import { gql } from 'apollo-server-express'
import { Users } from '../models/User'
import bcryptjs from 'bcryptjs'
import { genJWT } from '../helpers/jwt'

interface login {
  email: string
  password: string
}

export const LoginDefs = gql`
  extend type Mutation {
    login(email: String, password: String): Login
  }

  type Login {
    username: String
    email: String
    name: String
    lastname: String
    token: String
  }
`

export const LoginResolvers = {
  Mutation: {
    login: async (_: any, { email, password }: login) => {
      const user = await Users.findOne({ where: { email: email } })
      if (!user) {
        throw new Error('Email o Password incorrecto')
      }

      const validPass = bcryptjs.compareSync(password, user.password)

      if (!validPass) {
        throw new Error('Email o Password incorrecto')
      }

      if (!user.condition) {
        throw new Error('La cuenta no esta activada')
      }

      const token = await genJWT(user.id)

      return { username: user.username, email: user.email, name: user.name, lastname: user.lastname, token }
    }
  }
}
