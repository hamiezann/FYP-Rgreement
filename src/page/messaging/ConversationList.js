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
            <h1 className="mb-4 text-center">All Conversations</h1>
            <div className="list-group">
                {conversations.map(conversation => (
                    <Link to={`/conversations/${userId}/${conversation.id}`} className="list-group-item list-group-item-action d-flex align-items-center" key={conversation.id}>
                        <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3" style={{ width: '50px', height: '50px' }}>
                            <span className="h5 mb-0">{conversation.name.charAt(0)}</span> {/* Display first letter of the name */}
                        </div>
                        <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                                <h5 className="mb-1">{conversation.name}</h5>
                                {/* Add timestamp here if available */}
                            </div>
                            <p className="mb-1">{conversation.latest_message}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ConversationsPage;
