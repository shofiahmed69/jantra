import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ReturnSaleItemDto {
  @IsString() sale_id: string;
  @IsString() sale_item_id: string;
  @IsInt() @Min(1) quantity_returned: number;
  @IsOptional() @IsString() reason?: string;
  @IsBoolean() restock: boolean;
}
