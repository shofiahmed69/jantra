import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class PurchaseItemInputDto {
  @IsString() product_id: string;
  @IsInt() @Min(1) quantity: number;
  @IsOptional() @IsIn(['piece', 'strip', 'box', 'bottle']) unit?: 'piece' | 'strip' | 'box' | 'bottle';
  @IsNumber() @Min(0.01) cost_per_unit: number;
  @IsOptional() @IsString() batch_number?: string;
  @IsOptional() @IsDateString() expiry_date?: string;
}

export class CreatePurchaseDto {
  @IsOptional() @IsString() supplier_id?: string;
  @IsDateString() purchase_date: string;
  @IsOptional() @IsString() invoice_ref?: string;
  @IsOptional() @IsString() payment_status?: string;
  @IsOptional() @IsNumber() amount_paid?: number;
  @IsOptional() @IsString() note?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => PurchaseItemInputDto) items: PurchaseItemInputDto[];
}
