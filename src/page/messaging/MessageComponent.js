import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './message.css'; // Import CSS file for styling

const MessageComponent = ({ ownerId,user_id }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
  
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/messages`,
                    {
                        params: {
                            sender_id:user_id,
                            recipient_id: ownerId
                        }
                    }
                );
                // setMessages(response.data);
            // Sort messages by timestamp and then by their order in the array
                const sortedMessages = response.data.sort((a,b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);

                    if(dateA < dateB) {
                        return - 1;
                    }

                    if (dateA > dateB) {
                        return 1;
                    }

                    // return a.sequenceNumber - b.sequenceNumber;
                    return 0;
                });
  

                setMessages(sortedMessages);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setError(error);
                setIsLoading(false);
            }
        };
        useEffect(()=> {
        fetchMessages();
    }, [ownerId, user_id]);
  // console.log("Response:", messages);
    // console.log("House Owner:", ownerId);
    // console.log("My data:", messages[0].sender_id);
    
    const handleSubmitMessage = async (content) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/messages`, {
                sender_id: user_id,
                recipient_id: ownerId,
                content: content
            });
            // Fetch messages again after sending a message
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error || !messages.length) {
        return <p>No chat yet</p>;
    }
   
    return (
<div className="message-container">
    <ul className="message-list">
        {messages.map(message => (
            <li key={message.id} className={message.recipient_id === ownerId ? 'sender' : 'recipient'}>
                <p>{message.content}</p>
            </li>
        ))}
    </ul>
</div>

    );


};

export default MessageComponent;
