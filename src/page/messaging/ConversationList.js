import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
        <div className="conversation-list-container">
            <h1>All Conversations</h1>
            <ul className="conversation-list">
                {conversations.map(conversation => (
                    <li key={conversation.id} className="conversation-item">
                        <Link to={`/conversations/${userId}/${conversation.id}`} className="conversation-link">
                            <div className="conversation-icon"></div> {/* Circle icon */}
                            <div className="conversation-info">
                                <div className="conversation-header">
                                    <p>{conversation.name}</p>
                                    {/* Add timestamp here if available */}
                                </div>
                                <p className="conversation-message">{conversation.latest_message}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConversationsPage;
