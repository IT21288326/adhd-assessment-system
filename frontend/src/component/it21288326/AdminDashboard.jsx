// // import React, { useState, useEffect } from 'react';
// // import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// // import { AlertCircle, CheckCircle, Database, Activity, Users, Zap, Clock, Award, Server, RefreshCw } from 'lucide-react';
// // import { fetchSystemStatus , retrainModel,loadSystemStatus } from '../services/api';

// // const AdminDashboard = () => {
// //   // State for system status and metrics
// //   const [systemStatus, setSystemStatus] = useState({
// //     status: 'loading',
// //     model_loaded: 'loading',
// //     scaler_loaded: 'loading',
// //     database: 'loading',
// //     version: '',
// //     uptime: '0'
// //   });

// //   // State for prediction metrics
// //   const [predictionMetrics, setPredictionMetrics] = useState({
// //     totalPredictions: 0,
// //     predictionsByType: [],
// //     dailyPredictions: [],
// //     accuracy: 0
// //   });

// //   // State for model metrics
// //   const [modelMetrics, setModelMetrics] = useState({
// //     datasetSize: 0,
// //     featureImportance: [],
// //     keyPerformanceMetrics: []
// //   });

// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedTimeframe, setSelectedTimeframe] = useState('week');
// //   const [retrainingStatus, setRetrainingStatus] = useState('idle');

// //   // ADHD type colors for visualizations
// //   const ADHD_COLORS = {
// //     'No ADHD': '#4caf50',
// //     'Inattentive': '#2196f3',
// //     'Hyperactive-Impulsive': '#ff9800',
// //     'Combined': '#f44336',
// //     'Unknown': '#9e9e9e'
// //   };

// //   const loadSystemStatus = async () => {
// //     try {
// //       const response = await fetch('http://localhost:5000/health'); // Adjust the URL if needed
// //       if (!response.ok) {
// //         throw new Error(`Error fetching system status: ${response.statusText}`);
// //       }
// //       const data = await response.json();
      
// //       setSystemStatus({
// //         status: data.status,
// //         model_loaded: data.model_loaded,
// //         scaler_loaded: data.scaler_loaded,
// //         database: data.database,
// //         version: data.version,
// //         uptime: data.uptime
// //       });
// //     } catch (error) {
// //       console.error("Failed to fetch system status:", error);
// //       setError("Failed to connect to the server. Please check if the backend is running.");
      
// //       // Set default values if needed
// //       setSystemStatus({
// //         status: 'error',
// //         model_loaded: 'error',
// //         scaler_loaded: 'error',
// //         database: 'error',
// //         version: 'Unknown',
// //         uptime: 'N/A'
// //       });
// //     }
// //   };

// //   // Fetch prediction metrics from a new endpoint you'll need to create
// // //   const fetchPredictionMetrics = async () => {
// // //     try {
// // //       // This would be a new endpoint you'll need to create
// // //       const response = await fetch('http://localhost:5000/health');
// // //       if (!response.ok) {
// // //         throw new Error(`Error fetching prediction metrics: ${response.statusText}`);
// // //       }
// // //       const data = await response.json();
// // //       setPredictionMetrics(data);
// // //     } catch (error) {
// // //       console.error("Failed to fetch prediction metrics:", error);
// // //       // Continue loading other data even if this fails
// // //     }
// // //   };

// //   // Fetch model metrics from a new endpoint
// // //   const fetchModelMetrics = async () => {
// // //     try {
// // //       // This would be another new endpoint
// // //       const response = await fetch('http://localhost:5000/admin/model-metrics');
// // //       if (!response.ok) {
// // //         throw new Error(`Error fetching model metrics: ${response.statusText}`);
// // //       }
// // //       const data = await response.json();
// // //       setModelMetrics(data);
// // //     } catch (error) {
// // //       console.error("Failed to fetch model metrics:", error);
// // //       // Continue loading other data even if this fails
// // //     }
// // //   };

// //   //Combined function to load all dashboard data
// //   const loadDashboardData = async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       await loadSystemStatus();
// //     //   await fetchPredictionMetrics();
// //     //   await fetchModelMetrics();
// //       setLoading(false);
// //     } catch (err) {
// //       setError("Failed to load dashboard data. Please try again later.");
// //       setLoading(false);
// //     }
// //   };

// //   const handleRetrainModel = async () => {
// //     try {
// //       setRetrainingStatus('loading');
// //       // Get API key from secure storage or prompt admin for it
// //       const apiKey = localStorage.getItem('model_api_key') || prompt("Enter training API key:");
      
// //       const data = await retrainModel(apiKey);
      
// //       if (!data.error) {
// //         setRetrainingStatus('success');
// //         alert("Model retrained successfully!");
// //         // Reload dashboard data to reflect changes
// //         loadDashboardData();
// //       } else {
// //         setRetrainingStatus('error');
// //         alert(`Retraining failed: ${data.message || data.error || 'Unknown error'}`);
// //       }
// //     } catch (error) {
// //       setRetrainingStatus('error');
// //       alert(`Error initiating retraining: ${error.message}`);
// //     } finally {
// //       setTimeout(() => setRetrainingStatus('idle'), 2000);
// //     }
// //   };

// //   // Load data when component mounts
// //   useEffect(() => {
// //     loadDashboardData();
    
// //     // Set up periodic refresh (every 5 minutes)
// //     const intervalId = setInterval(() => {
// //       loadDashboardData();
// //     }, 5 * 60 * 1000);
    
// //     return () => clearInterval(intervalId);
// //   }, []);

// //   // Update data when timeframe changes
// //   useEffect(() => {
// //     // This would be implemented to fetch data for the specific timeframe
// //     // You'll need to add this parameter to your backend API
// //   }, [selectedTimeframe]);

// //   if (loading && !systemStatus.status) {
// //     return (
// //       <div className="flex items-center justify-center h-screen bg-gray-50">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
// //           <p className="mt-4 text-lg text-gray-700">Loading dashboard data...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex items-center justify-center h-screen bg-gray-50">
// //         <div className="text-center">
// //           <AlertCircle size={48} className="mx-auto text-red-500" />
// //           <p className="mt-4 text-lg text-gray-700">{error}</p>
// //           <button 
// //             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //             onClick={() => {
// //               setError(null);
// //               loadDashboardData();
// //             }}
// //           >
// //             Retry
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <header className="mb-8 flex justify-between items-center">
// //         <div>
// //           <h1 className="text-3xl font-bold text-gray-800">ADHD Assessment Admin Dashboard</h1>
// //           <p className="text-gray-600">Monitor model performance and application metrics</p>
// //         </div>
// //         <button 
// //           onClick={loadDashboardData}
// //           className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
// //         >
// //           <RefreshCw size={16} className="mr-2" />
// //           Refresh Data
// //         </button>
// //       </header>

