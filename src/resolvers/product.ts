import { gql } from 'apollo-server-express'
import { Product } from '../models/Product'
import { ApolloCtx } from '../interface'
import { isAuth } from '../middlewares/isAuth'
import { uploadFile } from '../middlewares/uploadFile'

interface ProductCreateInput {
  input: {
    name?: string
    description?: string
    price?: number
    stock?: number
    image?: any
    calification?: string
    brand?: string
    condition?: boolean
    categoryId: any
  }
}

interface ProductUpdateInput {
  input: {
    id: number
    name?: string
    description?: string
    price?: number
    stock?: number
    image?: any
    calification?: string
    brand?: string
    condition?: boolean
    categoryId: any
  }
}

interface ProductId {
  id: number
}

interface GetAllProducts {
  page: number
  numberPage: number
}

export const ProductDefs = gql`
  extend type Query {
    getAllProducts(page: Int, numberPage: Int): ProductResponse
    getProductId(id: ID!): Product
  }

  extend type Mutation {
    createProduct(input: ProductCreateInput): Res
    updateProduct(input: ProductUpdateInput): String
    deleteProduct(id: ID!): String
  }

  type Res {
    success: Boolean
    message: String
  }

  type ProductResponse {
    data: [Product]
    total: Int
  }

  type Product {
    id: ID
    name: String
    description: String
    price: Int
    stock: Int
    image: String
    calification: String
    brand: String
    condition: Boolean
    categoryId: ID
  }

  input ProductCreateInput {
    name: String
    description: String
    price: Int
    stock: Int
    image: Upload
    calification: String
    brand: String
    condition: Boolean
    categoryId: ID!
  }

  input ProductUpdateInput {
    id: ID!
    name: String
    description: String
    price: Int
    stock: Int
    image: Upload
    calification: String
    brand: String
    condition: Boolean
    categoryId: ID!
  }
`

export const ProductResolvers = {
  Query: {
    getAllProducts: async (_: any, { page, numberPage }: GetAllProducts, { token }: { token: any }) => {
      isAuth(token)

      const [res, count] = await Product.findAndCount({ take: numberPage, skip: (page - 1) * numberPage })

      return { data: res, total: count }
    },

    getProductId: async (_: any, args: ProductId) => {
      return await Product.findOne({ where: { id: args.id } })
    }
  },
  Mutation: {
    createProduct: async (_: any, args: ProductCreateInput) => {
      const { url } = (await uploadFile(args.input.image)) as { url: string; secure_url: string }

      const res = await Product.insert({
        ...args.input,
        image: url,
        category: args.input.categoryId
      })
      return { success: true, message: 'Creado Correctamente' }
    },

    updateProduct: async (_: any, args: ProductUpdateInput) => {
      const product = await Product.findOne({ where: { id: args.input.id } })

      if (!product) return new Error('Producto no existe')

      const { url } = (await uploadFile(args.input.image)) as { url: string; secure_url: string }

      const res = await Product.update({ id: args.input.id }, { ...args.input, image: url })

      if (res.affected === 1) return { success: true, message: 'Actualizado Correctamente' }

      throw new Error('No se pudo Actualizar')
    },
    deleteProduct: async (_: any, args: ProductId) => {
      const res = await Product.delete(args.id)

      if (res.affected === 1) return { success: true, message: 'Eliminado Correctamente' }

      throw new Error('No se pudo Eliminar')
    }
  }
}
