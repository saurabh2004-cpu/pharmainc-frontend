import { EnumValues } from "zod/v3";

// Auth types
export enum RoleEnum {
  NURSE = "NURSE",
  DOCTOR = "DOCTOR",
  STUDENT = "STUDENT",
  OTHER = "OTHER",
}

export enum InstituteRoles {
  HOSPITAL = "HOSPITAL",
  CLINIC = "CLINIC",
  LAB = "LAB",
  PHARMACY = "PHARMACY",
}

export enum EntityType {
  USER = "USER",
  INSTITUTE = "INSTITUTE"
}

export type EntityRole = RoleEnum | InstituteRoles;

// Forward declaration - will be fully defined below
export type Entity = User | Institution;

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}


export interface AuthParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // location: string; // Removed
  country: string;
  city: string;
  university?: string;
  degree?: string;
  yearOfStudy?: string;
  specialization?: string;
  gender?: string;
  experience?: string;
  role: RoleEnum;
  speciality?: string;
  subSpeciality?: string;
  type?: string;
  name?: string;
}

export type AuthSignInParams = Pick<AuthParams, "email" | "password" | "type" | "name">;



export interface AuthResponse {
  token: string;
  role: string;
}

// User types
export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  // location?: string; // key might still exist in old records, keeping optional or removing? User said "replaced".
  // But to be safe for frontend displaying old data, maybe keep it?
  // User said "Now it has been removed".
  // So I'll remove it or keep it optional for now to avoid breaking display components I haven't checked.
  // Actually, user said "Do NOT send location".
  // Let's add country and city.
  country?: string;
  city?: string;
  location?: string; // Keeping for backward compatibility if needed, but discouraged
  role: string;
  created_at: string;
  updated_at: string;
  email: string;
  bio?: string;
  verified?: boolean;
  profile_picture?: string;
  specialization?: string;
  specialties?: Specialty[];
  banner_picture?: string;
  headline?: string;
  about?: string;
  followers?: number;
  connections?: number;
  isFollowing?: boolean;
  isConnected?: boolean;
  connectionStatus?: 'none' | 'pending_sent' | 'pending_received' | 'connected';
  gender?: string;
}

export interface UserCreateParams {
  name: string;
  location: string;
  role: string;
  specialization?: string;
  gender?: string;
}

export interface UserUpdateParams {
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  location?: string;
  role?: string;
  email?: string;
  verified?: boolean;
  profile_picture?: string;
  banner_picture?: string;
  headline?: string;
  about?: string;
  followers?: number;
  connections?: number;
  specialization?: string;
  specialties?: Specialty[];
  gender?: string;
}

