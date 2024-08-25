import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';
import mockVideoData from './MockVideo';

const VideoList = () => {
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get('http://127.0.0.1:5000/videodata');
  //     const videos = response.data;
  //     setVideoList(videos);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const fetchData = async () => {
    try {
    
      const videos = mockVideoData;
      console.log(videos)
      setVideoList(videos);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  
  return (
    <div>
    <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Start Watching Videos
    </h3>
    <div className="grid grid-cols-2 gap-4">

      {videoList.length > 0 ? (
        videoList.map((video, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <Card key={index} video={video} />
          </div>

        
        ))
      ) : (
        <div className="col-span-2 bg-white shadow-md rounded-lg p-6 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Videos Available</h3>
            <p className="text-gray-600">
              It seems like there are no videos available at the moment. Please check back later.
            </p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default VideoList;