import React, { useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { useParams } from "react-router-dom"



const FIND_USER = gql`
query findUser($id: ID!) {
  findUser(id: $id) {
    username
    avatar
    posts {
        url
        filter
        title
        updated
        likes {
            id
        }
        comments {
            content
            updated
            likes {
                id
            }
            childComments {
                content
                updated
                likes {
                    id
                }
                replyTo {
                    id
                }
            }
        }
        id
    }
  }
}`



const User = () => {
    const ID = useParams().id

    const [ findUser, result_user ] = useLazyQuery(FIND_USER) 
    const [ userinfo, setUserInfo ] = useState(null)

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


    return (
        <div>  
            {userinfo
                ? <div>
                    {/* User Information */}
                    <div className="userinfo-avatar-button p-5">
                        <img 
                            src={userinfo.avatar} 
                            alt={userinfo.id} 
                            width="100" 
                            height="100" 
                            className='avatar-img'
                        />

                        <h4>Hello, {userinfo.username}</h4>
                    </div>
                    
                    {/* Display Posts */}
                    <div>
                        <h6 className='my-5'>{userinfo.posts.length} Post(s)</h6>

                        <div className='grid-userinfo-posts'>
                            {userinfo.posts.map(post =>
                                <div key={post.id}>
                                    <img 
                                        style={{ filter: `${post.filter}` }}
                                        src={post.url}
                                        width="500" 
                                        height="300" 
                                        alt={`imagenotdisplay ${post.id}`}
                                    />
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