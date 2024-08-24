import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="flex flex-col items-center">
      <div className="container">
        <h1>Admin Page</h1>
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
