import React from 'react';
import VideoList from '../Components/Dashboard/VideoList';

function Dashboard() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Discover new content and track your progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Leaderboard</h3>
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-600">Leaderboard content goes here.</p>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Start Watching Videos
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <VideoList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;