// // {/* System Status Cards */}
// // <div className="bg-white rounded-lg shadow p-6 flex items-center">
// //   <Server className="text-blue-500 mr-4" size={24} />
// //   <div>
// //     <h3 className="text-lg font-medium text-gray-800">API Status</h3>
// //     <div className="flex items-center mt-1">
// //       {systemStatus.status === 'ok' ? (
// //         <CheckCircle size={16} className="text-green-500 mr-2" />
// //       ) : (
// //         <AlertCircle size={16} className="text-yellow-500 mr-2" />
// //       )}
// //       <span className={systemStatus.status === 'ok' ? 'text-green-500' : 'text-yellow-500'}>
// //         {systemStatus.status === 'ok' ? 'Healthy' : 'Degraded'}
// //       </span>
// //     </div>
// //   </div>
// // </div>

// // {/* You might want to add these as well */}
// // <div className="bg-white rounded-lg shadow p-6 flex items-center">
// //   <Database className="text-blue-500 mr-4" size={24} />
// //   <div>
// //     <h3 className="text-lg font-medium text-gray-800">Model Status</h3>
// //     <div className="flex items-center mt-1">
// //       {systemStatus.model_loaded === 'loaded' ? (
// //         <CheckCircle size={16} className="text-green-500 mr-2" />
// //       ) : (
// //         <AlertCircle size={16} className="text-red-500 mr-2" />
// //       )}
// //       <span className={systemStatus.model_loaded === 'loaded' ? 'text-green-500' : 'text-red-500'}>
// //         {systemStatus.model_loaded === 'loaded' ? 'Loaded' : 'Not Loaded'}
// //       </span>
// //     </div>
// //   </div>
// // </div>

// // <div className="bg-white rounded-lg shadow p-6 flex items-center">
// //   <Database className="text-blue-500 mr-4" size={24} />
// //   <div>
// //     <h3 className="text-lg font-medium text-gray-800">Scaler Status</h3>
// //     <div className="flex items-center mt-1">
// //       {systemStatus.scaler_loaded === 'loaded' ? (
// //         <CheckCircle size={16} className="text-green-500 mr-2" />
// //       ) : (
// //         <AlertCircle size={16} className="text-red-500 mr-2" />
// //       )}
// //       <span className={systemStatus.scaler_loaded === 'loaded' ? 'text-green-500' : 'text-red-500'}>
// //         {systemStatus.scaler_loaded === 'loaded' ? 'Loaded' : 'Not Loaded'}
// //       </span>
// //     </div>
// //   </div>
// // </div>

// //       {/* Key Stats */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-medium text-gray-800">Total Predictions</h3>
// //             <Activity className="text-blue-500" size={20} />
// //           </div>
// //           <p className="text-3xl font-bold text-gray-900">{predictionMetrics.totalPredictions?.toLocaleString() || "N/A"}</p>
// //           <p className="text-sm text-gray-500 mt-2">All-time predictions made</p>
// //         </div>
        
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-medium text-gray-800">Model Accuracy</h3>
// //             <Award className="text-blue-500" size={20} />
// //           </div>
// //           <p className="text-3xl font-bold text-gray-900">{predictionMetrics.accuracy || "N/A"}%</p>
// //           <p className="text-sm text-gray-500 mt-2">Based on test dataset</p>
// //         </div>
        
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-medium text-gray-800">Model Version</h3>
// //             <Zap className="text-blue-500" size={20} />
// //           </div>
// //           <p className="text-3xl font-bold text-gray-900">{systemStatus.version || "N/A"}</p>
// //           <p className="text-sm text-gray-500 mt-2">Currently deployed</p>
// //         </div>
        
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-medium text-gray-800">Dataset Size</h3>
// //             <Users className="text-blue-500" size={20} />
// //           </div>
// //           <p className="text-3xl font-bold text-gray-900">{modelMetrics.datasetSize?.toLocaleString() || "N/A"}</p>
// //           <p className="text-sm text-gray-500 mt-2">Records in training data</p>
// //         </div>
// //       </div>

// //       {/* Charts Row */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
// //         {/* Accuracy Trend */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-lg font-medium text-gray-800 mb-4">Model Accuracy Trend</h3>
// //           <div className="h-64">
// //             {predictionMetrics.accuracyTrend ? (
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <LineChart data={predictionMetrics.accuracyTrend}>
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="date" />
// //                   <YAxis domain={[70, 100]} />
// //                   <Tooltip />
// //                   <Legend />
// //                   <Line 
// //                     type="monotone" 
// //                     dataKey="accuracy" 
// //                     stroke="#2563eb" 
// //                     name="Accuracy (%)"
// //                     strokeWidth={2} 
// //                     dot={{ r: 4 }}
// //                     activeDot={{ r: 6 }}
// //                   />
// //                 </LineChart>
// //               </ResponsiveContainer>
// //             ) : (
// //               <div className="flex items-center justify-center h-full">
// //                 <p className="text-gray-500">No accuracy trend data available</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Prediction By Type */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-lg font-medium text-gray-800 mb-4">Prediction Distribution</h3>
// //           <div className="h-64">
// //             {predictionMetrics.predictionsByType?.length > 0 ? (
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <PieChart>
// //                   <Pie
// //                     data={predictionMetrics.predictionsByType}
// //                     cx="50%"
// //                     cy="50%"
// //                     labelLine={false}
// //                     outerRadius={80}
// //                     fill="#8884d8"
// //                     dataKey="value"
// //                     label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   >
// //                     {predictionMetrics.predictionsByType.map((entry, index) => (
// //                       <Cell key={`cell-${index}`} fill={ADHD_COLORS[entry.name] || '#9e9e9e'} />
// //                     ))}
// //                   </Pie>
// //                   <Tooltip formatter={(value) => [`${value} predictions`, 'Count']} />
// //                   <Legend />
// //                   </PieChart>
// //               </ResponsiveContainer>
// //             ) : (
// //               <div className="flex items-center justify-center h-full">
// //                 <p className="text-gray-500">No prediction distribution data available</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Daily Predictions Chart */}
// //       <div className="bg-white rounded-lg shadow p-6 mb-8">
// //         <div className="flex justify-between items-center mb-4">
// //           <h3 className="text-lg font-medium text-gray-800">Daily Predictions</h3>
// //           <div className="flex space-x-2">
// //             <button 
// //               onClick={() => setSelectedTimeframe('week')}
// //               className={`px-3 py-1 rounded ${selectedTimeframe === 'week' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
// //             >
// //               Week
// //             </button>
// //             <button 
// //               onClick={() => setSelectedTimeframe('month')}
// //               className={`px-3 py-1 rounded ${selectedTimeframe === 'month' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
// //             >
// //               Month
// //             </button>
// //             <button 
// //               onClick={() => setSelectedTimeframe('quarter')}
// //               className={`px-3 py-1 rounded ${selectedTimeframe === 'quarter' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
// //             >
// //               Quarter
// //             </button>
// //           </div>
// //         </div>
// //         <div className="h-80">
// //           {predictionMetrics.dailyPredictions?.length > 0 ? (
// //             <ResponsiveContainer width="100%" height="100%">
// //               <BarChart data={predictionMetrics.dailyPredictions}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="date" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Bar dataKey="count" fill="#3b82f6" name="Predictions" />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           ) : (
// //             <div className="flex items-center justify-center h-full">
// //               <p className="text-gray-500">No daily prediction data available</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Feature Importance and Model Management */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
// //         {/* Feature Importance */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-lg font-medium text-gray-800 mb-4">Feature Importance</h3>
// //           <div className="h-80">
// //             {modelMetrics.featureImportance?.length > 0 ? (
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <BarChart
// //                   data={modelMetrics.featureImportance}
// //                   layout="vertical"
// //                   margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
// //                 >
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis type="number" />
// //                   <YAxis type="category" dataKey="name" width={100} />
// //                   <Tooltip />
// //                   <Legend />
// //                   <Bar dataKey="value" fill="#3b82f6" name="Importance Score" />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             ) : (
// //               <div className="flex items-center justify-center h-full">
// //                 <p className="text-gray-500">No feature importance data available</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Model Management */}
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-lg font-medium text-gray-800 mb-4">Model Management</h3>
          
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
// //             {modelMetrics.keyPerformanceMetrics?.map((metric, index) => (
// //               <div key={index} className="p-4 bg-gray-50 rounded-lg">
// //                 <h4 className="text-sm font-medium text-gray-600 mb-1">{metric.name}</h4>
// //                 <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
// //               </div>
// //             ))}
// //           </div>
          
