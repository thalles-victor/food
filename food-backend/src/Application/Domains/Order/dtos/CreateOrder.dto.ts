import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  productId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}
