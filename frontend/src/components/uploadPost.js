import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { gql, useMutation } from '@apollo/client'
import axios from 'axios'
import Filter from './filter'



const S3_PRE_SIGN = gql`
mutation s3PreSign($key: String!, $type: String!) {
    s3PreSign(
        key: $key
        type: $type
    ) {
        url
    }
}`



const Upload = ({ handleClose, show, userID, addPost }) => {
    const [ s3PreSign, result_url ] = useMutation(S3_PRE_SIGN)

    const [ file, setFile ] = useState(null)
    const [ title, setTitle ] = useState(null)

    const handleImagePreview = (event) => {
        setFile(event.target.files[0])
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const key = file.name
        const type = file.type

        setTitle(event.target.title.value)

        s3PreSign({ variables: { key, type } })

        event.target.title.value = ''
    }

    useEffect(() => {
        if (result_url.data) {
            const url = result_url.data.s3PreSign.url
      
            axios
                .put(url, file, {headers: {
                    "Content-Type": file.type
                }
            })
                .then(result => {
                    const url = `https://daisy-ins.s3.amazonaws.com/${file.name}`
                    const user = userID

                    addPost({ variables: { url, title, user } })
                })
                .catch(error => console.log(error))
        }
    }, [addPost, title, userID, file, result_url.data])
    

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Post</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <input 
                            type='file' 
                            name='image'
                            id="imageLoader"
                            onChange={handleImagePreview} 
                        />
                        
                        <br/><br/><br/>

                        <Filter file={file} setFile={setFile} />
                        
                        <textarea type='text' name='title' placeholder='Your comment within 200 words...'></textarea>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button className='btn btn-primary' type='submit' variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}



export default Upload