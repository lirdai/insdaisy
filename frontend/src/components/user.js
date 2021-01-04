import React, { useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"



const FIND_USER = gql`
query findUser($id: ID) {
  findUser(id: $id) {
    username
    avatar
    id
    posts {
        filter
        url
        id
    }
  }
}`



const User = () => {
    const ID = useParams().id

    const [ findUser, result_user ] = useLazyQuery(FIND_USER) 
    const [ userInfo, setUserInfo ] = useState(null)

    useEffect(() => {
        if (ID !== null) {
            findUser({ variables:  { id: ID } })
        }
    }, [ID])

    useEffect(() => {
        if (result_user.data) {
            setUserInfo(result_user.data.findUser)
        }
    }, [result_user.data])

    console.log(userInfo)
    return (
        <div>  
            {userInfo
                ? <div>
                    {/* User Information */}
                    <div className="userinfo-avatar-button p-5">
                        <img 
                            src={userInfo.avatar} 
                            alt={userInfo.id} 
                            width="100" 
                            height="100" 
                            className='avatar-img'
                        />

                        <h4>Hello, {userInfo.username}</h4>
                    </div>
                    
                    {/* Display Posts */}
                    <div>
                        <h6 className='my-5 p-5'>{userInfo.posts.length} Post(s)</h6>

                        <div className='grid-userinfo-posts'>
                            {userInfo.posts.map(post =>
                                <div key={post.id}>
                                    <Link to={`/post/${post.id}`}>
                                        <img 
                                            style={{ filter: `${post.filter}` }}
                                            src={post.url}
                                            width="500" 
                                            height="300" 
                                            alt={`imagenotdisplay ${post.id}`}
                                        />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                : <div>Loading...</div>
            }
        </div>
    )
}



export default User