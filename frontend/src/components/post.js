import React, { useEffect, useState } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { 
    ADD_POST_LIKES, 
    REMOVE_POST_LIKES,
    ADD_CHILD_COMMENT,
    FIND_USER,
    ADD_FRIEND,
    REMOVE_FRIEND
} from './queries'
import PostComment from './postComment'
import Reply from "./commentReply"
import Notification from './notification'



const FIND_POST = gql`
query findPost($id: ID) {
    findPost(id: $id) {
        id
        url
        filter
        title
        updated
        likes {
            id
        }
        user {
            id
            username
            avatar
        }
        comments {
            content
            updated
            likes {
                id
            }
            user {
                username
                avatar
                id
            }
            post {
                id
            }
            childComments {
                content
                updated
                likes {
                  id
                }
                user {
                    username
                    avatar
                    id
                }
                replyTo {
                    username
                }
                parentComment {
                  id
                }
                id
            }
            id
        }
    }
}`



const Post = ({ 
    userID,
    error,
    success,
    setError,
    setSuccess
}) => {
    // GraphQL
    const [ findPost, result_post ] = useLazyQuery(FIND_POST) 
    const [ addPostLikes, result_addPostLikes ] = useMutation(ADD_POST_LIKES)
    const [ removePostLikes, result_removePostLikes ] = useMutation(REMOVE_POST_LIKES)
    const [ addChildComment, result_addChildComment ] = useMutation(ADD_CHILD_COMMENT)
    const [ user, result_user ] = useLazyQuery(FIND_USER)
    const [ addFriend, result_addFriend ] = useMutation(ADD_FRIEND)
    const [ removeFriend, result_removeFriend ] = useMutation(REMOVE_FRIEND)

    const ID = useParams().id
    const [ postInfo, setPostInfo ] = useState(null)
    const [ userAll, setUserAll ] = useState(null)
    const [ postShow, setPostShow ] = useState(false)
    const [ postRender, setPostRender ] = useState(false)
    const [ childCommentVisible, setChildCommentVisible ] = useState({})
    const [ replyShow, setReplyShow ] = useState(false)
    const [ comment_id, setCommentID ] = useState(null)
    const [ reply_user, setReplyUser ] = useState(null)

    const handleReplyClose = () => setReplyShow(false)

    //Style 
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


    // onClick
    const handlePostLikes = (post) => {
        if (localStorage.getItem('token') !== null) {
            const post_find = post.likes.find(user => user.id === userID)
            const likes = post.likes.map(user => user.id)
            if (post_find) {
                removePostLikes({ variables: { id:post.id, likes:likes.filter(id => id !== userID) } })
            } else {
                addPostLikes({ variables: { id:post.id, likes:likes.concat(userID) } })
            }
        }
    }

    const handleDisplayComment = () => {
        if (postShow === false) {
            setPostShow(true)
        } else {
            setPostShow(false)
        }
    }

    const handleFollow = (friend_id) => {
        if (userAll) {
            const friend_find = userAll.friends.find(friendid => friendid.id === friend_id)
            const friends = userAll.friends.map(friend => friend.id)
            
            if (friend_find) {
                removeFriend({ variables: { id: userID, friends: friends.filter(id => id !== friend_id) } })
            } else {
                addFriend({ variables: { id: userID, friends: friends.concat(friend_id) } })
            }
        }
    }


    // useEffect
    // Find User
    useEffect(() => {
        if (result_user.data) {
            setUserAll(result_user.data.findUser)
        }
    }, [result_user.data])

    useEffect(() => {
        if (result_addFriend.data) {
            // console.log(result_addFriend.data.addFriend)
            setUserAll(result_addFriend.data.addFriend)
        }
    }, [result_addFriend.data])

    useEffect(() => {
        if (result_removeFriend.data) {
            // console.log(result_removeFriend.data.removeFriend)
            setUserAll(result_removeFriend.data.removeFriend)
        }
    }, [result_removeFriend.data])
    
    // Find Post
    useEffect(() => {
        if (ID !== null) {
            findPost({ variables:  { id: ID } })
        }
    }, [ID])

    useEffect(() => {
        if (result_post.data && postRender === false) {
            setPostInfo(result_post.data.findPost)
            setPostRender(true)
            setChildCommentVisible(result_post.data.findPost.comments.reduce((accumulator, currentValue) => {
                accumulator[currentValue.id] = false
                return accumulator
            }, {}))
            user({ variables: { id: userID } })
        }
    }, [result_post.data])

    useEffect(() => {
        if (result_addPostLikes.data) {
            // console.log(result_addPostLikes.data.addPostLikes.likes)
            const newPost = {
                ...postInfo,
                likes: result_addPostLikes.data.addPostLikes.likes
            }
            setPostInfo(newPost)
        }
    }, [result_addPostLikes.data])

    useEffect(() => {
        if (result_removePostLikes.data) {
            // console.log(result_removePostLikes.data.removePostLikes.likes)
            const newPost = {
                ...postInfo,
                likes: result_removePostLikes.data.removePostLikes.likes
            }
            setPostInfo(newPost)
        }
    }, [result_removePostLikes.data])

    // Add ChildComment
    useEffect(() => {
        if (result_addChildComment.data) {
            // console.log(result_addChildComment.data.addChildComment)
            const newPost = {
                ...postInfo,
                comments: postInfo.comments.map(comment => comment.id === result_addChildComment.data.addChildComment.parentComment.id
                    ? {
                        ...comment,
                        childComments: comment.childComments.concat(result_addChildComment.data.addChildComment)
                    }
                    : comment
                )
            }
            setPostInfo(newPost)
        }
    }, [result_addChildComment.data])

    return (    
        <div className='post-main-container'>
            <Notification error={error} success={success} />
            {postInfo
                ? <div className='post-individual-page'>
                    <div className='post-img'>
                        {postInfo.url.split(".").pop() === "mp4"
                            ? <video controls>
                                    <source src={postInfo.url} type="video/mp4" />
                            </video>
                            :  <img 
                                style={{ filter: `${postInfo.filter}` }}
                                src={postInfo.url} 
                                alt={`imageNotDisplay ${postInfo.id}`} 
                            />
                        } 
                        <Link to={`/user/${postInfo.user.id}`}>
                            <h5>@ {postInfo.user.username}</h5>
                        </Link>
                        <h5 className="post-content">{postInfo.title}</h5>
                        <small>{new Date(parseInt(postInfo.updated)).toLocaleString()}</small>
                    </div>
                    
                    <div className='post-avatar-button mt-3'>
                        <div className='avatar-img-main-position'>
                            <Link to={`/user/${postInfo.user.id}`}>
                                <img 
                                    src={postInfo.user.avatar} 
                                    alt={`imageNotDisplay ${postInfo.id}`} 
                                    width="50" 
                                    height="50" 
                                    className='avatar-img-main'
                                />
                            </Link>

                            {userAll
                                ? <span style={userAll.friends.find(friendid => friendid.id === postInfo.user.id) ? styleFollowDisappear : styleFollow} onClick={() => handleFollow(postInfo.user.id)}>
                                    <i className="fas fa-plus"></i>
                                </span>
                                : <span style={styleFollow} onClick={() => handleFollow(postInfo.user.id)}>
                                    <i className="fas fa-plus"></i>
                                </span>
                            }
                        </div>
                        
                        <button style={postInfo.likes.find(user => user.id === userID) ? styleHeartRed : styleHeartBlack} onClick={() => handlePostLikes(postInfo)}>
                            <i className="far fa-heart fa-2x"></i>
                            <b>{postInfo.likes.length}</b>
                        </button>

                        <button style={style} onClick={handleDisplayComment}>
                            <i className="far fa-comment-dots fa-2x"></i>
                            <b>{postInfo.comments.length}</b>
                        </button>
                    </div>

                    <PostComment 
                        postShow={postShow} 
                        style={style}
                        postInfo={postInfo}
                        userID={userID}
                        styleHeartRed={styleHeartRed}
                        styleHeartBlack={styleHeartBlack}
                        childCommentVisible={childCommentVisible}
                        setPostInfo={setPostInfo}
                        setChildCommentVisible={setChildCommentVisible}
                        setReplyShow={setReplyShow}
                        setCommentID={setCommentID}
                        setReplyUser={setReplyUser}
                        error={error}
                        success={success}
                        setError={setError}
                        setSuccess={setSuccess}
                    />
                </div>
                : <div>Loading...</div>
            }

            <Reply 
                userID={userID}
                show={replyShow}
                comment_id={comment_id}
                reply_user={reply_user}
                handleClose={handleReplyClose}
                addChildComment={addChildComment}
                setReplyShow={setReplyShow} 
                setCommentID={setCommentID}
                setReplyUser={setReplyUser}
                setError={setError}
                setSuccess={setSuccess}
            />   
        </div>
    )
}



export default Post