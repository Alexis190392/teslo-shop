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
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('Product')
  constructor(
    @InjectRepository(Product)
    private  readonly  productRepository: Repository<Product>,
  ) {
  }
  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    }catch (e) {
      this.handleDbExceptions(e);
    }

  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({id});
    if (!product) throw new NotFoundException(`El producto con el id ${id} no se encuentró`)
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
