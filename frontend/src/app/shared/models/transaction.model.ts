export interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'verified' | 'completed' | 'rejected';
  customerId: any;
  recipientDetails: {
    name: string;
    account: string;
    swiftCode: string;
    bank: string;
  };
  verificationDetails?: {
    verifiedBy: string;
    verifiedAt: Date;
    notes: string;
  };
  processing?: boolean; 
  verificationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
