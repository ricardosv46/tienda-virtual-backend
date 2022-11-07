import { GraphQLUpload } from 'graphql-upload'
import { ObjectType, Field, InputType } from 'type-graphql'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Upload } from '../interface'
import { Product } from './Product'

@Entity()
@ObjectType()
export class CategoryProduct extends BaseEntity {
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
  condition: boolean

  @Column()
  @Field()
  image: string

  @OneToMany(() => Product, (product) => product.category, { eager: true })
  products: Product[]
}

@InputType()
export class CategoryProductCreateInput {
  @Field()
  name: string

  @Field()
  description: string

  @Field(() => GraphQLUpload, { nullable: true })
  image?: Upload
}

@InputType()
export class CategoryProductUpdateInput {
  @Field()
  id: number

  @Field()
  name: string

  @Field()
  description: string

  @Field()
  condition: boolean

  @Field(() => GraphQLUpload, { nullable: true })
  image?: Upload
}
