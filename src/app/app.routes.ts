import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RecordsListComponent } from './records/records-list/records-list';

import { RecordFormComponent } from './records/record-form/record-form';

import { RecordDetailComponent } from './records/record-detail/record-detail'

import { authGuard } from './core/auth/auth.guard';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'records', component: RecordsListComponent, canActivate: [authGuard] },
  { path: 'records/add', component: RecordFormComponent, canActivate: [authGuard] },
  { path: 'records/:id', component: RecordDetailComponent, canActivate: [authGuard] },
  { path: 'records/:id/edit', component: RecordFormComponent, canActivate: [authGuard] },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
