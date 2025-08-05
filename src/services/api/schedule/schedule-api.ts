import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class EventService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('events');
  }

  async confirmEvent(eventId: string): Promise<void> {
    const url = this.requestBuilder.buildUrl(`${eventId}/confirm`);
    await httpClient.post<void, void>({
      url,
      body: undefined,
      typeCheck: () => {
        // Handle 204 No Content responses - just return success
        return {
          success: true,
          data: undefined,
        };
      },
    });
    // No need to return anything for void
  }

  async declineEvent(eventId: string): Promise<void> {
    const url = this.requestBuilder.buildUrl(`${eventId}/decline`);
    await httpClient.post<void, void>({
      url,
      body: undefined,
      typeCheck: () => {
        return {
          success: true,
          data: undefined,
        };
      },
    });
  }
}

export const eventService = new EventService();
