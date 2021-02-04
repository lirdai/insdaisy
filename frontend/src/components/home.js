import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { useApolloClient } from '@apollo/client'
import DisplayPost from './displayPost'
import Notification from './notification'



const Home = ({ 
    token, 
    setToken, 
    userID, 
    username,
    error,
    success,
    setError,
    setSuccess,
}) => {
    // useState
    const [ uploadShow, setUploadShow ] = useState(false)
    const handleUploadClose = () => setUploadShow(false)
    const handleUploadShow = () => setUploadShow(true)

    const [ replyShow, setReplyShow ] = useState(false)
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
    

    // Style
    const styleBorder = {
        border: 'none'
    }


    return (
        <div className='home'>
            {/* Navbar  +++  Footer*/}
            <div>
                <div className='navbar'>
                    <div className='nav-user'>
                        {token === null
                            ? <h4 className='welcome'><i>Welcome</i></h4>
                            : <Link to={`/user/${userID}`}><h4><i>{username}</i></h4></Link>
                        }
                    </div>

                    <div className='nav-post'>
                        {token === null
                            ? null
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
                <Notification error={error} success={success} />
                <DisplayPost 
                    userID={userID}
                    setReplyShow={setReplyShow}
                    handleUploadClose={handleUploadClose}
                    uploadShow={uploadShow}
                    handleReplyClose={handleReplyClose}
                    replyShow={replyShow}
                    error={error}
                    success={success}
                    setError={setError}
                    setSuccess={setSuccess}
                />
            </div>
        </div>
    )
}



export default Home