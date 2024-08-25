import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import mockEventData from './MockEvent';
import EventCard from '../Events/EventCard';

const EventList = () => {
  const [eventList, setEventList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/read/event");
      const events = response.data;
      const today = new Date();

      const upcomingEvents = events
        .filter((event) => new Date(event.endDate.$date) > today)
        .sort((a, b) => new Date(a.endDate.$date) - new Date(b.endDate.$date));
      const pastEvents = events.filter(
        (event) => new Date(event.endDate.$date) < today
      );

      setEventList(pastEvents);
      console.log("eventList:", eventList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h3 className="text-3xl font-bold text-gray-800 mb-4">
        Your Attended Events
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {eventList.length > 0 ? (
          eventList.map((event, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6">
              <EventCard key={index} event={event} />
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white shadow-md rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Events Available
              </h3>
              <p className="text-gray-600">
                It seems like you haven't attended any events yet. Please check
                back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;