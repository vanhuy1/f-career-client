'use client';

import React, { useState, useMemo } from 'react';
import ConversationList from '@/components/messages/ConversationList';
import ChatView from '@/components/messages/ChatView';
import MessageInput from '@/components/messages/MessageInput';
import {
  mockConversations,
  Conversation,
  Message,
} from '@/components/messages/mock-data';

const MessagesPage: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(mockConversations[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);

  // Filter conversations based on search term
  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;

    return conversations.filter(
      (conversation) =>
        conversation.contact.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        conversation.contact.company
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        conversation.lastMessage
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [conversations, searchTerm]);

  // Get the selected conversation
  const selectedConversation =
    conversations.find((conv) => conv.id === selectedConversationId) || null;

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = (messageContent: string) => {
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      content: messageContent,
      timestamp: new Date(),
      type: 'text',
      isRead: true,
    };

    setConversations((prevConversations) =>
      prevConversations.map((conversation) => {
        if (conversation.id === selectedConversationId) {
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage],
            lastMessage:
              messageContent.length > 30
                ? `${messageContent.substring(0, 30)}...`
                : messageContent,
            timestamp: new Date(),
          };
        }
        return conversation;
      }),
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ConversationList
        conversations={filteredConversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="flex flex-1 flex-col">
        <ChatView conversation={selectedConversation} />
        {selectedConversation && (
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!selectedConversation}
          />
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
