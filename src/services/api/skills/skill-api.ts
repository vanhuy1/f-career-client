import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

export interface Skill {
  id: string;
  name: string;
}

class SkillService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('skills');
  }

  async findAll(): Promise<Skill[]> {
    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.get<Skill[]>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as Skill[],
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }
}

export const skillService = new SkillService();
