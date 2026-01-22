import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecordsService } from '../records.service';
import { StockStatusPipe } from '../stock-status.pipe';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-record-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    StockStatusPipe,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="wrap">
      <button mat-button routerLink="/records">← Back</button>
      <mat-card-title>Record Details</mat-card-title>
      <mat-card-subtitle *ngIf="record">
        {{ record.recordTitle | lowercase }}
      </mat-card-subtitle>

      <mat-card>

        <mat-card-content>
          <div class="center" *ngIf="loading">
            <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
          </div>

          <p class="err" *ngIf="error">{{ error }}</p>

          <ng-container *ngIf="record && !loading">
            <mat-list>
              <mat-list-item><b>Title:</b>&nbsp;{{ record.recordTitle | lowercase }}</mat-list-item>
              <mat-list-item><b>Artist:</b>&nbsp;{{ record.artist }}</mat-list-item>
              <mat-list-item><b>Format:</b>&nbsp;{{ record.format }}</mat-list-item>
              <mat-list-item><b>Genre:</b>&nbsp;{{ record.genre }}</mat-list-item>
              <mat-list-item><b>Release Year:</b>&nbsp;{{ record.releaseYear }}</mat-list-item>
              <mat-list-item><b>Price:</b>&nbsp;{{ record.price }}</mat-list-item>
              <mat-list-item><b>Stock Qty:</b>&nbsp;{{ record.stockQuantity }}</mat-list-item>
              <mat-list-item>
                <b>Stock Status:</b>&nbsp;{{ record.stockQuantity | stockStatus }}
              </mat-list-item>
            </mat-list>

            <mat-divider class="gap"></mat-divider>

            <h3>Customer Purchase</h3>

            <ng-container *ngIf="record.customer; else noCust">
              <mat-list>
                <mat-list-item><b>Customer ID:</b>&nbsp;{{ record.customer.customerId }}</mat-list-item>
                <mat-list-item><b>First Name:</b>&nbsp;{{ record.customer.firstName }}</mat-list-item>
                <mat-list-item><b>Last Name:</b>&nbsp;{{ record.customer.lastName }}</mat-list-item>
                <mat-list-item><b>Contact Number:</b>&nbsp;{{ record.customer.contactNumber }}</mat-list-item>
                <mat-list-item><b>Email:</b>&nbsp;{{ record.customer.email }}</mat-list-item>
              </mat-list>
            </ng-container>

            <ng-template #noCust>
              <p>No customer linked.</p>
            </ng-template>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .wrap { max-width: 900px; margin: 16px auto; padding: 0 12px; display: grid; gap: 12px; }
    .err { color: red; }
    .center { display: flex; justify-content: center; padding: 18px 0; }
    .gap { margin: 16px 0; }
    h3 { margin: 0 0 8px; }
  `]
})
export class RecordDetailComponent implements OnInit {
  record: any = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private api: RecordsService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid record id.';
      return;
    }

    this.loading = true;
    this.api.getById(id).subscribe({
      next: (r) => { this.record = r; this.loading = false; },
      error: (e) => { this.error = e?.error?.message ?? 'Failed to load record.'; this.loading = false; }
    });
  }
}