// //           <div className="border-t pt-4">
// //             <h4 className="text-md font-medium text-gray-800 mb-2">Model Retraining</h4>
// //             <p className="text-sm text-gray-600 mb-4">
// //               Retrain the model with the latest dataset to improve prediction accuracy.
// //               This process may take several minutes.
// //             </p>
// //             <button
// //               onClick={handleRetrainModel}
// //               disabled={retrainingStatus === 'loading'}
// //               className={`flex items-center justify-center w-full py-2 px-4 rounded-lg text-white font-medium
// //                 ${retrainingStatus === 'loading' ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
// //                 ${retrainingStatus === 'success' ? 'bg-green-600' : ''}
// //                 ${retrainingStatus === 'error' ? 'bg-red-600' : ''}
// //               `}
// //             >
// //               {retrainingStatus === 'loading' && (
// //                 <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
// //               )}
// //               {retrainingStatus === 'idle' && 'Retrain Model'}
// //               {retrainingStatus === 'loading' && 'Retraining...'}
// //               {retrainingStatus === 'success' && 'Retrained Successfully'}
// //               {retrainingStatus === 'error' && 'Retraining Failed'}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Footer with version info */}
// //       <footer className="mt-auto text-center text-sm text-gray-500 pt-8 pb-4">
// //         <p>ADHD Assessment Dashboard v1.0 • Model Version: {systemStatus.version || 'Unknown'}</p>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { AlertCircle, CheckCircle, Database, Activity, Users, Zap, Clock, Award, Server, RefreshCw, ChevronDown } from 'lucide-react';

// const AdminDashboard = () => {
//   // State for system status and metrics
//   const [systemStatus, setSystemStatus] = useState({
//     status: 'loading',
//     model_loaded: 'loading',
//     scaler_loaded: 'loading',
//     database: 'loading',
//     version: '',
//     uptime: '0'
//   });

//   // State for prediction metrics
//   const [predictionMetrics, setPredictionMetrics] = useState({
//     totalPredictions: 0,
//     predictionsByType: [],
//     dailyPredictions: [],
//     accuracy: 0
//   });

//   // State for model metrics
//   const [modelMetrics, setModelMetrics] = useState({
//     datasetSize: 0,
//     featureImportance: [],
//     keyPerformanceMetrics: []
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedTimeframe, setSelectedTimeframe] = useState('week');
//   const [retrainingStatus, setRetrainingStatus] = useState('idle');

//   // ADHD type colors for visualizations - more professional, slightly muted palette
//   const ADHD_COLORS = {
//     'No ADHD': '#4CAF50',
//     'Inattentive': '#1976D2',
//     'Hyperactive-Impulsive': '#FF9800',
//     'Combined': '#E53935',
//     'Unknown': '#757575'
//   };

//   const loadSystemStatus = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/health');
//       if (!response.ok) {
//         throw new Error(`Error fetching system status: ${response.statusText}`);
//       }
//       const data = await response.json();
      
//       setSystemStatus({
//         status: data.status,
//         model_loaded: data.model_loaded,
//         scaler_loaded: data.scaler_loaded,
//         database: data.database,
//         version: data.version,
//         uptime: data.uptime
//       });
//     } catch (error) {
//       console.error("Failed to fetch system status:", error);
//       setError("Failed to connect to the server. Please check if the backend is running.");
      
//       setSystemStatus({
//         status: 'error',
//         model_loaded: 'error',
//         scaler_loaded: 'error',
//         database: 'error',
//         version: 'Unknown',
//         uptime: 'N/A'
//       });
//     }
//   };

//   // Combined function to load all dashboard data
//   const loadDashboardData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       await loadSystemStatus();
//       // Mock data for development purposes
//       setPredictionMetrics({
//         totalPredictions: 12458,
//         accuracy: 92.7,
//         predictionsByType: [
//           { name: 'No ADHD', value: 6245 },
//           { name: 'Inattentive', value: 3124 },
//           { name: 'Hyperactive-Impulsive', value: 1542 },
//           { name: 'Combined', value: 1547 }
//         ],
//         dailyPredictions: [
//           { date: '2025-03-10', count: 142 },
//           { date: '2025-03-11', count: 156 },
//           { date: '2025-03-12', count: 189 },
//           { date: '2025-03-13', count: 201 },
//           { date: '2025-03-14', count: 178 },
//           { date: '2025-03-15', count: 103 },
//           { date: '2025-03-16', count: 87 }
//         ],
//         accuracyTrend: [
//           { date: 'Jan', accuracy: 87.5 },
//           { date: 'Feb', accuracy: 89.2 },
//           { date: 'Mar', accuracy: 92.7 }
//         ]
//       });
      
//       setModelMetrics({
//         datasetSize: 24680,
//         featureImportance: [
//           { name: 'Attention Score', value: 0.32 },
//           { name: 'Hyperactivity', value: 0.28 },
//           { name: 'Impulsivity', value: 0.21 },
//           { name: 'Age', value: 0.12 },
//           { name: 'Gender', value: 0.07 }
//         ],
//         keyPerformanceMetrics: [
//           { name: 'F1 Score', value: '0.94' },
//           { name: 'Precision', value: '0.95' },
//           { name: 'Recall', value: '0.93' },
//           { name: 'AUC', value: '0.96' }
//         ]
//       });
      
