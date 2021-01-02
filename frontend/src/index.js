// Dependencies
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch, Route, Redirect
} from "react-router-dom"
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'

// Static
import './decorator/styles.css'

// React.js
import Home from './components/home'
import Login from './components/login'
import Register from './components/register'
import User from './components/user'



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
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
})



const App = () => {
  const [ token, setToken ] = useState(localStorage.getItem('token'))
  const [ username, setUsername ] = useState(localStorage.getItem('username'))
  const [ userID, setUserID ] = useState(localStorage.getItem('id'))

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/user/:id">
            <User />
          </Route>
          
          <Route exact path="/register">
            <Register />
          </Route>

          <Route exact path="/login">
            {token !== null
              ? <Redirect to='/' />
              : <Login 
                  setToken={setToken} 
                  setUsername={setUsername}
                  setUserID={setUserID}
                />
            }
          </Route>

          <Route exact path="/">
            <Home 
              setToken={setToken} 
              token={token}
              userID={userID}
              username={username}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}



ReactDOM.render(
  <ApolloProvider client={client}>
    <App /> 
  </ApolloProvider>, document.getElementById('root'))