export class CreateBudgetDto {
  name: string;
  amount: number;
  period: string;
  category?: string;
}
