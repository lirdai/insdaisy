// Dependencies
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch, Route, Redirect
} from "react-router-dom"
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { 
  ApolloClient, 
  ApolloProvider, 
  HttpLink, 
  InMemoryCache,
  split
} from '@apollo/client'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

// Static
import './decorator/styles.css'

// React.js
import Home from './components/home'
import Login from './components/login'
import Register from './components/register'
import User from './components/user'
import Post from './components/post'
import Friends from './components/friends'
import userReducer from './components/userinfo'



const reducer = combineReducers({
  user: userReducer
})

const store = createStore(reducer)



const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({
  uri: 'https://insdaisy.daisywebdev.com/graphql',
})

const wsLink = new WebSocketLink({
  uri: `wss://insdaisy.daisywebdev.com/graphql-ws`,
  options: {
    reconnect: true
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        fields: {
          likes: {
            merge(existing, incoming) {
              return incoming
            },
          },
        },
      },
      Comment: {
        fields: {
          likes: {
            merge(existing, incoming) {
              return incoming
            },
          },
        },
      },
      ChildComment: {
        fields: {
          likes: {
            merge(existing, incoming) {
              return incoming
            },
          },
        },
      },
      User: {
        fields: {
          friends: {
            merge(existing, incoming) {
              return incoming
            },
          },
        },
      },
  }}),
  link: splitLink
})



const App = () => {
  const [ token, setToken ] = useState(localStorage.getItem('token'))
  const [ username, setUsername ] = useState(localStorage.getItem('username'))
  const [ userID, setUserID ] = useState(localStorage.getItem('id'))

  const [ error, setError ] = useState(null)
  const [ success, setSuccess ] = useState(null)
  
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/post/:id">
            <Post 
              userID={userID} 
              error={error}
              success={success}
              setError={setError}
              setSuccess={setSuccess}
            />
          </Route>

          <Route exact path="/user/:id">
            <User />
          </Route>

          <Route exact path="/friends/:id">
            <Friends 
              error={error}
              success={success}
              setError={setError}
              setSuccess={setSuccess}
            />
          </Route>
          
          <Route exact path="/register">
            <Register 
              error={error}
              success={success}
              setError={setError}
              setSuccess={setSuccess}
            />
          </Route>

          <Route exact path="/login">
            {token !== null
              ? <Redirect to='/' />
              : <Login 
                  setToken={setToken} 
                  setUsername={setUsername}
                  setUserID={setUserID}
                  error={error}
                  success={success}
                  setError={setError}
                  setSuccess={setSuccess}
                />
            }
          </Route>

          <Route exact path="/">
            <Home 
              setToken={setToken} 
              token={token}
              userID={userID}
              username={username}
              error={error}
              success={success}
              setError={setError}
              setSuccess={setSuccess}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}



ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App /> 
    </Provider>,
  </ApolloProvider>, document.getElementById('root'))