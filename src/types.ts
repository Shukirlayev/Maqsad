export type Transaction = {
  id: string;
  amount: number;
  date: string;
  note?: string;
};

export type Goal = {
  id: string;
  userId?: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
  history: Transaction[];
  color: string;
  category?: string;
};
