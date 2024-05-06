import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './message.css'; // Import CSS file for styling

const MessageComponent = ({ ownerId,user_id }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
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
const sortedMessages = response.data.sort((a, b) => {
    const timestampComparison = new Date(a.timestamp) - new Date(b.timestamp);
    if (timestampComparison !== 0) {
      return timestampComparison;
    } else {
      return a.sequenceNumber - b.sequenceNumber; // Sort by sequence number if timestamps are equal
    }
  });
  

                setMessages(sortedMessages);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setError(error);
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [ownerId, user_id]);
   // console.log("Response:", messages);
    // console.log("House Owner:", ownerId);
    // console.log("My data:", messages[0].sender_id);
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
