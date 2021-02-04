import React from 'react'
import { Button, Modal } from 'react-bootstrap'



const Reply = ({ 
    show, 
    handleClose, 
    userID, 
    addChildComment, 
    comment_id, 
    reply_user,
    setError,
    setSuccess
}) => {
    const handleSubmit = async (event) => {
        event.preventDefault()

        const content = event.target.childComment.value
        const user = userID
        const parentComment = comment_id
        const replyTo = reply_user

        try {
            await addChildComment({ variables: { content, user, parentComment, replyTo } })
            setSuccess("Comment Added!")
            setTimeout(() => setSuccess(null), 3000)
        } catch(error) {
            setError(error.message)
            setTimeout(() => setError(null), 3000)
        }
        
        event.target.childComment.value = ''
    }


    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <form  onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reply Here</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <textarea type='text' name='childComment' placeholder='Your comment within 50 letters...'></textarea>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button type='submit' variant="primary" onClick={handleClose}>Save Changes</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}



export default Reply