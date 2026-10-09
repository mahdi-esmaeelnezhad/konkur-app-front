export type UserRole = "student" | "coach" | "parent" | "teacher" | "admin";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  locale?: string;
  timezone?: string;
  account_status?: string;
}

export interface MeUser extends AuthUser {
  profile?: {
    display_name?: string;
    bio?: string;
    avatar_url?: string;
  };
}

export interface StudySession {
  id: string;
  status: string;
  title?: string;
  activity_type?: string;
  started_at?: string | null;
  ended_at?: string | null;
  active_seconds?: number;
  notes_summary?: string;
}

export interface Goal {
  id: string;
  title: string;
  target_value: string | number;
  current_value: string | number;
  unit: string;
  status: string;
  deadline?: string | null;
}

export interface Post {
  id: string;
  body: string;
  title?: string;
  visibility: string;
  author?: { id: string; username?: string };
  created_at?: string;
  comment_count?: number;
  reaction_count?: number;
}

export interface NavItem {
  href: string;
  label: string;
  key: string;
}
