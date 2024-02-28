import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

  @ApiProperty({
    example: '08861f59-419c-49c9-838e-102e35c95e89',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Pants-White',
    description: 'Product title',
    uniqueItems: true
  })
  @Column('text',{unique:true})
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  })
  @Column('float',{default: 0})//@Column('number') no es soportado por pg
  price: number;

  @ApiProperty({
    example: 'Text description....',
    description: 'Product description',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: 'pants_white',
    description: 'Product SLUG',
    uniqueItems: true
  })
  @Column('text',{unique: true})
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0
  })
  @Column('int',{default:0})
  stock: number;

  @ApiProperty({
    example:["S","M","L"],
    description: 'Product sizes',
  })
  @Column('text',{array:true})
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example:['tag1','tag2','tag3'],
    description: 'Product tags',
    default: []
  })
  @Column('text',{array:true, default:[]})
  tags: string[];

  @ApiProperty()
  @OneToMany(
    ()=> ProductImage,
    (productImage) => productImage.product,
    {cascade: true,
      eager: true}
    )
  images?: ProductImage[];

  @ManyToOne(
    ()=> User,
    (user) => user.product,
    {eager:true}, //para gargar automaticamente la relacion
  )
  user: User


  @BeforeInsert()
  checkSlugInsert(){
    if (!this.slug){
      this.slug = this.title;
    }
    this.slug = this.slug.toLowerCase()
      .replaceAll(' ','_')
      .replaceAll("'",'');
  }

  @BeforeUpdate()
  checkSlugUpdate(){
    this.slug = this.slug.toLowerCase()
      .replaceAll(' ','_')
      .replaceAll("'",'');
  }

}
