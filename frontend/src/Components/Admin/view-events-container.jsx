import React, { useState, useEffect } from "react";
import Modal from "./update-events-modal";
import styles from "../styles/view-events-and-feedbacks.module.css";
import axios from "axios";
import EventUpdateForm from "./EventUpdateForm";

// const dummy_data = [
//   {
//     ID: "A1",
//     Name: "Tung Chung Chai Gathering - Art with Tissue",
//     Location: "City Game",
//     "Start Date": "20 August 2024, 10 PM",
//     "End Date": "20 August 2024, 11PM",
//     "Event Type": "Women",
//     Status: "Available",
//   },
//   {
//     ID: "A2",
//     Name: "SEN Centre Help",
//     Location: "Hong Kong",
//     "Start Date": "10 August 2024",
//     "End Date": "27 December 2024",
//     "Event Type": "Children",
//     Status: "Available",
//   },
//   {
//     ID: "A3",
//     Name: "Chai Gathering for EM Ladies - Potluck Party",
//     Location: "Zubin's Family Centre",
//     "Start Date": "23 August 2024, 10AM",
//     "End Date": "23 August",
//     "Event Type": "Children",
//     Status: "Available",
//   },
//   {
//     ID: "A4",
//     Name: "Tung Chung Chai Gathering - Art with Tissue",
//     Location: "City Game",
//     "Start Date": "20 August 2024, 10 PM",
//     "End Date": "20 August 2024, 11PM",
//     "Event Type": "Women",
//     Status: "Available",
//   },
//   {
//     ID: "A5",
//     Name: "SEN Centre Help",
//     Location: "Hong Kong",
//     "Start Date": "10 August 2024",
//     "End Date": "27 December 2024",
//     "Event Type": "Children",
//     Status: "Available",
//   },
//   {
//     ID: "A6",
//     Name: "Chai Gathering for EM Ladies - Potluck Party",
//     Location: "Zubin's Family Centre",
//     "Start Date": "23 August 2024, 10AM",
//     "End Date": "23 August",
//     "Event Type": "Children",
//     Status: "Available",
//   },
// ];

function Container() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventList, setEventList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/read/events");
      const events = response.data;
      // const today = new Date();
      // const upcomingEvents = events.filter(event => new Date(event.endDate.$date) > today);
      // const pastEvents = events.filter(event => new Date(event.endDate.$date) < today);

      setEventList(events);
      console.log("eventList:", eventList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (event) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/delete/event/${event._id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Event deleted successfully");
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else {
        console.error("Error deleting event:", error.message);
      }
    }
    // // Filter out the event with the specified ID
    // const updatedEvents = eventList.filter((event) => event.ID !== eventID);
    // setEventList(updatedEvents);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className={styles.container}>
        {eventList.length > 0 ? (
          eventList.map((event, i) => (
            <div key={i} className={styles.container_items}>
              <h3>{event.name}</h3>
              <div className={styles.info_container}>
                <div>Location: {event.location}</div>
                <div>Start Date: {event.startDate}</div>
                <div>End Date: {event.endDate}</div>
                <div>Type: {event.eventType}</div>
              </div>
              <div className={styles.button_container}>
                <button
                  className={styles.event_button + " btn"}
                  onClick={() => handleUpdate(event)}
                >
                  Update Event
                </button>
                <button
                  className={styles.event_button + " btn"}
                  onClick={() => handleDelete(event)}
                >
                  Delete Event
                </button>
                {/* {showModal && <Modal event={selectedEvent} />} */}
                {showModal && event === selectedEvent && (
                  <EventUpdateForm
                    data={selectedEvent}
                    setShowModal={setShowModal}
                  />
                )}
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
