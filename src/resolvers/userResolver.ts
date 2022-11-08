import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql'
import { LoginInput, LoginResponse, User, UserCreateInput, UserUpdateInput } from '../models/User'
import bcryptjs from 'bcryptjs'
import { genId } from '../helpers/genId'
import { emailRegister, recoveryPasswordEmail } from '../helpers/email'
import { deleteFile, uploadFile } from '../middlewares/uploadFile'
import { isAuth } from '../middlewares/isAuth'
import { genJWT } from '../helpers/jwt'
import { ApolloCtx } from '../interface'
import { Response } from './index'
@ObjectType()
class UsersResponse {
  @Field(() => [User])
  data: [User]

  @Field(() => String)
  total: number
}

@Resolver()
export default class UserResolvers {
  @Mutation(() => Response)
  async register(@Arg('input') input: UserCreateInput) {
    const user = await User.findOne({ where: { email: input.email } })
    if (user) {
      throw new Error('El usuario ya existe')
    }

    const salt = bcryptjs.genSaltSync()
    const hasPassword = bcryptjs.hashSync(input.password, salt)
    const token = genId()

    if (!input.image) {
      await User.insert({
        ...input,
        condition: false,
        password: hasPassword,
        image: '',
        token
      })
      emailRegister({
        email: input.email,
        nombre: input.name,
        token
      })
      return { success: true, message: 'Revisa tu Email para confirmar tu cuenta' }
    }
    const { url } = (await uploadFile(input.image)) as { url: string; secure_url: string }
    await User.insert({
      ...input,
      password: hasPassword,
      condition: false,
      image: url,
      token
    })
    emailRegister({
      email: input.email,
      nombre: input.name,
      token
    })
    return { success: true, message: 'Revisa tu Email para confirmar tu cuenta' }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg('input') input: LoginInput) {
    const user = await User.findOne({ where: { email: input.email } })
    if (!user) {
      throw new Error('Email o Password incorrecto')
    }

    const validPass = bcryptjs.compareSync(input.password, user.password)

    if (!validPass) {
      throw new Error('Email o Password incorrecto')
    }

    if (!user.condition) {
      throw new Error('La cuenta no esta activada')
    }

    const token = await genJWT(user.id)

    return { username: user.username, email: user.email, name: user.name, lastname: user.lastname, token }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => LoginResponse)
  async refreshToken(@Ctx() { req }: ApolloCtx) {
    const id = req.id

    const user = await User.findOne({ where: { id } })

    if (!user) {
      throw new Error('Token Invalido')
    }

    const token = await genJWT(user.id)

    return { username: user.username, email: user.email, name: user.name, lastname: user.lastname, token }
  }

  @Mutation(() => Response)
  async confirm(@Arg('token') token: string) {
    const user = await User.findOne({ where: { token } })
    if (!user) {
      throw new Error('Token no válido')
    }
    user.condition = true
    user.token = ''
    const res = await User.update({ id: user.id }, user)
    if (res.affected === 1) return { success: true, message: 'Confirmado Correctamente' }
    throw new Error('No se pudo Confirmar')
  }

  @UseMiddleware(isAuth)
  @Query(() => UsersResponse)
  async getAllUsers(@Arg('page') page: number, @Arg('numberPage') numberPage: number) {
    const [res, count] = await User.findAndCount({ take: numberPage, skip: (page - 1) * numberPage })
    return { data: res, total: count }
  }

  @UseMiddleware(isAuth)
  @Query(() => User)
  async getUserId(@Arg('id') id: number) {
    const user = await User.findOne({ where: { id } })

    if (!user) {
      throw new Error('El usuario no existe')
    }

    return user
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Response)
  async recoveryPassword(@Arg('email') email: string) {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new Error('El usuario no existe')
    }
    const token = genId()

    await User.update({ id: user.id }, { ...user, token })

    recoveryPasswordEmail({
      email: user.email,
      nombre: user.name,
      token
    })

    return { success: true, message: 'Se ha enviado un correo para restablecer la contraseña' }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Response)
  async changePassword(@Ctx() { req }: ApolloCtx, @Arg('passowrd') password: string) {
    const id = req.id

    const user = await User.findOne({ where: { id } })
    if (!user) {
      throw new Error('Token no válido')
    }

    const salt = bcryptjs.genSaltSync()
    const hasPassword = bcryptjs.hashSync(password, salt)

    user.password = hasPassword
    user.token = ''

    await User.update({ id: user.id }, user)

    return { success: true, message: 'Password modificado correctamente' }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Response)
  async updateUser(@Arg('input') input: UserUpdateInput) {
    const user = await User.findOne({ where: { id: input.id } })
    if (!user) throw new Error('Usuario no existe')

    if (input.image) {
      const { url } = (await uploadFile(input.image)) as { url: string; secure_url: string }

      const res = await User.update({ id: input.id }, { ...input, image: url })

      if (res.affected === 1) return { success: true, message: 'Actualizado Correctamente' }
    }

    const res = await User.update({ id: input.id }, { ...input, image: '' })

    if (res.affected === 1) return { success: true, message: 'Actualizado Correctamente' }

    return { success: false, message: 'No se pudo Actualizar' }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Response)
  async deleteUser(@Arg('id') id: number) {
    const res = await User.delete(id)

    if (res.affected === 1) return { success: true, message: 'Eliminado Correctamente' }
    throw new Error('No se pudo Eliminar')
  }
}
