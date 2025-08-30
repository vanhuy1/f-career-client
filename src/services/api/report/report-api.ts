import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';
import { CreateReportReq, Report, ReportListParams, ReportListResponse, UpdateReportStatusReq, HideJobRequest, HideJobResponse } from '@/types/Report';

class ReportService {
    private rb = new RequestBuilder().setResourcePath('reports');

    /** POST /reports */
    async create(payload: CreateReportReq): Promise<Report> {
        const url = this.rb.buildUrl();
        const response = await httpClient.post<Report, CreateReportReq>({
            url,
            body: payload,
            typeCheck: (data) => ({ success: true, data: data as Report }),
        });
        return response;
    }

    /** GET /reports?status=&limit=&page= */
    async list(params?: ReportListParams): Promise<ReportListResponse> {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.limit !== undefined) queryParams.append('limit', String(params.limit));
        if (params?.page !== undefined) queryParams.append('page', String(params.page));

        const baseUrl = this.rb.buildUrl('');
        const url = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
        return await httpClient.get<ReportListResponse>({
            url,
            typeCheck: (data) => ({ success: true, data: data as ReportListResponse }),
        });
    }

    /** GET /reports/:id */
    async findOne(id: string): Promise<Report> {
        const url = this.rb.buildUrl(id);
        return await httpClient.get<Report>({
            url,
            typeCheck: (data) => ({ success: true, data: data as Report }),
        });
    }

    /** PATCH /reports/:id/status */
    async updateStatus(id: string, payload: UpdateReportStatusReq): Promise<Report> {
        const url = this.rb.buildUrl(`${id}/status`);
        return await httpClient.patch<Report, UpdateReportStatusReq>({
            url,
            body: payload,
            typeCheck: (data) => ({ success: true, data: data as Report }),
        });
    }

    /** POST /reports/hide-job */
    async hideJob(payload: HideJobRequest): Promise<HideJobResponse> {
        const url = this.rb.buildUrl('hide-job');
        return await httpClient.post<HideJobResponse, HideJobRequest>({
            url,
            body: payload,
            typeCheck: (data) => ({ success: true, data: data as HideJobResponse }),
        });
    }
}

export const reportService = new ReportService();


