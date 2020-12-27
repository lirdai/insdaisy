import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { useApolloClient } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client'
import Upload from './uploadPost'
import Reply from './commentReply'
import DisplayComment from './displayComment'
import { 
    ALL_POSTS, 
    ADD_POST, 
    ADD_POST_LIKES, 
    REMOVE_POST_LIKES, 
    ADD_COMMENT,
    ADD_COMMENT_LIKES,
    REMOVE_COMMENT_LIKES,
    ADD_CHILD_COMMENT
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

    const [ addChildComment, result_childComment ] = useMutation(ADD_CHILD_COMMENT)


    // useState
    const [ postsAll, setPostsAll ] = useState([])
    const [ commentVisible, setCommentVisible ] = useState({})
    const [ childCommentVisible, setChildCommentVisible ] = useState({})
    const [ allPostsRender, setAllPostsRender ] = useState(false)
    const [ followUp, setFollowUp ] = useState(false)

    const [ uploadShow, setUploadShow ] = useState(false)
    const handleUploadClose = () => setUploadShow(false)
    const handleUploadShow = () => setUploadShow(true)

    const [ replyShow, setReplyShow ] = useState(false)
    const [ comment_id, setCommentID ] = useState(null)
    const [ reply_user, setReplyUser ] = useState(null)
    const handleReplyClose = () => {
        setReplyShow(false)
    }


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

    const handleFollow = () => {}


    // Style
    const styleBorder = {
        border: 'none'
    }

    const style = {
        border: 'none',        
        outline: "none",
        backgroundColor: "white"
    }

    const styleFollow = {
        width: "20px",
        height: "20px",
        color: "white",
        backgroundColor: "red",
        borderRadius: "50%",
        display: "grid",
        justifyContent: "center",
        alignContent: "center",
        position: "relative",
        left: "30%",
        bottom: "80%"
    }

    const styleFollowDisappear = {
        display: "none",
    }

    const styleHeartRed = {
        border: 'none',
        outline: 'none',
        color: "red",
        backgroundColor: "white"
    }

    const styleHeartBlack = {
        border: 'none',
        outline: 'none',
        color: "black",
        backgroundColor: "white"
    } 


    // useEffect
    // All Posts
    useEffect(() => {
        if (posts.data && allPostsRender === false) {
            // console.log(posts.data.allPosts)
            setPostsAll(posts.data.allPosts)
            setCommentVisible(posts.data.allPosts.reduce((accumulator, currentValue) => {
                accumulator[currentValue.id] = false
                return accumulator
            }, {}))
            setChildCommentVisible(posts.data.allPosts.reduce((accumulator, currentValue) => {
                currentValue.comments.map(comment => accumulator[comment.id] = false)
                return accumulator
            }, {}))
            setAllPostsRender(true)
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

    // Parent Comment
    useEffect(() => {
        if (result_comment.data) {
            // console.log(result_comment.data.addComment)
            setPostsAll(postsAll => postsAll.map(post => post.id === result_comment.data.addComment.post.id 
                ? {
                    ...post,
                    comments: post.comments.concat(result_comment.data.addComment)
                }
                : post ))

            let newChildCommentVisible = {
                ...childCommentVisible
            }
            newChildCommentVisible[result_comment.data.addComment.id] = false
            setChildCommentVisible(newChildCommentVisible)  
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

    // Child Comment
    useEffect(() => {
        if (result_childComment.data) {
            // console.log(result_childComment.data.addChildComment)
            const postUpdated = postsAll.find(post => post.comments.find(comment =>
                comment.id === result_childComment.data.addChildComment.parentComment.id
            ))

            setPostsAll(postsAll => postsAll.map(post => post.id === postUpdated.id
                ? {
                    ...post,
                    comments: post.comments.map(comment => comment.id === result_childComment.data.addChildComment.parentComment.id
                        ? {
                            ...comment,
                            childComments: comment.childComments.concat(result_childComment.data.addChildComment)
                        }
                        : comment
                    )
                }
                : post
            ))
        }
    }, [result_childComment.data]) 

    // console.log(childCommentVisible)
    // console.log(commentVisible)
    // console.log(reply_user)
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
                                <button style={styleBorder} onClick={handleUploadShow}>
                                    <i className="fas fa-edit fa-2x"></i>
                                </button>
                            </div>
                        }
                    </div>
                    
                    <div className='nav-login'> 
                        <Link to="/login">
                            <button style={styleBorder}>
                                <i className="fas fa-user-plus fa-2x"></i>
                            </button>
                        </Link>
                    </div>

                    <div className='nav-logout'> 
                        <button style={styleBorder} className='px-2' onClick={logout}>
                            <i className="fas fa-sign-out-alt fa-2x"></i>
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
                                            <img style={{ filter: `${post.filter}` }} className='p-3' src={post.url} alt={`not display ${post.id}`} />
                                            <h5>@ {post.user.username}</h5>
                                            <h5><b>{post.title}</b></h5>
                                            <small>{new Date(parseInt(post.updated)).toLocaleString()}</small>
                                        </div>
                                        
                                        <div className="avatar-fontawesome">
                                            <div className='avatar-img-main-position'>
                                                <img src={post.user.avatar} alt={`avatar not display ${post.id}`} width="50px" height="50px" className='avatar-img-main'/>
                                                <span style={followUp ? styleFollowDisappear : styleFollow} onClick={handleFollow}>
                                                    <i className="fas fa-plus"></i>
                                                </span>
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

                                    <DisplayComment 
                                        post={post}       
                                        userID={userID}
                                        postsAll={postsAll}
                                        commentVisible={commentVisible}
                                        childCommentVisible={childCommentVisible}
                                        setPostsAll={setPostsAll}
                                        setChildCommentVisible={setChildCommentVisible}
                                        setReplyShow={setReplyShow}
                                        setCommentID={setCommentID}
                                        setReplyUser={setReplyUser}
                                        removeCommentLikes={removeCommentLikes}
                                        addCommentLikes={addCommentLikes}
                                        addComment={addComment}
                                        style={style}
                                        styleHeartRed={styleHeartRed}
                                        styleHeartBlack={styleHeartBlack}
                                    />
                                </div>
                            )}
                        </div>
                    }

                    <Upload 
                        handleClose={handleUploadClose}
                        show={uploadShow}
                        userID={userID}
                        addPost={addPost}
                    />  

                    <Reply 
                        handleClose={handleReplyClose}
                        show={replyShow}
                        userID={userID}
                        addChildComment={addChildComment}
                        comment_id={comment_id}
                        reply_user={reply_user}
                    />   
                </div>
            </div>
        </div>
    )
}



export default Home