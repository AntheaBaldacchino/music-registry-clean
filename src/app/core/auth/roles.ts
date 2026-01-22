import { UserRole } from './auth.models';

export const canAdd = (role: UserRole) =>
  role === 'clerk' || role === 'manager' || role === 'admin';

export const canUpdate = (role: UserRole) =>
  role === 'manager' || role === 'admin';

export const canDelete = (role: UserRole) =>
  role === 'admin';
