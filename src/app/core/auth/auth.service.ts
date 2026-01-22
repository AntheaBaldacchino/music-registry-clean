import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { apiUrl, API_CONFIG } from '../api/api.config';
import { LoginRequest, SessionUser, UserRole } from './auth.models';

const STORAGE_KEY = 'music_registry_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionSubject = new BehaviorSubject<SessionUser | null>(this.load());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<SessionUser> {
    const payload: LoginRequest = { email, password };

    return this.http.post<SessionUser>(apiUrl(API_CONFIG.endpoints.login), payload).pipe(
      tap((user) => {
        this.save(user);
        this.sessionSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.sessionSubject.value;
  }

  session(): SessionUser | null {
    return this.sessionSubject.value;
  }

  role(): UserRole | null {
    return this.sessionSubject.value?.role ?? null;
  }

  email(): string {
    return this.sessionSubject.value?.email ?? '';
  }

  
  session$(): Observable<SessionUser | null> {
    return this.sessionSubject.asObservable();
  }

  private save(user: SessionUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  private load(): SessionUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  }
}
