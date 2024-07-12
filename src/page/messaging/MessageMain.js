import React from 'react';
import MessageComponent from './MessageComponent';
import MessageForm from './MessageForm';
import { useLocation, useParams } from 'react-router-dom';
import './message.css'; // Import CSS file for styling
import axios from 'axios';

const MessageMain = () => {
    const sender_id = localStorage.getItem('userId');
    const user_id = localStorage.getItem('userId');
    const { houseId } = useParams();
    const { state } = useLocation();
    const ownerId = state?.ownerId;
    const apiURL = process.env.REACT_APP_XANN_API;

    const handleSubmitMessage = async (content) => {
        try {
            // await axios.post(`http://127.0.0.1:8000/api/messages`, {
            await axios.post(`${apiURL}/api/messages`, {
                sender_id: sender_id,
                recipient_id: ownerId,
                content: content
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    return (
        <div className="message-main-container">
            <div className="chat-header">
                <h2>Chatting with Owner: {ownerId}</h2>
                <p>House ID: {houseId}</p>
            </div>
            <div className="chat-body">
                {/* <MessageComponent ownerId={ownerId} senderId={sender_id} /> */}
                <MessageComponent ownerId={ownerId} user_id={user_id} />
            </div>
            <div className="chat-footer">
                {/* <MessageForm ownerId={ownerId} senderId={sender_id} /> */}
                <MessageForm ownerId={ownerId} senderId={sender_id} onSubmitMessage={handleSubmitMessage} />
            </div>
        </div>
    );
};

export default MessageMain;
