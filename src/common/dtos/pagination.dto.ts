import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";


export class PaginationDto{
  @IsOptional()
  @IsPositive()
  @Type(()=> Number) //evisamos agregar el transformer el app.module
  // @IsNumber()
  // @Min(1)
  limit?: number;

  @IsOptional()
  @Type(()=> Number)
  @Min(1)
  offset?: number;
}