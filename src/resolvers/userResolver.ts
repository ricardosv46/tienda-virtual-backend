import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql'
import { LoginInput, User, UserCreateInput } from '../models/User'
import bcryptjs from 'bcryptjs'
import { genId } from '../helpers/genId'
import { emailRegister } from '../helpers/email'
import { uploadFile } from '../middlewares/uploadFile'
import { isAuth } from '../middlewares/isAuth'
import { genJWT } from '../helpers/jwt'

@ObjectType()
class Response {
  @Field(() => Boolean)
  success: boolean

  @Field(() => String)
  message: string
}

@ObjectType()
class LoginResponse {
  @Field()
  username: string

  @Field(() => String)
  email: string

  @Field(() => String)
  lastname: string

  @Field(() => String)
  token: string
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
  @Query(() => [User])
  async getAllUsers(@Arg('page') @Arg('numberPage') page: number, numberPage: number) {
    return User.find()
  }
}
