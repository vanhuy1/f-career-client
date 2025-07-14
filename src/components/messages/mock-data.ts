export interface Contact {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  contact: Contact;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  messages: Message[];
  isActive?: boolean;
}

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Jan Mayer',
    avatar: '/api/placeholder/40/40',
    title: 'Recruiter',
    company: 'Nomad',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Joe Bartmann',
    avatar: '/api/placeholder/40/40',
    title: 'HR Manager',
    company: 'TechCorp',
  },
  {
    id: '3',
    name: 'Ally Wales',
    avatar: '/api/placeholder/40/40',
    title: 'Senior Developer',
    company: 'StartupXYZ',
  },
  {
    id: '4',
    name: 'James Gardner',
    avatar: '/api/placeholder/40/40',
    title: 'Team Lead',
    company: 'InnovateLabs',
  },
  {
    id: '5',
    name: 'Allison Geidt',
    avatar: '/api/placeholder/40/40',
    title: 'Product Manager',
    company: 'DesignCo',
  },
  {
    id: '6',
    name: 'Ruben Culhane',
    avatar: '/api/placeholder/40/40',
    title: 'CTO',
    company: 'FutureTech',
  },
  {
    id: '7',
    name: 'Lydia Diaz',
    avatar: '/api/placeholder/40/40',
    title: 'HR Specialist',
    company: 'GlobalTech',
  },
  {
    id: '8',
    name: 'James Dokidis',
    avatar: '/api/placeholder/40/40',
    title: 'Engineering Manager',
    company: 'BuildRight',
  },
  {
    id: '9',
    name: 'Angelina Swann',
    avatar: '/api/placeholder/40/40',
    title: 'Talent Acquisition',
    company: 'ScaleUp',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content:
      'Hey Jake, I wanted to reach out because we saw your work contributions and were impressed by your work.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: 'text',
    isRead: true,
  },
  {
    id: '2',
    senderId: '1',
    content: 'We want to invite you for a quick interview',
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
    type: 'text',
    isRead: true,
  },
  {
    id: '3',
    senderId: 'current-user',
    content:
      'Hi Jan, sure I would love to. Thanks for taking the time to see my work!',
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
    type: 'text',
    isRead: true,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    contact: mockContacts[0],
    lastMessage: 'We want to invite you for a qui...',
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
    unreadCount: 0,
    messages: mockMessages,
    isActive: true,
  },
  {
    id: '2',
    contact: mockContacts[1],
    lastMessage: 'Hey thanks for your interview...',
    timestamp: new Date('2024-01-15T15:40:00'),
    unreadCount: 0,
    messages: [
      {
        id: '4',
        senderId: '2',
        content:
          'Hey thanks for your interview today. We were really impressed with your technical skills.',
        timestamp: new Date('2024-01-15T15:40:00'),
        type: 'text',
        isRead: true,
      },
    ],
  },
  {
    id: '3',
    contact: mockContacts[2],
    lastMessage: 'Hey thanks for your interview...',
    timestamp: new Date('2024-01-15T15:40:00'),
    unreadCount: 1,
    messages: [
      {
        id: '5',
        senderId: '3',
        content:
          'Hey thanks for your interview today. Looking forward to hearing back from you.',
        timestamp: new Date('2024-01-15T15:40:00'),
        type: 'text',
        isRead: false,
      },
    ],
  },
  {
    id: '4',
    contact: mockContacts[3],
    lastMessage: 'Hey thanks for your interview...',
    timestamp: new Date('2024-01-15T15:40:00'),
    unreadCount: 0,
    messages: [
      {
        id: '6',
        senderId: '4',
        content:
          'Hey thanks for your interview yesterday. We should have an update for you by end of week.',
        timestamp: new Date('2024-01-15T15:40:00'),
        type: 'text',
        isRead: true,
      },
    ],
  },
  {
    id: '5',
    contact: mockContacts[4],
    lastMessage: 'Hey thanks for your interview...',
    timestamp: new Date('2024-01-15T15:40:00'),
    unreadCount: 0,
    messages: [
      {
        id: '7',
        senderId: '5',
        content:
          'Hey thanks for your interview session. We really enjoyed our conversation.',
        timestamp: new Date('2024-01-15T15:40:00'),
        type: 'text',
        isRead: true,
      },
    ],
  },
  {
    id: '6',
    contact: mockContacts[5],
    lastMessage: 'Hey thanks for your interview...',
    timestamp: new Date('2024-01-15T15:40:00'),
    unreadCount: 0,
    messages: [
      {
        id: '8',
        senderId: '6',
        content:
          'Hey thanks for your interview today. Great technical discussion!',
        timestamp: new Date('2024-01-15T15:40:00'),
        type: 'text',
        isRead: true,
      },
    ],
  },
  {
    id: '7',
    contact: mockContacts[6],
    lastMessage: 'Hey thanks for your interview...',
    timestamp: new Date('2024-01-15T15:40:00'),
    unreadCount: 2,
    messages: [
      {
        id: '9',
        senderId: '7',
        content:
          'Hey thanks for your interview today. We have some follow-up questions.',
        timestamp: new Date('2024-01-15T15:40:00'),
        type: 'text',
        isRead: false,
      },
    ],
  },
  {
    id: '8',
    contact: mockContacts[7],
    lastMessage: 'Hey thanks for your interview...',
    timestamp: new Date('2024-01-15T15:40:00'),
    unreadCount: 0,
    messages: [
      {
        id: '10',
        senderId: '8',
        content:
          'Hey thanks for your interview session. Looking forward to next steps.',
        timestamp: new Date('2024-01-15T15:40:00'),
        type: 'text',
        isRead: true,
      },
    ],
  },
  {
    id: '9',
    contact: mockContacts[8],
    lastMessage: 'Hey thanks for your interview...',
    timestamp: new Date('2024-01-15T15:40:00'),
    unreadCount: 0,
    messages: [
      {
        id: '11',
        senderId: '9',
        content:
          'Hey thanks for your interview today. Really impressed with your portfolio.',
        timestamp: new Date('2024-01-15T15:40:00'),
        type: 'text',
        isRead: true,
      },
    ],
  },
];

export const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} mins ago`;
  } else if (hours < 24) {
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else if (days === 1) {
    return 'Yesterday';
  } else {
    return timestamp.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};
