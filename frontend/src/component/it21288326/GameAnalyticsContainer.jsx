import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GameAnalytics from './GameAnalytics';

const GameAnalyticsContainer = () => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { childId, gameId } = useParams(); // Assuming you're using these route params
  
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        // You can adjust the endpoint based on your API structure
        const response = await axios.get(`http://localhost:8800/api/gamematrix/${childId}/${gameId}`);
        setGameData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError('Failed to load game data. Please try again later.');
        setLoading(false);
      }
    };
    
    if (childId && gameId) {
      fetchGameData();
    }
  }, [childId, gameId]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading game analytics...</div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <GameAnalytics gameData={gameData} />
    </div>
  );
};

export default GameAnalyticsContainer;