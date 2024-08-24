import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import EventCard from './EventCard'; 

function EventGallery(data) {
  const [eventDataList, setEventDataList] = useState([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState([]);
  const [pastEventsList, setPastEventsList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/eventdata');
      const events = response.data;
      const today = new Date();

      const upcomingEvents = events.filter(event => new Date(event.startDate) > today);
      const pastEvents = events.filter(event => new Date(event.endDate) < today);

      setEventDataList(events);
      setUpcomingEventsList(upcomingEvents);
      setPastEventsList(pastEvents);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

return (
    <Container maxWidth="xl">
        <div className='mb-10'>
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <hr className="mb-6"/>
            {upcomingEventsList && upcomingEventsList.length > 0 ? (
                <div className="grid grid-cols-4 gap-6">
                    {upcomingEventsList.slice(0, 4).map((event, index) => (
                        <EventCard key={index} event={event} />
                    ))}
                </div>
            ) : (
                <div>No events found.</div>
            )}

        </div>
        <div>
            <h2 className="text-3xl font-bold mb-4">Past Events</h2>
            <hr className="mb-6"/>
            {pastEventsList && pastEventsList.length > 0 ? (
                <div className="grid grid-cols-4 gap-6">
                    {pastEventsList.slice(0, 4).map((event, index) => (
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