import { DataSource } from 'typeorm'
import { entities } from './models'
import * as dotenv from 'dotenv'
dotenv.config()

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_PORT = process.env.DB_PORT
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME

export const connectDB = async () => {
  const dataSource: DataSource = new DataSource({
    type: 'mysql',
    username: DB_USERNAME,
    password: DB_PASSWORD,
    port: Number(DB_PORT),
    host: DB_HOST,
    database: DB_NAME,
    entities,
    synchronize: true,
    ssl: true
  })
  dataSource
    .initialize()
    .then(() => {
      console.log('conectado a la DB')
    })
    .catch((error) => console.log(error))
}
