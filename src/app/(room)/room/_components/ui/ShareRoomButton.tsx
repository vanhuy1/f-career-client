'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Copy, 
  Check, 
  Link as LinkIcon, 
  Twitter, 
  Facebook, 
  Mail, 
  Linkedin 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useLocalStorageState } from '../../hooks/useLocalStorage';
import { nanoid } from 'nanoid';

export default function ShareRoomButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [roomId, setRoomId] = useLocalStorageState<string | null>(null, 'study-room-id');
  
  // Generate a room ID if one doesn't exist
  useEffect(() => {
    if (!roomId) {
      setRoomId(nanoid(10));
    }
  }, [roomId, setRoomId]);
  
  // Reset copied state when popover closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);
  
  const getRoomUrl = () => {
    if (typeof window === 'undefined' || !roomId) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/room?id=${roomId}`;
  };
  
  const handleCopy = () => {
    const url = getRoomUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Room link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    });
  };
  
  const handleShare = (platform: string) => {
    const url = getRoomUrl();
    const text = 'Join my study room!';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };
  
  const generateNewRoomId = () => {
    if (confirm('Are you sure you want to generate a new room ID? This will invalidate any previously shared links.')) {
      const newRoomId = nanoid(10);
      setRoomId(newRoomId);
      toast.success('New room ID generated!');
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-stone-800/50 hover:bg-stone-700/50 rounded-full"
        >
          <Share2 className="h-5 w-5 text-stone-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-stone-900 border-stone-800 p-0 rounded-lg shadow-xl">
        <div className="p-3 border-b border-stone-800">
          <h3 className="font-medium text-stone-200">Share Study Room</h3>
          <p className="text-xs text-stone-400">Invite others to join your study session</p>
        </div>
        
        <Tabs defaultValue="link" className="p-3">
          <TabsList className="bg-stone-800 w-full mb-3">
            <TabsTrigger value="link" className="flex-1">Link</TabsTrigger>
            <TabsTrigger value="social" className="flex-1">Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 h-4 w-4" />
                <Input 
                  value={getRoomUrl()} 
                  readOnly 
                  className="pl-9 pr-12 bg-stone-800 border-stone-700 text-stone-300"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-2 hover:bg-stone-700"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-stone-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-300"
                onClick={generateNewRoomId}
              >
                Generate New Link
              </Button>
              
              <Button 
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-3">
            <p className="text-sm text-stone-400 mb-2">Share via:</p>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                className="flex flex-col items-center gap-1 p-2 h-auto bg-stone-800 border-stone-700 hover:bg-stone-700"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-5 w-5 text-blue-400" />
                <span className="text-xs text-stone-300">Twitter</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center gap-1 p-2 h-auto bg-stone-800 border-stone-700 hover:bg-stone-700"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="text-xs text-stone-300">Facebook</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center gap-1 p-2 h-auto bg-stone-800 border-stone-700 hover:bg-stone-700"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-5 w-5 text-blue-500" />
                <span className="text-xs text-stone-300">LinkedIn</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center gap-1 p-2 h-auto bg-stone-800 border-stone-700 hover:bg-stone-700"
                onClick={() => handleShare('email')}
              >
                <Mail className="h-5 w-5 text-red-400" />
                <span className="text-xs text-stone-300">Email</span>
              </Button>
            </div>
            
            <div className="pt-2 text-xs text-center text-stone-500">
              Share this room with friends to study together
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}