import { Arg, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql'
import { uploadFile } from '../middlewares/uploadFile'
import { isAuth } from '../middlewares/isAuth'
import { Response } from './index'
import { Product, ProductCreateInput, ProductUpdateInput } from '../models/Product'

@ObjectType()
class ProductResponse {
  @Field(() => [Product])
  data: [Product]

  @Field(() => String)
  total: number
}

@Resolver()
export default class ProductResolver {
  @Query(() => ProductResponse)
  async getAllProducts(@Arg('page') page: number, @Arg('numberPage') numberPage: number) {
    const [res, count] = await Product.findAndCount({ take: numberPage, skip: (page - 1) * numberPage })
    return { data: res, total: count }
  }

  @Query(() => Product)
  async getProductId(@Arg('id') id: number) {
    const category = await Product.findOne({ where: { id } })

    if (!category) {
      throw new Error('El producto no existe')
    }

    return category
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Product)
  async createProduct(@Arg('input') input: ProductCreateInput) {
    if (!input.image) {
      const res = await Product.insert({
        ...input,
        image: '',
        condition: false,
        calification: ''
      })

      return { id: res.identifiers[0].id, ...input, image: '', condition: false, calification: '' }
    }

    const { url, public_id } = (await uploadFile(input.image)) as { url: string; public_id: string }

    const res = await Product.insert({
      ...input,
      image: url,
      cloudId: public_id,
      condition: false,
      calification: ''
    })

    return { id: res.identifiers[0].id, ...input, image: url, condition: false, calification: '' }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Response)
  async updateProduct(@Arg('input') input: ProductUpdateInput) {
    const category = await Product.findOne({ where: { id: input.id } })
    if (!category) throw new Error('El producto no existe')

    if (input.image) {
      const { url } = (await uploadFile(input.image)) as { url: string; secure_url: string }

      const res = await Product.update({ id: input.id }, { ...input, image: url })

      if (res.affected === 1) return { success: true, message: 'Actualizado Correctamente' }
    }

    const res = await Product.update({ id: input.id }, { ...input, image: '' })

    if (res.affected === 1) return { success: true, message: 'Actualizado Correctamente' }

    return { success: false, message: 'No se pudo Actualizar' }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Response)
  async deleteProduct(@Arg('id') id: number) {
    const res = await Product.delete(id)
    if (res.affected === 1) return { success: true, message: 'Eliminado Correctamente' }
    throw new Error('No se pudo Eliminar')
  }
}
