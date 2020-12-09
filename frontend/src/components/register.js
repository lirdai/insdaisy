import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import axios from 'axios'



const CREATE_USER = gql`
mutation createUser($username: String!, $avatar: String!, $passwordHash: String!) {
    createUser(
        username: $username
        avatar: $avatar
        passwordHash: $passwordHash
    ) {
        id
    }
}`

const S3_PRE_SIGN = gql`
mutation s3PreSign($key: String!, $type: String!) {
    s3PreSign(
        key: $key
        type: $type
    ) {
        url
    }
}`



const Register = () => {
    const history = useHistory()
    const [ createUser ] = useMutation(CREATE_USER)
    const [ s3PreSign, result_url ] = useMutation(S3_PRE_SIGN)
    const [ file, setFile ] = useState(null)
    const [ username, setUsername ] = useState(null)
    const [ passwordHash, setPasswordHash ] = useState(null)

    const handleSubmit = (event) => {
        event.preventDefault()

        setFile(event.target.avatar.files[0])
        setUsername(event.target.username.value)
        setPasswordHash(event.target.pwd.value)

        const key = event.target.avatar.files[0].name
        const type = event.target.avatar.files[0].type

        s3PreSign({ variables: { key, type } })

        event.target.username.value = ''
        event.target.pwd.value = ''
    }

    useEffect(() => {
        if (result_url.data) {
            const url = result_url.data.s3PreSign.url
      
            axios
                .put(url, file, {headers: {
                    "Content-Type": file.type
                }
            })
                .then(result => {
                    const avatar = `https://daisy-ins.s3.amazonaws.com/${file.name}`

                    createUser({ variables: { username, avatar, passwordHash } })
                    history.push('/login')
                })
                .catch(error => console.log(error))
        }
    }, [createUser, result_url.data])

    return (
        <div className='register-bigger'>
        <form onSubmit={handleSubmit} className='register'>
            <input type='text' name='username' placeholder='Username' />
            <input type='text' name='pwd' placeholder='Password' />
            <input type='file' name='avatar' />

            <input type='submit' value='Register' />
        </form>
    </div>
    )
}



export default Register