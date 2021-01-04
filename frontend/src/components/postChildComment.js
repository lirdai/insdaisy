import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import { useMutation } from '@apollo/client'
import {
    ADD_CHILD_COMMENT_LIKES,
    REMOVE_CHILD_COMMENT_LIKES
} from './queries'



const PostChildComment = ({ 
    comment, 
    userID,  
    style, 
    styleHeartRed, 
    styleHeartBlack,
    childCommentVisible,
    hideWhenVisible,
    showWhenVisible,
    postInfo,
    setPostInfo,
    handleReplyShow
}) => {
    // console.log(comment)
    const [ addChildCommentLikes, result_addChildCommentLikes ] = useMutation(ADD_CHILD_COMMENT_LIKES)
    const [ removeChildCommentLikes, result_removeChildCommentLikes ] = useMutation(REMOVE_CHILD_COMMENT_LIKES)

    const handleChildCommentLikes = (child) => {
        const childComment_find = child.likes.find(user => user.id === userID)
        const likes = child.likes.map(user => user.id)
        if (childComment_find) {
            removeChildCommentLikes({ variables: { id:child.id, likes:likes.filter(id => id !== userID) } })
        } else {
            addChildCommentLikes({ variables: { id:child.id, likes:likes.concat(userID) } })
        }
    }

    useEffect(() => {
        if (result_addChildCommentLikes.data) {
            // console.log(result_addChildCommentLikes.data.addChildCommentLikes)
            const newPost = {
                ...postInfo,
                comments: postInfo.comments.map(comment => comment.id === result_addChildCommentLikes.data.addChildCommentLikes.parentComment.id
                    ? {
                        ...comment,
                        childComments: comment.childComments.map(child => child.id === result_addChildCommentLikes.data.addChildCommentLikes.id
                            ? {
                                ...child,
                                likes: result_addChildCommentLikes.data.addChildCommentLikes.likes
                            }
                            : child
                        )
                    }
                    : comment
                )
            }
            setPostInfo(newPost)
        }
    }, [result_addChildCommentLikes.data])

    useEffect(() => {
        if (result_removeChildCommentLikes.data) {
            // console.log(result_removeChildCommentLikes.data.removeChildCommentLikes)
            const newPost = {
                ...postInfo,
                comments: postInfo.comments.map(comment => comment.id === result_removeChildCommentLikes.data.removeChildCommentLikes.parentComment.id
                    ? {
                        ...comment,
                        childComments: comment.childComments.map(child => child.id === result_removeChildCommentLikes.data.removeChildCommentLikes.id
                            ? {
                                ...child,
                                likes: result_removeChildCommentLikes.data.removeChildCommentLikes.likes
                            }
                            : child
                        )
                    }
                    : comment
                )
            }
            setPostInfo(newPost)
        }
    }, [result_removeChildCommentLikes.data])

    return (
        <div style={childCommentVisible[comment.id] ? showWhenVisible : hideWhenVisible}>
            {comment.childComments.map(child => 
                <div key={child.id} className='postComment'>
                    {/* Display Avatar */}
                    <div>
                        <Link to={`/user/${child.user.id}`}>
                            <img src={child.user.avatar} alt={`avatar not display ${child.id}`} width="30px" height="30px" className='avatar-img-main' />
                        </Link>
                    </div>

                    {/* Display Main section */}
                    <div>
                        <p>
                            <b>
                                {child.user.username}
                                <i className="fas fa-arrow-right mx-3"></i>
                                {child.replyTo.username}
                            </b>
                        </p>
                        <p>{child.content}</p>
                        <p>{new Date(parseInt(child.updated)).toLocaleString()}</p>
                    </div>

                    {/* Display Reply &&& Likes */}        
                    <div className="postComment-reply-likes">
                        <button style={child.likes.find(user => user.id === userID) ? styleHeartRed : styleHeartBlack} onClick={() => handleChildCommentLikes(child)}>
                            <i className="far fa-heart fa-1x"></i>
                            <b>{child.likes.length}</b>
                        </button>
                        <button style={style} onClick={() => handleReplyShow(comment.id, child.user.id)}>Reply</button>
                    </div>
                </div>
            )} 
        </div>
    )
}



export default PostChildComment