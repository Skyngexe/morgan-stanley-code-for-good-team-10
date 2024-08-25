import { useState } from "react";
import styles from "../styles/view-events-and-feedbacks.module.css"

function FeedbackContainer() {
  const feedbackList = [
    {
      "Event Name": "Tung Chung Chai Gathering - Art with Tissue",
      Feedbacks: [
        {
          "How would you rate 'Tung Chung Chai Gathering - Art with Tissue' from 1 to 10?":
            "10",
        },
        {
          "What suggestions do you have for improvement":
            "The event was great, no suggestions for improvement.",
        },
      ],
    },
    {
      "Event Name": "Tung Chung Chai Gathering - Art with Tissue",
      Feedbacks: [
        {
          "How would you rate 'Tung Chung Chai Gathering - Art with Tissue' from 1 to 10?":
            "5",
        },
        {
          "What suggestions do you have for improvement":
            "It would be helpful to have more interactive sessions.",
        },
      ],
    },
    {
      "Event Name": "SEN Centre Help",
      Feedbacks: [
        {
          "How would you rate 'SEN Centre Help' from 1 to 10?": "8",
        },
        {
          "What suggestions do you have for improvement":
            "Adding more volunteers could enhance the assistance provided.",
        },
      ],
    },
    {
      "Event Name":
        "Weekly Elderly Gathering - Quick and Easy Photos on Your Smartphone",
      Feedbacks: [
        {
          "How would you rate 'Weekly Elderly Gathering - Quick and Easy Photos on Your Smartphone' from 1 to 10?":
            "9",
        },
        {
          "What suggestions do you have for improvement":
            "Including a brief photography tutorial could be beneficial.",
        },
      ],
    },
    {
      "Event Name": "Chai Gathering for EM Ladies - Potluck Party",
      Feedbacks: [
        {
          "How would you rate 'Chai Gathering for EM Ladies - Potluck Party' from 1 to 10?":
            "7",
        },
        {
          "What suggestions do you have for improvement":
            "Having a wider variety of dishes could make the potluck more exciting.",
        },
      ],
    },
  ];
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

  const handleShowFeedback = () => {
    console.log("Feedbacks...");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className={styles.container}>
        {eventList.length > 0 ? (
          eventList.map((event) => (
            <div key={event.ID} className={styles.container_items}>
              <h3>{event.Name}</h3>
              <div className={styles.info_container}>
                <div>Location: {event.Location}</div>
                <div>Start Date: {event["Start Date"]}</div>
                <div>End Date: {event["End Date"]}</div>
                <div>Type: {event["Event Type"]}</div>
              </div>
              <div className={styles.button_container}>
                <button
                  className={styles.event_button}
                  onClick={() => handleShowFeedback(event.ID)}
                >
                  Show Feedback
                </button>
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

export default FeedbackContainer;
