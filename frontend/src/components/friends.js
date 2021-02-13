import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { gql, useMutation, useSubscription } from '@apollo/client'
import Notification from './notification'



const POST_MESSAGE = gql`
mutation postMessage($username: String, $content: String!, $channel_name: String!, $created_at: String) {
    postMessage(
        username: $username,
        content: $content,
        channel_name: $channel_name,
        created_at: $created_at
    ) {
        id
        username
        content
        channel_name
        created_at
    }
}`

const POST_MESSAGE_SUB = gql`
subscription postMessage($channel_name: String!) {
    postMessage(
        channel_name: $channel_name
    ) {
        id
        username
        content
        channel_name
        created_at
    }
}
`



const Friends = ({ error, success, setError, setSuccess }) => {
    const user = useSelector(state => state.user)
    const [ channelSent, SetChannelSent ] = useState(null)
    const [ channelReceived, setChannelReceived ] = useState(null)
    const [ chatHistory, setChatHistory ] = useState([])

    const [ postMessage ] = useMutation(POST_MESSAGE)

    useSubscription(POST_MESSAGE_SUB, {
        variables: { channel_name:channelReceived },
        onSubscriptionData: ({ subscriptionData }) => {
            console.log(subscriptionData.data.postMessage.username)
            setChatHistory(chatHistory.concat(subscriptionData.data.postMessage))
            if (channelSent !== subscriptionData.data.postMessage.username) {
                setSuccess(`You received message from ${subscriptionData.data.postMessage.username}`)
                setTimeout(() => setSuccess(null), 3000)
            }
        }
    })


    const handleSubmit = async (event) => {
        event.preventDefault()

        const username = channelReceived
        const content = event.target.chat.value
        const channel_name = channelSent
        const created_at = new Date()

        try {
            await postMessage({ variables: { username, content, channel_name, created_at } })
        } catch (error) {
            setError(error.message)
            setTimeout(() => setError(null), 3000)
        }
        
        setChatHistory(chatHistory.concat({ username, content, channel_name, created_at }))

        event.target.chat.value= ''
    }


    const handleChannelName = (friendname) => {
        SetChannelSent(friendname)
        setChatHistory([])
    }


    useEffect(() => {
        if (user) {
            setChannelReceived(user.username)
        }
    }, [user])

    // console.log(channelSent, channelReceived)
    // console.log(chatHistory)
    // console.log(user)
    // Channel Name: Username
    return (
        <div className="container">
            {user === null
                ? <Link to="/">Go back Home</Link>
                : <div id="friends-grid">
                    <div>
                        <h3> Friend Lists </h3>

                        <ul className='navbar-ul mt-5'>
                            {user.friends.map(friend => 
                                <button key={friend.id} onClick={() => handleChannelName(friend.username)}>
                                    <li>
                                        <img 
                                            src={user.avatar} 
                                            alt={user.id} 
                                            width="50" 
                                            height="50" 
                                            className='avatar-img-main mr-2'
                                        />

                                        {friend.username}
                                    </li>
                                </button>
                            )}
                        </ul>
                    </div>

                    <div>
                        <Notification 
                            error={error}
                            success={success}
                        />

                        <div className='chatRoom'>
                            {chatHistory.filter(chatMes => chatMes.username === channelSent || chatMes.channel_name === channelSent).map((chatMes, index)=> 
                                <div key={index} className='chat-total'>
                                    {chatMes.username === user.username
                                        ? <ul className="chat-left">
                                            <li className='chat-li-left'> 
                                                <p className='chat-me'> Me </p> 
                                                <p className='text-left'>{chatMes.content}</p>
                                            </li>
                                        </ul>
                                        :  <ul className="chat-right">
                                            <li className='chat-li-right'> 
                                                <p className='text-right'>{chatMes.content}</p>
                                                <p className='chat-mate'> {chatMes.username} </p> 
                                            </li>
                                        </ul>
                                    }
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} id="chat-form">
                            <input type="text" name='chat' />
                            <button type='submit'> Enter </button>
                        </form>
                    </div>
                </div> 
            }
        </div>
    )
}



export default Friends