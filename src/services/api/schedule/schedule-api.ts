import {
  UpdateStatusScheduleEventCompanyRequest,
  UpdateStatusScheduleEventCompanyResponse,
} from '@/types/Schedule';
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

  async updateStatusScheduleEventCompany(
    eventId: string,
    request: UpdateStatusScheduleEventCompanyRequest,
  ): Promise<UpdateStatusScheduleEventCompanyResponse> {
    const url = this.requestBuilder.buildUrl(`${eventId}`);
    const response = await httpClient.patch<
      UpdateStatusScheduleEventCompanyResponse,
      UpdateStatusScheduleEventCompanyRequest
    >({
      url,
      body: request,
      typeCheck: (data) => ({
        success: true,
        data: data as UpdateStatusScheduleEventCompanyResponse,
      }),
    });
    return response;
  }
}

export const eventService = new EventService();
