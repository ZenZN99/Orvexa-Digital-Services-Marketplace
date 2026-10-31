export interface IPlatformWallet {
  id: string;
  balance: number;
  key: string;
  createdAt?: Date;
  updatedAt?: Date;
}
