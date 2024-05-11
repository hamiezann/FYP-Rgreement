import React, { useState, useEffect } from 'react';
import { useLocation,useParams } from 'react-router-dom';
import axios from 'axios';
import './message.css'; // Import CSS file for styling
import RenterComponent from './RenterComponent';
import RenterForm from './RenterForm';


const ConversationPage = () => {
    const { senderId, recipientId } = useParams();
    const [messages, setMessages] = useState([]);
    const { state } = useLocation();
    const ownerId = state?.ownerId;

    // useEffect(() => {
    //     fetchMessages();
    // }, []);

    // const fetchMessages = async () => {
    //     try {
    //         const response = await axios.get(`http://127.0.0.1:8000/api/conversations/${senderId}/${recipientId}`);
    //         setMessages(response.data);
    //     } catch (error) {
    //         console.error('Error fetching messages:', error);
    //     }
    // };

    const handleSubmitMessage = async (content) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/messages`, {
                sender_id: senderId,
                recipient_id: recipientId,
                content: content
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    // console.log("SenderID:" , senderId);
    // console.log("RecipientID:" , recipientId);
    return (
        <div className="message-main-container">
            <div className='chat-header'>
            <h1>Chatting with User: {senderId === localStorage.getItem('userId') ? recipientId : senderId}</h1>
            </div>
            <div className="chat-body">
                <RenterComponent ownerId={recipientId} user_id={senderId} />
            </div>
            <div className='chat-footer'>
                <RenterForm ownerId={recipientId} senderId={senderId} onSubmitMessage={handleSubmitMessage} />
            </div>
            {/* <ul>
                {messages.map(message => (
                    <li key={message.id}>
                        <p>{message.content}</p>
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default ConversationPage;
