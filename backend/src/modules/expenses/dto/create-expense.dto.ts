import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsString() category: string;
  @IsString() description: string;
  @IsNumber() @Min(0.01) amount: number;
  @IsDateString() expense_date: string;
  @IsOptional() @IsString() note?: string;
}
