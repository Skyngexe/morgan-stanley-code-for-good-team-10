import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import EventCard from './EventCard'; 

function EventGallery() {
  const [eventDataList, setEventDataList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/events');
      console.log(response.data);
      setEventDataList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

return (
    <Container maxWidth="xl">
        <div>
            <h2 className="text-3xl font-light mb-4">Upcoming Events</h2>
            <hr className="mb-6"/>
            {eventDataList && eventDataList.length > 0 ? (
                <div className="grid grid-cols-4 gap-6">
                    {eventDataList.map((event, index) => (
                        <EventCard key={index} event={event} />
                    ))}
                </div>
            ) : (
                <div>No events found.</div>
            )}

        </div>
    </Container>
);
}

export default EventGallery;