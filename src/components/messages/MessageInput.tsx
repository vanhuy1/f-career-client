'use client';

import React, { useState } from 'react';
import { Smile, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-end space-x-3">
        {/* <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button> */}

        <div className="relative flex-1">
          <Textarea
            placeholder="Reply message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="max-h-32 min-h-[44px] resize-none border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500"
            rows={1}
            disabled={disabled}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          disabled={disabled}
        >
          <Smile className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
