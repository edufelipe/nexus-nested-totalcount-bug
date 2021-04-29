import { join } from "path"

import { makeSchema, connectionPlugin } from "nexus"

import * as types from "./graphql"

export const schema = makeSchema({
  types: types,
  outputs: {
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
    schema: join(__dirname, "..", "schema.graphql")
  },
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
