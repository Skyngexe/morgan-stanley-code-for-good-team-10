import React from 'react';
import VideoList from '../Components/Dashboard/VideoList';
import Leaderboard from '../Components/Dashboard/Leaderboard';
import EventList from '../Components/Dashboard/EventList';


function Dashboard() {
  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-32 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-800 mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-blue-600 text-lg">
            Discover new content and track your progress.
          </p>
          <div className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg mt-6">
            Discover new content and track your progress
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          <div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <Leaderboard />
            </div>
          </div>
          <div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <EventList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;