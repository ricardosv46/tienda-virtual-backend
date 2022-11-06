import { Field, ObjectType } from 'type-graphql'
import ProductResolver from './productResolver'
import CategoryProductResolver from './categoryProductResolver'
import UserResolvers from './userResolver'

@ObjectType()
export class Response {
  @Field(() => Boolean)
  success: boolean

  @Field(() => String)
  message: string
}

export const resolvers = [UserResolvers, CategoryProductResolver, ProductResolver] as const
