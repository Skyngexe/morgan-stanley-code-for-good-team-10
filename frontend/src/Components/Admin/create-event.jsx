import { useState } from "react";
import styles from "../styles/create-event.module.css";
import axios from "axios";

function EventCreateForm() {
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/create/event",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="rounded shadow-xl p-4">
      <form className="text-left w-full" onSubmit={handleSubmit}>
        <label className="flex items-start justify-between">
          <span className="min-w-32">Event Name:</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-sm input-bordered max-w-xl"
            required
          />
        </label>
        <label className="flex items-start justify-between">
          <span className="min-w-32">Description:</span>
          <input
            type="text"
            name="descriptions"
            value={formData.descriptions}
            onChange={handleChange}
            className="input input-sm input-bordered max-w-xl"
            required
          />
        </label>
        <label className="flex items-start justify-between">
          <span className="min-w-32">Image:</span>
          <input
            type="file"
            name="imageURL"
            // value={formData.imageURL}
            onChange={handleChange}
            className="max-w-xl"
          />
        </label>
        <label className="flex items-start justify-between">
          <span className="min-w-32">Location:</span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input input-sm input-bordered max-w-xl"
            required
          />
        </label>
        <label className="flex items-start justify-between">
          <span className="min-w-32">Event Type:</span>
          <input
            type="text"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="input input-sm input-bordered max-w-xl"
            required
          />
        </label>
        <label className="flex items-start justify-between">
          <span className="min-w-32">Volunteer Quota:</span>
          <input
            type="number"
            name="volunteer_Quota"
            value={formData.volunteer_Quota}
            onChange={handleChange}
            className="input input-sm input-bordered max-w-xl"
            required
            min="0"
          />
        </label>
        <label className="flex items-start justify-between">
          <span className="min-w-32">Participant Quota: </span>
          <input
            type="number"
            name="participant_Quota"
            value={formData.participant_Quota}
            onChange={handleChange}
            className="input input-sm input-bordered max-w-xl"
            required
            min="0"
          />
        </label>
        <label className="flex items-start justify-between">
          <span className="min-w-32">Start Time:</span>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="input input-sm input-bordered max-w-xl"
            required
          />
        </label>
        <label className="flex items-start justify-between">
          <span className="min-w-32">End Time:</span>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="input input-sm input-bordered max-w-xl"
            required
          />
        </label>
        <label className="flex items-start justify-between">
          <span className="min-w-32">Training Video:</span>
          <input
            type="url"
            name="videoURL"
            value={formData.videoURL}
            onChange={handleChange}
            className="input input-sm input-bordered max-w-xl"
          />
        </label>
        <div className="mt-8 w-full flex justify-center">
          <input
            className="btn max-w-40 btn-primary"
            type="submit"
            value="Create Event"
          />
        </div>
      </form>
    </div>
  );
}

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
      <EventCreateForm />
    </div>
  );
};

export default CreateEvent;
