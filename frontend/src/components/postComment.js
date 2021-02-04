import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import { useMutation } from '@apollo/client'
import {
    ADD_COMMENT,
    ADD_COMMENT_LIKES,
    REMOVE_COMMENT_LIKES
} from './queries'
import PostChildComment from './postChildComment'



const PostComment = ({ 
    postShow, 
    style, 
    postInfo,
    userID,
    styleHeartRed,
    styleHeartBlack,
    setPostInfo,
    childCommentVisible,
    setChildCommentVisible,
    setReplyShow, 
    setCommentID, 
    setReplyUser,
    setError,
    setSuccess
}) => {
    const hideWhenVisible = { display: 'none'}
    const showWhenVisible = { display: ''}

    const [ addComment, result_comment ] = useMutation(ADD_COMMENT)
    const [ addCommentLikes, result_addCommentLikes ] = useMutation(ADD_COMMENT_LIKES)
    const [ removeCommentLikes, result_removeCommentLikes ] = useMutation(REMOVE_COMMENT_LIKES)

    const handleChildCommentShow = (id) => {
        if (childCommentVisible[id]) {
            const newChildCommentVisible = {
                ...childCommentVisible,
            }
            newChildCommentVisible[id] = false
            setChildCommentVisible(newChildCommentVisible)
        } else {
            const newChildCommentVisible = {
                ...childCommentVisible,
            }
            newChildCommentVisible[id] = true
            setChildCommentVisible(newChildCommentVisible)
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

    const handleAddComment = async (event) => {
        event.preventDefault()

        const content = event.target.content.value
        const postID = event.target.post_id.value

        try {
            await addComment({ variables: { content: content, user: userID, post: postID } })
            setSuccess("Comment Added!")
            setTimeout(() => setSuccess(null), 3000)
        } catch (error) {
            setError(error.message)
            setTimeout(() => setError(null), 3000)
        }
        
        event.target.content.value = ''
    }

    const handleReplyShow = (comment_id, user_id) => {
        setReplyShow(true)
        setCommentID(comment_id)
        setReplyUser(user_id)
    }


    // Parent Comment
    useEffect(() => {
        if (result_comment.data) {
            // console.log(result_comment.data.addComment)
            const newPost = {
                ...postInfo,
                comments: postInfo.comments.concat(result_comment.data.addComment)
            }
            setPostInfo(newPost)
        }
    }, [result_comment.data])

    useEffect(() => {
        if (result_addCommentLikes.data) {
            // console.log(result_addCommentLikes.data.addCommentLikes)
            // console.log(postInfo.comments)
            const newPost = {
                ...postInfo,
                comments: postInfo.comments.map(comment => comment.id === result_addCommentLikes.data.addCommentLikes.id
                    ? {
                        ...comment,
                        likes: result_addCommentLikes.data.addCommentLikes.likes
                    }
                    : comment
                )
            }
            setPostInfo(newPost)
        }
    }, [result_addCommentLikes.data])

    useEffect(() => {
        if (result_removeCommentLikes.data) {
            // console.log(postInfo.comments)
            // console.log(result_removeCommentLikes.data.removeCommentLikes)
            const newPost = {
                ...postInfo,
                comments: postInfo.comments.map(comment => comment.id === result_removeCommentLikes.data.removeCommentLikes.id
                    ? {
                        ...comment,
                        likes: result_removeCommentLikes.data.removeCommentLikes.likes
                    }
                    : comment
                )
            }
            setPostInfo(newPost)
        }
    }, [result_removeCommentLikes.data])


    return(
        <div style={postShow ? showWhenVisible : hideWhenVisible}>
            {postInfo
                ? <div>
                    {postInfo.comments.map(comment => 
                        <div key={comment.id} >
                            <div className='postComment'>
                                {/* Display Avatar */}
                                <div>
                                    <Link to={`/user/${comment.user.id}`}>
                                        <img src={comment.user.avatar} alt={`avatar not display ${comment.id}`} width="30px" height="30px" className='avatar-img-main'/>
                                    </Link>
                                </div>

                                {/* Display Main section */}
                                <div>
                                    <p><b>{comment.user.username}</b></p>
                                    <p className='post-content'>{comment.content}</p>
                                    <p>{new Date(parseInt(comment.updated)).toLocaleString()}</p>

                                    {comment.childComments.length === 0
                                        ? <div></div>
                                        : <small onClick={() => handleChildCommentShow(comment.id)}> <b>Show {comment.childComments.length} comments</b> </small>
                                    }
                                </div>

                                {/* Display Reply &&& Likes */}
                                <div className="postComment-reply-likes">
                                    <button style={comment.likes.find(user => user.id === userID) ? styleHeartRed : styleHeartBlack} onClick={() => handleCommentLikes(comment)}>
                                        <i className="far fa-heart fa-1x"></i>
                                        <b>{comment.likes.length}</b>
                                    </button>
                                    <button style={style} onClick={() => handleReplyShow(comment.id, comment.user.id)}>Reply</button>
                                </div>
                            </div>

                            <PostChildComment 
                                comment={comment} 
                                postInfo={postInfo}
                                style={style}
                                userID={userID}
                                styleHeartRed={styleHeartRed}
                                styleHeartBlack={styleHeartBlack}
                                childCommentVisible={childCommentVisible}
                                hideWhenVisible={hideWhenVisible}
                                showWhenVisible={showWhenVisible} 
                                setPostInfo={setPostInfo}
                                handleReplyShow={handleReplyShow}
                            />
                        </div>
                    )}

                    <form  className="comment-form m-5" onSubmit={handleAddComment}>
                        <input type='hidden' name='post_id' value={postInfo.id} />
                        <input type='text' name='content' />
                        <button style={style} type='submit'>
                            <i className="fas fa-share fa-2x"></i>
                        </button>
                    </form>
                </div>
                : <div>Loading...</div>
            }
        </div>
    )
}



export default PostComment