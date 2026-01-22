import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl, API_CONFIG } from '../core/api/api.config';

@Injectable({ providedIn: 'root' })
export class LookupService {
  constructor(private http: HttpClient) {}

  formats() {
    return this.http.get<string[]>(apiUrl(API_CONFIG.endpoints.formats));
  }

  genres() {
    return this.http.get<string[]>(apiUrl(API_CONFIG.endpoints.genres));
  }

  // populate dropdowns for record
}