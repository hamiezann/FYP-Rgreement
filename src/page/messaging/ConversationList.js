import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './message.css';

const ConversationsPage = () => {
    const [conversations, setConversations] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/conversations?user_id=${userId}`);
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center text-primary">All Conversations</h1>
            <div className="list-group conversation-list-container">
                {conversations.map(conversation => (
                    <Link 
                        to={`/conversations/${userId}/${conversation.id}`} 
                        className="list-group-item list-group-item-action conversation-item" 
                        key={conversation.id}
                    >
                        <div className="conversation-icon">
                            <span>{conversation.name.charAt(0)}</span> {/* Display first letter of the name */}
                        </div>
                        <div className="conversation-info">
                            <div className="conversation-header">
                                <p>{conversation.name}</p>
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
