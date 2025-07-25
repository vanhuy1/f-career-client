'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FrontendConversation, formatTimestamp } from './mock-data';

interface ChatViewProps {
  conversation: FrontendConversation | null;
  currentUserId: string;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, currentUserId }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-gray-400">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No conversation selected
          </h3>
          <p className="text-gray-500">
            Choose a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  // Use company name and logo if available, otherwise use contact name and avatar
  const isCompany = !!conversation.contact.company;
  const displayName = isCompany
    ? conversation.contact.companyName || conversation.contact.name
    : conversation.contact.name;
  const displayAvatar = isCompany
    ? (typeof conversation.contact.company === 'object' &&
        conversation.contact.company?.logoUrl) ||
      conversation.contact.avatar
    : conversation.contact.avatar;

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={displayAvatar} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {displayName}
              </h2>
              <p className="text-sm text-gray-600">
                {conversation.contact.title}
              </p>
            </div>
          </div>

          {/* <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Pin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4">
          {/* Conversation start notice */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-500">
              This is the very beginning of your direct message with{' '}
              <span className="font-medium">{displayName}</span>
            </p>
          </div>

          {/* Date separator */}
          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="bg-white px-4 text-sm text-gray-500">Today</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>
          </div>

          {/* Message bubbles */}
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <div
                  className={`flex ${
                    message.senderId === currentUserId
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  {message.senderId !== currentUserId && (
                    <Avatar className="mr-3 h-8 w-8">
                      <AvatarImage src={displayAvatar} />
                      <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-xs rounded-lg px-4 py-3 lg:max-w-md ${
                      message.senderId === currentUserId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {message.senderId === currentUserId && (
                    <Avatar className="ml-3 h-8 w-8">
                      <AvatarFallback className="bg-gray-600 text-xs text-white">
                        You
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                <div
                  className={`mt-1 text-xs text-gray-500 ${
                    message.senderId === currentUserId
                      ? 'mr-11 text-right'
                      : 'ml-11 text-left'
                  }`}
                >
                  {message.createdAt && formatTimestamp(message.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