export interface UserSearchParams {
  page?: number;
  limit?: number;
  fields?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string;
  location?: string;
  role?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// New search response format
export interface SearchUsersResponse {
  users: User[];
  page: number;
  pageSize: number;
  total: number;
}

export interface SearchInstitutionsResponse {
  institutes: Institution[];
  page: number;
  pageSize: number;
  total: number;
}

// Network types
export interface FollowParams {
  id2: string;
  id2_poster_type: "user" | "institute";
}

export interface Follow extends FollowParams {
  id: string;
  created_at: string;
  id1: string;
}

export interface ConnectParams {
  id2: string;
  id2_poster_type: "user" | "institute";
}

export interface Connect extends ConnectParams {
  id: string;
  created_at: string;
  id1: string;
  id2: string;
  accepted: boolean;
}

// Background types
export interface Education {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  user_id: string;
  institution_id: string;
  created_at: string;
  updated_at: string;
  // New fields
  instituteName?: string;
  degree?: string;
  country?: string;
  city?: string;
  isCurrentJob?: boolean;
}

export interface EducationParams {
  title: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  institution_id?: string;
  // New params
  instituteName?: string;
  degree?: string;
  country?: string;
  city?: string;
  isCurrentJob?: boolean;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  user_id: string;
  institution_id: string;
  created_at: string;
  updated_at: string;
  // New fields
  institutionName?: string;
  organizationName?: string;
  role?: string;
  locationType?: string;
  country?: string;
  city?: string;
  isCurrentJob?: boolean;
}

export interface ExperienceParams {
  title: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  institution_id?: string;
  // New fields
  organizationName?: string;
  role?: string;
  locationType?: string;
  country?: string;
  city?: string;
  isCurrentJob?: boolean;
}

export interface Skills {
  id: string;
  userId: string;
  skills: string[];
}

export interface SkillsParams {
  skills: string[];
}

// Institute types
export interface Institution {
  id: string;
  name: string;
  location: string;
  type: string;
  created_at: string;
  updated_at: string;
  verified?: boolean;
  email?: string;
  employees_count?: string;
  area_of_expertise?: string;
  profile_picture?: string;
  banner_picture?: string;
  contact_email?: string;
  contact_number?: string;
  bio?: string;
  about?: string;
  followers?: number;
  role?: string;
  // New fields from prompt
  headline?: string;
  bedsCount?: number;
  staffCount?: number;
  telephone?: string;
  services?: string[];
  affiliatedUniversity?: string;
  yearEstablished?: number;
  ownership?: string;
  contactEmail?: string;
  contactNumber?: string;
  country?: string;
  city?: string;
  specialties?: string[];
}

export interface InstituteSignUpParams {
  name: string;
  country: string;
  city: string;
  contactEmail: string;
  password: string;
  location: string;
  contactNumber: string;
  role: string;
  type: string;
  services: string[];
  telephone: string;
  bedsCount: number;
  staffCount: number;
  verified?: boolean;
}

export interface InstitutionCreateParams {
  name: string;
  location: string;
  type: string;
}

export interface InstitutionUpdateParams {
  name?: string;
  location?: string;
  type?: string;
  verified?: boolean;
  email?: string;
  employees_count?: string;
  staffCount?: number;
  area_of_expertise?: string;
  profile_picture?: string;
  banner_picture?: string;
  contact_email?: string;
  contact_number?: string;
  contactNumber?: string;
  bio?: string;
  about?: string;
  followers?: number;
  bedsCount?: number;
  telephone?: string;
  services?: string[];
  headline?: string;
  country?: string;
  city?: string;
}

export interface InstitutionSearchParams {
  q?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
  fields?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface JobInactiveReason {
  id: string;
  created_at: string;
  updated_at: string;
  jobId: string;
  reason: string;
}

// Job types
export interface Job {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  fullDescription: string;
  jobType: string;
  workLocation: string;
  experienceLevel: string;
  requirements: string;
  salaryMin: number;
  salaryMax: number;
  status: string;
  shortDescription: string;
  salaryCurrency: string;
  applicationDeadline: string | null;
  contactEmail: string;
  contactPhone: string;
  contactPerson: string;
  additionalInfo: string;
  instituteId: string;
  specialties: string[];
  // New fields
  city?: string | null;
  country?: string | null;
  role?: string;
  skills?: string[];
  speciality?: string | null;
  subSpeciality?: string | null;

  institute?: {
    id: string;
    created_at: string;
    name: string;
    location: string;
    type: string;
    verified: boolean;
    contactEmail: string;
    contactNumber: string;
    role: string;
    affiliatedUniversity: string | null;
    yearEstablished: number | null;
    ownership: string | null;
    headline: string | null;
    about: string | null;
    specialties: string[];
    services: string[];
  };
  // Legacy properties for compatibility
  pay_range?: string;
  benefits?: string;
  category?: string;
  location?: string;
  // role?: string; // Removed duplicate legacy
  work_location?: string;
  experience_level?: string;
  institute_id?: string;
  active?: boolean;
  applicationsCount?: number;
  jobInactiveReasons?: JobInactiveReason[];
}

export interface JobCreateParams {
  title: string;
  fullDescription: string;
  jobType: string;
  workLocation: string;
  experienceLevel: string;
  requirements: string;
  salaryMin: number;
  salaryMax: number;
  shortDescription?: string | null;
  salaryCurrency?: string | null;
  applicationDeadline?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactPerson?: string | null;
  additionalInfo?: any;
  specialties?: Array<{ id?: string; name: string; description?: string }>;
  // New fields
  city?: string;
  country?: string;
  role: string;
  skills: string[];
  speciality?: string | null;
  subSpeciality?: string | null;
  status?: string;
}

export interface JobUpdateParams {
  title?: string;
  description?: string;
  fullDescription?: string;
  pay_range?: string;
  benefits?: string;
  category?: string;
  location?: string;
  role?: string;
  work_location?: string;
  experience_level?: string;
  active?: boolean;

