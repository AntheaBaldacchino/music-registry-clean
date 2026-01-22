import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from "@angular/material/card";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatCard, MatCardTitle, MatCardContent, MatError, MatCardActions],
  template: `
    <mat-card-title>Login</mat-card-title>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
  <mat-card class="card">

    <mat-card-content>
      <mat-form-field appearance="outline" class="full">
        <mat-label>Email</mat-label>
        <input
          matInput
          type="email"
          formControlName="email"
          autocomplete="username"
        />
        <mat-error *ngIf="email.touched && email.hasError('required')">
          Email is required.
        </mat-error>
        <mat-error *ngIf="email.touched && email.hasError('email')">
          Email format is invalid.
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full">
        <mat-label>Password</mat-label>
        <input
          matInput
          type="password"
          formControlName="password"
          autocomplete="current-password"
        />
        <mat-error *ngIf="password.touched && password.hasError('required')">
          Password is required.
        </mat-error>
      </mat-form-field>

      <p class="err" *ngIf="serverError">{{ serverError }}</p>
    </mat-card-content>

    <mat-card-actions class="actions">
      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="form.invalid || loading"
      >
        {{ loading ? 'Signing in...' : 'Login' }}
      </button>
    </mat-card-actions>
  </mat-card>
</form>
  `,
  styles: `
    .full { width: 100%; }
.card { max-width: 420px; margin: 24px auto; }
.actions { padding: 0 16px 16px; }
.err { color: red; margin: 8px 16px 0; }

  `
})
export class LoginComponent {
  loading = false;
  serverError = '';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit() {
    this.serverError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.getRawValue() as { email: string; password: string };

    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/records');
      },
      error: (err) => {
        this.loading = false;
        this.serverError = err?.error?.message ?? 'Login failed. Check credentials and try again.';
      }
    });
  }
}
