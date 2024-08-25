import React, { useEffect, useState } from "react";
import axios from "axios";

function CreateForm() {
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
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label>
        Event Name:{" "}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:{" "}
        <input
          type="text"
          name="descriptions"
          value={formData.descriptions}
          onChange={handleChange}
        />
      </label>
      <label>
        Image:{" "}
        <input
          type="file"
          name="imageURL"
          // value={formData.imageURL}
          onChange={handleChange}
        />
      </label>
      <label>
        Location:{" "}
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </label>
      <label>
        Event Type:{" "}
        <input
          type="text"
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
        />
      </label>
      <label>
        Volunteer Quota:{" "}
        <input
          type="number"
          name="volunteer_Quota"
          value={formData.volunteer_Quota}
          onChange={handleChange}
        />
      </label>
      <label>
        Participant Quota:{" "}
        <input
          type="number"
          name="participant_Quota"
          value={formData.participant_Quota}
          onChange={handleChange}
        />
      </label>
      <label>
        Start Time:{" "}
        <input
          type="datetime-local"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
      </label>
      <label>
        End Time:{" "}
        <input
          type="datetime-local"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
      </label>
      <label>
        Training Video:{" "}
        <input
          type="url"
          name="videoURL"
          value={formData.videoURL}
          onChange={handleChange}
        />
      </label>
      <input type="submit" value="Create Event" />
    </form>
  );
}

export default function AdminPage() {
  const [itemData, setItemData] = useState();
  const [events, setEvents] = useState();

  const fetchItem = async () => {
    axios
      .get("http://127.0.0.1:5000/form/item")
      .then((response) => {
        console.log(response.data);
        setItemData(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return { error: error };
      });
  };

  const fetchEvents = async () => {
    axios
      .get("http://127.0.0.1:5000/read/events")
      .then((response) => {
        console.log(response.data);
        setEvents(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return { error: error };
      });
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="container">
        <h1>Admin Page</h1>
        <CreateForm />
        <button onClick={fetchItem} className="border">
          Get Item
        </button>
        <ul className="flex flex-col gap-y-4">
          {/* {JSON.stringify(itemData, null, 2)} */}
          {itemData && (
            <>
              {itemData.responses.responses.map((response, i) => {
                const answers = response.answers;
                return (
                  <div className="border">
                    {Object.entries(answers).map(([questionId, answerData]) => (
                      <li key={questionId}>
                        <strong>Question ID:</strong> {questionId} <br />
                        <strong>Question: </strong>{" "}
                        {itemData.questions[questionId]} <br />
                        <strong>Answer:</strong>{" "}
                        {answerData.textAnswers.answers
                          .map((a) => a.value)
                          .join(", ")}
                      </li>
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </ul>
        {/* <div>{JSON.stringify(events)}</div> */}
        <h1 className="mt-12 text-2xl">Events</h1>
        <div className="mt flex flex-col gap-y-4">
          {events &&
            events.map((event, index) => (
              <div key={index} className="border">
                <strong>Name:</strong> {event.name} <br />
                <strong>Location:</strong> {event.location} <br />
                <strong>Start Date:</strong> {event.startDate} <br />
                <strong>End Date:</strong> {event.endDate} <br />
                <strong>Event Type:</strong> {event.eventType} <br />
                <strong>Status:</strong> {event.status}
              </div>
            ))}
        </div>
      </div>
    </div>
  );


  
}
