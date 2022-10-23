import { gql } from 'apollo-server-express'
// import { Users } from '../entities/User'
import { uploadFile } from '../middlewares/uploadFile'
import bcryptjs from 'bcryptjs'
import { genId } from '../helpers/genId'
import { emailRegister, recoveryPasswordEmail } from '../helpers/email'
import { isAuth } from '../middlewares/isAuth'

interface UserCreateInput {
  input: {
    name?: string
    username?: string
    lastname?: string
    password: string
    email?: string
    dni?: string
    celular?: string
    gender?: string
    image?: any
    rol?: string
  }
}

interface UserUpdateInput {
  input: {
    id: number
    name?: string
    username?: string
    lastname?: string
    password: string
    email?: string
    dni?: string
    celular?: string
    gender?: string
    image?: any
    rol?: string
  }
}

interface argsUserId {
  id: number
}

interface GetAllUsers {
  page: number
  numberPage: number
}

export const UserDefs = gql`
  extend type Query {
    getAllUsers: [User]
    getUserId(id: ID!): User
  }

  extend type Mutation {
    createUser(input: UserCreateInput): Res
    updateUser(input: UserUpdateInput): Res
    deleteUser(id: ID!): Res
    confirm(token: String): Res
    checkToken(token: String): Res
    recoveryPassword(email: String): Res
    changePassword(token: String, password: String): Res
  }

  type User {
    id: ID
    name: String
    username: String
    lastname: String
    password: String
    email: String
    dni: String
    celular: String
    gender: String
    image: String
    rol: String
    token: String
    condition: Boolean
  }

  input UserCreateInput {
    name: String
    username: String
    lastname: String
    password: String
    email: String
    dni: String
    celular: String
    gender: String
    image: Upload
    rol: String
  }

  input UserUpdateInput {
    id: ID!
    name: String
    username: String
    lastname: String
    password: String
    email: String
    dni: String
    celular: String
    gender: String
    image: Upload
    rol: String
  }

  type ResUser {
    total: Int
    data: User
  }

  type Res {
    success: Boolean
    message: String
  }
`

// export const UserResolvers = {
//   Query: {
//     getAllUsers: async (_: any, { page, numberPage }: GetAllUsers, { token }: { token: any }) => {
//       isAuth(token)
//       const [res, count] = await Users.findAndCount({ take: numberPage, skip: (page - 1) * numberPage })

//       return { data: res, total: count }
//     },

//     getUserId: async (_: any, args: argsUserId) => {
//       return await Users.findOne({ where: { id: args.id } })
//     }
//   },
//   Mutation: {
//     createUser: async (_: any, args: UserCreateInput) => {
//       const user = await Users.findOne({ where: { email: args.input.email } })
//       if (user) {
//         throw new Error('El usuario ya existe')
//       }

//       const salt = bcryptjs.genSaltSync()
//       const hasPassword = bcryptjs.hashSync(args.input.password, salt)

//       const token = genId()

//       if (!args.input.image) {
//         const res = await Users.insert({
//           ...args.input,
//           condition: false,
//           password: hasPassword,
//           image: '',
//           token
//         })
//         emailRegister({
//           email: args.input.email,
//           nombre: args.input.name,
//           token
//         })
//         return { success: true, message: 'Revisa tu Email para confirmar tu cuenta' }
//       }
//       const { url } = (await uploadFile(args.input.image)) as { url: string; secure_url: string }
//       const res = await Users.insert({
//         ...args.input,
//         password: hasPassword,
//         condition: false,
//         image: url,
//         token
//       })
//       emailRegister({
//         email: args.input.email,
//         nombre: args.input.name,
//         token
//       })
//       return { success: true, message: 'Revisa tu Email para confirmar tu cuenta' }
//     },

//     confirm: async (_: any, { token }: { token: string }) => {
//       const user = await Users.findOne({ where: { token } })
//       if (!user) {
//         throw new Error('Token no válido')
//       }
//       user.condition = true
//       user.token = ''
//       const res = await Users.update({ id: user.id }, user)
//       if (res.affected === 1) return { success: true, message: 'Confirmado Correctamente' }
//       throw new Error('No se pudo Confirmar')
//     },

//     checkToken: async (_: any, { token }: { token: string }) => {
//       const user = await Users.findOne({ where: { token } })
//       if (!user) {
//         throw new Error('Token no válido')
//       }

//       return { success: true, message: 'Token válido y el usuario existe' }
//     },

//     recoveryPassword: async (_: any, { email }: { email: string }) => {
//       const user = await Users.findOne({ where: { email } })
//       if (!user) {
//         throw new Error('El usuario no existe')
//       }
//       const token = genId()

//       await Users.update({ id: user.id }, { ...user, token })

//       recoveryPasswordEmail({
//         email: user.email,
//         nombre: user.name,
//         token
//       })

//       return { success: true, message: 'Se ha enviado un correo para restablecer la contraseña' }
//     },

//     changePassword: async (_: any, { token, password }: { token: string; password: string }) => {
//       const user = await Users.findOne({ where: { token } })
//       if (!user) {
//         throw new Error('Token no válido')
//       }

//       const salt = bcryptjs.genSaltSync()
//       const hasPassword = bcryptjs.hashSync(password, salt)

//       user.password = hasPassword
//       user.token = ''

//       await Users.update({ id: user.id }, user)

//       return { success: true, message: 'Password modificado correctamente' }
//     },

//     updateUser: async (_: any, args: UserUpdateInput) => {
//       const user = await Users.findOne({ where: { id: args.input.id } })
//       if (!user) throw new Error('Usuario no existe')

//       const { url } = (await uploadFile(args.input.image)) as { url: string; secure_url: string }

//       const res = await Users.update({ id: args.input.id }, { ...args.input, image: url })
//       if (res.affected === 1) return { success: true, message: 'Actualizado Correctamente' }
//       return { success: false, message: 'No se pudo Actualizar' }
//     },
//     deleteUser: async (_: any, args: argsUserId) => {
//       const res = await Users.delete(args.id)
//       if (res.affected === 1) return { success: true, message: 'Eliminado Correctamente' }
//       throw new Error('No se pudo Eliminar')
//     }
//   }
// }
