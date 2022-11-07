import { GraphQLUpload } from 'graphql-upload'
import { Field, InputType, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Upload } from '../interface'
import { CategoryProduct } from './CategoryProduct'

@Entity()
@ObjectType()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Column()
  @Field()
  name: string

  @Column()
  @Field()
  description: string

  @Column()
  @Field()
  price: number

  @Column()
  @Field()
  stock: number

  @Column()
  @Field()
  image: string

  @Column()
  @Field()
  calification: string

  @Column()
  @Field()
  brand: string

  @Column()
  @Field()
  condition: boolean

  @ManyToOne(() => CategoryProduct, (category) => category.products, {
    onDelete: 'CASCADE'
  })
  category: CategoryProduct
}

@InputType()
export class ProductCreateInput {
  @Field()
  name: string

  @Field()
  description: string

  @Field()
  price: number

  @Field()
  stock: number

  @Field()
  calification: string

  @Field()
  brand: string

  @Field(() => GraphQLUpload, { nullable: true })
  image?: Upload
}

@InputType()
export class ProductUpdateInput {
  @Field()
  id: number

  @Field()
  name: string

  @Field()
  description: string

  @Field()
  price: number

  @Field()
  stock: number

  @Field()
  calification: string

  @Field()
  brand: string

  @Field()
  condition: boolean

  @Field(() => GraphQLUpload, { nullable: true })
  image?: Upload
}
