// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useParams, useLocation } from 'react-router-dom';
// // import GameAnalytics from './GameAnalytics';

// // const GameAnalyticsContainer = () => {
// //   const [gameData, setGameData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
  
// //   // Get router parameters
// //   const { childId,gameId } = useParams();
// //   const location = useLocation();
// //   // const [childId, setChildId] = useState(location.state?.childId || null);

// //   useEffect(() => {
// //     const fetchGameData = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await axios.get(`http://localhost:8800/api/metrics/${childId}/${gameId}`);
        
// //         // Check if response has the expected structure
// //         if (response.data && response.data.success && response.data.data) {
// //           setGameData(response.data.data); // Set just the data property
// //         } else {
// //           setError('Invalid data format received from server');
// //         }
        
// //         setLoading(false);
// //       } catch (err) {
// //         console.error('Error fetching game data:', err);
// //         setError('Failed to load game data. Please try again later.');
// //         setLoading(false);
// //       }

// //     };
    
// //     if (childId && gameId) {
// //       fetchGameData();
// //     }
// //   }, [childId, gameId]);
  
// //   if (loading) {
// //     return <div className="flex items-center justify-center h-screen">Loading game analytics...</div>;
// //   }
  
// //   if (error) {
// //     return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
// //   }
  
// //   return (
// //     <div className="container mx-auto py-8">
// //       <GameAnalytics gameData={gameData} />
// //     </div>
// //   );
// // };

// // export default GameAnalyticsContainer;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useLocation } from 'react-router-dom';
// import GameAnalytics from './GameAnalytics';

// const GameAnalyticsContainer = () => {
//   const [gameData, setGameData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Get router parameters
//   const { childId, gameId } = useParams();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchGameData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:8800/api/metrics/${childId}/${gameId}`);
        
//         // Check if response has the expected structure
//         if (response.data && response.data.success && response.data.data) {
//           setGameData(response.data.data); // Set just the data property
//         } else {
//           setError('Invalid data format received from server');
//         }
        
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching game data:', err);
//         setError('Failed to load game data. Please try again later.');
//         setLoading(false);
//       }
//     };
    
//     if (childId && gameId) {
//       fetchGameData();
//     }
//   }, [childId, gameId]);
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-white">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-700 font-medium">Loading game analytics...</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-white">
//         <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="text-red-700 font-medium">{error}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }
  
//   // Apply a wrapper with its own styling context
//   return (
//     <div className="analytics-container bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         <GameAnalytics gameData={gameData} />
//       </div>
      
//       {/* Add this style tag to override any conflicting styles */}
//       <style jsx>{`
//         .analytics-container .card,
//         .analytics-container .progress,
//         .analytics-container .tabs {
//           font-family: inherit;
//         }
        
//         .analytics-container h1,
//         .analytics-container h2,
//         .analytics-container h3 {
//           font-family: inherit;
//           margin: 0;
//         }
        
//         /* Add specific style overrides for any conflicting components */
//         .analytics-container .progress {
//           height: 8px;
//           border-radius: 4px;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GameAnalyticsContainer;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import GameAnalytics from './GameAnalytics';
import './GameAnalyticsContainer.css'; // Create this file for isolated styles

const GameAnalyticsContainer = () => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get router parameters
  const { childId, gameId } = useParams();
  const location = useLocation();

  // Add a ref to access the container element
  const containerRef = React.useRef(null);

  // Force style reapplication after component mounts
  useEffect(() => {
    if (containerRef.current) {
      // Small trick to force a repaint
      const element = containerRef.current;
      const currentDisplay = window.getComputedStyle(element).display;
      element.style.display = 'none';
      // Force a reflow
      void element.offsetHeight;
      element.style.display = currentDisplay;
    }
  }, [gameData]);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8800/api/metrics/${childId}/${gameId}`);
        
        // Check if response has the expected structure
        if (response.data && response.data.success && response.data.data) {
          setGameData(response.data.data); // Set just the data property
        } else {
          setError('Invalid data format received from server');
        }
        
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
  
  // Inject a style tag with !important rules
  useEffect(() => {
    // Create a new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'game-analytics-priority-styles';
    
    // Add your overriding styles with !important
    styleElement.innerHTML = `
      .game-analytics-wrapper .card { font-family: inherit !important; }
      .game-analytics-wrapper .progress { height: 8px !important; }
      .game-analytics-wrapper .tabs-list { background-color: #f9fafb !important; }
      .game-analytics-wrapper .card-header { padding: 1rem !important; }
      .game-analytics-wrapper .card-content { padding: 1rem !important; }
      
      /* Add more specific style overrides as needed */
      .game-analytics-wrapper [class*="bg-gradient"] { background-image: var(--tw-gradient-stops) !important; }
      .game-analytics-wrapper .text-blue-500 { color: rgb(59, 130, 246) !important; }
      .game-analytics-wrapper .text-green-500 { color: rgb(34, 197, 94) !important; }
      .game-analytics-wrapper .text-red-500 { color: rgb(239, 68, 68) !important; }
    `;
    
    // Append the style element to the document head
    document.head.appendChild(styleElement);
    
    // Clean up function
    return () => {
      const styleTag = document.getElementById('game-analytics-priority-styles');
      if (styleTag) {
        document.head.removeChild(styleTag);
      }
    };
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading game analytics...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className="game-analytics-wrapper bg-gray-50 min-h-screen" 
      style={{ isolation: 'isolate' }}
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Wrap GameAnalytics with a div that uses CSS specificity to override styles */}
        <div id="analytics-root" className="analytics-component">
          <GameAnalytics gameData={gameData} />
        </div>
      </div>
    </div>
  );
};

export default GameAnalyticsContainer;