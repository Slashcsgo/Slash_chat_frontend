import { ApolloClient, ApolloLink, DocumentNode, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink} from "@apollo/client/link/subscriptions"
import { getMainDefinition } from "@apollo/client/utilities";
import { OperationTypeNode } from "graphql";
import { createClient } from "graphql-ws";
import { urls } from "../config";
import { setContext } from '@apollo/client/link/context';
import { cache } from "./Cache";

const queryLink = new HttpLink({
  uri: urls.query
})

const mutationLink = new HttpLink({
  uri: urls.mutation
})

const wsLink = new GraphQLWsLink(createClient({
  url: urls.subscription,
  connectionParams: {
    authToken: localStorage.getItem('token')
  }
}))

const compareOperationType = (query: DocumentNode, operationName: OperationTypeNode) => {
  const definition = getMainDefinition(query)
  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation === operationName
  )
}

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

const splitLink = split(
  ({ query }) => {
    return compareOperationType(query, OperationTypeNode.SUBSCRIPTION)
  }, wsLink, split(
    ({ query }) => {
      return compareOperationType(query, OperationTypeNode.MUTATION)
    }, mutationLink, queryLink
  )
)

export const client = new ApolloClient({
  cache: cache,
  link: authLink.concat(splitLink)
})