export interface Applicant {
    id: string
    fullName: string
    avatar: string
    score: number
    hiringStage: "Interview" | "Shortlisted" | "Declined" | "Hired" | "Interviewed"
    appliedDate: string
    jobRole: string
}

export interface ApplicantFilters {
    search: string
    stage?: string
    role?: string
}

export interface PaginationState {
    currentPage: number
    itemsPerPage: number
    totalItems: number
}
