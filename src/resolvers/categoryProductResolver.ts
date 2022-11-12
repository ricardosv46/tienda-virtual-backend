import { Arg, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql'
import { deleteFile, uploadFile } from '../middlewares/uploadFile'
import { isAuth } from '../middlewares/isAuth'
import { Response } from './index'
import { CategoryProduct, CategoryProductCreateInput, CategoryProductUpdateInput } from '../models/CategoryProduct'

@ObjectType()
class CategoryResponse {
  @Field(() => [CategoryProduct])
  data: [CategoryProduct]

  @Field(() => String)
  total: number
}

@Resolver()
export default class CategoryProductResolver {
  @Query(() => CategoryResponse)
  async getAllCategorys(@Arg('page') page: number, @Arg('numberPage') numberPage: number) {
    const [res, count] = await CategoryProduct.findAndCount({ take: numberPage, skip: (page - 1) * numberPage })
    return { data: res, total: count }
  }

  @Query(() => CategoryProduct)
  async getCategoryId(@Arg('id') id: number) {
    const category = await CategoryProduct.findOne({ where: { id } })

    if (!category) {
      throw new Error('La categoria no existe')
    }

    return { ...category }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => CategoryProduct)
  async createCategory(@Arg('input') input: CategoryProductCreateInput) {
    if (!input.image) {
      const res = await CategoryProduct.insert({
        ...input,
        image: '',
        condition: false
      })
      return { id: res.identifiers[0].id, ...input, image: '', condition: false }
    }
    const { url, public_id } = (await uploadFile(input.image)) as { url: string; secure_url: string; public_id: string }

    const res = await CategoryProduct.insert({
      ...input,
      image: url,
      cloudId: public_id,
      condition: false
    })
    return { id: res.identifiers[0].id, ...input, image: url, cloudId: public_id, condition: false }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Response)
  async updateCategory(@Arg('input') input: CategoryProductUpdateInput) {
    const category = await CategoryProduct.findOne({ where: { id: input.id } })
    if (!category) throw new Error('La categoria no existe')

    if (input.image && typeof input.image === 'object') {
      const { url, public_id } = (await uploadFile(input.image)) as { url: string; secure_url: string; public_id: string }

      if (category.cloudId) {
        await deleteFile(category.cloudId)
      }

      const res = await CategoryProduct.update({ id: input.id }, { ...input, image: url, cloudId: public_id })

      if (res.affected === 1) return { success: true, message: 'Actualizado Correctamente' }
    }

    const res = await CategoryProduct.update({ id: input.id }, { ...input, image: category.image, cloudId: category.cloudId })

    if (res.affected === 1) return { success: true, message: 'Actualizado Correctamente' }

    return { success: false, message: 'No se pudo Actualizar' }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Response)
  async updateCategoryCondition(@Arg('id') id: number, @Arg('condition') condition: boolean) {
    const category = await CategoryProduct.findOne({ where: { id } })
    if (!category) throw new Error('La categoria no existe')

    const res = await CategoryProduct.update({ id }, { condition })

    if (res.affected === 1) return { success: true, message: 'Actualizado Correctamente' }

    return { success: false, message: 'No se pudo Actualizar' }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Response)
  async deleteCategory(@Arg('id') id: number) {
    const category = await CategoryProduct.findOne({ where: { id } })

    if (!category) {
      throw new Error('La categoria no existe')
    }

    const res = await CategoryProduct.delete(id)

    if (category.cloudId) {
      await deleteFile(category.cloudId)
    }

    if (res.affected === 1) return { success: true, message: 'Eliminado Correctamente' }
    throw new Error('No se pudo Eliminar')
  }
}
