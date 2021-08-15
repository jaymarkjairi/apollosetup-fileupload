const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload')
const cors = require('cors')
const {
  ApolloServerPluginLandingPageGraphQLPlayground
} = require("apollo-server-core")
// const { finished } = require('stream/promises')
// const bodyParser = require('body-parser')

const path = require('path')
const fs = require('fs')

const typeDefs = gql`
        # The implementation for this scalar is provided by the
        # 'GraphQLUpload' export from the 'graphql-upload' package
        # in the resolver map below.
        scalar Upload

        type File {
        url: String!
        }

        type Query {
        # This is only here to satisfy the requirement that at least one
        # field be present within the 'Query' type.  This example does not
        # demonstrate how to fetch uploads back.
        hello: String!
        }

        type Mutation {
        # Multiple uploads are supported. See graphql-upload docs for details.
        uploadFile(file: Upload!): File!
        }
`

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    hello: () => {
      return 'Hello World'
    }
  },
  Mutation: {
    uploadFile: async (parent, { file }) => {

      try {
        const { createReadStream, filename } = await file;

        // const { ext } = path.parse(filename)
        // const randomName = generateRandomString(12) + ext

        const stream = createReadStream()
        const pathName = path.join(__dirname, `public/images/${filename}`)
        await stream.pipe(fs.createWriteStream(pathName))

        return { url: `http://localhost:4000/public/images/${filename}` }


        //   const { createReadStream, filename, mimetype, encoding } = await file;

        //   // Invoking the `createReadStream` will return a Readable Stream.
        //   // See https://nodejs.org/api/stream.html#stream_readable_streams
        //   const stream = createReadStream();
        //   const pathName = path.join(__dirname, `public/images/${randomName}`)


        //   const out = fs.createWriteStream(pathName)
        //   stream.pipe(out)
        //   await finished(out)

        //   return { filename, mimetype, encoding }

      } catch (err) {
        throw Error(err)
      }
    }
  }
}

async function startServer() {
  const app = express()

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    // uploads: false
  })

  await apolloServer.start()


  app.use(graphqlUploadExpress()) //when remove error appear "POST body missing, invalid Content-Type, or JSON object has no keys." in postman and using react app Unhandled Rejection (Error): Unexpected token P in JSON at position 0


  apolloServer.applyMiddleware({ app })

  // app.use((req, res) => {
  //     res.send(path.join(__dirname, `public/images/`))
  // })

  // app.use(express.static('public')) //show files
  app.use('/public', express.static('public'));


  app.use(cors())

  app.listen(4000, () => console.log('Server is Running'))
}

startServer()