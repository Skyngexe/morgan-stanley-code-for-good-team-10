import React from 'react';

const Card = ({ video }) => {
  const handleClick = () => {
    
    window.location.href = video.link;
    
  };

  return (
    <div onClick={handleClick}>
      <h3>{video.title}</h3>
      <p>{video.description}</p>
    </div>
  );
};

export default Card;