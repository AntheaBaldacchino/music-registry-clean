import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar class="bar" color="primary">
      <div class="nav">
        <a mat-button routerLink="/login" routerLinkActive="active">Login</a>

        <a *ngIf="loggedIn()" mat-button routerLink="/records" routerLinkActive="active">Records</a>
        <a *ngIf="loggedIn()" mat-button routerLink="/records/add" routerLinkActive="active">Add Records</a>
      </div>

      <span class="spacer"></span>

      <span *ngIf="loggedIn()" class="meta">
        {{ role() }} | {{ email() }}
      </span>

      <button *ngIf="loggedIn()" mat-stroked-button color="warn" (click)="logout()">
        Logout
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .bar { position: sticky; top: 0; z-index: 10; }
    .nav { display: flex; gap: 6px; align-items: center; }
    .spacer { flex: 1; }
    .meta { margin-right: 12px; opacity: 0.95; font-size: 0.95rem; }
    .active { font-weight: 700; }
  `]
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  loggedIn = () => this.auth.isLoggedIn();
  role = () => this.auth.role() ?? '';
  email = () => this.auth.session()?.email ?? '';

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
