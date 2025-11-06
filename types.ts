// Fix: Define and export the TransactionType enum to resolve import errors.
export enum TransactionType {
  INCOME = 'Pemasukan',
  EXPENSE = 'Pengeluaran',
}

export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: TransactionType;
  balance ? : number;
}

export type NewTransaction = Omit < Transaction, 'id' | 'balance' > ;

export interface NotificationState {
  message: string;
  type: 'success' | 'error';
}
export {};