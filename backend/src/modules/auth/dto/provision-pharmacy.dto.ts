import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ProvisionPharmacyDto {
  @IsString() @MinLength(2) @MaxLength(150) name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsOptional() @IsString() @MaxLength(100) owner_name?: string;
}
