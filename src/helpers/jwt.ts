import * as JWT from 'jsonwebtoken'

const SECRETKEY = process.env.SECRETKEY || 'Ricardo22*'

export const genJWT = (id: number): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    JWT.sign({ id }, SECRETKEY, { expiresIn: '24h' }, function (err, token) {
      if (err) {
        reject(err)
      }

      resolve(token)
    })
  })
}

export const verifyJWT = (token: string) => {
  try {
    return JWT.verify(token, SECRETKEY)
  } catch (error) {
    return null
  }
}

export const decodeJWT = (token: string) => JWT.decode(token)
