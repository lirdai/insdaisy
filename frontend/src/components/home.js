import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { useApolloClient } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client'
import Upload from './uploadPost'
import { 
    ALL_POSTS, 
    ADD_POST, 
    ADD_POST_LIKES, 
    REMOVE_POST_LIKES, 
    ADD_COMMENT,
    ADD_COMMENT_LIKES,
    REMOVE_COMMENT_LIKES
} from './queries'



const Home = ({ token, setToken, userID, username }) => {
    // GraphQL
    const posts = useQuery(ALL_POSTS)
    const [ addPost, result_post ] = useMutation(ADD_POST)
    const [ addPostLikes, result_addPostLikes ] = useMutation(ADD_POST_LIKES)
    const [ removePostLikes, result_removePostLikes ] = useMutation(REMOVE_POST_LIKES)

    const [ addComment, result_comment ] = useMutation(ADD_COMMENT)
    const [ addCommentLikes, result_addCommentLikes ] = useMutation(ADD_COMMENT_LIKES)
    const [ removeCommentLikes, result_removeCommentLikes ] = useMutation(REMOVE_COMMENT_LIKES)


    // useState
    const [ postsAll, setPostsAll ] = useState([])
    const [ show, setShow ] = useState(false)
    const [ commentVisible, setCommentVisible ] = useState({})
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)


    // Logout
    const client = useApolloClient()
    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }
    

    // onClick
    const handlePostLikes = (post) => {
        const post_find = post.likes.find(user => user.id === userID)
        const likes = post.likes.map(user => user.id)
        if (post_find) {
            removePostLikes({ variables: { id:post.id, likes:likes.filter(id => id !== userID) } })
        } else {
            addPostLikes({ variables: { id:post.id, likes:likes.concat(userID) } })
        }
    }

    const handleCommentLikes = (comment) => {
        const comment_find = comment.likes.find(user => user.id === userID)
        const likes = comment.likes.map(user => user.id)
        if (comment_find) {
            removeCommentLikes({ variables: { id:comment.id, likes:likes.filter(id => id !== userID) } })
        } else {
            addCommentLikes({ variables: { id:comment.id, likes:likes.concat(userID) } })
        }
    }

    const handleDisplayComment = (id) => {
        if (commentVisible[id]) {
            const newCommentVisible = {
                ...commentVisible,
            }
            newCommentVisible[id] = false
            setCommentVisible(newCommentVisible)
        } else {
            const newCommentVisible = {
                ...commentVisible,
            }
            newCommentVisible[id] = true
            setCommentVisible(newCommentVisible)
        }
    }

    const handleAddComment = (event) => {
        event.preventDefault()

        const content = event.target.content.value
        const postID = event.target.post_id.value

        addComment({ variables: { content: content, user: userID, post: postID } })

        event.target.content.value = ''
    }


    // Style
    const styleBorder = {
        border: 'none'
    }

    const style = {
        border: 'none',        
        outline: "none",
        backgroundColor: "white",
    }

    const styleHeartRed = {
        border: 'none',
        outline: 'none',
        color: "red",
        backgroundColor: "white",
    }

    const styleHeartBlack = {
        border: 'none',
        outline: 'none',
        color: "black",
        backgroundColor: "white",
    } 

    const hideWhenVisible = { display: 'none'}
    const showWhenVisible = { display: ''}


    // useEffect
    // All Posts
    useEffect(() => {
        if (posts.data) {
            // console.log(posts.data.allPosts)
            setPostsAll(posts.data.allPosts)
            setCommentVisible(posts.data.allPosts.reduce((accumulator, currentValue) => {
                accumulator[currentValue.id] = false
                return accumulator
            }, {}))
        }
    }, [posts.data])

    useEffect(() => {
        if (result_post.data) {
            // console.log(result_post.data.addPost)
            setPostsAll(postsAll => postsAll.concat(result_post.data.addPost))
            let newCommentVisible = {
                ...commentVisible
            }
            newCommentVisible[result_post.data.addPost.id] = false
            setCommentVisible(newCommentVisible)
        }
    }, [result_post.data])

    // Update Post Likes
    useEffect(() => {
        if (result_addPostLikes.data) {
            // console.log(result_addLikes.data.addPostLikes)
            setPostsAll(postsAll => postsAll.map(post => post.id === result_addPostLikes.data.addPostLikes.id 
                ? {
                    ...post,
                    likes: result_addPostLikes.data.addPostLikes.likes
                }
                : post ))
        }
    }, [result_addPostLikes.data])

    useEffect(() => {
        if (result_removePostLikes.data) {
            // console.log(result_removeLikes.data.removePostLikes)
            setPostsAll(postsAll => postsAll.map(post => post.id === result_removePostLikes.data.removePostLikes.id 
                ? {
                    ...post,
                    likes: result_removePostLikes.data.removePostLikes.likes
                }
                : post ))
        }
    }, [result_removePostLikes.data])


    // Comment
    useEffect(() => {
        if (result_comment.data) {
            // console.log(result_comment.data.addComment)
            setPostsAll(postsAll => postsAll.map(post => post.id === result_comment.data.addComment.post.id 
                ? {
                    ...post,
                    comments: post.comments.concat(result_comment.data.addComment)
                }
                : post ))
        }
    }, [result_comment.data])

    useEffect(() => {
        if (result_addCommentLikes.data) {
            // console.log(result_addCommentLikes.data.addCommentLikes)
            setPostsAll(postsAll => postsAll.map(post => post.id === result_addCommentLikes.data.addCommentLikes.post.id 
                ? {
                    ...post,
                    comments: post.comments.map(comment => comment.id === result_addCommentLikes.data.addCommentLikes.id
                        ? {
                            ...comment,
                            likes: result_addCommentLikes.data.addCommentLikes.likes
                        }
                        : comment
                    )
                }
                : post ))
        }
    }, [result_addCommentLikes.data])

    useEffect(() => {
        if (result_removeCommentLikes.data) {
            // console.log(result_removeCommentLikes.data.removeCommentLikes)
            setPostsAll(postsAll => postsAll.map(post => post.id === result_removeCommentLikes.data.removeCommentLikes.post.id 
                ? {
                    ...post,
                    comments: post.comments.map(comment => comment.id === result_removeCommentLikes.data.removeCommentLikes.id
                        ? {
                            ...comment,
                            likes: result_removeCommentLikes.data.removeCommentLikes.likes
                        }
                        : comment
                    )
                }
                : post ))
        }
    }, [result_removeCommentLikes.data])


    // console.log(commentVisible)
    // console.log(postsAll)
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
                    {postsAll.loading
                        ? <div>loading...</div>
                        : <div>
                            {postsAll.map(post => 
                                <div key={post.id}>
                                    <div className='onePost mb-5'>
                                        <div className="img-user-title-date">
                                            <img className='p-3' src={post.url} alt={`not display ${post.id}`} />
                                            <h5>@ {post.user.username}</h5>
                                            <h5><b>{post.title}</b></h5>
                                            <small>{new Date(parseInt(post.updated)).toLocaleString()}</small>
                                        </div>
                                        
                                        <div className="avatar-fontawesome">
                                            <div className='avatar-img-main-position'>
                                                <img src={post.user.avatar} alt={`avatar not display ${post.id}`} width="50px" height="50px" className='avatar-img-main'/>
                                            </div>

                                            <button style={post.likes.find(user => user.id === userID) ? styleHeartRed : styleHeartBlack} onClick={() => handlePostLikes(post)}>
                                                <i className="far fa-heart fa-2x"></i>
                                                <b>{post.likes.length}</b>
                                            </button>

                                            <button style={style} onClick={() => handleDisplayComment(post.id)}>
                                                <i className="far fa-comment-dots fa-2x"></i>
                                                <b>{post.comments.length}</b>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Display Comment */}
                                    <div style={commentVisible[post.id] ? showWhenVisible : hideWhenVisible}>
                                        {post.comments.map(comment => 
                                            <div key={comment.id} className="post-comment">
                                                <div>
                                                    <img src={comment.user.avatar} alt={`avatar not display ${comment.id}`} width="30px" height="30px" className='avatar-img-main'/>
                                                </div>
                                               
                                                <div>
                                                    <p><b>{comment.user.username}</b></p>
                                                    <p>{comment.content}</p>

                                                    <div className='comment-date-reply'>
                                                        <p>{new Date(parseInt(comment.updated)).toLocaleString()}</p>
                                                        <button style={style}>Reply</button>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <button style={comment.likes.find(user => user.id === userID) ? styleHeartRed : styleHeartBlack} onClick={() => handleCommentLikes(comment)}>
                                                        <i className="far fa-heart fa-2x"></i>
                                                        <b>{comment.likes.length}</b>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <form className="comment-form m-5" onSubmit={handleAddComment}>
                                            <input type='hidden' name='post_id' value={post.id} />
                                            <input type='text' name='content' />
                                            <button style={style} type='submit'>
                                                <i className="fas fa-share fa-2x"></i>
                                            </button>
                                        </form>
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