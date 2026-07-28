export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'LabOperator' | 'SpecialistDoctor';
  professionalRegistration?: string;
  specialty?: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface BiopsyCaseSummary {
  id: string;
  internalCaseCode: string;
  organSite: string;
  stainingType: string;
  status: 'Pending' | 'InReview' | 'Laudado' | 'ReadyForArchive';
  slideCount: number;
  hasOpinion: boolean;
  createdAt: string;
  createdByUserName: string;
}

export interface SlideFile {
  id: string;
  originalFileName: string;
  fileSizeBytes: number;
  contentType: string;
  fileHash?: string;
  temporaryShareLink?: string;
  shareLinkExpiresAt?: string;
  uploadedAt: string;
}

export interface ClinicalOpinion {
  id: string;
  diagnosticImpression: string;
  microscopicDescription?: string;
  additionalComments?: string;
  priorityLevel?: string;
  isSigned: boolean;
  createdAt: string;
  signedAt?: string;
  issuedByUserId: string;
  issuedByUserName: string;
  issuedByUserSpecialty?: string;
}

export interface BiopsyCaseDetail {
  id: string;
  internalCaseCode: string;
  organSite: string;
  stainingType: string;
  clinicalSummary: string;
  status: 'Pending' | 'InReview' | 'Laudado' | 'ReadyForArchive';
  patientBiologicalSex?: string;
  patientAgeAtBiopsy?: number;
  createdAt: string;
  updatedAt?: string;
  createdByUserName: string;
  slideFiles: SlideFile[];
  opinions: ClinicalOpinion[];
}

export interface AuditLog {
  id: string;
  action: string;
  entityName: string;
  entityId?: string;
  details?: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  userName: string;
  userEmail?: string;
}
