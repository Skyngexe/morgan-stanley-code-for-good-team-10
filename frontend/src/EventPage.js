import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function EventPage() {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        axios.get('http://127.0.0.1:5000/responses')
        .then(response => {
            console.log(response.data.data);
            setData(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
        
    };

    return (
        <div>
            <h1>Event Page</h1>
            <ul>
                <button onClick={fetchData}>Fetch Data</button>
                {data.map((item, index) => (
                    <li key={index}>
                        {item['First Name']} {item['Last Name']} - {item['Role']}
                    </li>
                ))}
            </ul>
        </div>
    )
}