import { format, toZonedTime } from 'date-fns-tz';
import {
  parseISO,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
  company?: string | { companyName: string; logoUrl?: string };
  companyName?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string | Date;
  type?: string;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  user1: User;
  user2: User;
  user1Id: string;
  user2Id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface FrontendConversation {
  id: string;
  contact: User;
  messages: Message[];
  lastMessage: string;
  timestamp: string | Date;
  unreadCount: number;
}

export function formatTimestamp(timestamp: Date | string | undefined): string {
  if (!timestamp) return '';

  // Chuẩn hóa đầu vào timestamp
  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    try {
      // Parse chuỗi ISO hoặc các định dạng khác, giả sử timestamp từ server là UTC
      date = parseISO(timestamp);
    } catch (_) {
      console.error('Invalid timestamp format:', timestamp);
      return '';
    }
  }
  // Kiểm tra xem date có hợp lệ không
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }

  const timeZone = 'Asia/Ho_Chi_Minh';
  // Chuyển đổi từ UTC sang Asia/Ho_Chi_Minh
  const zonedDate = toZonedTime(date, timeZone);
  const now = toZonedTime(new Date(), timeZone); // Thời gian hiện tại ở VN

  // Tính khoảng cách thời gian
  const minutes = differenceInMinutes(now, zonedDate);
  const hours = differenceInHours(now, zonedDate);
  const days = differenceInDays(now, zonedDate);

  // Logic định dạng
  if (minutes < 1) {
    return 'Vừa xong';
  } else if (minutes < 60) {
    return `${minutes} phút trước`;
  } else if (hours < 24) {
    return format(zonedDate, 'h:mm a', { timeZone });
  } else if (days < 7) {
    const weekday = format(zonedDate, 'EEE', { timeZone });
    const time = format(zonedDate, 'h:mm a', { timeZone });
    return `${weekday} ${time}`;
  } else {
    const showYear = now.getFullYear() !== zonedDate.getFullYear();
    return format(zonedDate, showYear ? 'MMM d, yyyy' : 'MMM d', { timeZone });
  }
}
