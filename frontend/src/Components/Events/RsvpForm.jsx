import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Link } from '@mui/material';


function RSVPForm({ upcomingEvents }) {
  
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
  
  const [formData, setFormData] = useState({
    event: '',       // Initially no event is selected
    registrationURL: '' // This will hold the registration URL of the selected event
  });

  function handleChange(event) {
    const selectedEventName = event.target.value;
    const selectedEvent = eventDataList.find(e => e.name === selectedEventName);
    if (selectedEvent) {
      setFormData({
        ...formData,
        event: selectedEventName,
        registrationURL: selectedEvent.registrationURL 
      });
    }
  }

  return (
    <div className="container mx-auto px-8 py-5 mt-10 mb-16">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className='text-2xl font-bold text-blue text-center py-4'>
          RSVP
        </div>
        <form>
          <div className="flex flex-col">
            <label htmlFor="event" className="mb-2 text-xl">Select Event</label>
            <select
              id="event"
              name="event"
              value={formData.event}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            >
              {eventDataList.map((event, index) => (
                <option key={index} value={event.name}>{event.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col mt-4 bg-white p-6 rounded-lg">
            {formData.registrationURL && (
              <div>
                <Link href={formData.registrationURL} target="_blank" rel="noopener noreferrer">
                  <Button variant="contained" className="text-yellow uppercase">
                    {formData.eventName} Register Here!
                  </Button>
                </Link>
              </div>
            )}
           </div>
        </form>

      </div>

    </div>
  );
}

export default RSVPForm;
