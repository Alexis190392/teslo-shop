import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";


export class PaginationDto{

  @ApiProperty({
    default: 10,
    description: 'Cuantas filas desea ver?',
    required: false
  })
  @IsOptional()
  @IsPositive()
  @Type(()=> Number) //evisamos agregar el transformer el app.module
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'Cuantas filas desea saltar?',
    required: false
  })
  @IsOptional()
  @Type(()=> Number)
  @Min(1)
  offset?: number;
}