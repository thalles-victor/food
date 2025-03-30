import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(40)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  price: number;
}
