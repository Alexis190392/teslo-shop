import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product]) //arreglo con todas las entidades que está definiendo
  ]
})
export class ProductsModule {}
