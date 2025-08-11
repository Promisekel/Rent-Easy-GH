export interface Payment {
  userId: string;
  type: 'feature' | 'verify' | 'premiumView';
  amount: number;
  listingId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}