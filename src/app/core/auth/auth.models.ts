export type UserRole = 'clerk' | 'manager' | 'admin';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}
