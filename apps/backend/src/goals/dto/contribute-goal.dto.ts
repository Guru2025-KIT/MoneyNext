import { IsNumber } from 'class-validator';

export class ContributeGoalDto {
  @IsNumber()
  amount: number;
}
