export interface User {
  id: string;
  name: string;
  email: string;
  role: 'landlord' | 'renter';
  verified: boolean;
  favorites: string[];
  createdAt: Date;
}