
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/write/user');
      const users = response.data;

      // Sort users by points in descending order
      const sortedUsers = users.sort((a, b) => b.points.$numberInt - a.points.$numberInt);

      // Get top 5 users
      const topUsers = sortedUsers.slice(0, 5);

      setTopUsers(topUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="mx-4 md:mx-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div>
        <h3 className="text-xl font-bold mb-2">Top Users</h3>
        {topUsers.length > 0 ? (
          <ol>
            {topUsers.map((user, index) => (
              <li key={user._id} className="bg-white shadow-md rounded-lg p-4 mb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">{index + 1}. </span>
                    {user.username}
                  </div>
                  <div>Points: {user.points.$numberInt}</div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-800 mb-2">No Data Available</h4>
              <p className="text-gray-600">It seems like there are no user data at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;