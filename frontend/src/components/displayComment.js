import React from 'react'
import DisplayChildComment from './displayChildComment'
import { Link } from "react-router-dom"



const DisplayComment = ({ 
    post, 
    userID, 
    postsAll,
    setPostsAll,
    setReplyShow, 
    setCommentID, 
    setReplyUser,
    setChildCommentVisible,
    removeCommentLikes, 
    addCommentLikes, 
    addComment, 
    commentVisible, 
    childCommentVisible,
    style, 
    styleHeartRed, 
    styleHeartBlack
}) => {
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

    const handleReplyShow = (comment_id, user_id) => {
        setReplyShow(true)
        setCommentID(comment_id)
        setReplyUser(user_id)
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

    const handleAddComment = (event) => {
        event.preventDefault()

        const content = event.target.content.value
        const postID = event.target.post_id.value

        addComment({ variables: { content: content, user: userID, post: postID } })

        event.target.content.value = ''
    }

    const hideWhenVisible = { display: 'none'}
    const showWhenVisible = { display: ''}

    return (
        <div>
            {/* Display Comment */}
            <div style={commentVisible[post.id] ? showWhenVisible : hideWhenVisible}>
                {post.comments.map(comment => 
                    <div key={comment.id} className="post-comment">
                        <div>
                            <Link to={`/user/${comment.user.id}`}>
                                <img src={comment.user.avatar} alt={`avatar not display ${comment.id}`} width="30px" height="30px" className='avatar-img-main'/>
                            </Link>
                        </div>
                        
                        <div>
                            <p><b>{comment.user.username}</b></p>
                            <p>{comment.content}</p>

                            <div>
                                <div className='comment-date-reply'>
                                    <p>{new Date(parseInt(comment.updated)).toLocaleString()}</p>
                                    <button style={style} onClick={() => handleReplyShow(comment.id, comment.user.id)}>Reply</button>
                                </div>

                                {comment.childComments.length === 0
                                    ? <div></div>
                                    : <small onClick={() => handleChildCommentShow(comment.id)}> <b>Show {comment.childComments.length} comments</b> </small>
                                }
                        
                                <DisplayChildComment 
                                    childCommentVisible={childCommentVisible}
                                    showWhenVisible={showWhenVisible}
                                    hideWhenVisible={hideWhenVisible}
                                    comment={comment}
                                    style={style}
                                    userID={userID}
                                    postsAll={postsAll}
                                    setPostsAll={setPostsAll}
                                    styleHeartRed={styleHeartRed}
                                    styleHeartBlack={styleHeartBlack}
                                    handleReplyShow={handleReplyShow}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <button style={comment.likes.find(user => user.id === userID) ? styleHeartRed : styleHeartBlack} onClick={() => handleCommentLikes(comment)}>
                                <i className="far fa-heart fa-1x"></i>
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
    )
}



export default DisplayComment