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
  const user = useUser();
  const currentUserId = user?.data?.id || '';
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
  }, [currentUserId, searchParams]);

  useEffect(() => {
    if (!currentUserId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Tạo kết nối socket global riêng
    const globalSocket = io(`${socketUrl}/messenger`, {
      query: { userId: currentUserId },
      withCredentials: true,
    });

    console.log('Creating global socket for incoming calls');

    // Lắng nghe incoming calls từ TẤT CẢ conversations
    globalSocket.on(
      'video-call-offer',
      ({ from, signal, conversationId: callConversationId }) => {
        console.log('Received incoming call:', { from, callConversationId });

        // Tìm conversation với người gọi
        const conversation = conversations.find(
          (conv) => conv.id === callConversationId,
        );

        if (conversation) {
          // Lưu thông tin cuộc gọi đến
          setIncomingCallData({
            from,
            signal,
            conversationId: callConversationId,
          });
          setShowIncomingCallNotification(true);

          // Tự động chọn conversation nếu chưa chọn
          if (
            !selectedConversation ||
            selectedConversation.id !== callConversationId
          ) {
            setSelectedConversation(conversation);
          }
        }
      },
    );

    return () => {
      console.log('Disconnecting global socket');
      globalSocket.disconnect();
    };
  }, [currentUserId, conversations, selectedConversation]);

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
          prev
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

  // Initialize WebSocket when a conversation is selected
  useEffect(() => {
    if (!selectedConversation || !currentUserId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Connect to the messenger namespace
    const socketUrl =
      (process.env.NEXT_PUBLIC_API_URL as string | undefined) ||
      'http://localhost:8000';
    socketRef.current = io(`${socketUrl}/messenger`, {
      query: {
        userId: currentUserId,
        conversationId: selectedConversation.id,
      },
      withCredentials: true,
    });

    const socket = socketRef.current;

    socket.emit('joinConversation', selectedConversation.id);

    // Handle new messages
    socket.on('newMessage', (message: Message & { sender: User }) => {
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
    });

    // Handle user status updates
    socket.on('userStatus', ({ userId, isOnline }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: isOnline,
      }));
    });

    // Handle incoming video call
    socket.on(
      'video-call-offer',
      ({ from, signal, conversationId: callConversationId }) => {
        if (callConversationId === selectedConversation?.id) {
          setIncomingCallData({
            from,
            signal,
            conversationId: callConversationId,
          });
          setShowIncomingCallNotification(true);
        }
      },
    );

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Fetch messages only once when selecting a conversation
    if (!messagesLoadedRef.current[selectedConversation.id]) {
      fetchMessages(selectedConversation.id);
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }

      socket.off('newMessage');
      socket.off('userStatus');
      socket.off('error');
      socket.off('video-call-offer');
      socket.emit('leaveConversation', selectedConversation.id);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [selectedConversation, currentUserId, fetchMessages]);

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setSelectedConversation(conv);
      // Reset the loaded flag when manually selecting a conversation
      if (conv.id !== selectedConversation?.id) {
        messagesLoadedRef.current[conv.id] = false;
      }
    }
  };

  const handleSendMessage = (content: string) => {
    if (selectedConversation && socketRef.current && currentUserId) {
      socketRef.current.emit('sendMessage', {
        conversationId: selectedConversation.id,
        content,
        senderId: currentUserId,
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
