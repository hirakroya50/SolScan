export type TokenBalance = {
  mint: string;
  amount: number;
};

export type Transaction = {
  sig: string;
  time: number | null;
  ok: boolean;
};

export type WalletOverview = {
  balance: number;
  tokens: TokenBalance[];
  txns: Transaction[];
};
