import { Message, Conversation } from '@/components/messages/mock-data';

import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class MessengerService {
  private rb = new RequestBuilder().setResourcePath('messenger');

  async startConversation(
    userId: string,
    companyId: string,
  ): Promise<{ id: string; user1Id: string; user2Id: string }> {
    const url = this.rb.buildUrl('conversations/start');
    return await httpClient.post<
      { id: string; user1Id: string; user2Id: string },
      { userId: string; companyId: string }
    >({
      url,
      body: {
        userId,
        companyId,
      },
      typeCheck: (data) => ({
        success: true,
        data: data as { id: string; user1Id: string; user2Id: string },
      }),
    });
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    const url = this.rb.buildUrl(`conversations/${userId}`);
    const response = await httpClient.get<Conversation[]>({
      url,
      typeCheck: (data) => ({ success: true, data }),
    });
    return response;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const url = this.rb.buildUrl(`messages/${conversationId}`);
    const response = await httpClient.get<Message[]>({
      url,
      typeCheck: (data) => ({ success: true, data }),
    });
    return response;
  }

  async markMessagesAsRead(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const url = this.rb.buildUrl(`messages/${conversationId}/mark-read`);
    await httpClient.post<void, { userId: string }>({
      url,
      body: { userId },
      typeCheck: (data) => ({ success: true, data }),
    });
  }
}

export const messengerService = new MessengerService();
