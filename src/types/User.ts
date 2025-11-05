export interface User {
  id: string;
  name: string;
  email: string;
  role: 'landlord' | 'renter' | 'admin';
  verified: boolean;
  favorites: string[];
  photoURL?: string;
  phone?: string;
  status?: 'active' | 'blocked';
  createdAt?: string | null;
  updatedAt?: string | null;
}