//       setLoading(false);
//     } catch (err) {
//       setError("Failed to load dashboard data. Please try again later.");
//       setLoading(false);
//     }
//   };

//   const handleRetrainModel = async () => {
//     try {
//       setRetrainingStatus('loading');
//       // Simulate API call with timeout
//       setTimeout(() => {
//         setRetrainingStatus('success');
//         setTimeout(() => setRetrainingStatus('idle'), 2000);
//       }, 3000);
//     } catch (error) {
//       setRetrainingStatus('error');
//       alert(`Error initiating retraining: ${error.message}`);
//       setTimeout(() => setRetrainingStatus('idle'), 2000);
//     }
//   };

//   // Load data when component mounts
//   useEffect(() => {
//     loadDashboardData();
    
//     // Set up periodic refresh (every 5 minutes)
//     const intervalId = setInterval(() => {
//       loadDashboardData();
//     }, 5 * 60 * 1000);
    
//     return () => clearInterval(intervalId);
//   }, []);

//   // Loading state
//   if (loading && !systemStatus.status) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-lg text-gray-700">Loading dashboard data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
//           <AlertCircle size={48} className="mx-auto text-red-500" />
//           <h2 className="text-xl font-bold text-gray-800 mt-4">Connection Error</h2>
//           <p className="mt-2 text-gray-600">{error}</p>
//           <button 
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             onClick={() => {
//               setError(null);
//               loadDashboardData();
//             }}
//           >
//             Retry Connection
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Top navigation */}
//       <nav className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 flex items-center">
//                 <Activity className="h-8 w-8 text-blue-600" />
//                 <span className="ml-2 text-lg font-semibold text-gray-900">ADHD Assessment Platform</span>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <span className="text-sm text-gray-500 mr-4">System Version: {systemStatus.version || 'Unknown'}</span>
//               <div className="ml-4 flex items-center md:ml-6">
//                 <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                   <span className="sr-only">View notifications</span>
//                   <AlertCircle className="h-6 w-6" />
//                 </button>
//                 <div className="ml-3 relative">
//                   <div>
//                     <button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                       <span className="sr-only">Open user menu</span>
//                       <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
//                         A
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         {/* Header with actions */}
//         <div className="px-4 py-4 sm:px-0 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div className="mb-4 md:mb-0">
//               <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//               <p className="mt-1 text-sm text-gray-600">Monitor model performance and system health</p>
//             </div>
//             <div className="flex space-x-3">
//               <button 
//                 onClick={loadDashboardData}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <RefreshCw size={16} className="mr-2 text-gray-500" />
//                 Refresh
//               </button>
//               <button 
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Export Report
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* System Status Summary */}
//         <div className="px-4 sm:px-0 mb-6">
//           <h2 className="text-lg font-medium text-gray-900 mb-3">System Status</h2>
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
//               <div className="p-6">
//                 <div className="flex items-center">
//                   <Server className="flex-shrink-0 mr-3 h-6 w-6 text-blue-600" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">API Status</p>
//                     <div className="flex items-center mt-1">
//                       {systemStatus.status === 'ok' ? (
//                         <>
//                           <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
//                           <p className="text-sm text-gray-500">Operational</p>
//                         </>
//                       ) : (
//                         <>
//                           <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
//                           <p className="text-sm text-gray-500">Degraded</p>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="flex items-center">
//                   <Database className="flex-shrink-0 mr-3 h-6 w-6 text-blue-600" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">ML Model</p>
//                     <div className="flex items-center mt-1">
//                       {systemStatus.model_loaded === 'loaded' ? (
//                         <>
//                           <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
//                           <p className="text-sm text-gray-500">Active</p>
//                         </>
//                       ) : (
//                         <>
//                           <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
//                           <p className="text-sm text-gray-500">Not Loaded</p>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="flex items-center">
//                   <Clock className="flex-shrink-0 mr-3 h-6 w-6 text-blue-600" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Uptime</p>
//                     <div className="flex items-center mt-1">
//                       <p className="text-sm text-gray-500">{systemStatus.uptime || 'Unknown'}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         {/* <div className="px-4 sm:px-0 mb-6">
//           <h2 className="text-lg font-medium text-gray-900 mb-3">Key Metrics</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="bg-white overflow-hidden shadow rounded-lg">
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
//                     <Activity className="h-6 w-6 text-blue-600" />
//                   </div>
//                   <div className="ml-5 w-0 flex-1">
//                     <dl>
//                       <dt className="text-sm font-medium text
// ================================================================================== */}
// <div className="px-4 sm:px-0 mb-6">
//   <h2 className="text-lg font-medium text-gray-900 mb-3">Key Metrics</h2>
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//     <div className="bg-white overflow-hidden shadow rounded-lg">
//       <div className="px-4 py-5 sm:p-6">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
//             <Activity className="h-6 w-6 text-blue-600" />
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">Total Predictions</dt>
//               <dd className="flex items-baseline">
//                 <div className="text-2xl font-semibold text-gray-900">
//                   {predictionMetrics.totalPredictions?.toLocaleString() || "0"}
//                 </div>
//               </dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//     </div>

//     <div className="bg-white overflow-hidden shadow rounded-lg">
//       <div className="px-4 py-5 sm:p-6">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
//             <Award className="h-6 w-6 text-green-600" />
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">Model Accuracy</dt>
//               <dd className="flex items-baseline">
//                 <div className="text-2xl font-semibold text-gray-900">
//                   {predictionMetrics.accuracy || "0"}%
//                 </div>
//                 <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
//                   <span>+2.3%</span>
//                 </div>
//               </dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//     </div>

//     <div className="bg-white overflow-hidden shadow rounded-lg">
//       <div className="px-4 py-5 sm:p-6">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
//             <Users className="h-6 w-6 text-purple-600" />
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">Dataset Size</dt>
//               <dd className="flex items-baseline">
//                 <div className="text-2xl font-semibold text-gray-900">
//                   {modelMetrics.datasetSize?.toLocaleString() || "0"}
//                 </div>
//               </dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//     </div>

//     <div className="bg-white overflow-hidden shadow rounded-lg">
//       <div className="px-4 py-5 sm:p-6">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
//             <Zap className="h-6 w-6 text-yellow-600" />
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">Latest Version</dt>
//               <dd className="flex items-baseline">
//                 <div className="text-2xl font-semibold text-gray-900">
//                   {systemStatus.version || "v0.0.0"}
//                 </div>
//               </dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

