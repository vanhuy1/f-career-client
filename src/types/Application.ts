export type ApplicationStatus =
  | 'In Review'
  | 'Shortlisted'
  | 'Offered'
  | 'Interviewing'
  | 'Unsuitable'
  | 'Hired';

export type StatusColor =
  | 'yellow'
  | 'green'
  | 'blue'
  | 'red'
  | 'purple'
  | 'gray';

export type LogoColor = 'green' | 'blue' | 'red' | 'black' | 'purple';

export interface JobApplication {
  id: number;
  company: {
    name: string;
    logoColor: LogoColor;
  };
  role: string;
  dateApplied: string;
  status: ApplicationStatus;
  statusColor: StatusColor;
}

export interface StatusCount {
  status: ApplicationStatus | 'All';
  count: number;
}
