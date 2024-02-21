import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from "@nestjs/common";
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PaginationDto } from "../common/dtos/pagination.dto";
import {validate as isUUID} from 'uuid';
import { Product, ProductImage } from "./entities";

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('Product')
  constructor(
    @InjectRepository(Product)
    private  readonly  productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private  readonly  productImageRepository: Repository<ProductImage>,

    private readonly dataSourse: DataSource

  ) {
  }
  async create(createProductDto: CreateProductDto) {
    try {
      const {images = [], ...productDetails} = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image =>  this.productImageRepository.create({url: image}))
      });
      await this.productRepository.save(product);

      return {  ...product, images };
    }catch (e) {
      this.handleDbExceptions(e);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const {limit= 10,offset = 0}= paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true, // para que aparezcan en el response mediante la relacion
      }
    });

    return products.map( product => ({
      ...product,
      images: product.images.map( img => img.url)
    }))
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)){
      product = await this.productRepository.findOneBy({id: term});
    }else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await  queryBuilder.where('UPPER(title) =: title or slug=:slug',{
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();

    }

    if (!product)
      throw new NotFoundException(`El producto con el id ${term} no se encuentró`)

    return product;
  }

  async findOnePlain( term: string){
    const { images = [], ... rest} = await this.findOne(term);

    return {
      ...rest,
      images: images.map( image=> image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate} = updateProductDto;

    const product = await this.productRepository.preload({ //preload: busca los productos por id y carga todas las propiedades del dto
      id: id,
      ...toUpdate
    })

    if (!product)
      throw new NotFoundException(`Producto con el id ${id} no se encontró`);

    //create queryRunner
    const queryRunner = this.dataSourse.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {
      //borro las imagenes anteriores para reemplazar por las nuevas
      if (images){
        await queryRunner.manager.delete(ProductImage, { product:{id: id}})
        //reemplazo por la nueva
        product.images = images.map( image => this.productImageRepository.create({url: image}))
      }

      //ahora permanezco con el producto y sus datos
      await  queryRunner.manager.save( product);
      // await this.productRepository.save(product);

      //si no falla lo anterior, aplica los cambios
      await queryRunner.commitTransaction();
      //cierro la conexion
      await  queryRunner.release();

      return this.findOnePlain(id);
    }catch (e) {
      //si da error, realizo rollback
      await queryRunner.rollbackTransaction()
      await queryRunner.release();

      this.handleDbExceptions(e);
    }

  }

  async remove(id: string) {

    const product = await this.findOne(id);
    await  this.productRepository.remove(product);

  }

  private handleDbExceptions(error: any){
    if (error.code == '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException("Ayudaaaaaaaaaaaaa!")

  }

  //para limpiar todos los productos, para uso con seed
  async deleteAllProducts(){
    const query= this.productImageRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (e) {
      this.handleDbExceptions(e);
    }
  }
}
