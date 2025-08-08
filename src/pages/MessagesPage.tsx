'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import dynamic from 'next/dynamic';
import ConversationList from '@/components/messages/ConversationList';
import ChatView from '@/components/messages/ChatView';
import MessageInput from '@/components/messages/MessageInput';
import VideoCallModal from '@/components/messages/VideoCallModal';
import IncomingCallNotification from '@/components/messages/IncomingCallNotification';
import {
  Conversation,
  FrontendConversation,
  Message,
  User,
} from '@/components/messages/mock-data';
import { messengerService } from '@/services/api/messenger';
import { useUser } from '@/services/state/userSlice';
import SimplePeer from 'simple-peer';

const MessagesPage = () => {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<FrontendConversation[]>(
    [],
  );
  const [selectedConversation, setSelectedConversation] =
    useState<FrontendConversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const socketRef = useRef<Socket | null>(null);
  const socketConnectedRef = useRef<boolean>(false);

  const user = useUser();
  const currentUserId = user?.data?.id || '';
  const lastFetchTimeRef = useRef<number>(0);
  const messagesLoadedRef = useRef<{ [key: string]: boolean }>({});

  // Track online status separately
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: boolean }>(
    {},
  );

  // Video call state
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [showIncomingCallNotification, setShowIncomingCallNotification] =
    useState(false);
  const [incomingCallData, setIncomingCallData] = useState<{
    from: string;
    signal: SimplePeer.SignalData;
    conversationId: string;
  } | null>(null);

  // Memoize handleSelectConversation với useCallback
  const handleSelectConversation = useCallback(
    (id: string) => {
      setConversations((prevConversations) => {
        const conv = prevConversations.find((c) => c.id === id);
        if (conv) {
          setSelectedConversation(conv);
          // Reset the loaded flag when manually selecting a conversation
          if (conv.id !== selectedConversation?.id) {
            messagesLoadedRef.current[conv.id] = false;
          }
        }
        return prevConversations;
      });
    },
    [selectedConversation?.id],
  );

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!currentUserId) {
          console.warn('No user ID available, skipping fetchConversations');
          return;
        }

        const data = await messengerService.getConversations(currentUserId);
        // Initialize frontend conversations
        const initializedConversations: FrontendConversation[] = data.map(
          (conv: Conversation) => {
            const contact =
              conv.user1.id === currentUserId ? conv.user2 : conv.user1;

            // Add company name to contact if they have a company
            if (
              contact.company &&
              typeof contact.company === 'object' &&
              'companyName' in contact.company
            ) {
              contact.companyName = contact.company.companyName;
            }

            return {
              ...conv,
              contact,
              messages: [],
              lastMessage: '',
              timestamp: conv.updatedAt,
              unreadCount: 0,
            };
          },
        );
        setConversations(initializedConversations);

        // Auto-select conversation from query parameter
        const conversationId = searchParams?.get('conversationId') as
          | string
          | null;
        if (conversationId) {
          const conv = initializedConversations.find(
            (c) => c.id === conversationId,
          );
          if (conv) {
            handleSelectConversation(conv.id);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [currentUserId, searchParams, handleSelectConversation]);

  // Debounced fetch messages function
  const fetchMessages = useCallback(
    async (conversationId: string) => {
      // Prevent fetching if we've fetched recently (within last 2 seconds)
      const now = Date.now();
      if (now - lastFetchTimeRef.current < 2000) {
        return;
      }

      // Don't fetch if we've already loaded messages for this conversation
      if (messagesLoadedRef.current[conversationId]) {
        return;
      }

      try {
        lastFetchTimeRef.current = now;
        const messages = await messengerService.getMessages(conversationId);

        setConversations((prev) => {
          const updated = [...prev];
          const conv = updated.find((c) => c.id === conversationId);
          if (conv) {
            conv.messages = messages;
            conv.lastMessage = messages[messages.length - 1]?.content || '';
            conv.timestamp =
              messages[messages.length - 1]?.createdAt || conv.timestamp;
            conv.unreadCount = messages.filter(
              (m: Message) => !m.isRead && m.senderId !== currentUserId,
            ).length;
          }
          return updated;
        });

        setSelectedConversation((prev) =>
          prev && prev.id === conversationId
            ? {
                ...prev,
                messages,
                lastMessage: messages[messages.length - 1]?.content || '',
                timestamp:
                  messages[messages.length - 1]?.createdAt || prev.timestamp,
                unreadCount: messages.filter(
                  (m: Message) => !m.isRead && m.senderId !== currentUserId,
                ).length,
              }
            : prev,
        );

        // Mark messages as read - only do this once per conversation load
        await messengerService.markMessagesAsRead(
          conversationId,
          currentUserId,
        );

        // Mark as loaded
        messagesLoadedRef.current[conversationId] = true;
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    [currentUserId],
  );

  // Handler functions
  const handleNewMessage = useCallback(
    (message: Message & { sender: User }) => {
      // Check if sender has company information and add companyName
      if (
        message.sender.company &&
        typeof message.sender.company === 'object' &&
        'companyName' in message.sender.company
      ) {
        message.sender.companyName = message.sender.company.companyName;
      }

      // Update the messages in the conversation
      setConversations((prev) => {
        const updated = [...prev];
        const conv = updated.find((c) => c.id === message.conversationId);
        if (conv) {
          const newMessage = {
            id: message.id,
            conversationId: message.conversationId,
            senderId: message.sender.id,
            content: message.content,
            createdAt: message.createdAt,
            type: message.type || 'text',
            isRead: message.isRead || false,
          };

          // Check if message already exists to avoid duplicates
          if (!conv.messages.some((m) => m.id === newMessage.id)) {
            conv.messages.push(newMessage);
            conv.lastMessage = message.content;
            conv.timestamp = message.createdAt;

            if (!message.isRead && message.sender.id !== currentUserId) {
              conv.unreadCount = (conv.unreadCount || 0) + 1;
            }
          }
        }
        return updated;
      });

      // If this is a message for the currently selected conversation, mark it as read
      if (
        selectedConversation &&
        message.conversationId === selectedConversation.id &&
        message.sender.id !== currentUserId &&
        !message.isRead
      ) {
        messengerService.markMessagesAsRead(
          message.conversationId,
          currentUserId,
        );
      }
    },
    [currentUserId, selectedConversation],
  );

  const handleUserStatus = useCallback(
    ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: isOnline,
      }));
    },
    [],
  );

  const handleIncomingCall = useCallback(
    ({
      from,
      signal,
      conversationId,
    }: {
      from: string;
      signal: SimplePeer.SignalData;
      conversationId: string;
    }) => {
      console.log('Incoming call:', { from, conversationId });

      // Sử dụng functional update để tránh phụ thuộc vào conversations state
      setConversations((prevConversations) => {
        const conversation = prevConversations.find(
          (c) => c.id === conversationId,
        );
        if (conversation) {
          setIncomingCallData({ from, signal, conversationId });
          setShowIncomingCallNotification(true);

          setSelectedConversation((prevSelected) => {
            if (!prevSelected || prevSelected.id !== conversationId) {
              return conversation;
            }
            return prevSelected;
          });
        }
        return prevConversations;
      });
    },
    [],
  );

  // Initialize socket - MỘT LẦN DUY NHẤT
  useEffect(() => {
    if (!currentUserId || socketRef.current) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log('Creating single socket connection...');

    const socket = io(`${socketUrl}/messenger`, {
      query: { userId: currentUserId },
      withCredentials: true,
      transports: ['polling', 'websocket'], // Cho phép cả 2
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socketConnectedRef.current = true;

      // Re-join all conversations after reconnect
      // Sử dụng functional update để lấy conversations hiện tại
      setConversations((currentConversations) => {
        currentConversations.forEach((conv) => {
          socket.emit('joinConversation', conv.id);
        });
        return currentConversations;
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      socketConnectedRef.current = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socketRef.current = socket;

    // Cleanup chỉ khi component unmount
    return () => {
      console.log('Component unmounting, disconnecting socket');
      socket.disconnect();
      socketRef.current = null;
      socketConnectedRef.current = false;
    };
  }, [currentUserId]);

  // Setup event listeners
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    // Add event listeners
    socket.on('newMessage', handleNewMessage);
    socket.on('userStatus', handleUserStatus);
    socket.on('video-call-offer', handleIncomingCall);

    // Handle video call events
    socket.on('video-call-end', ({ from }: { from: string }) => {
      if (from === selectedConversation?.contact.id) {
        console.log('Remote ended call');
        setIsVideoCallOpen(false);
        setIsIncomingCall(false);
      }
    });

    return () => {
      // Cleanup listeners nhưng KHÔNG disconnect socket
      socket.off('newMessage', handleNewMessage);
      socket.off('userStatus', handleUserStatus);
      socket.off('video-call-offer', handleIncomingCall);
      socket.off('video-call-end');
    };
  }, [
    handleNewMessage,
    handleUserStatus,
    handleIncomingCall,
    selectedConversation,
  ]);

  // Join conversations khi danh sách conversations thay đổi
  useEffect(() => {
    if (!socketRef.current || !socketConnectedRef.current) return;

    const socket = socketRef.current;

    // Join all conversations để nhận notifications
    conversations.forEach((conv) => {
      socket.emit('joinConversation', conv.id);
    });
  }, [conversations]);

  // Handle selected conversation change
  useEffect(() => {
    if (!selectedConversation) return;

    // Fetch messages nếu chưa load
    if (!messagesLoadedRef.current[selectedConversation.id]) {
      fetchMessages(selectedConversation.id);
    }

    // Emit focus event để server biết user đang xem conversation nào
    if (socketRef.current && socketConnectedRef.current) {
      socketRef.current.emit('focusConversation', selectedConversation.id);
    }

    return () => {
      // Emit blur event khi chuyển conversation
      if (socketRef.current && socketConnectedRef.current) {
        socketRef.current.emit('blurConversation', selectedConversation.id);
      }
    };
  }, [selectedConversation, fetchMessages]);

  const handleSendMessage = (content: string) => {
    if (
      selectedConversation &&
      socketRef.current &&
      socketConnectedRef.current &&
      currentUserId
    ) {
      socketRef.current.emit('sendMessage', {
        conversationId: selectedConversation.id,
        content,
        senderId: currentUserId,
      });
    } else {
      console.error('Cannot send message:', {
        hasConversation: !!selectedConversation,
        hasSocket: !!socketRef.current,
        isConnected: socketConnectedRef.current,
        hasUserId: !!currentUserId,
      });
    }
  };

  const handleStartVideoCall = () => {
    if (selectedConversation) {
      setIsIncomingCall(false);
      setIsVideoCallOpen(true);
    }
  };

  const handleStartAudioCall = () => {
    // For now, audio calls use the same modal but with video disabled initially
    if (selectedConversation) {
      setIsIncomingCall(false);
      setIsVideoCallOpen(true);
    }
  };

  const handleCloseVideoCall = () => {
    setIsVideoCallOpen(false);
    setIsIncomingCall(false);
  };

  const handleAcceptIncomingCall = () => {
    setShowIncomingCallNotification(false);
    setIsIncomingCall(true);
    setIsVideoCallOpen(true);
  };

  const handleDeclineIncomingCall = () => {
    if (socketRef.current && incomingCallData) {
      socketRef.current.emit('video-call-decline', {
        conversationId: incomingCallData.conversationId,
        to: incomingCallData.from,
        from: currentUserId,
      });
    }
    setShowIncomingCallNotification(false);
    setIncomingCallData(null);
  };

  return (
    <div className="flex h-screen">
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversation?.id || null}
        onSelectConversation={handleSelectConversation}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onlineUsers={onlineUsers}
      />
      <div className="flex flex-1 flex-col">
        <ChatView
          conversation={selectedConversation}
          currentUserId={currentUserId}
          onStartVideoCall={handleStartVideoCall}
          onStartAudioCall={handleStartAudioCall}
        />
        {selectedConversation && (
          <MessageInput onSendMessage={handleSendMessage} />
        )}
      </div>

      {/* Incoming Call Notification */}
      {selectedConversation && (
        <IncomingCallNotification
          isVisible={showIncomingCallNotification}
          callerName={selectedConversation.contact.name}
          callerAvatar={selectedConversation.contact.avatar}
          onAccept={handleAcceptIncomingCall}
          onDecline={handleDeclineIncomingCall}
          isVideoCall={true}
        />
      )}

      {/* Video Call Modal */}
      {selectedConversation && (
        <VideoCallModal
          isOpen={isVideoCallOpen}
          onClose={handleCloseVideoCall}
          socket={socketRef.current}
          currentUserId={currentUserId}
          contactId={selectedConversation.contact.id.toString()}
          contactName={selectedConversation.contact.name}
          contactAvatar={selectedConversation.contact.avatar}
          conversationId={selectedConversation.id}
          isIncoming={isIncomingCall}
          incomingCallData={incomingCallData}
        />
      )}
    </div>
  );
};

// Use dynamic import with ssr: false to prevent server-side rendering
export default dynamic(() => Promise.resolve(MessagesPage), { ssr: false });