// {/* Charts Row - Top */}
// <div className="px-4 sm:px-0 mb-6">
//   <h2 className="text-lg font-medium text-gray-900 mb-3">Prediction Analysis</h2>
//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//     {/* Daily Predictions Chart */}
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg leading-6 font-medium text-gray-900">Daily Predictions</h3>
//           <div className="flex bg-gray-100 p-1 rounded-md">
//             <button 
//               onClick={() => setSelectedTimeframe('week')}
//               className={`px-3 py-1 text-sm font-medium rounded ${
//                 selectedTimeframe === 'week' 
//                   ? 'bg-white text-gray-800 shadow-sm' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Week
//             </button>
//             <button 
//               onClick={() => setSelectedTimeframe('month')}
//               className={`px-3 py-1 text-sm font-medium rounded ${
//                 selectedTimeframe === 'month' 
//                   ? 'bg-white text-gray-800 shadow-sm' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Month
//             </button>
//             <button 
//               onClick={() => setSelectedTimeframe('quarter')}
//               className={`px-3 py-1 text-sm font-medium rounded ${
//                 selectedTimeframe === 'quarter' 
//                   ? 'bg-white text-gray-800 shadow-sm' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Quarter
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="px-4 py-5 sm:p-6">
//         <div className="h-72">
//           {predictionMetrics.dailyPredictions?.length > 0 ? (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={predictionMetrics.dailyPredictions}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//                 <YAxis tick={{ fontSize: 12 }} />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e0e0e0',
//                     borderRadius: '4px',
//                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                   }} 
//                 />
//                 <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-500">No prediction data available</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* Prediction Type Distribution */}
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
//         <h3 className="text-lg leading-6 font-medium text-gray-900">Prediction Distribution</h3>
//       </div>
//       <div className="px-4 py-5 sm:p-6">
//         <div className="h-72">
//           {predictionMetrics.predictionsByType?.length > 0 ? (
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={predictionMetrics.predictionsByType}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   innerRadius={60}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
//                 >
//                   {predictionMetrics.predictionsByType.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={ADHD_COLORS[entry.name] || '#9e9e9e'} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   formatter={(value, name) => [`${value} (${((value / predictionMetrics.totalPredictions) * 100).toFixed(1)}%)`, name]}
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e0e0e0',
//                     borderRadius: '4px',
//                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                   }}
//                 />
//                 <Legend verticalAlign="bottom" height={36} />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-500">No distribution data available</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

// {/* Charts Row - Bottom */}
// <div className="px-4 sm:px-0 mb-6">
//   <h2 className="text-lg font-medium text-gray-900 mb-3">Model Performance</h2>
//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//     {/* Model Accuracy Trend */}
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
//         <h3 className="text-lg leading-6 font-medium text-gray-900">Accuracy Trend</h3>
//       </div>
//       <div className="px-4 py-5 sm:p-6">
//         <div className="h-72">
//           {predictionMetrics.accuracyTrend ? (
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={predictionMetrics.accuracyTrend}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//                 <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
//                 <Tooltip 
//                   formatter={(value) => [`${value}%`, 'Accuracy']}
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e0e0e0',
//                     borderRadius: '4px',
//                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                   }}
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="accuracy" 
//                   stroke="#3b82f6" 
//                   strokeWidth={2} 
//                   dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: 'white' }}
//                   activeDot={{ r: 6, fill: '#3b82f6' }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-500">No accuracy trend data available</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
    
//     {/* Feature Importance */}
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
//         <h3 className="text-lg leading-6 font-medium text-gray-900">Feature Importance</h3>
//       </div>
//       <div className="px-4 py-5 sm:p-6">
//         <div className="h-72">
//           {modelMetrics.featureImportance?.length > 0 ? (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={modelMetrics.featureImportance}
//                 layout="vertical"
//                 margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
//                 <XAxis type="number" domain={[0, 'dataMax']} tick={{ fontSize: 12 }} />
//                 <YAxis 
//                   type="category" 
//                   dataKey="name" 
//                   tick={{ fontSize: 12 }} 
//                   width={100} 
//                 />
//                 <Tooltip 
//                   formatter={(value) => [`${value.toFixed(2)}`, 'Importance']}
//                   contentStyle={{ 
//                     backgroundColor: 'white', 
//                     border: '1px solid #e0e0e0',
//                     borderRadius: '4px',
//                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                   }}
//                 />
//                 <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-500">No feature importance data available</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

// {/* Performance Metrics and Model Management */}
// <div className="px-4 sm:px-0 mb-6">
//   <h2 className="text-lg font-medium text-gray-900 mb-3">Model Management</h2>
//   <div className="bg-white shadow rounded-lg overflow-hidden">
//     <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
//       {/* Performance Metrics */}
//       <div className="col-span-2 p-6">

// <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {modelMetrics.keyPerformanceMetrics?.map((metric, index) => (
//             <div key={index} className="bg-gray-50 rounded-lg p-4">
//               <dt className="text-sm font-medium text-gray-500">{metric.name}</dt>
//               <dd className="mt-1 text-3xl font-semibold text-gray-900">{metric.value}</dd>
//             </div>
//           ))}
//         </div>
        
//         <div className="mt-6">
//           <h4 className="text-md font-medium text-gray-900 mb-2">Additional Insights</h4>
//           <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-blue-400" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-blue-800">Model Performance Analysis</h3>
//                 <div className="mt-2 text-sm text-blue-700">
//                   <p>
//                     Current model is performing with high accuracy across all ADHD subtypes. 
//                     The "Inattentive" type predictions show the highest confidence scores.
//                     Recommendation: Consider collecting more data for "Hyperactive-Impulsive" type to improve detection.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Model Management */}
//       <div className="p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Model Control</h3>
        
//         <div className="space-y-6">
//           <div>
//             <div className="flex items-center justify-between">
//               <h4 className="text-sm font-medium text-gray-900">Training Status</h4>
//               <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
//                 Up to Date
//               </span>
//             </div>
//             <p className="mt-1 text-sm text-gray-500">
//               Last trained: March 12, 2025
//             </p>
//           </div>
          
//           <div>
//             <h4 className="text-sm font-medium text-gray-900 mb-1">Model Retraining</h4>
//             <p className="text-sm text-gray-500 mb-4">
//               Retrain the model with the latest dataset to improve prediction accuracy.
//             </p>
//             <button
//               onClick={handleRetrainModel}
//               disabled={retrainingStatus === 'loading'}
//               className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
//                 ${retrainingStatus === 'loading' ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
//                 ${retrainingStatus === 'success' ? 'bg-green-600' : ''}
//                 ${retrainingStatus === 'error' ? 'bg-red-600' : ''}
//                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
//               `}
//             >
//               {retrainingStatus === 'loading' && (
//                 <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               )}
//               {retrainingStatus === 'idle' && 'Retrain Model'}
//               {retrainingStatus === 'loading' && 'Retraining...'}
//               {retrainingStatus === 'success' && 'Retrained Successfully'}
//               {retrainingStatus === 'error' && 'Retraining Failed'}
//             </button>
//           </div>
          
