import React, { useState } from 'react';
import axios from 'axios';



const MessageForm = ({ownerId, senderId}) => {
    const [content, setContent] = useState('');
    const recipient_id = ownerId;
    const sender_id = senderId;
    console.log("Recipient_id:", recipient_id);
   

    const handleSubmit = async event => {
        event.preventDefault();

        try {
           // await axios.post('/api/messages', { content });
            await axios.post(`http://127.0.0.1:8000/api/messages`, { 
                sender_id: sender_id,
                recipient_id: recipient_id,
                content: content
            } );

            setContent('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={event => setContent(event.target.value)}
                placeholder="Type your message here..."
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageForm;
