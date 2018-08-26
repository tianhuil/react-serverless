import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getToken } from './user'

const API_HOST = process.env.API_HOST,
      API_PORT = process.env.API_PORT

const httpLink = createHttpLink({
  uri: `http://${API_HOST}:${API_PORT}/graphql`,
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const jwtToken = getToken()
  // return the headers to the context so httpLink can read them
  return jwtToken ? {
    headers: {...headers, authorization: `Bearer ${jwtToken}`}
  } : headers
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default client
