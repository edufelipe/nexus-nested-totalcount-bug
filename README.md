# This a repo to reproduce https://github.com/graphql-nexus/nexus/issues/901

All relevant code is in [server.ts](src/server.ts), where upon defining a new field using `extendConnection`, the resolver is only called on the first object that implements that resolver, not on all objects.

In the following query `totalCount` always resolve to `3`, even though it should resolve to `2` the top-level connection.

```graphql
{
  people(first: 10) {
    totalCount
    edges {
      node {
        id
        name
        friends(first: 10) {
          totalCount
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "people": {
      "totalCount": 3,
      "edges": [
        {
          "node": {
            "id": "1",
            "name": "John",
            "friends": {
              "totalCount": 3
            }
          }
        },
        {
          "node": {
            "id": "2",
            "name": "Amy",
            "friends": {
              "totalCount": 3
            }
          }
        }
      ]
    }
  }
}
```

```
curl 'http://localhost:8080/graphql' -H 'Content-Type: application/json' --data-binary '{"query":"{ people(first: 10) { totalCount, edges { node {id, name, friends(first: 10) {totalCount} } } } }"}'
```

