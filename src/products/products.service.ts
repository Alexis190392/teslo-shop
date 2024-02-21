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
import { Repository } from "typeorm";
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
    return await this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)){
      product = await this.productRepository.findOneBy({id: term});
    }else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await  queryBuilder.where('UPPER(title) =: title or slug=:slug',{
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      }).getOne();

    }

    if (!product)
      throw new NotFoundException(`El producto con el id ${term} no se encuentró`)

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({ //preload: busca los productos por id y carga todas las propiedades del dto
      id: id,
      ...updateProductDto,
      images:[],
    })

    if (!product)
      throw new NotFoundException(`Producto con el id ${id} no se encontró`);

    try {
      await this.productRepository.save(product);
      return product;
    }catch (e) {
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
}
