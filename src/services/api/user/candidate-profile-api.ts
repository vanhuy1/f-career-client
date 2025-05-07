import { CandidateProfile } from '@/types/CandidateProfile';
import { RequestBuilder } from '@/utils/axios/request-builder';
import candidateProfileData from '@/data/candidate-profile/candidate-profile.json';

class CandidateProfileService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath(
      'candidate-profile',
    );
  }

  async getCandidateProfile(): Promise<CandidateProfile> {
    return candidateProfileData as CandidateProfile;
  }
}

export const candidateProfileService = new CandidateProfileService();
