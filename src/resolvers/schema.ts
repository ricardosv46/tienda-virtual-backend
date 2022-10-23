import { gql } from 'apollo-server-express'

import { GraphQLUpload } from 'graphql-upload'
import { CategoryDefs, CategoryResolvers } from './category'
import { LoginDefs, LoginResolvers } from './login'
import { ProductDefs, ProductResolvers } from './product'
import { UserDefs, UserResolvers } from './user'

const rootDefs = gql`
  scalar Upload
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`

export const typeDefs = [rootDefs, UserDefs, CategoryDefs, ProductDefs, LoginDefs]

const rootResolvers = {
  Upload: GraphQLUpload
}

export const resolvers = [rootResolvers, UserResolvers, CategoryResolvers, ProductResolvers, LoginResolvers]
