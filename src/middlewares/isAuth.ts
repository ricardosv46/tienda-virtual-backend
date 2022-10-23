import { MiddlewareFn } from 'type-graphql'
import { verifyJWT } from '../helpers/jwt'
import { ApolloCtx } from '../interface'

export const isAuth: MiddlewareFn<ApolloCtx> = ({ context }, next) => {
  const token = context.req.headers.authorization

  if (!token) {
    throw new Error('Token invalido')
  }

  const payload: any = verifyJWT(token)

  if (!payload?.id) {
    throw new Error('Token invalido')
  }

  context.req.id = +payload.id

  return next()
}
