import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './Product'

@Entity()
export class CategoryProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column()
  description: string
  @Column()
  condition: boolean
  @Column()
  image: string
  @OneToMany(() => Product, (product) => product.category, { eager: true })
  products: Product[]
}
