import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecordEntryUI, RecordsService } from '../records.service';
import { AuthService } from '../../core/auth/auth.service';
import { canUpdate, canDelete } from '../../core/auth/roles';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExportService } from '../export.service';
  
@Component({
  selector: 'app-records-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
 template: `
      <mat-card-title>Records</mat-card-title>
    <mat-card>

      <mat-card-content>
        <div class="err" *ngIf="error">{{ error }}</div>

        <div class="center" *ngIf="loading">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        </div>

        <div class="export">
          <button mat-stroked-button type="button" (click)="exportExcel()">Export Excel</button>
          <button mat-stroked-button type="button" (click)="exportPdf()">Export PDF</button>
        </div>

        <table *ngIf="!loading && records.length" class="tbl">
          <thead>
            <tr>
              <th>Row Number</th>
              <th>Id</th>
              <th>Customer ID</th>
              <th>Customer Last Name</th>
              <th>Format</th>
              <th>Genre</th>
              <th class="actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let r of records">
              <td>{{ r.id }}</td>
              <td>{{ r.customer.customerId }}</td>
              <td>{{ r.customer.lastName }}</td>
              <td>{{ r.format }}</td>
              <td>{{ r.genre }}</td>

              <td class="actions">
                <a mat-stroked-button color="primary" [routerLink]="['/records', r.id]">View</a>

                <button
                  mat-stroked-button
                  type="button"
                  [disabled]="!allowUpdate"
                  (click)="onUpdate(r.id!)">
                  Update
                </button>

                <button
                  mat-stroked-button
                  color="warn"
                  type="button"
                  [disabled]="!allowDelete"
                  (click)="onDelete(r.id!)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p *ngIf="!loading && !records.length && !error">No records yet.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .tbl { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border-bottom: 1px solid #e6e6e6; padding: 10px 8px; text-align: left; }
    .actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .actions-col { width: 260px; }
    .err { color: red; margin-top: 8px; }
    .center { display: flex; justify-content: center; padding: 18px 0; }
    .export { display: flex; gap: 10px; margin: 10px 0; flex-wrap: wrap; }

  `]
})
export class RecordsListComponent implements OnInit {
  [x: string]: any;
  records: RecordEntryUI[] = [];
  error = '';

  allowUpdate = false;
  allowDelete = false;
  loading = false;

  constructor(
    private recordsApi: RecordsService,
    private auth: AuthService,
    private router: Router,
    private exportSvc: ExportService
  ) {}

  ngOnInit(): void {
    const role = this.auth.role();
    if (role) {
      this.allowUpdate = canUpdate(role);
      this.allowDelete = canDelete(role);
    }
    this.loading = true;
    this.recordsApi.getAll().subscribe({
      next: (data) => (
        this.records = data, this.loading = false
      ),
     error: (e) => {
      this.error = e?.error?.message ?? 'Failed to load records.';
      this.loading = false;
    }
    });
  }

  onUpdate(id: number) {
    this.router.navigate(['/records', id, 'edit']);

  }

  onDelete(id: number) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    this.recordsApi.delete(id).subscribe({
    next: () => {
      this.records = this.records.filter(r => r.id !== id);
    },
    error: (e) => {
      this.error = e?.error?.message ?? 'Failed to delete record.';
    }
  });
  }

  exportExcel() {
    this.exportSvc.exportExcel(this.records);
  }

  exportPdf() {
    this.exportSvc.exportPdf(this.records);
  }

}
