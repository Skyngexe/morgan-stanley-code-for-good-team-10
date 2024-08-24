import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Carousel() {
  // Need to connect with DB (if any)
  const events = [
    {
      title: "2021 Zubin Foundation Conference",
      description: "Heartwarming gathering of the Zubin foundation",
      image: "https://www.zubinfoundation.org/wp-content/uploads/2023/05/Conference-2021-1-2.png",
    },
    {
      title: "2022 Zubin Foundation Conference",
      description: "Heartwarming gathering of the Zubin foundation",
      image: "https://d2yy7txqjmdbsq.cloudfront.net/nonprofits/05da5a45-cbcb-4e08-8bb8-2f2f5784583c/3031/gal__DSC1265.JPG",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  return (
    <div className="relative w-3/4 mx-auto h-[600px]">
      {events.map((event, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={event.image} alt={event.title} className="object-cover w-full h-full rounded-xl" />
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg">
            <h1 className="text-lg font-bold text-white">{event.title}</h1>
            <p className="text-white">{event.description}</p>
          </div>
        </div>
      ))}
      <button
        className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white text-2xl p-2"
        onClick={handlePrev}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button
        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white text-2xl p-2"
        onClick={handleNext}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}

export default Carousel;
