'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Conversation, formatTimestamp } from './mock-data';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchTerm,
  onSearchChange,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-gray-200 bg-white">
      {/* Search */}
      <div className="border-b border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-0 bg-gray-50 pl-10"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${
              selectedConversationId === conversation.id
                ? 'border-l-4 border-l-blue-500 bg-blue-50'
                : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.contact.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {getInitials(conversation.contact.name)}
                  </AvatarFallback>
                </Avatar>
                {conversation.contact.isOnline && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="truncate font-semibold text-gray-900">
                    {conversation.contact.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(conversation.timestamp)}
                  </span>
                </div>

                <p className="mb-1 truncate text-sm text-gray-600">
                  {conversation.lastMessage}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {conversation.contact.title} at{' '}
                    {conversation.contact.company}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <Badge className="flex h-5 min-w-[20px] items-center justify-center bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
