export interface CoreTeamMember {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
}

export interface CreateCoreTeamReq {
  name: string;
  position: string;
  imageUrl: string;
}

export interface UpdateCoreTeamReq {
  name?: string;
  position?: string;
  imageUrl?: string;
}

export interface CoreTeamListResponse {
  data: CoreTeamMember[];
  meta: Record<string, unknown>;
}

export interface CoreTeamResponse {
  data: CoreTeamMember;
  meta: Record<string, unknown>;
}
