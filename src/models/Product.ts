import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CategoryProduct } from './CategoryProduct'

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column()
  description: string
  @Column()
  price: number
  @Column()
  stock: number
  @Column()
  image: string
  @Column()
  calification: string
  @Column()
  brand: string
  @Column()
  condition: boolean
  @ManyToOne(() => CategoryProduct, (category) => category.products)
  category: CategoryProduct
}
