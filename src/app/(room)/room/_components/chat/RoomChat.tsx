'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
      <div className="fixed bottom-8 right-8 z-20">
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
    <div className={cn(
      "fixed bottom-8 right-8 z-20 w-[320px] bg-stone-900/80 backdrop-blur-sm rounded-lg border border-stone-700/50",
      "text-white shadow-lg flex flex-col h-[480px] animate-in slide-in-from-right duration-300"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-2",
        "border-b border-stone-700/50 bg-white/5 rounded-t-lg"
      )}>
        <span className="font-medium">Room Chat</span>
        <button
          onClick={() => setIsOpen(false)}
          className={cn(
            "p-2 rounded-full hover:bg-stone-700/60 transition-colors"
          )}
          aria-label="Close Chat"
        >
          <Icon name="Close" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-2">
            <Icon name="Chat" className="w-8 h-8" />
            <p className="text-sm text-center">
              No messages yet.<br />Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col space-y-1",
                message.sender === 'You' ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-lg px-3 py-2",
                message.sender === 'You'
                  ? "bg-green-500/20 border border-green-500/30"
                  : "bg-stone-800/60 border border-stone-700/30"
              )}>
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
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-stone-800/60 border-stone-700/50 focus:ring-green-500/50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={cn(
              "p-2 rounded-full bg-stone-800/60 hover:bg-stone-700/60 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label="Send Message"
          >
            <Icon name="Note" className={cn(
              "rotate-90",
              !inputValue.trim() && "opacity-50"
            )} />
          </button>
        </form>
      </div>
    </div>
  );
} 