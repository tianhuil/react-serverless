import React from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"

export const getToken = () => localStorage.getItem('token')

const setToken = (token) => localStorage.setItem('token', token)

const clearToken = () => setToken('')

const userIdFromToken = (token) => {
  try {
    const payload = atob(token.split(".")[1])
    return JSON.parse(payload).person_id
  } catch(error) {
    return null
  }
}

export const UserContext = React.createContext({
  userId: userIdFromToken(getToken()),
  logIn: ((token) => {}),
  logOut: (() => {})
})

export const UserConsumer = UserContext.Consumer

export class UserProvider extends React.Component {
  constructor(props) {
    super(props)

    this.logIn = (token) => {
      const userId = userIdFromToken(token)
      if (userId === null) {
        return false
      } else {
        setToken(token)
        this.setState(state => ({userId: userId}))
        return true
      }
    }

    this.logOut = (client) => {
      clearToken()
      this.setState(state => ({userId: null}))
      console.log(client)
      client.resetStore()
      client.cache.reset()
    }

    this.state = {
      userId: userIdFromToken(getToken()),
      logIn: this.logIn,
      logOut: this.logOut
    }
  }

  render() {
    return <UserContext.Provider value={this.state}>
      {this.props.children}
    </UserContext.Provider>
  }
}