  // Modern fields (camelCase)
  jobType?: string;
  workLocation?: string;
  experienceLevel?: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
  shortDescription?: string | null;
  salaryCurrency?: string | null;
  applicationDeadline?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactPerson?: string | null;
  additionalInfo?: any;
  skills?: string[];
  speciality?: string | null;
  subSpeciality?: string | null;
  city?: string | null;
  country?: string | null;
  status?: string;
}

export interface JobSearchParams {
  q?: string;
  title?: string;
  description?: string;
  pay_range?: string;
  benefits?: string;
  category?: string;
  location?: string;
  role?: string;
  work_location?: string;
  experience_level?: string;
  institute_id?: string;
  active?: boolean;
  page?: number;
  limit?: number;
  fields?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetJobResponse extends Job {
  matchingScore: number | null;
  job: Job;
}

// Content types
export interface Post {
  id: string;
  title: string;
  content: string;
  auth: string;
  created_at: string;
  updated_at: string;
  reactions?: number;
  shares?: number;
  saves?: number;
  attachment_id?: string;
  poster_type: string
}

export interface PostCreateParams {
  title: string;
  content: string;
  attachment_id?: string;
}

export interface PostUpdateParams {
  title?: string;
  content?: string;
  attachment_id?: string;
}

export interface PostSearchParams {
  q: string;
  auth?: string;
  minReactions?: number;
  maxReactions?: number;
  dateFrom?: string;
  dateTo?: string;
  hasAttachment?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Comment {
  id: string;
  content: string;
  auth: string;
  post_id: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  reactions?: number;
  shares?: number;
  saves?: number;
}

export interface CommentCreateParams {
  content: string;
  post_id: string;
  parent_id?: string;
}

export interface CommentUpdateParams {
  content: string;
}

export interface CommentSearchParams {
  q: string;
  auth?: string;
  post_id?: string;
  minReactions?: number;
  maxReactions?: number;
  dateFrom?: string;
  dateTo?: string;
  hasReplies?: boolean;
  isReply?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  created_at: string;
  updated_at: string;
  cover_letter?: string | null;
  coverLetter?: string | null;
  resume_url?: string | null;
  resumeUrl?: string | null;
  portfolio_url?: string | null;
  status?: string;
  notes?: string | null;
  additional_info?: Record<string, unknown>;
  additionalDetails?: Record<string, unknown>;
  applied_at?: string;
  appliedDate?: string;
  reviewed_at?: string | null;
  responded_at?: string | null;
  experienceYears?: number | null;
  currentPosition?: string | null;
  currentInstitute?: string | null;
  // Optional embedded objects from API
  user?: any;
  job?: Job;
}

export interface ApplicationCreateParams {
  appliedDate?: string | null;
  resumeUrl: string;
  coverLetter?: string | null;
  experienceYears?: number | null;
  currentPosition?: string | null;
  currentInstitute?: string | null;
  additionalDetails?: Record<string, unknown> | null;
  jobId: string;
  userId: string;
}

export interface ApplicationUpdateParams {
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  status?: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  notes?: string;
  additional_info?: Record<string, unknown>;
  reviewed_at?: string;
  responded_at?: string;
}

// Job Stats types (deprecated - kept for backward compatibility)
export interface JobStats {
  totals: {
    totalCandidatesViewed: number;
    responseRate: number;
    averageResponseTime: number;
    conversionRate: number;
  };
  trends: Array<{
    date: string;
    views: number;
    responses: number;
  }>;
  weeklyComparison: Array<{
    week: string;
    engagement: number;
  }>;
  responseDistribution: Record<string, number>;
  engagementMetrics: {
    openRate: number;
    clickRate: number;
    applicationRate: number;
  };
}

// Institute Stats types (new)
export interface InstituteStats {
  totals: {
    totalJobs: number;
    totalInstituteProfileViews: number;
    totalApplications: number;
    averageResponseRate: number;
    averageResponseTimeHours: number;
    conversionRate: number;
  };
  trends?: Array<{
    date: string;
    views: number;
    applications: number;
  }>;
  weeklyComparison?: Array<{
    week: string;
    engagement: number;
  }>;
  responseDistribution?: Record<string, number>;
}

export interface ReactionResponse {
  postId: string;
  reacted: boolean;
  totalReactions: number;
}

// Chat types
export interface ChatUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  verified?: boolean;
  online?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  senderUsername: string;
  recipientUsername: string;
  replyTo?: string;
  tempId?: string;
  sending?: boolean;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  lastSender: string;
}

// Specialty types
export interface Specialty {
  id: string;
  name: string;
  users?: string[];
  institutes?: string[];
}

export interface SpecialtyCreateParams {
  name: string;
}

export interface SpecialtySearchParams {
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface SpecialtySearchResponse {
  specialties: Specialty[];
  page: number;
  pageSize: number;
  total: number;
}

// Notification types
export interface Notification {
  id: string;
  createdAt: string;
  receiverId: string;
  receiverRole: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedJobId?: string | null;
  relatedApplicationId?: string | null;
  job?: Job;
  application?: Application;
  type?: string;
  status?: string;
}

export interface ApplicationStats {
  applied: number;
  interviewScheduled: number;
  rejected: number;
}
