import express from "express"
import { graphqlHTTP } from "express-graphql"
import { connectionFromArray } from "graphql-relay"
import { makeSchema, connectionPlugin, extendType, objectType } from "nexus"


const People = objectType({
  name: "People",
  definition(t) {
    t.id("id")
    t.string("name")
    t.connectionField("friends", {
      type: "People",
      totalCount: (root, args, ctx, info) => {
        // This code is always executed, replacing the would-be correct root 'people' connection totalCount value (which would be 2)
        console.log("totalCount friends", root)
        return 3
      },
      resolve: (root, args, ctx, info) => {
        // This code also gets executed properly
        console.log("resolve friends")
        return [
          { id: 3, name: "Jack" },
          { id: 4, name: "Jane" },
          { id: 5, name: "Ana" }
        ]
      }
    })
  }
})

const PeopleQuery = extendType({
  type: "Query",
  definition(t) {
    t.connectionField("people", {
      type: "People",
      totalCount: (root, args, ctx, info) => {
        // This code never gets executed and the totalCount returned is the one above from the 'friends' connection instead (which is 3)
        console.log("totalCount people")
        return 2
      },
      resolve: (root, args, ctx, info) => {
        // This code gets executed properly
        console.log("resolve people")
        return connectionFromArray(
          [
            { id: 1, name: "John" },
            { id: 2, name: "Amy" }
          ],
          args
        )
      }
    })
  }
})

const schema = makeSchema({
  types: [People, PeopleQuery],
  features: {
    abstractTypeStrategies: {
      isTypeOf: true
    }
  },
  plugins: [
    connectionPlugin({
      includeNodesField: true,
      disableBackwardPagination: true,
      extendConnection: {
        totalCount: { type: "Int" }
      }
    })
  ]
})


express().use(
  "/graphql",
  graphqlHTTP(async (req, res) => {
    return {
      schema: schema,
      graphiql: true
    }
  })
).listen(8080)
