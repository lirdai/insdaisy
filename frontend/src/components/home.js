import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { useApolloClient } from '@apollo/client'
import { gql, useMutation, useQuery } from '@apollo/client'
import Upload from './uploadPost'



const ALL_POSTS = gql`
query {
    allPosts {
        url
        title
        updated
        likes {
            id
        }
        id
        user {
            username
        }
        comments {
            content
        }
    }
}`

const ADD_POST = gql`
mutation addPost($url: String!, $title: String!, $user: ID!) {
    addPost(
        url: $url
        title: $title
        user: $user
    ) {
        url
        title
        updated
        likes {
            id
        }
        id
        user {
            username
        }
        comments {
            content
        }
    }
}`

const ADD_POST_LIKES = gql`
mutation addPostLikes($id: ID!, $likes: [ID]!) {
    addPostLikes(
        id: $id
        likes: $likes
    ) {
        url
        title
        updated
        likes {
            id
        }
        id
        user {
            username
        }
        comments {
            content
        }
    }
}
`

const REMOVE_POST_LIKES = gql`
mutation removePostLikes($id: ID!, $likes: [ID]!) {
    removePostLikes(
        id: $id
        likes: $likes
    ) {
        url
        title
        updated
        likes {
            id
        }
        id
        user {
            username
        }
        comments {
            content
        }
    }
}
`



const Home = ({ token, setToken, userID, username }) => {
    // GraphQL
    const [ addPost, result_post ] = useMutation(ADD_POST)
    const posts = useQuery(ALL_POSTS)
    const [ addPostLikes ] = useMutation(ADD_POST_LIKES)
    const [ removePostLikes ] = useMutation(REMOVE_POST_LIKES)

    // useState
    const [ postsAll, setPostsAll ] = useState([])
    const [ show, setShow ] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    // Logout
    const client = useApolloClient()
    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    const handleLikes = (post) => {
        const post_find = post.likes.find(user => user.id === userID)
        const likes = post.likes.map(user => user.id)
        if (post_find) {
            removePostLikes({ variables: { id:post.id, likes:likes.filter(id => id !== userID) } })
        } else {
            addPostLikes({ variables: { id:post.id, likes:post.likes.concat(userID) } })
        }
    }

    // Style
    const styleBorder = {
        border: 'none'
    }

    const styleHeartRed = {
        color: "red"
    }

    const styleHeartBlack = {
        color: "black"
    } 

    // useEffect
    useEffect(() => {
        if (posts.data) {
            setPostsAll(posts.data.allPosts)
        }
    }, [posts.data])

    useEffect(() => {
        if (result_post.data) {
            setPostsAll(postsAll => postsAll.concat(result_post.data.addPost))
        }
    }, [result_post.data])

    
    return (
        <div className='home'>
            {/* Navbar  +++  Footer*/}
            <div>
                <div className='navbar'>
                    <div className='nav-user'>
                        {token === null
                            ? <h3><i>Welcome</i></h3>
                            : <Link to={`/user/${userID}`}><h3><i>{username}</i></h3></Link>
                        }
                    </div>

                    <div className='nav-post'>
                        {token === null
                            ? <div>Please log in to add post!</div>
                            : <div>
                                <button style={styleBorder} onClick={handleShow}><i className="fas fa-edit fa-2x"></i>
                                </button>
                            </div>
                        }
                    </div>
                    
                    <div className='nav-login'> 
                        <Link to="/login">
                            <button style={styleBorder}><i className="fas fa-user-plus fa-2x"></i>
                            </button>
                        </Link>
                    </div>

                    <div className='nav-logout'> 
                        <button style={styleBorder} className='px-2' onClick={logout}><i className="fas fa-sign-out-alt fa-2x"></i>
                        </button>
                    </div>

                    <div className='footer'>
                        <p>&copy; Created by Daisy Dai</p>
                        <p>Created on 12/02/2020</p>
                    </div>
                </div>
            </div>
            

            {/* Display Post */}
            <div>
                <div className='content'>
                    {posts.loading
                        ? <div>loading...</div>
                        : <div>
                            {postsAll.map(post => 
                                <div key={post.id} className='mb-5'>
                                    <div className='content-front'>
                                        <h5>{post.user.username}</h5>
                                        <h5>{new Date(parseInt(post.updated)).toLocaleString()}</h5>
                                    </div>
                                    
                                    <img src={post.url} alt={post.id} max-width="300" height="200" />

                                    <div className='font-post'>
                                        <div id='title'>
                                            <small><b>{post.title}</b></small>
                                        </div>
                             
                                        <div id="fontawesome">
                                            <button style={post.likes.find(user => user.id === userID) ? styleHeartRed : styleHeartBlack} onClick={() => handleLikes(post)}>
                                                <i className="far fa-heart fa-2x"></i>
                                                <b>{post.likes.length}</b>
                                            </button>

                                            <button>
                                                <i className="far fa-comment-dots fa-2x"></i>
                                                <b>{post.comments.length}</b>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    }

                    <Upload 
                        handleClose={handleClose}
                        show={show}
                        userID={userID}
                        addPost={addPost}
                    />      
                </div>
            </div>
        </div>
    )
}



export default Home