'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import Icon from '../ui/Icon';
import IconButton from '../ui/IconButton';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

export default function RoomChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'You',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed right-8 bottom-8 z-20">
        <IconButton
          icon="Chat"
          label="Chat"
          onClick={() => setIsOpen(true)}
          isActive={false}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed right-8 bottom-8 z-20 w-[320px] rounded-lg border border-stone-700/50 bg-stone-900/80 backdrop-blur-sm',
        'animate-in slide-in-from-right flex h-[480px] flex-col text-white shadow-lg duration-300',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-2',
          'rounded-t-lg border-b border-stone-700/50 bg-white/5',
        )}
      >
        <span className="font-medium">Room Chat</span>
        <button
          onClick={() => setIsOpen(false)}
          className={cn(
            'rounded-full p-2 transition-colors hover:bg-stone-700/60',
          )}
          aria-label="Close Chat"
        >
          <Icon name="Close" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-stone-400">
            <Icon name="Chat" className="h-8 w-8" />
            <p className="text-center text-sm">
              No messages yet.
              <br />
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex flex-col space-y-1',
                message.sender === 'You' ? 'items-end' : 'items-start',
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2',
                  message.sender === 'You'
                    ? 'border border-green-500/30 bg-green-500/20'
                    : 'border border-stone-700/30 bg-stone-800/60',
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              <div className="flex items-center space-x-2 text-xs text-stone-400">
                <span>{message.sender}</span>
                <span>•</span>
                <span>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-stone-700/50 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-stone-700/50 bg-stone-800/60 focus:ring-green-500/50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={cn(
              'rounded-full bg-stone-800/60 p-2 transition-colors hover:bg-stone-700/60',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            aria-label="Send Message"
          >
            <Icon
              name="Note"
              className={cn('rotate-90', !inputValue.trim() && 'opacity-50')}
            />
          </button>
        </form>
      </div>
    </div>
  );
}
