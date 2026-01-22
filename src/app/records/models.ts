export type UserRole = 'SALESPERSON' | 'MANAGER' | 'ADMIN';

export interface UserSession {
  token: string;
  role: UserRole;
  email: string;
}

export interface Customer {
  customerId: string;         
  firstName: string;
  lastName: string;
  contactNumber: string;       
  email: string;
}

export interface RecordEntry {
  id?: number;                 
  recordTitle: string;
  artist: string;
  format: string;              
  genre: string;               
  releaseYear: number;
  price: number;
  stockQuantity: number;
  customer: Customer | null;   
}
