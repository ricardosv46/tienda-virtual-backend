import { DataSource } from 'typeorm'
import { entities } from './models'

export const connectDB = async () => {
  const dataSource: DataSource = new DataSource({
    type: 'mysql',
    username: 'root',
    password: '123456',
    port: 3307,
    host: 'localhost',
    database: 'usersdb',
    entities,
    synchronize: false,
    ssl: false
  })
  dataSource
    .initialize()
    .then(() => {
      console.log('conectado a la DB')
    })
    .catch((error) => console.log(error))
}
