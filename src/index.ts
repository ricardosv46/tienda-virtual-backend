import { ApolloServer } from 'apollo-server-express'
import { resolvers } from './resolvers'
import app from './app'
import { connectDB } from './db'
import { buildSchema } from 'type-graphql'
import { graphqlUploadExpress } from 'graphql-upload'
import { ApolloCtx } from './interface'
import * as dotenv from 'dotenv'
dotenv.config()
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core'

const PORT = process.env.PORT

console.log('NODE_ENV', process.env.NODE_ENV)

const main = async () => {
  try {
    await connectDB()
    const apolloServer = new ApolloServer({
      context: (ctx: ApolloCtx) => ctx,
      schema: await buildSchema({ resolvers, validate: false })
      // plugins: [
      //   // Install a landing page plugin based on NODE_ENV
      //   process.env.NODE_ENV === 'production'
      //     ? ApolloServerPluginLandingPageProductionDefault({
      //         graphRef: 'my-graph-id@my-graph-variant',
      //         footer: false
      //       })
      //     : ApolloServerPluginLandingPageLocalDefault({ footer: false })
      // ]
    })
    app.use(graphqlUploadExpress())
    await apolloServer.start()

    apolloServer.applyMiddleware({ app })

    app.use('/', (req, res) => {
      res.send('Welcome to Graphql Upload!')
    })

    console.log(`listening on port ${PORT}`)
  } catch (error) {
    console.log(error)
  }
}
main()

app.listen(PORT)
