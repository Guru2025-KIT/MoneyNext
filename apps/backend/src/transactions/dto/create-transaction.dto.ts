export class CreateTransactionDto {
  accountId: string;
  type: string;
  amount: number;
  description: string;
  category?: string;
  date?: string;
}
