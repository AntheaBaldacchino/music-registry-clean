import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { LookupService } from '../lookup.service';
import { RecordsService } from '../records.service';
import { AuthService } from '../../core/auth/auth.service';
import { canUpdate } from '../../core/auth/roles';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


const CUSTOMER_ID_PATTERN = /^\d+[A-Za-z]$/;
const CONTACT_PATTERN = /^\d{8,}$/;

@Component({
  selector: 'app-record-form',
  standalone: true,
  imports: [CommonModule,
  ReactiveFormsModule,
  RouterLink,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule],
  templateUrl: './record-form.html',
  styleUrl: './record-form.scss'
})
export class RecordFormComponent implements OnInit {
  formats: string[] = [];
  genres: string[] = [];

  loadingLookups = false;
  saving = false;
  error = '';

  isEdit = false;
  recordId: number | null = null;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private lookups: LookupService,
    private records: RecordsService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      recordTitle: ['', Validators.required],
      artist: ['', Validators.required],
      format: ['', Validators.required],
      genre: ['', Validators.required],
      releaseYear: [null, Validators.required],
      price: [null, Validators.required],
      stockQuantity: [null, Validators.required],
      customer: this.fb.group({
        customerId: ['', [Validators.required, Validators.pattern(CUSTOMER_ID_PATTERN)]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        contactNumber: ['', [Validators.required, Validators.pattern(CONTACT_PATTERN)]],
        email: ['', [Validators.required, Validators.email]],
      }),
    });
  }

  ngOnInit(): void {
    // Detect edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.recordId = Number(idParam);
    }

    // Role gate for editing
    if (this.isEdit) {
      const role = this.auth.role();
      if (!role || !canUpdate(role)) {
        this.router.navigateByUrl('/records');
        return;
      }
    }

    // Load lookups
    this.loadingLookups = true;

    this.lookups.formats().subscribe({
      next: (f) => (this.formats = f),
      error: (e) => (this.error = e?.error?.message ?? 'Failed to load formats.'),
    });

    // After genres load, switch off loading and (if edit) load record + patch form
    this.lookups.genres().subscribe({
      next: (g) => {
        this.genres = g;
        this.loadingLookups = false;

        if (this.isEdit && this.recordId) {
          this.loadRecordForEdit(this.recordId);
        }
      },
      error: (e) => {
        this.error = e?.error?.message ?? 'Failed to load genres.';
        this.loadingLookups = false;
      },
    });

    // If not edit, nothing else to do
  }

  private loadRecordForEdit(id: number) {
    this.records.getById(id).subscribe({
      next: (r) => this.form.patchValue(r as any),
      error: (e) => (this.error = e?.error?.message ?? 'Failed to load record for editing.'),
    });
  }

  t(name: string) {
    const c = this.form.get(name);
    return !!(c && c.touched && c.invalid);
  }

  t2(group: string, name: string) {
    const c = this.form.get(`${group}.${name}`);
    return !!(c && c.touched && c.invalid);
  }

  onSubmit(): void {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.form.getRawValue();

    // CREATE
    if (!this.isEdit) {
      this.records.create(payload as any).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigateByUrl('/records');
        },
        error: (e) => {
          this.saving = false;
          this.error = e?.error?.message ?? 'Failed to save record.';
        }
      });
      return;
    }

    // UPDATE
    if (!this.recordId) {
      this.saving = false;
      this.error = 'Invalid record id.';
      return;
    }

    if (!confirm('Confirm update?')) {
      this.saving = false;
      return;
    }

    this.records.update(this.recordId, payload as any).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigateByUrl('/records');
      },
      error: (e) => {
        this.saving = false;
        this.error = e?.error?.message ?? 'Failed to update record.';
      }
    });
  }
}
