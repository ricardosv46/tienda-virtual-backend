import { gql } from 'apollo-server-express'
import { CategoryProduct } from '../models/CategoryProduct'
import { uploadFile } from '../middlewares/uploadFile'

interface CategoryCreateInput {
  input: { name?: string; description?: string; condition?: boolean; image?: any }
}

interface CategoryUpdateInput {
  input: {
    id: number
    name?: string
    description?: string
    condition?: boolean
    image?: any
  }
}

interface CategoryId {
  id: number
}

interface GetAllCategorys {
  page: number
  numberPage: number
}

export const CategoryDefs = gql`
  extend type Query {
    getAllCategorys: CategoryResponse
    getCategoryId(id: ID!): Category
  }

  extend type Mutation {
    createCategory(input: CategoryCreateInput): Category
    updateCategory(input: CategoryUpdateInput): String
    deleteCategory(id: ID!): String
  }

  type Category {
    id: ID
    name: String
    description: String
    condition: Boolean
    image: String
    products: [Product]
  }

  input CategoryCreateInput {
    name: String
    description: String
    condition: Boolean
    image: Upload
  }

  input CategoryUpdateInput {
    id: ID!
    name: String
    description: String
    condition: Boolean
    image: Upload
  }

  type CategoryResponse {
    total: Int
    data: [Category]
  }
`

export const CategoryResolvers = {
  Query: {
    getAllCategorys: async (_: any, { page, numberPage }: GetAllCategorys) => {
      const [res, count] = await CategoryProduct.findAndCount({ take: numberPage, skip: (page - 1) * numberPage })

      return { data: res, total: count }
    },

    getCategoryId: async (_: any, args: CategoryId) => {
      return await CategoryProduct.findOne({ where: { id: args.id } })
    }
  },
  Mutation: {
    createCategory: async (_: any, args: CategoryCreateInput) => {
      const { url } = (await uploadFile(args.input.image)) as { url: string; secure_url: string }

      const res = await CategoryProduct.insert({
        ...args.input,
        image: url
      })

      return { id: res.identifiers[0].id, ...args.input, image: url }
    },

    updateCategory: async (_: any, args: CategoryUpdateInput) => {
      const category = await CategoryProduct.findOne({ where: { id: args.input.id } })
      if (!category) return 'Categoria no existe'

      const { url } = (await uploadFile(args.input.image)) as { url: string; secure_url: string }

      const res = await CategoryProduct.update({ id: args.input.id }, { ...args.input, image: url })
      if (res.affected === 1) return 'Actualizado Correctamente'
      return 'No se pudo Actualizar'
    },
    deleteCategory: async (_: any, args: CategoryId) => {
      const res = await CategoryProduct.delete(args.id)
      if (res.affected === 1) return 'Eliminado Correctamente'
      return 'No se pudo Eliminar'
    }
  }
}