//           <div className="border-t border-gray-200 pt-4">
//             <h4 className="text-sm font-medium text-gray-900 mb-1">Advanced Options</h4>
//             <div className="space-y-2 mt-3">
//               <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                 Download Model Weights
//               </button>
//               <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                 View Training Logs
//               </button>
//               <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                 Configure Parameters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//       {/* Footer */}
//       <footer className="mt-8 border-t border-gray-200 pt-4 pb-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center space-x-1 text-sm text-gray-500">
//               <span>ADHD Assessment Platform</span>
//               <span>•</span>
//               <span>Version {systemStatus.version || '1.0.0'}</span>
//               <span>•</span>
//               <span>Admin Dashboard</span>
//             </div>
//             <div className="mt-4 md:mt-0 flex space-x-4">
//               <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Documentation</a>
//               <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Support</a>
//               <a href="#" className="text-sm text-gray-500 hover:text-gray-900">API Reference</a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, Database, Activity, Users, Zap, Clock, Award, Server, RefreshCw, ChevronDown } from 'lucide-react';

// Add this function to create a scoped style tag
const createScopedStyle = () => {
  if (typeof document !== 'undefined') {
    // Check if the style tag already exists to avoid duplicates
    const existingStyle = document.getElementById('admin-dashboard-styles');
    if (existingStyle) return;
    
    const style = document.createElement('style');
    style.id = 'admin-dashboard-styles';
    
    // Insert all the CSS from the artifact above
    style.innerHTML = `
       .bg-white { background-color: white; }
      .bg-gray-50 { background-color: #f9fafb; }
      .bg-gray-100 { background-color: #f3f4f6; }
      .bg-blue-50 { background-color: #eff6ff; }
      .bg-blue-100 { background-color: #dbeafe; }
      .bg-blue-600 { background-color: #2563eb; }
      .bg-green-100 { background-color: #d1fae5; }
      .bg-green-500 { background-color: #10b981; }
      .bg-green-600 { background-color: #059669; }
      .bg-yellow-100 { background-color: #fef3c7; }
      .bg-yellow-500 { background-color: #f59e0b; }
      .bg-yellow-600 { background-color: #d97706; }
      .bg-red-500 { background-color: #ef4444; }
      .bg-red-600 { background-color: #dc2626; }
      .bg-purple-100 { background-color: #f3e8ff; }
      .bg-purple-600 { background-color: #9333ea; }
      
      .text-white { color: white; }
      .text-gray-500 { color: #6b7280; }
      .text-gray-600 { color: #4b5563; }
      .text-gray-700 { color: #374151; }
      .text-gray-800 { color: #1f2937; }
      .text-gray-900 { color: #111827; }
      .text-blue-500 { color: #3b82f6; }
      .text-blue-600 { color: #2563eb; }
      .text-blue-700 { color: #1d4ed8; }
      .text-blue-800 { color: #1e40af; }
      .text-green-500 { color: #10b981; }
      .text-green-600 { color: #059669; }
      .text-green-800 { color: #065f46; }
      .text-red-500 { color: #ef4444; }
      
      /* Font sizing */
      .text-xs { font-size: 0.75rem; }
      .text-sm { font-size: 0.875rem; }
      .text-base { font-size: 1rem; }
      .text-lg { font-size: 1.125rem; }
      .text-xl { font-size: 1.25rem; }
      .text-2xl { font-size: 1.5rem; }
      .text-3xl { font-size: 1.875rem; }
      
      /* Font weights */
      .font-medium { font-weight: 500; }
      .font-semibold { font-weight: 600; }
      .font-bold { font-weight: 700; }
      
      /* Layout */
      .flex { display: flex; }
      .grid { display: grid; }
      .hidden { display: none; }
      .h-screen { height: 100vh; }
      .h-2 { height: 0.5rem; }
      .h-2\\.5 { height: 0.625rem; }
      .h-4 { height: 1rem; }
      .h-5 { height: 1.25rem; }
      .h-6 { height: 1.5rem; }
      .h-8 { height: 2rem; }
      .h-16 { height: 4rem; }
      .h-72 { height: 18rem; }
      .w-0 { width: 0; }
      .w-2 { width: 0.5rem; }
      .w-2\\.5 { width: 0.625rem; }
      .w-4 { width: 1rem; }
      .w-5 { width: 1.25rem; }
      .w-6 { width: 1.5rem; }
      .w-8 { width: 2rem; }
      .w-16 { width: 4rem; }
      .w-full { width: 100%; }
      .max-w-md { max-width: 28rem; }
      .max-w-4xl { max-width: 56rem; }
      .max-w-7xl { max-width: 80rem; }
      
      /* Spacing */
      .p-1 { padding: 0.25rem; }
      .p-2 { padding: 0.5rem; }
      .p-3 { padding: 0.75rem; }
      .p-4 { padding: 1rem; }
      .p-6 { padding: 1.5rem; }
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
      .py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
      .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
      .pt-4 { padding-top: 1rem; }
      .pb-8 { padding-bottom: 2rem; }
      
      .m-1 { margin: 0.25rem; }
      .m-2 { margin: 0.5rem; }
      .m-3 { margin: 0.75rem; }
      .m-4 { margin: 1rem; }
      .m-6 { margin: 1.5rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .mt-1 { margin-top: 0.25rem; }
      .mt-2 { margin-top: 0.5rem; }
      .mt-3 { margin-top: 0.75rem; }
      .mt-4 { margin-top: 1rem; }
      .mt-6 { margin-top: 1.5rem; }
      .mt-8 { margin-top: 2rem; }
      .mb-1 { margin-bottom: 0.25rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-3 { margin-bottom: 0.75rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mb-6 { margin-bottom: 1.5rem; }
      .ml-2 { margin-left: 0.5rem; }
      .ml-3 { margin-left: 0.75rem; }
      .ml-4 { margin-left: 1rem; }
      .ml-5 { margin-left: 1.25rem; }
      .mr-2 { margin-right: 0.5rem; }
      .mr-3 { margin-right: 0.75rem; }
      .mr-4 { margin-right: 1rem; }
      
      /* Borders */
      .border { border-width: 1px; }
      .border-t { border-top-width: 1px; }
      .border-b { border-bottom-width: 1px; }
      .border-gray-200 { border-color: #e5e7eb; }
      .border-gray-300 { border-color: #d1d5db; }
      .border-blue-100 { border-color: #dbeafe; }
      .border-blue-500 { border-color: #3b82f6; }
      .border-transparent { border-color: transparent; }
      .border-white { border-color: white; }
      .rounded-md { border-radius: 0.375rem; }
      .rounded-lg { border-radius: 0.5rem; }
      .rounded-full { border-radius: 9999px; }
      
      /* Shadows */
      .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
      .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
      
      /* Flexbox and Grid */
      .flex-1 { flex: 1 1 0%; }
      .flex-col { flex-direction: column; }
      .flex-row { flex-direction: row; }
      .flex-shrink-0 { flex-shrink: 0; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      .space-x-1 > * + * { margin-left: 0.25rem; }
      .space-x-3 > * + * { margin-left: 0.75rem; }
      .space-x-4 > * + * { margin-left: 1rem; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .space-y-6 > * + * { margin-top: 1.5rem; }
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .gap-4 { gap: 1rem; }
      .gap-6 { gap: 1.5rem; }
      .divide-x > * + * { border-left-width: 1px; }
      .divide-y > * + * { border-top-width: 1px; }
      .divide-gray-200 > * + * { border-color: #e5e7eb; }
      
      /* Text alignment */
      .text-left { text-align: left; }
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      
      /* Misc */
      .overflow-hidden { overflow: hidden; }
      .overflow-x-auto { overflow-x: auto; }
      .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
      .cursor-not-allowed { cursor: not-allowed; }
      
      /* Animations */
      .animate-spin { animation: spin 1s linear infinite; }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      
      /* Transitions */
      .transition-colors { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      
      /* Hover effects */
      .hover\\:bg-gray-50:hover { background-color: #f9fafb; }
      .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
      .hover\\:text-gray-500:hover { color: #6b7280; }
      .hover\\:text-gray-700:hover { color: #374151; }
      .hover\\:text-gray-900:hover { color: #111827; }
      
      /* Focus effects */
      .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
      .focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
      .focus\\:ring-blue-500:focus { --tw-ring-color: #3b82f6; }
      .focus\\:ring-offset-2:focus { --tw-ring-offset-width: 2px; }
      
      /* Responsive design */
      @media (min-width: 640px) {
        .sm\\:px-0 { padding-left: 0; padding-right: 0; }
        .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .sm\\:p-6 { padding: 1.5rem; }
        .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      
@media (min-width: 768px) {
  .md\\:flex-row { flex-direction: row; }
  .md\\:items-center { align-items: center; }
  .md\\:justify-between { justify-content: space-between; }
  .md\\:mb-0 { margin-bottom: 0; }
  .md\\:mt-0 { margin-top: 0; }
  .md\\:ml-6 { margin-left: 1.5rem; }
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .md\\:divide-y-0 { border-top-width: 0px; }
  .md\\:divide-x { border-right-width: 0px; border-left-width: 1px; }
}

@media (min-width: 1024px) {
  .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
  .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .lg\\:divide-y-0 { border-top-width: 0px; }
  .lg\\:divide-x { border-right-width: 0px; border-left-width: 1px; }
}
    `;
    
    document.head.appendChild(style);
  }
};

