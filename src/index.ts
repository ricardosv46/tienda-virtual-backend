import { ApolloServer } from 'apollo-server-express'
import { resolvers } from './resolvers'
import app from './app'
import { connectDB } from './db'
import { buildSchema } from 'type-graphql'
import { graphqlUploadExpress } from 'graphql-upload'
import { ApolloCtx } from './interface'

const main = async () => {
  try {
    await connectDB()
    const apolloServer = new ApolloServer({
      context: (ctx: ApolloCtx) => ctx,
      // context: async ({ req }: any) => {
      //   const token = req.headers.authorization
      //   return { token }
      // },
      schema: await buildSchema({ resolvers, validate: false })
    })
    app.use(graphqlUploadExpress())
    await apolloServer.start()

    apolloServer.applyMiddleware({ app })

    app.use('/', (req, res) => {
      res.send('Welcome to Graphql Upload!')
    })

    console.log('listening on port 4000')
  } catch (error) {
    console.log(error)
  }
}
main()

app.listen(4000)
