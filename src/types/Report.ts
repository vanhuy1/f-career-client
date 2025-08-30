export interface ReportUserInfo {
    id: string | number;
    name?: string;
    email?: string;
}

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export interface Report {
    id: string;
    title: string;
    description: string;
    jobId: string;
    userId?: number | string;
    status?: ReportStatus;
    reportedBy?: ReportUserInfo;
    user?: {
        id: number | string;
        name: string;
        email: string;
    };
    job?: {
        id: string;
        title: string;
        location: string;
        company: {
            id: string;
            name: string;
        };
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateReportReq {
    title: string;
    description: string;
    jobId: string;
}

export interface ReportListParams {
    status?: ReportStatus;
    limit?: number;
    page?: number;
}

export interface ReportListMeta {
    count: number;
    page: number;
}

export interface ReportListResponse {
    reports: Report[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UpdateReportStatusReq {
    status: ReportStatus;
    adminNote?: string;
}

export interface HideJobRequest {
    jobId: string;
    reason: string;
}

export interface HideJobResponse {
    message: string;
}


