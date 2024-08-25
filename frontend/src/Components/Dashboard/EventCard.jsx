import React from 'react';

const Card = ({ event }) => {
  return (
    <div className="event-card transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <a href={event.url} target="_blank" rel="noopener noreferrer">
        <div className="event-card-content p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
          <p className="text-gray-600 mb-4">{event.endDate.$date}</p>
          <p className="text-gray-600">{event.description}</p>
        </div>
      </a>
    </div>
  );
};

export default Card;