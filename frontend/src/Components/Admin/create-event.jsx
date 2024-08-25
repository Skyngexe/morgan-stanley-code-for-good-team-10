import { useState } from "react";
import styles from "../styles/create-event.module.css";
import axios from "axios";
import EventCreateForm from "./EventCreateForm";

const default_values = {
  name: "",
  descriptions: "",
  imageURL: null,
  startDate: "",
  endDate: "",
  volunteer_Quota: "",
  participant_Quota: "",
  eventType: "",
  videoURL: "",
  status: "new",
  location: "",
  fee: "free",
  registrationURL: "",
  form_Id: "",
  registered_participants: [],
  attended_participants: [],
};

const CreateEvent = () => {
  /* 
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [createdEvents, setCreatedEvents] = useState([]);

  const EventNameUpdate = (event) => {
    setEventName(event.target.value);
  };

  const StartDateUpdate = (event) => {
    setStartDate(event.target.value);
  };

  const EndDateUpdate = (event) => {
    setEndDate(event.target.value);
  };

  const StartTimeUpdate = (event) => {
    setStartTime(event.target.value);
  };

  const EndTimeUpdate = (event) => {
    setEndTime(event.target.value);
  };

  const EventTypeUpdate = (event) => {
    setEventType(event.target.value);
  };

  const EventStatusUpdate = (event) => {
    setEventStatus(event.target.value);
  }; 

  const CreateEvent = () => {
    const newEvent = {
      id: new Date().getTime(),
      name: eventName,
      startDate,
      endDate,
      startTime,
      endTime,
      eventType,
      eventStatus,
    };
    setCreatedEvents([...createdEvents, newEvent]);
  }; 
  */

  return (
    <div className={styles.app}>
      <h1>Create Event</h1>
      {/* <div className={styles.form_container}>
        <div className={styles.event_form}>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={EventNameUpdate}
          />
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={StartDateUpdate}
          />
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={EndDateUpdate}
          />
          <input
            type="time"
            placeholder="Start Time"
            value={startTime}
            onChange={StartTimeUpdate}
          />
          <input
            type="time"
            placeholder="End Time"
            value={endTime}
            onChange={EndTimeUpdate}
          />
          <input
            type="text"
            placeholder="Event Type"
            value={eventType}
            onChange={EventTypeUpdate}
          />
          <input
            type="text"
            placeholder="Event Status"
            value={eventStatus}
            onChange={EventStatusUpdate}
          />
          <button className="create-btn" onClick={CreateEvent}>
            Create Event
          </button>
        </div>
      </div> */}
      <EventCreateForm data={default_values} />
    </div>
  );
};

export default CreateEvent;
