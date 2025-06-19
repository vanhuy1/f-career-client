'use client';

import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

import { Button } from './ui-button';
import useMeetContext from '../contexts/MeetContext';
import { cn } from '@/lib/utils';
import { videoCallText } from '../utils/text';
import { TUser } from '../utils/types';

interface Message {
  id: string;
  text: string;
  from: TUser;
  timestamp: string;
}

export function Chat() {
  const { socketRef, userData, peersData, meetId } = useMeetContext();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socketRef.current || !userData.id || !meetId) return;

    const message: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      from: userData,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    socketRef.current.emit('BE-send-chat-message', {
      meetId,
      message: message.text,
      from: userData,
    });

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    const handleNewMessage = ({ message, from, timestamp }: { message: string; from: TUser; timestamp: string }) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        from,
        timestamp,
      };
      setMessages(prev => [...prev, newMessage]);
    };

    socket.on('FE-new-chat-message', handleNewMessage);

    return () => {
      socket.off('FE-new-chat-message', handleNewMessage);
    };
  }, [socketRef]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-2 text-center">
        <h3 className="font-medium">{videoCallText.page.meet.chat.title}</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center text-sm">
            {videoCallText.page.meet.empty.message}
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex w-full',
                message.from.id === userData.id ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                  message.from.id === userData.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="font-medium">
                  {message.from.id === userData.id
                    ? 'You'
                    : peersData.get(message.from.id)?.name || message.from.name}
                </p>
                <p>{message.text}</p>
                <span className="mt-1 block text-right text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], {
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

      <div className="border-t p-2">
        <div className="flex items-center gap-2">
          <textarea
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={videoCallText.inputPlaceholder.sendMessage}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <Button
            className="h-10 w-10 rounded-full p-0"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !socketRef.current || !userData.id}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}