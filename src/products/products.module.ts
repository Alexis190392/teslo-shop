import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product, ProductImage } from "./entities";
// import { ProductImage } from "./entities/product-image.entity"; //por archivo de barril index.ts

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]) //arreglo con todas las entidades que está definiendo
  ],
  exports: [ ProductsService ]
})
export class ProductsModule {}
