import React, { useState } from "react";
import Modal from "./update-events-modal";

function Container() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventList, setEventList] = useState([
    {
      ID: "A1",
      Name: "Tung Chung Chai Gathering - Art with Tissue",
      Location: "City Game",
      "Start Date": "20 August 2024, 10 PM",
      "End Date": "20 August 2024, 11PM",
      "Event Type": "Women",
      Status: "Available",
    },
    {
      ID: "A2",
      Name: "SEN Centre Help",
      Location: "Hong Kong",
      "Start Date": "10 August 2024",
      "End Date": "27 December 2024",
      "Event Type": "Children",
      Status: "Available",
    },
    {
      ID: "A3",
      Name: "Chai Gathering for EM Ladies - Potluck Party",
      Location: "Zubin's Family Centre",
      "Start Date": "23 August 2024, 10AM",
      "End Date": "23 August",
      "Event Type": "Children",
      Status: "Available",
    },
    {
      ID: "A4",
      Name: "Tung Chung Chai Gathering - Art with Tissue",
      Location: "City Game",
      "Start Date": "20 August 2024, 10 PM",
      "End Date": "20 August 2024, 11PM",
      "Event Type": "Women",
      Status: "Available",
    },
    {
      ID: "A5",
      Name: "SEN Centre Help",
      Location: "Hong Kong",
      "Start Date": "10 August 2024",
      "End Date": "27 December 2024",
      "Event Type": "Children",
      Status: "Available",
    },
    {
      ID: "A6",
      Name: "Chai Gathering for EM Ladies - Potluck Party",
      Location: "Zubin's Family Centre",
      "Start Date": "23 August 2024, 10AM",
      "End Date": "23 August",
      "Event Type": "Children",
      Status: "Available",
    },
  ]);

  const handleUpdate = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDelete = (eventID) => {
    // Filter out the event with the specified ID
    const updatedEvents = eventList.filter((event) => event.ID !== eventID);
    setEventList(updatedEvents);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="container">
        {eventList.length > 0 ? (
          eventList.map((event) => (
            <div key={event.ID} className="container-items">
              <h3>{event.Name}</h3>
              <div className="info-container">
                <div>Location: {event.Location}</div>
                <div>Start Date: {event["Start Date"]}</div>
                <div>End Date: {event["End Date"]}</div>
                <div>Type: {event["Event Type"]}</div>
              </div>
              <div className="button-container">
                <button
                  className="event-button"
                  onClick={() => handleUpdate(event)}
                >
                  Update Event
                </button>
                <button
                  className="event-button"
                  onClick={() => handleDelete(event.ID)}
                >
                  Delete Event
                </button>
                {showModal && <Modal event={selectedEvent} />}
              </div>
            </div>
          ))
        ) : (
          <p>No Events</p>
        )}
      </div>
    </div>
  );
}

export default Container;
