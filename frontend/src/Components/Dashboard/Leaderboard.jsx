import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mockUsers from './MockData';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const users = mockUsers;
      const sortedUsers = users.sort((a, b) => b.points.$numberInt - a.points.$numberInt);
      const top5Users = sortedUsers.slice(0, 5);

      setTopUsers(top5Users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="mx-4 md:mx-8 bg-yellow-500 rounded-lg p-6">
      <h3 className="text-3xl font-bold text-gray-800 mb-4">Leaderboard</h3>
      <h3 className="text-xl font-bold mb-2 text-white">Leader Users</h3>
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
        <div className="flex items-center justify-center">
          <div className="text-center text-white">
            <h4 className="text-xl font-bold mb-2">No Data Available</h4>
            <p>It seems like there are no user data at the moment.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;