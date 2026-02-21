export class CreateGoalDto {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
  category?: string;
}
