import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiUrl, API_CONFIG } from '../core/api/api.config';

export interface RecordEntryUI {
  id?: number;
  recordTitle: string;
  artist: string;
  format: string;
  genre: string;
  releaseYear: number;
  price: number;
  stockQuantity: number;
  customer: {
    customerId: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
  };
}

export interface RecordEntryApi {
  id?: number;
  title: string;
  artist: string;
  format: string;
  genre: string;
  releaseYear: number;
  price: number;
  stockQty: number;
  customerId: string;
  customerFirstName: string;
  customerLastName: string;
  customerContact: string;
  customerEmail: string;
}

@Injectable({ providedIn: 'root' })
export class RecordsService {
  private base = apiUrl(API_CONFIG.endpoints.records);

  constructor(private http: HttpClient) {}

  getAll(): Observable<RecordEntryUI[]> {
    return this.http.get<RecordEntryApi[]>(this.base).pipe(
      map((rows) => rows.map((r) => this.fromApi(r)))
    );
  }

  getById(id: number): Observable<RecordEntryUI> {
    return this.http.get<RecordEntryApi>(`${this.base}/${id}`).pipe(
      map((r) => this.fromApi(r))
    );
  }

  create(payload: RecordEntryUI): Observable<RecordEntryUI> {
    return this.http.post<RecordEntryApi>(this.base, this.toApi(payload)).pipe(
      map((r) => this.fromApi(r))
    );
  }

  update(id: number, payload: RecordEntryUI): Observable<RecordEntryUI> {
    return this.http.put<RecordEntryApi>(`${this.base}/${id}`, this.toApi(payload)).pipe(
      map((r) => this.fromApi(r))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

  private fromApi(r: RecordEntryApi): RecordEntryUI {
    return {
      id: r.id,
      recordTitle: r.title,
      artist: r.artist,
      format: r.format,
      genre: r.genre,
      releaseYear: r.releaseYear,
      price: r.price,
      stockQuantity: r.stockQty,
      customer: {
        customerId: r.customerId ?? '',
        firstName: r.customerFirstName ?? '',
        lastName: r.customerLastName ?? '',
        contactNumber: r.customerContact ?? '',
        email: r.customerEmail ?? '',
      }
    };
  }

  private toApi(r: RecordEntryUI): RecordEntryApi {
    return {
      id: r.id,
      title: r.recordTitle,
      artist: r.artist,
      format: r.format,
      genre: r.genre,
      releaseYear: r.releaseYear,
      price: r.price,
      stockQty: r.stockQuantity,
      customerId: r.customer.customerId,
      customerFirstName: r.customer.firstName,
      customerLastName: r.customer.lastName,
      customerContact: r.customer.contactNumber,
      customerEmail: r.customer.email
    };
  }
}
