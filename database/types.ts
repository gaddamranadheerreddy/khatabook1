export interface Person {
  id: number;
  name: string;
  phone?: string | null;
  created_at: number;
}

export interface Transaction {
  id: number;
  person_id: number;
  amount: number;
  type: 'credit' | 'debit';
  note?: string | null;
  date: number;
  created_at: number;
}

export interface PersonWithBalance extends Person {
  balance: number;
  total_credit: number;
  total_debit: number;
}

export interface TransactionInput {
  person_id: number;
  amount: number;
  type: 'credit' | 'debit';
  note?: string;
  date: number;
}

export interface PersonInput {
  name: string;
  phone?: string;
}
