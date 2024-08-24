import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Carousel from '../Components/Events/Carousel';
import TimerCountdown from '../Components/Events/TimerCountdown';
import RSVPForm from '../Components/Events/RsvpForm';
import EventGallery from '../Components/Events/EventGallery';

function EventPage() {
  return (
    <div className="mt-32 p-4">
      <Carousel />

      <div className="container mx-auto px-8 py-10 mt-10">
        <h2 className="text-6xl">Welcome to The Zubin Foundation</h2>
        <p className="text-xl mt-4">
          Explore the events that our foundation has to offer. <br></br>Register for upcoming events and stay updated on the latest happenings.
        </p>
        <hr className="m-6"/>
      </div>

      <TimerCountdown />
      <div className="container mx-auto px-8 mt-10">
        <EventGallery />

        <h2 className="text-3xl font-light mt-16 mb-4">Register Here</h2>
        <hr className="mb-2"/>
        <RSVPForm />
        <hr className="mb-6"/>
      </div>
    </div>
  );
}

export default EventPage;