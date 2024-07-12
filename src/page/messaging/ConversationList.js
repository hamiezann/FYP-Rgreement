import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './message.css';

const ConversationsPage = () => {
    const [conversations, setConversations] = useState([]);
    const userId = localStorage.getItem('userId');
    const apiURL = process.env.REACT_APP_XANN_API;
    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            // const response = await axios.get(`http://127.0.0.1:8000/api/conversations?user_id=${userId}`);
            const response = await axios.get(`${apiURL}/api/conversations?user_id=${userId}`);
            console.log('Data',response.data);
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    return (
        <div className="main-container">
            <div className='message-list-header-wrapper'>
            <h3>Messages</h3>
            <i className='fas fa-search'></i>
            </div>
            <div className="list-group conversation-list-container">
                {conversations.map(conversation => (
                    <Link 
                        to={`/conversations/${userId}/${conversation.id}`} 
                        className="list-group-item list-group-item-action conversation-item" 
                        key={conversation.id}
                    >
                        <div className="conversation-icon">
                            {/* {conversation.profile_pic ? (
                                <img src={conversation.profile_pic} alt={`${conversation.name}'s Profile Pic`} />
                            ) : (
                                <span>{conversation.name.charAt(0)}</span>
                            )} */}
                            <span>{conversation.name.charAt(0)}</span>
                        </div>
                        <div className="conversation-info">
                            <div className="conversation-header">
                                <p>{conversation.name}</p>
                                {/* Add timestamp if available */}
                                {conversation.timestamp && (
                                    <small className="timestamp">{conversation.timestamp}</small>
                                )}
                            </div>
                            <p className="conversation-message">{conversation.latest_message}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ConversationsPage;
