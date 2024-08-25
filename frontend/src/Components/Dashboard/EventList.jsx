import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import mockEventData from './MockEvent';
import EventCard from '../Events/EventCard';

const EventList = () => {
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const events = mockEventData;
      console.log(events);
      setEventList(events);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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