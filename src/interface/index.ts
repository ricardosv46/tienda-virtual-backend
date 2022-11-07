import { Request, Response } from 'express'
import { Stream } from 'stream'

export interface ApolloCtx {
  req: Request & { id?: number }
  res: Response
}

export interface Upload {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => Stream
}
