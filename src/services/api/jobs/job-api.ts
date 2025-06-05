import { Job, JobListResponse, CreateJobReq, UpdateJobReq } from '@/types/Job';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class JobService {
  private rb = new RequestBuilder().setResourcePath('jobs');

  /** GET /jobs?limit=&offset= */
  async findAll(limit?: number, offset?: number): Promise<JobListResponse> {
    const url = this.rb.buildUrl('');

    console.log(limit, offset); // handle share page
    return await httpClient.get<JobListResponse>({
      url,
      typeCheck: (data) => ({ success: true, data: data as JobListResponse }),
    });
  }

  /** GET /jobs/company/:companyId?limit=&offset= */

  async findByCompany(
    companyId: string,
    limit?: number,
    offset?: number,
  ): Promise<JobListResponse> {
    const url = this.rb.buildUrl(`company/${companyId}`);
    console.log(limit, offset);
    return await httpClient.get<JobListResponse>({
      url,
      typeCheck: (data) => ({ success: true, data: data as JobListResponse }),
    });
  }

  /** GET /jobs/:id */
  async findOne(id: string): Promise<Job> {
    const url = this.rb.buildUrl(id);
    const response = await httpClient.get<{ data: Job; meta?: string }>({
      url,
      typeCheck: (data) => ({ success: true, data }),
    });
    return response.data;
  }

  /** POST /jobs */
  async create(payload: CreateJobReq): Promise<Job> {
    const url = this.rb.buildUrl();
    return await httpClient.post<Job, CreateJobReq>({
      url,
      body: payload,
      typeCheck: (data) => ({ success: true, data: data as Job }),
    });
  }

  /** PATCH /jobs/:id */
  async update(id: string, payload: UpdateJobReq): Promise<Job> {
    const url = this.rb.buildUrl(id);
    return await httpClient.patch<Job, UpdateJobReq>({
      url,
      body: payload,
      typeCheck: (data) => ({ success: true, data: data as Job }),
    });
  }

  /** DELETE /jobs/:id */
  async delete(id: string): Promise<void> {
    const url = this.rb.buildUrl(id);
    await httpClient.delete<void>({
      url,
      typeCheck: (data) => ({ success: true, data: data }),
    });
  }
}

export const jobService = new JobService();
