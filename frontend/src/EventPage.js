import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EventPage() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    axios
      .get("http://127.0.0.1:5000/response/form")
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="container">
        <h1>Event Page</h1>
        <button onClick={fetchData} className="border">
          Fetch Data
        </button>
        <ul className="flex flex-col gap-y-4">
            {JSON.stringify(data)}
        </ul>
      </div>
    </div>
  );
}
