import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from "@nestjs/common";
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from "../common/dtos/pagination.dto";
import { Auth, GetUser } from "../auth/decorators";
import { User } from "../auth/entities/user.entity";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Product } from "./entities";

@ApiTags('Products')
@Controller('products')
// @Auth()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}

  @Post()
  @Auth()
  @ApiResponse({status: 201, description: 'El producto ha sido creado', type: Product})
  @ApiResponse({status: 400, description: 'Bad Request' })
  @ApiResponse({status: 403, description: 'Forbidden. Related token' })
  create(@Body() createProductDto: CreateProductDto,
         @GetUser() user:User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto ) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
