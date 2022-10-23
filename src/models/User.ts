import { ObjectType, Field, InputType } from 'type-graphql'
import { GraphQLUpload } from 'graphql-upload'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number

  @Column()
  @Field()
  name: string

  @Column()
  @Field()
  lastname: string

  @Column()
  @Field()
  username: string

  @Column({ unique: true })
  @Field()
  email: string

  @Column()
  @Field()
  dni: string

  @Column()
  @Field()
  celular: string

  @Column()
  @Field()
  gender: string

  @Column()
  @Field()
  password: string

  @Column()
  @Field()
  image: string

  @Column()
  @Field()
  condition: boolean

  @Column()
  @Field()
  token: string

  @Column()
  @Field()
  rol: string
}

@InputType()
export class UserCreateInput {
  @Field()
  name: string

  @Field()
  lastname: string

  @Field()
  username: string

  @Field()
  email: string

  @Field()
  dni: string

  @Field()
  celular: string

  @Field()
  gender: string

  @Field()
  password: string

  @Field()
  rol: string

  @Field(() => GraphQLUpload, { nullable: true })
  image?: string
}

@InputType()
export class LoginInput {
  @Field()
  email!: string

  @Field()
  password!: string
}
