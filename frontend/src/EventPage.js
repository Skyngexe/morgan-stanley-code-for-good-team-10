import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EventPage() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    axios
      .get("http://127.0.0.1:5000/responses")
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div>
      <h1>Event Page</h1>
      <button onClick={fetchData} className="border">
          Fetch Data
        </button>
      <ul className="flex flex-col gap-y-4">
        {data.map((item, index) => (
          <li key={index} className="border">
            <div>First Name: {item["First Name"]}</div>
            <div>Last Name: {item["Last Name"]}</div>
            <div>Role: {item["Role"]}</div>
            <div>Email Address: {item["Email Address"]}</div>
            <div>Phone Number: {item["Phone Number"]}</div>
            <div>Gender: {item["Gender"]}</div>
            <div>Ethnicity: {item["Ethnicity"]}</div>
            <div>Age: {item["Age"]}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
