import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisplaySearchHouse = ({ houseId }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHouseDetails = async () => {
            try {
                if (!houseId) {
                    return; // Exit early if houseId is empty
                }
                const response = await axios.get(`http://127.0.0.1:8000/api/find-house/${houseId}`);
                setMessages(response.data); // Access response.data instead of response
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching house details:', error);
                setError(error);
                setIsLoading(false);
            }
        };
        fetchHouseDetails();
    }, [houseId]);

    if (isLoading) {
        return <p></p>; // Consider adding a spinner or animation here
    }
    if (error || !messages.length) {
        return <p>Error fetching house details. Please try again later.</p>; // More user-friendly error message
    }

    return (
        <div className='house-detail-container'>
            <div>Type of House: {messages[0].type_of_house}</div>
            <div>Type of House: {messages[0].type_of_house}</div>
      <div>Description: {messages[0].description}</div>
      <div>Rent Fee: {messages[0].rent_fee}</div>
      <div>Number of Rooms: {messages[0].number_of_rooms}</div>
        </div>
    );
};

export default DisplaySearchHouse;
