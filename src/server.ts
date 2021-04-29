import express from "express"
import { graphqlHTTP } from "express-graphql"

import { schema } from "./schema"

const app = express()

app.use(
  "/graphql",
  graphqlHTTP(async (req, res) => {
    return {
      schema: schema,
      graphiql: true
    }
  })
)

app.listen(8080)
