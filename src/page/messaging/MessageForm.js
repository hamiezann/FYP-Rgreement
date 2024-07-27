import React, { useState } from 'react';




const MessageForm = ({ownerId, senderId, onSubmitMessage}) => {
    const [content, setContent] = useState('');
    const recipient_id = ownerId;
    const sender_id = senderId;
   // console.log("Recipient_id:", recipient_id);
   

    const handleSubmit = async event => {
        event.preventDefault();

        try {
           
            // await axios.post(`http://127.0.0.1:8000/api/messages`, { 
            //     sender_id: sender_id,
            //     recipient_id: recipient_id,
            //     content: content
            // } );
            await onSubmitMessage(content);

            setContent('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleEnterWasPressed = event => {
        if((event.keyCode === 13 || event.key === 'Enter') && !event.shiftKey){
            event.preventDefault();
            handleSubmit(event);
        }
    };

    return (
        <form className='chat-form' onSubmit={handleSubmit}>
            <textarea
            className='chat-input-form'
                value={content}
                onChange={event => setContent(event.target.value)}
                onKeyDown={handleEnterWasPressed}
                placeholder="Type your message here..."
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageForm;
