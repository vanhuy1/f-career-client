'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import dynamic from 'next/dynamic';
import ConversationList from '@/components/messages/ConversationList';
import ChatView from '@/components/messages/ChatView';
import MessageInput from '@/components/messages/MessageInput';
import {
  Conversation,
  FrontendConversation,
  Message,
  User,
} from '@/components/messages/mock-data';
import { messengerService } from '@/services/api/messenger';
import { useUser } from '@/services/state/userSlice';
import type SimplePeer from 'simple-peer';

// Lazy load heavy components
const VideoCallModal = dynamic(
  () => import('@/components/messages/VideoCallModal'),
  { ssr: false },
);

const IncomingCallNotification = dynamic(
  () => import('@/components/messages/IncomingCallNotification'),
  { ssr: false },
);

// Constants
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
const RECONNECT_ATTEMPTS = 3;

const MessagesPage = () => {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<FrontendConversation[]>(
    [],
  );
  const [selectedConversation, setSelectedConversation] =
    useState<FrontendConversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  // Video call state
  const [videoCallState, setVideoCallState] = useState({
    isOpen: false,
    isIncoming: false,
    showNotification: false,
    incomingData: null as {
      from: string;
      signal: SimplePeer.SignalData;
      conversationId: string;
    } | null,
  });

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const messagesLoadedRef = useRef<Set<string>>(new Set());
  const pendingMessagesRef = useRef<Map<string, Message[]>>(new Map());
  const conversationsRef = useRef<FrontendConversation[]>([]);

  // User data
  const user = useUser();
  const currentUserId = user?.data?.id || '';

  // Update conversationsRef when conversations state changes
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Memoized socket config
  const socketConfig = useMemo(
    () => ({
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: RECONNECT_ATTEMPTS,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 3000,
      timeout: 10000,
      autoConnect: true,
      forceNew: false,
    }),
    [],
  );

  // Initialize socket connection
  useEffect(() => {
    if (!currentUserId || socketRef.current?.connected) return;

    console.log('Initializing socket connection...');

    const socket = io(SOCKET_URL, {
      ...socketConfig,
      query: { userId: currentUserId },
    });

    socketRef.current = socket;

    const handleConnect = () => {
      console.log('Socket connected:', socket.id);

      const convIds = conversationsRef.current.map((c) => c.id);
      if (convIds.length > 0) {
        convIds.forEach((id) => {
          socket.emit('joinConversation', id);
        });
      }

      // Process pending messages
      pendingMessagesRef.current.forEach((messages, convId) => {
        messages.forEach((msg) => {
          socket.emit('sendMessage', {
            conversationId: convId,
            content: msg.content,
            senderId: currentUserId,
          });
        });
      });
      pendingMessagesRef.current.clear();
    };

    const handleDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, [currentUserId, socketConfig]);

  // Join conversations when they change
  useEffect(() => {
    if (!socketRef.current?.connected || conversations.length === 0) return;

    conversations.forEach((conv) => {
      socketRef.current?.emit('joinConversation', conv.id);
    });
  }, [conversations]);

  // Fetch messages
  const fetchMessages = useCallback(
    async (conversationId: string, force = false) => {
      if (!force && messagesLoadedRef.current.has(conversationId)) {
        return;
      }

      try {
        const messages = await messengerService.getMessages(conversationId);

        setConversations((prev) => {
          const updated = [...prev];
          const convIndex = updated.findIndex((c) => c.id === conversationId);

          if (convIndex !== -1) {
            const conv = updated[convIndex];
            const lastMsg = messages[messages.length - 1];

            updated[convIndex] = {
              ...conv,
              messages,
              lastMessage: lastMsg?.content || '',
              timestamp: lastMsg?.createdAt || conv.timestamp,
              unreadCount: messages.filter(
                (m: Message) => !m.isRead && m.senderId !== currentUserId,
              ).length,
            };
          }

          return updated;
        });

        setSelectedConversation((prev) => {
          if (prev?.id === conversationId) {
            const lastMsg = messages[messages.length - 1];
            return {
              ...prev,
              messages,
              lastMessage: lastMsg?.content || '',
              timestamp: lastMsg?.createdAt || prev.timestamp,
              unreadCount: messages.filter(
                (m: Message) => !m.isRead && m.senderId !== currentUserId,
              ).length,
            };
          }
          return prev;
        });

        messagesLoadedRef.current.add(conversationId);

        messengerService
          .markMessagesAsRead(conversationId, currentUserId)
          .catch(console.error);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    [currentUserId],
  );

  // Select conversation
  const handleSelectConversation = useCallback(
    async (id: string) => {
      const conv = conversationsRef.current.find((c) => c.id === id);
      if (!conv) return;

      setSelectedConversation(conv);

      if (!messagesLoadedRef.current.has(id)) {
        await fetchMessages(id);
      }

      socketRef.current?.emit('focusConversation', id);
    },
    [fetchMessages],
  );

  // New message handler
  const handleNewMessage = useCallback(
    (message: Message & { sender: User }) => {
      if (
        message.sender.company &&
        typeof message.sender.company === 'object' &&
        'companyName' in message.sender.company
      ) {
        message.sender.companyName = message.sender.company.companyName;
      }

      setConversations((prev) => {
        const updated = [...prev];
        const convIndex = updated.findIndex(
          (c) => c.id === message.conversationId,
        );

        if (convIndex !== -1) {
          const conv = updated[convIndex];

          if (!conv.messages.some((m) => m.id === message.id)) {
            const [updatedConv] = updated.splice(convIndex, 1);

            updatedConv.messages.push({
              id: message.id,
              conversationId: message.conversationId,
              senderId: message.sender.id,
              content: message.content,
              createdAt: message.createdAt,
              type: message.type || 'text',
              isRead: message.isRead || false,
            });

            updatedConv.lastMessage = message.content;
            updatedConv.timestamp = message.createdAt;

            if (!message.isRead && message.sender.id !== currentUserId) {
              updatedConv.unreadCount++;
            }

            updated.unshift(updatedConv);
          }
        }

        return updated;
      });

      if (
        selectedConversation?.id === message.conversationId &&
        message.sender.id !== currentUserId &&
        !message.isRead
      ) {
        messengerService
          .markMessagesAsRead(message.conversationId, currentUserId)
          .catch(console.error);
      }
    },
    [currentUserId, selectedConversation?.id],
  );

  // User status handler
  const handleUserStatus = useCallback(
    ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }));
    },
    [],
  );

  // Incoming call handler
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
      console.log('Receiving incoming call from:', from);

      const conversation = conversationsRef.current.find(
        (c) => c.id === conversationId,
      );

      if (conversation) {
        // Hiển thị notification trước
        setVideoCallState({
          isOpen: false,
          isIncoming: true,
          showNotification: true,
          incomingData: { from, signal, conversationId },
        });

        // Auto select conversation nếu chưa được chọn
        if (selectedConversation?.id !== conversationId) {
          setSelectedConversation(conversation);
          if (!messagesLoadedRef.current.has(conversationId)) {
            fetchMessages(conversationId);
          }
        }
      }
    },
    [selectedConversation?.id, fetchMessages],
  );

  // Accept incoming call
  const handleAcceptIncomingCall = useCallback(() => {
    console.log('Accepting incoming call');

    // Đóng notification và mở video modal với incoming data
    setVideoCallState((prev) => ({
      ...prev,
      isOpen: true,
      showNotification: false,
      // Giữ nguyên isIncoming và incomingData để VideoCallModal xử lý
    }));
  }, []);

  // Decline incoming call
  const handleDeclineIncomingCall = useCallback(() => {
    console.log('Declining incoming call');

    if (socketRef.current && videoCallState.incomingData) {
      socketRef.current.emit('video-call-decline', {
        conversationId: videoCallState.incomingData.conversationId,
        to: videoCallState.incomingData.from,
        from: currentUserId,
      });
    }

    // Reset state
    setVideoCallState({
      isOpen: false,
      isIncoming: false,
      showNotification: false,
      incomingData: null,
    });
  }, [currentUserId, videoCallState.incomingData]);

  // Close video call
  const handleCloseVideoCall = useCallback(() => {
    console.log('Closing video call');

    // Reset all video call state
    setVideoCallState({
      isOpen: false,
      isIncoming: false,
      showNotification: false,
      incomingData: null,
    });
  }, []);

  // Start video call
  const handleStartVideoCall = useCallback(() => {
    if (selectedConversation) {
      console.log('Starting video call with:', selectedConversation.contact.id);

      setVideoCallState({
        isOpen: true,
        isIncoming: false,
        showNotification: false,
        incomingData: null,
      });
    }
  }, [selectedConversation]);

  // Setup socket listeners for video call
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Video call events
    socket.on('video-call-offer', handleIncomingCall);

    socket.on('video-call-end', ({ from }: { from: string }) => {
      console.log('Remote ended call:', from);
      if (
        from === selectedConversation?.contact.id ||
        from === videoCallState.incomingData?.from
      ) {
        handleCloseVideoCall();
      }
    });

    socket.on('video-call-declined', ({ from }: { from: string }) => {
      console.log('Call declined by:', from);
      if (from === selectedConversation?.contact.id) {
        handleCloseVideoCall();
      }
    });

    // Cleanup
    return () => {
      socket.off('video-call-offer');
      socket.off('video-call-end');
      socket.off('video-call-declined');
    };
  }, [
    handleIncomingCall,
    handleCloseVideoCall,
    selectedConversation?.contact.id,
    videoCallState.incomingData?.from,
  ]);

  // Setup other socket listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on('newMessage', handleNewMessage);
    socket.on('userStatus', handleUserStatus);

    return () => {
      socket.off('newMessage');
      socket.off('userStatus');
    };
  }, [handleNewMessage, handleUserStatus]);

  // Initial conversations fetch
  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUserId) return;

      try {
        const data = await messengerService.getConversations(currentUserId);

        const initializedConversations: FrontendConversation[] = data.map(
          (conv: Conversation) => {
            const contact =
              conv.user1.id === currentUserId ? conv.user2 : conv.user1;

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

        const convId = searchParams?.get('conversationId');
        if (convId) {
          const conv = initializedConversations.find((c) => c.id === convId);
          if (conv) {
            setSelectedConversation(conv);
            if (!messagesLoadedRef.current.has(convId)) {
              fetchMessages(convId);
            }
          }
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };

    loadConversations();
  }, [currentUserId, searchParams, fetchMessages]);

  // Send message
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!selectedConversation || !currentUserId) return;

      const messageData = {
        conversationId: selectedConversation.id,
        content,
        senderId: currentUserId,
      };

      if (socketRef.current?.connected) {
        socketRef.current.emit('sendMessage', messageData);
      } else {
        const pending =
          pendingMessagesRef.current.get(selectedConversation.id) || [];
        pending.push(messageData as Message);
        pendingMessagesRef.current.set(selectedConversation.id, pending);

        console.warn('Socket not connected, message queued');
      }
    },
    [selectedConversation, currentUserId],
  );

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
          onStartAudioCall={handleStartVideoCall}
        />

        {selectedConversation && (
          <MessageInput onSendMessage={handleSendMessage} />
        )}
      </div>

      {/* Incoming Call Notification */}
      {selectedConversation && (
        <IncomingCallNotification
          isVisible={videoCallState.showNotification}
          callerName={selectedConversation.contact.name}
          callerAvatar={selectedConversation.contact.avatar}
          onAccept={handleAcceptIncomingCall}
          onDecline={handleDeclineIncomingCall}
          isVideoCall={true}
        />
      )}

      {/* Video Call Modal */}
      {selectedConversation && videoCallState.isOpen && (
        <VideoCallModal
          isOpen={videoCallState.isOpen}
          onClose={handleCloseVideoCall}
          socket={socketRef.current}
          currentUserId={currentUserId}
          contactId={selectedConversation.contact.id.toString()}
          contactName={selectedConversation.contact.name}
          contactAvatar={selectedConversation.contact.avatar}
          conversationId={selectedConversation.id}
          isIncoming={videoCallState.isIncoming}
          incomingCallData={videoCallState.incomingData}
        />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(MessagesPage), { ssr: false });
