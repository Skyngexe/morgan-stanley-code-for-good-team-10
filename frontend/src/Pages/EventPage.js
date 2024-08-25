import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Carousel from '../Components/Events/Carousel';
import TimerCountdown from '../Components/Events/TimerCountdown';
import RSVPForm from '../Components/Events/RsvpForm';
import EventGallery from '../Components/Events/EventGallery';

import Chatbot from '../Components/Chatbot/ChatBot';

function EventPage() {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
  
  return (
    <div className="mt-32 p-4">
      <Carousel />

      <div className="container mx-auto px-8 py-10 mt-10">
        <h2 className="text-6xl font-bold">Welcome to The Zubin Foundation</h2>
        <p className="text-xl mt-4">
          Explore the events that our foundation has to offer. <br></br>Register for upcoming events and stay updated on the latest happenings.
        </p>
      </div>

      <TimerCountdown />
      <div className="container mx-auto px-8 mt-10">
        <EventGallery />

        <h2 className="text-3xl font-bold mt-16 mb-4">Register Here</h2>
        <hr className="mb-2"/>
        <RSVPForm />
        <hr className="mb-6"/>
      </div>

      {/* Chatbot Button */}
      <div className="fixed bottom-4 right-4">
        <button
          className="w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
          onClick={toggleChatbot}
        >
          💬
        </button>
      </div>

      {/* Chatbot Component */}
      {showChatbot && (
        <div className="fixed bottom-20 right-4">
          <Chatbot />
        </div>
      )}
    </div>
  );
}

export default EventPage;