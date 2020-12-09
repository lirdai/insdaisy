import React, { useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { useParams } from "react-router-dom"



const FIND_USER = gql`
query findUser($id: ID!) {
  findUser(id: $id) {
    avatar
    posts {
        url
        title
        updated
        likes {
            username
        }
        id
    }
  }
}
`



const User = () => {
    const ID = useParams().id

    const [ findUser, result_user ] = useLazyQuery(FIND_USER) 
    const [ userinfo, setUserInfo ] = useState(null)

    useEffect(() => {
        findUser({ variables:  { id: ID } })
    }, [])

    useEffect(() => {
        if (result_user.data) {
            setUserInfo(result_user.data.findUser)
        }
    }, [result_user.data])


    return (
        <div>
            {userinfo
                ? <div>
                    {/* User Information */}
                    <div>
                        <img 
                            src={userinfo.avatar} 
                            alt={userinfo.id} 
                            width="100" 
                            height="100" 
                            className='avatar-img'
                        />
                        <button>Reset Password</button>
                    </div>
                    
                    {/* Display Posts */}
                    <div>
                        <h1>Display Posts</h1>
                    </div>
                </div>
                : <div>Loading...</div>
            }
        </div>
    )
}



export default User