const AdminDashboard = () => {
  // Call the function to create the scoped styles
  useEffect(() => {
    createScopedStyle();
    return () => {
      // Optional: Clean up styles when component unmounts
      if (typeof document !== 'undefined') {
        const styleTag = document.getElementById('admin-dashboard-styles');
        if (styleTag) styleTag.remove();
      }
    };
  }, []);

  // Your existing component code continues here...
  const [systemStatus, setSystemStatus] = useState({
    status: 'loading',
    model_loaded: 'loading',
    scaler_loaded: 'loading',
    database: 'loading',
    version: '',
    uptime: '0'
  });

  // State for prediction metrics
  const [predictionMetrics, setPredictionMetrics] = useState({
    totalPredictions: 0,
    predictionsByType: [],
    dailyPredictions: [],
    accuracy: 0
  });

  // State for model metrics
  const [modelMetrics, setModelMetrics] = useState({
    datasetSize: 0,
    featureImportance: [],
    keyPerformanceMetrics: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [retrainingStatus, setRetrainingStatus] = useState('idle');

  // ADHD type colors for visualizations - more professional, slightly muted palette
  const ADHD_COLORS = {
    'No ADHD': '#4CAF50',
    'Inattentive': '#1976D2',
    'Hyperactive-Impulsive': '#FF9800',
    'Combined': '#E53935',
    'Unknown': '#757575'
  };

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (!response.ok) {
        throw new Error(`Error fetching system status: ${response.statusText}`);
      }
      const data = await response.json();
      
      setSystemStatus({
        status: data.status,
        model_loaded: data.model_loaded,
        scaler_loaded: data.scaler_loaded,
        database: data.database,
        version: data.version,
        uptime: data.uptime
      });
    } catch (error) {
      console.error("Failed to fetch system status:", error);
      setError("Failed to connect to the server. Please check if the backend is running.");
      
      setSystemStatus({
        status: 'error',
        model_loaded: 'error',
        scaler_loaded: 'error',
        database: 'error',
        version: 'Unknown',
        uptime: 'N/A'
      });
    }
  };

  // Combined function to load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      await loadSystemStatus();
      // Mock data for development purposes
      setPredictionMetrics({
        totalPredictions: 12458,
        accuracy: 92.7,
        predictionsByType: [
          { name: 'No ADHD', value: 6245 },
          { name: 'Inattentive', value: 3124 },
          { name: 'Hyperactive-Impulsive', value: 1542 },
          { name: 'Combined', value: 1547 }
        ],
        dailyPredictions: [
          { date: '2025-03-10', count: 142 },
          { date: '2025-03-11', count: 156 },
          { date: '2025-03-12', count: 189 },
          { date: '2025-03-13', count: 201 },
          { date: '2025-03-14', count: 178 },
          { date: '2025-03-15', count: 103 },
          { date: '2025-03-16', count: 87 }
        ],
        accuracyTrend: [
          { date: 'Jan', accuracy: 87.5 },
          { date: 'Feb', accuracy: 89.2 },
          { date: 'Mar', accuracy: 92.7 }
        ]
      });
      
      setModelMetrics({
        datasetSize: 24680,
        featureImportance: [
          { name: 'Attention Score', value: 0.32 },
          { name: 'Hyperactivity', value: 0.28 },
          { name: 'Impulsivity', value: 0.21 },
          { name: 'Age', value: 0.12 },
          { name: 'Gender', value: 0.07 }
        ],
        keyPerformanceMetrics: [
          { name: 'F1 Score', value: '0.94' },
          { name: 'Precision', value: '0.95' },
          { name: 'Recall', value: '0.93' },
          { name: 'AUC', value: '0.96' }
        ]
      });
      
      setLoading(false);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
    }
  };

  // const handleRetrainModel = async () => {
  //   try {
  //     setRetrainingStatus('loading');
  //     // Simulate API call with timeout
  //     setTimeout(() => {
  //       setRetrainingStatus('success');
  //       setTimeout(() => setRetrainingStatus('idle'), 2000);
  //     }, 3000);
  //   } catch (error) {
  //     setRetrainingStatus('error');
  //     alert(`Error initiating retraining: ${error.message}`);
  //     setTimeout(() => setRetrainingStatus('idle'), 2000);
  //   }
  // };

  const handleRetrainModel = async () => {
    try {
      setRetrainingStatus('loading');
  
      const response = await fetch('http://localhost:5000//retrain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'default_training_key' // Replace with your actual API key
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setRetrainingStatus('success');
        setTimeout(() => setRetrainingStatus('idle'), 2000);
      } else {
        setRetrainingStatus('error');
        alert(`Error: ${data.message || 'Retraining failed'}`);
        setTimeout(() => setRetrainingStatus('idle'), 2000);
      }
    } catch (error) {
      setRetrainingStatus('error');
      alert(`Error initiating retraining: ${error.message}`);
      setTimeout(() => setRetrainingStatus('idle'), 2000);
    }
  };
  

  // Load data when component mounts
  useEffect(() => {
    loadDashboardData();
    
    // Set up periodic refresh (every 5 minutes)
    const intervalId = setInterval(() => {
      loadDashboardData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Loading state
  if (loading && !systemStatus.status) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <AlertCircle size={48} className="mx-auto text-red-500" />
          <h2 className="text-xl font-bold text-gray-800 mt-4">Connection Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => {
              setError(null);
              loadDashboardData();
            }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-lg font-semibold text-gray-900">ADHD Assessment Platform</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">System Version: {systemStatus.version || 'Unknown'}</span>
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">View notifications</span>
                  <AlertCircle className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        A
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header with actions */}
        <div className="px-4 py-4 sm:px-0 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Monitor model performance and system health</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={loadDashboardData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw size={16} className="mr-2 text-gray-500" />
                Refresh
              </button>
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* System Status Summary */}
        <div className="px-4 sm:px-0 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">System Status</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <Server className="flex-shrink-0 mr-3 h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">API Status</p>
                    <div className="flex items-center mt-1">
                      {systemStatus.status === 'ok' ? (
                        <>
                          <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          <p className="text-sm text-gray-500">Operational</p>
                        </>
                      ) : (
                        <>
                          <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
                          <p className="text-sm text-gray-500">Degraded</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <Database className="flex-shrink-0 mr-3 h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">ML Model</p>
                    <div className="flex items-center mt-1">
                      {systemStatus.model_loaded === 'loaded' ? (
                        <>
                          <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          <p className="text-sm text-gray-500">Active</p>
                        </>
                      ) : (
                        <>
                          <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                          <p className="text-sm text-gray-500">Not Loaded</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <Clock className="flex-shrink-0 mr-3 h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Uptime</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500">{systemStatus.uptime || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {/* <div className="px-4 sm:px-0 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text
================================================================================== */}
<div className="px-4 sm:px-0 mb-6">
  <h2 className="text-lg font-medium text-gray-900 mb-3">Key Metrics</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Predictions</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {predictionMetrics.totalPredictions?.toLocaleString() || "0"}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
            <Award className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Model Accuracy</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {predictionMetrics.accuracy || "0"}%
                </div>
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <span>+2.3%</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Dataset Size</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {modelMetrics.datasetSize?.toLocaleString() || "0"}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
            <Zap className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Latest Version</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {systemStatus.version || "v0.0.0"}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Charts Row - Top */}
<div className="px-4 sm:px-0 mb-6">
  <h2 className="text-lg font-medium text-gray-900 mb-3">Prediction Analysis</h2>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Daily Predictions Chart */}
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Daily Predictions</h3>
          <div className="flex bg-gray-100 p-1 rounded-md">
            <button 
              onClick={() => setSelectedTimeframe('week')}
              className={`px-3 py-1 text-sm font-medium rounded ${
                selectedTimeframe === 'week' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => setSelectedTimeframe('month')}
              className={`px-3 py-1 text-sm font-medium rounded ${
                selectedTimeframe === 'month' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Month
            </button>
            <button 
              onClick={() => setSelectedTimeframe('quarter')}
              className={`px-3 py-1 text-sm font-medium rounded ${
                selectedTimeframe === 'quarter' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Quarter
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="h-72">
          {predictionMetrics.dailyPredictions?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionMetrics.dailyPredictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No prediction data available</p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Prediction Type Distribution */}
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Prediction Distribution</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="h-72">
          {predictionMetrics.predictionsByType?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={predictionMetrics.predictionsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {predictionMetrics.predictionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ADHD_COLORS[entry.name] || '#9e9e9e'} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} (${((value / predictionMetrics.totalPredictions) * 100).toFixed(1)}%)`, name]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No distribution data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

{/* Charts Row - Bottom */}
<div className="px-4 sm:px-0 mb-6">
  <h2 className="text-lg font-medium text-gray-900 mb-3">Model Performance</h2>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Model Accuracy Trend */}
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Accuracy Trend</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="h-72">
          {predictionMetrics.accuracyTrend ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionMetrics.accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Accuracy']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No accuracy trend data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Feature Importance */}
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Feature Importance</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="h-72">
          {modelMetrics.featureImportance?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={modelMetrics.featureImportance}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" domain={[0, 'dataMax']} tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  width={100} 
                />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}`, 'Importance']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No feature importance data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

{/* Performance Metrics and Model Management */}
<div className="px-4 sm:px-0 mb-6">
  <h2 className="text-lg font-medium text-gray-900 mb-3">Model Management</h2>
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
      {/* Performance Metrics */}
      <div className="col-span-2 p-6">

<h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {modelMetrics.keyPerformanceMetrics?.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500">{metric.name}</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{metric.value}</dd>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Additional Insights</h4>
          <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Model Performance Analysis</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Current model is performing with high accuracy across all ADHD subtypes. 
                    The "Inattentive" type predictions show the highest confidence scores.
                    Recommendation: Consider collecting more data for "Hyperactive-Impulsive" type to improve detection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Model Management */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Model Control</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">Training Status</h4>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Up to Date
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Last trained: March 12, 2025
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Model Retraining</h4>
            <p className="text-sm text-gray-500 mb-4">
              Retrain the model with the latest dataset to improve prediction accuracy.
            </p>
            <button
              onClick={handleRetrainModel}
              disabled={retrainingStatus === 'loading'}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                ${retrainingStatus === 'loading' ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                ${retrainingStatus === 'success' ? 'bg-green-600' : ''}
                ${retrainingStatus === 'error' ? 'bg-red-600' : ''}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
              `}
            >
              {retrainingStatus === 'loading' && (
                <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {retrainingStatus === 'idle' && 'Retrain Model'}
              {retrainingStatus === 'loading' && 'Retraining...'}
              {retrainingStatus === 'success' && 'Retrained Successfully'}
              {retrainingStatus === 'error' && 'Retraining Failed'}
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Advanced Options</h4>
            <div className="space-y-2 mt-3">
              <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Download Model Weights
              </button>
              <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                View Training Logs
              </button>
              <button className="w-full text-left px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Configure Parameters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Footer */}
      <footer className="mt-8 border-t border-gray-200 pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>ADHD Assessment Platform</span>
              <span>•</span>
              <span>Version {systemStatus.version || '1.0.0'}</span>
              <span>•</span>
              <span>Admin Dashboard</span>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Documentation</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Support</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">API Reference</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
  );
};
export default AdminDashboard;