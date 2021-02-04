import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import { gql, useMutation } from '@apollo/client'
import Notification from './notification'



const LOGIN = gql`
mutation login($username: String!, $passwordHash: String!) {
    login(
        username: $username
        passwordHash: $passwordHash
    ) {
        value
        username
        id
    }
}`



const Login = ({ 
    setToken, 
    setUsername, 
    setUserID,
    error,
    success,
    setError,
    setSuccess
}) => {
    const [ login, result_login ] = useMutation(LOGIN)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const username = event.target.username.value
        const passwordHash = event.target.pwd.value

        try {
            await login({ variables: { username, passwordHash } })
            setSuccess("Login Successfully!")
            setTimeout(() => setSuccess(null), 3000)
        } catch(error) {
            setError(error.message)
            setTimeout(() => setError(null), 3000)
        }

        event.target.username.value = ''
        event.target.pwd.value = ''
    }

    useEffect(() => {
        if ( result_login.data ) {
          setToken(result_login.data.login.value)
          setUsername(result_login.data.login.username)
          setUserID(result_login.data.login.id)

          localStorage.setItem('token', result_login.data.login.value)
          localStorage.setItem('username', result_login.data.login.username)
          localStorage.setItem('id', result_login.data.login.id)
        }
      }, [setUserID, setUsername, setToken, result_login.data])


    return (
        <div className='login-bigger'>
            <form onSubmit={handleSubmit} className='login'>
                <Notification error={error} success={success} />
                <input type='text' name='username' placeholder='Username' required />
                <input type='text' name='pwd' placeholder='Password' required />

                <input type='submit' value='Log In' />
                <small>Don't have an account yet? Please <Link to='/register'>register here.</Link></small>
            </form>
        </div>
    )
}



export default Login