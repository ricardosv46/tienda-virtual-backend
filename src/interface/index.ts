import { Request, Response } from 'express'

export interface ApolloCtx {
  req: Request & { id?: number }
  res: Response
}
