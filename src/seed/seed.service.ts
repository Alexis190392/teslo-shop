import { Injectable } from '@nestjs/common';
import { ProductsService } from "../products/products.service";
import { initialData } from "./data/seed-data";

@Injectable()
export class SeedService {

  constructor(
    private  readonly  productsService: ProductsService
  ) {
  }

  async runSeed(){
    await this.insertNewProducts();

    return 'SEED EJECUTADO';
  }

  private async  insertNewProducts(){
    await this.productsService.deleteAllProducts();

    const products =  initialData.products;

    //creo varios insert de forma masiva
    const insertPromise= [];

    // products.forEach(product=> {
    //   insertPromise.push(this.productsService.create(product))
    // })

    await Promise.all( insertPromise);

    return true;
  }
}
