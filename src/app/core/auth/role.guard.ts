import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from './auth.models';

export const roleGuard =
  (allowed: UserRole[]): CanActivateFn =>
  () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const role = auth.role();
    if (!role) return router.parseUrl('/login');

    return allowed.includes(role) ? true : router.parseUrl('/records');
  };

// if your not in the allowed roles, redirect to /records
