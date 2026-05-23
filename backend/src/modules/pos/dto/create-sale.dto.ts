import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class SaleItemInputDto {
  @IsString() product_id: string;
  @IsNumber() quantity: number;
  @IsOptional() @IsNumber() discount_percent?: number;
}

export class CreateSaleDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => SaleItemInputDto) items: SaleItemInputDto[];
  @IsOptional() @IsNumber() discount_amount?: number;
  @IsOptional() @IsNumber() tax_amount?: number;
  @IsString() payment_method: string;
  @IsOptional() @IsString() payment_reference?: string;
}
