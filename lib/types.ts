export type NoteColor = "yellow" | "peach" | "mint" | "pink" | "sky" | "lavender";

export type Note = {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "fun"
  | "health"
  | "other";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  createdAt: number;
};

export type QuickLink = {
  id: string;
  title: string;
  url: string;
  emoji: string;
  color: string;
  createdAt: number;
};

export type Currency = {
  code: string;
  label: string;
  symbol: string;
};

export type Settings = {
  currency: Currency;
};
