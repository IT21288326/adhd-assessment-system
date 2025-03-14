// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { Progress } from './ui/progress';
// import { AlertCircle, Activity, Brain, Clock, BarChart2, Zap, Target, XCircle, Award, Star, TrendingUp } from 'lucide-react';
// import Confetti from 'react-confetti';
// import tw, {styled} from 'twin.macro';

// // Create styled components with Tailwind classes
// const Container = styled.div`
//   ${tw`container mx-auto p-4 bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl`}
// `;

// const StyledCard = styled(Card)`
//   ${tw`bg-white border-2 border-blue-200 hover:shadow-md transition-shadow`}
// `;

// const GameAnalytics = ({ gameData }) => {
//   const [analysisResults, setAnalysisResults] = useState({
//     inattention: { score: 0, level: '', insights: [] },
//     impulsivity: { score: 0, level: '', insights: [] },
//     combined: { score: 0, level: '', insights: [] }
//   });
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [achievements, setAchievements] = useState([]);
//   const [selectedTab, setSelectedTab] = useState('metrics');
//   const [showPositiveMessage, setShowPositiveMessage] = useState(false);

//   useEffect(() => {
    
//     if (gameData) {
//       if (gameData.reactionTimes && gameData.reactionTimes.length > 0) {
//         const mean = gameData.averageReactionTime;
//         const variance = gameData.reactionTimes.reduce((sum, time) => 
//           sum + Math.pow(time - mean, 2), 0) / gameData.reactionTimes.length;
//         gameData.reactionTimeVariability = Math.sqrt(variance);
//       }
//       const results = analyzeGameData(gameData);
//       setAnalysisResults(results);
    
//           // Generate achievements
//           const userAchievements = generateAchievements(gameData);
//           setAchievements(userAchievements);
          
//           // Show confetti if there are achievements or good scores
//           if (userAchievements.length > 0 || gameData.score > 150) {
//             setShowConfetti(true);
//             setTimeout(() => setShowConfetti(false), 5000);
//           }
          
//           // Show positive message
//           setShowPositiveMessage(true);
//           setTimeout(() => setShowPositiveMessage(false), 8000);
//         }
//   }, [gameData]);

//   // Generate achievements based on gameplay
//   const generateAchievements = (data) => {
//     const achievements = [];
    
//     if (data.correctStreak >= 10) {
//       achievements.push({
//         title: "Focus Master",
//         description: "Caught 10 stars in a row!",
//         icon: <Target className="text-indigo-500" />
//       });
//     }
    
//     if (data.score > 200) {
//       achievements.push({
//         title: "Star Collector",
//         description: "Scored over 200 points!",
//         icon: <Star className="text-yellow-500" />
//       });
//     }
    
//     if (data.averageReactionTime < 600 && data.reactionTimes.length > 10) {
//       achievements.push({
//         title: "Lightning Fast",
//         description: "Super quick reaction time!",
//         icon: <Zap className="text-blue-500" />
//       });
//     }
    
//     if (data.missedStars < 3 && data.reactionTimes.length > 10) {
//       achievements.push({
//         title: "Eagle Eye",
//         description: "Almost nothing escapes you!",
//         icon: <Activity className="text-green-500" />
//       });
//     }
    
//     return achievements;
//   };

//   // Analyze game data to calculate metrics
//   const analyzeGameData = (data) => {
//     // 1. Inattention Analysis
//     const inattentionScore = calculateInattentionScore(data);
//     const inattentionLevel = getScoreLevel(inattentionScore);
//     const inattentionInsights = generateInattentionInsights(data, inattentionScore);

//     // 2. Impulsivity Analysis
//     const impulsivityScore = calculateImpulsivityScore(data);
//     const impulsivityLevel = getScoreLevel(impulsivityScore);
//     const impulsivityInsights = generateImpulsivityInsights(data, impulsivityScore);

//     // 3. Combined Analysis
//     const combinedScore = (inattentionScore + impulsivityScore) / 2;
//     const combinedLevel = getScoreLevel(combinedScore);
//     const combinedInsights = generateCombinedInsights(inattentionScore, impulsivityScore, data);

//     return {
//       inattention: {
//         score: inattentionScore,
//         level: inattentionLevel,
//         insights: inattentionInsights
//       },
//       impulsivity: {
//         score: impulsivityScore,
//         level: impulsivityLevel,
//         insights: impulsivityInsights
//       },
//       combined: {
//         score: combinedScore,
//         level: combinedLevel,
//         insights: combinedInsights
//       }
//     };
//   };

//   // Calculate inattention score from 0-100 (higher = more inattentive)
//   const calculateInattentionScore = (data) => {
//     // Factors indicating inattention:
//     // 1. Missed stars
//     const missedStarsFactor = Math.min(data.missedStars * 5, 40);
    
//     // 2. Long reaction times
//     const avgReactionTime = data.averageReactionTime;
//     let reactionTimeFactor = 0;
//     if (avgReactionTime > 1000) reactionTimeFactor = 30;
//     else if (avgReactionTime > 800) reactionTimeFactor = 20;
//     else if (avgReactionTime > 600) reactionTimeFactor = 10;
    
//     // 3. Missed star streaks (consecutive misses)
//     const maxMissedStreak = Math.max(...data.missedStarStreaks, 0);
//     const streakFactor = maxMissedStreak * 10;
    
//     // Calculate final score (cap at 100)
//     return Math.min(missedStarsFactor + reactionTimeFactor + streakFactor, 100);
//   };

//   // Calculate impulsivity score from 0-100 (higher = more impulsive)
//   const calculateImpulsivityScore = (data) => {
//     // Factors indicating impulsivity:
//     // 1. Premature clicks
//     const prematureClicksRatio = data.prematureClicks / 
//       (data.reactionTimes.length + data.prematureClicks) * 100;
//     const prematureClicksFactor = Math.min(prematureClicksRatio, 50);
    
//     // 2. Very fast reaction times (potentially impulsive responses)
//     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
//     const fastResponseRatio = (fastResponses / data.reactionTimes.length) * 100;
//     const fastResponseFactor = Math.min(fastResponseRatio * 0.5, 30);
    
//     // 3. Variability in reaction times (inconsistent behavior)
//     // Calculate standard deviation if we have it
//     let variabilityFactor = 0;
//     if (data.reactionTimeVariability) {
//       if (data.reactionTimeVariability > 300) variabilityFactor = 20;
//       else if (data.reactionTimeVariability > 200) variabilityFactor = 10;
//     }
    
//     // Calculate final score (cap at 100)
//     return Math.min(prematureClicksFactor + fastResponseFactor + variabilityFactor, 100);
//   };

//   // Generate score level based on numerical score
//   const getScoreLevel = (score) => {
//     if (score < 20) return 'Low';
//     if (score < 40) return 'Below Average';
//     if (score < 60) return 'Average';
//     if (score < 80) return 'Above Average';
//     return 'High';
//   };

//   // Generate insights for inattention
//   const generateInattentionInsights = (data, score) => {
//     const insights = [];
    
//     if (data.missedStars > 5) {
//       insights.push("Missed several stars, suggesting potential attention lapses.");
//     }
    
//     if (data.averageReactionTime > 1000) {
//       insights.push("Slower reaction times indicate possible difficulty maintaining focus.");
//     }
    
//     if (Math.max(...data.missedStarStreaks, 0) >= 2) {
//       insights.push("Consecutive missed stars suggest periods of significant inattention.");
//     }
    
//     if (score < 30) {
//       insights.push("Overall attention levels appear strong.");
//     }
    
//     return insights.length > 0 ? insights : ["Attention metrics are within normal ranges."];
//   };

//   // Generate insights for impulsivity
//   const generateImpulsivityInsights = (data, score) => {
//     const insights = [];
    
//     if (data.prematureClicks > data.reactionTimes.length * 0.3) {
//       insights.push("High number of premature clicks suggests impulsive responding.");
//     }
    
//     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
//     if (fastResponses > data.reactionTimes.length * 0.2) {
//       insights.push("Many unusually fast responses may indicate impulsive decision making.");
//     }
    
//     if (data.reactionTimeVariability && data.reactionTimeVariability > 300) {
//       insights.push("High variability in response times suggests inconsistent attention control.");
//     }
    
//     if (score < 30) {
//       insights.push("Shows good impulse control overall.");
//     }
    
//     return insights.length > 0 ? insights : ["Impulsivity metrics are within normal ranges."];
//   };

//   // Generate combined insights
//   const generateCombinedInsights = (inattentionScore, impulsivityScore, data) => {
//     const insights = [];
    
//     if (inattentionScore > 60 && impulsivityScore > 60) {
//       insights.push("Shows both inattentive and impulsive patterns, consider activities to strengthen focus and response control.");
//     } else if (inattentionScore > 60) {
//       insights.push("Primarily shows inattentive patterns. Consider focus-building activities.");
//     } else if (impulsivityScore > 60) {
//       insights.push("Primarily shows impulsive patterns. Consider impulse-control activities.");
//     }
    
//     if (data.score > 200) {
//       insights.push("Despite challenges, achieved a good game score, showing persistence.");
//     }
    
//     if (data.correctStreak > 15) {
//       insights.push("Achieved significant correct streak, demonstrating capacity for sustained attention.");
//     }
    
//     return insights.length > 0 ? insights : ["Overall performance is within typical ranges."];
//   };

//     // Get child-friendly score level
//     const getKidFriendlyLevel = (level) => {
//       switch (level) {
//         case 'Low': return 'Great!';
//         case 'Below Average': return 'Good';
//         case 'Average': return 'Okay';
//         case 'Above Average': return 'Needs Practice';
//         case 'High': return 'Let\'s Work on This';
//         default: return 'Okay';
//       }
//     };
  
//     // Get color based on level for kids UI (less red/harsh colors)
//     const getLevelColor = (level) => {
//       switch (level) {
//         case 'Low': return 'text-emerald-500';
//         case 'Below Average': return 'text-blue-500';
//         case 'Average': return 'text-indigo-500';
//         case 'Above Average': return 'text-purple-500';
//         case 'High': return 'text-orange-500';
//         default: return 'text-gray-500';
//       }
//     };
  
//     // Get progress bar color based on score (kid-friendly colors)
//     const getProgressColor = (score) => {
//       if (score < 30) return 'bg-emerald-400';
//       if (score < 50) return 'bg-blue-400';
//       if (score < 70) return 'bg-indigo-400';
//       if (score < 85) return 'bg-purple-400';
//       return 'bg-orange-400';
//     };
  
//     // Convert insights to kid-friendly language
//     const getKidFriendlyInsights = (insights) => {
//       const friendlyMap = {
//         "Missed several stars": "You missed a few stars. That's okay! Let's practice spotting them.",
//         "Slower reaction times": "You took a little extra time to catch the stars.",
//         "Consecutive missed stars": "Sometimes you missed stars in a row. Let's work on staying focused!",
//         "Overall attention levels appear strong": "You're doing great at paying attention!",
//         "High number of premature clicks": "You clicked a bit early sometimes. Let's practice waiting for the stars!",
//         "Many unusually fast responses": "You're super quick! Sometimes it's good to take a moment before clicking.",
//         "High variability in response times": "Your clicking speed changes a lot. Let's try to be more consistent.",
//         "Shows good impulse control": "You're great at waiting for the right moment!",
//         "Shows both inattentive and impulsive patterns": "Let's practice both waiting for stars and spotting them all.",
//         "Primarily shows inattentive patterns": "Let's practice spotting all the stars!",
//         "Primarily shows impulsive patterns": "Let's practice waiting for the right moment to click!",
//         "Despite challenges, achieved a good game score": "Great job getting a high score!",
//         "Achieved significant correct streak": "Wow! You caught many stars in a row!"
//       };
      
//       return insights.map(insight => {
//         for (const [key, value] of Object.entries(friendlyMap)) {
//           if (insight.includes(key)) return value;
//         }
//         return insight;
//       });
//     };
  
//     if (!gameData) {
//       return <div className="p-4 text-center">Let's play a game and see how you do!</div>;
//     }
  
//     return (
//       <Container>
//         {
//       <div className="container mx-auto p-4 bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl">
//         {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        
//         {showPositiveMessage && (
//           <div className="fixed top-4 right-4 bg-green-100 text-green-800 p-4 rounded-lg shadow-lg animate-bounce">
//             <h3 className="font-bold text-lg">Great job playing!</h3>
//             <p>You're doing awesome!</p>
//           </div>
//         )}
        
//         <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Your Space Adventure Results</h1>
        
//         {/* Achievements Section */}
//         {achievements.length > 0 && (
//           <div className="mb-8">
//             <h2 className="text-xl font-bold mb-4 text-center text-indigo-600 flex items-center justify-center">
//               <Award className="mr-2" size={24} />
//               Your Achievements
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//               {achievements.map((achievement, index) => (
//                 <Card key={index} className="border-2 border-indigo-200 bg-white hover:bg-indigo-50 transition-colors">
//                   <CardHeader className="pb-2 text-center">
//                     <div className="flex justify-center mb-2">
//                       {achievement.icon}
//                     </div>
//                     <CardTitle className="text-lg">{achievement.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="text-center">
//                     <p>{achievement.description}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {/* Progress Chart Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <Card className="border-2 border-blue-200 hover:shadow-md transition-shadow bg-white">
//             <CardHeader className="pb-2">
//               <CardTitle className="flex items-center text-blue-700">
//                 <Brain className="mr-2" size={20} />
//                 <span>Focus Power</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-semibold">{analysisResults.inattention.score.toFixed(1)}</span>
//                 <span className={`font-bold ${getLevelColor(analysisResults.inattention.level)}`}>
//                   {getKidFriendlyLevel(analysisResults.inattention.level)}
//                 </span>
//               </div>
//               <Progress value={analysisResults.inattention.score} className={getProgressColor(analysisResults.inattention.score)} />
//             </CardContent>
//           </Card>
          
//           <Card className="border-2 border-purple-200 hover:shadow-md transition-shadow bg-white">
//             <CardHeader className="pb-2">
//               <CardTitle className="flex items-center text-purple-700">
//                 <Zap className="mr-2" size={20} />
//                 <span>Patience Power</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-semibold">{analysisResults.impulsivity.score.toFixed(1)}</span>
//                 <span className={`font-bold ${getLevelColor(analysisResults.impulsivity.level)}`}>
//                   {getKidFriendlyLevel(analysisResults.impulsivity.level)}
//                 </span>
//               </div>
//               <Progress value={analysisResults.impulsivity.score} className={getProgressColor(analysisResults.impulsivity.score)} />
//             </CardContent>
//           </Card>
          
//           <Card className="border-2 border-indigo-200 hover:shadow-md transition-shadow bg-white">
//             <CardHeader className="pb-2">
//               <CardTitle className="flex items-center text-indigo-700">
//                 <Activity className="mr-2" size={20} />
//                 <span>Overall Superhero Power</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-semibold">{analysisResults.combined.score.toFixed(1)}</span>
//                 <span className={`font-bold ${getLevelColor(analysisResults.combined.level)}`}>
//                   {getKidFriendlyLevel(analysisResults.combined.level)}
//                 </span>
//               </div>
//               <Progress value={analysisResults.combined.score} className={getProgressColor(analysisResults.combined.score)} />
//             </CardContent>
//           </Card>
//         </div>
        
//         {/* Tabs Section */}
//         <Tabs defaultValue="metrics" value={selectedTab} onValueChange={setSelectedTab}>
//           <TabsList className="grid w-full grid-cols-3 rounded-full bg-indigo-100">
//             <TabsTrigger value="metrics" className="rounded-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
//               Your Game Stats
//             </TabsTrigger>
//             <TabsTrigger value="insights" className="rounded-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
//               Star Mission Report
//             </TabsTrigger>
//             <TabsTrigger value="recommendations" className="rounded-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
//               Power-Up Activities
//             </TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="metrics" className="mt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <Card className="bg-white border-2 border-yellow-200 hover:shadow-lg transition-shadow">
//                 <CardHeader className="pb-2 bg-yellow-50 rounded-t-lg">
//                   <CardTitle className="text-lg flex items-center text-yellow-700">
//                     <Star className="mr-2" size={20} />
//                     <span>Stars Collected</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-4">
//                   <p className="text-4xl font-bold text-center text-yellow-600">{gameData.score}</p>
//                   <p className="text-center text-gray-500 mt-2">points</p>
//                 </CardContent>
//               </Card>
              
//               <Card className="bg-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
//                 <CardHeader className="pb-2 bg-blue-50 rounded-t-lg">
//                   <CardTitle className="text-lg flex items-center text-blue-700">
//                     <Clock className="mr-2" size={20} />
//                     <span>Speed Power</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-4">
//                   <p className="text-4xl font-bold text-center text-blue-600">{gameData.averageReactionTime.toFixed(0)}</p>
//                   <p className="text-center text-gray-500 mt-2">milliseconds</p>
//                 </CardContent>
//               </Card>
              
//               <Card className="bg-white border-2 border-green-200 hover:shadow-lg transition-shadow">
//                 <CardHeader className="pb-2 bg-green-50 rounded-t-lg">
//                   <CardTitle className="text-lg flex items-center text-green-700">
//                     <TrendingUp className="mr-2" size={20} />
//                     <span>Best Streak</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-4">
//                   <p className="text-4xl font-bold text-center text-green-600">{gameData.correctStreak}</p>
//                   <p className="text-center text-gray-500 mt-2">stars in a row</p>
//                 </CardContent>
//               </Card>
              
//               <Card className="bg-white border-2 border-red-200 hover:shadow-lg transition-shadow">
//                 <CardHeader className="pb-2 bg-red-50 rounded-t-lg">
//                   <CardTitle className="text-lg flex items-center text-red-700">
//                     <XCircle className="mr-2" size={20} />
//                     <span>Missed Stars</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-4">
//                   <p className="text-4xl font-bold text-center text-red-600">{gameData.missedStars}</p>
//                   <p className="text-center text-gray-500 mt-2">stars missed</p>
//                 </CardContent>
//               </Card>
              
//               <Card className="bg-white border-2 border-orange-200 hover:shadow-lg transition-shadow">
//                 <CardHeader className="pb-2 bg-orange-50 rounded-t-lg">
//                   <CardTitle className="text-lg flex items-center text-orange-700">
//                     <AlertCircle className="mr-2" size={20} />
//                     <span>Early Clicks</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-4">
//                   <p className="text-4xl font-bold text-center text-orange-600">{gameData.prematureClicks}</p>
//                   <p className="text-center text-gray-500 mt-2">times</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="insights" className="mt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Card className="bg-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
//                 <CardHeader className="bg-blue-50 rounded-t-lg">
//                   <CardTitle className="flex items-center text-blue-700">
//                     <Brain className="mr-2" size={20} />
//                     Focus Mission Report
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-4">
//                   <ul className="space-y-3">
//                     {getKidFriendlyInsights(analysisResults.inattention.insights).map((insight, index) => (
//                       <li key={index} className="flex items-start">
//                         <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
//                           <Brain size={16} className="text-blue-600" />
//                         </div>
//                         <span>{insight}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
              
//               <Card className="bg-white border-2 border-purple-200 hover:shadow-lg transition-shadow">
//                 <CardHeader className="bg-purple-50 rounded-t-lg">
//                   <CardTitle className="flex items-center text-purple-700">
//                     <Zap className="mr-2" size={20} />
//                     Patience Mission Report
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-4">
//                   <ul className="space-y-3">
//                     {getKidFriendlyInsights(analysisResults.impulsivity.insights).map((insight, index) => (
//                       <li key={index} className="flex items-start">
//                         <div className="bg-purple-100 p-1 rounded-full mr-2 mt-1">
//                           <Zap size={16} className="text-purple-600" />
//                         </div>
//                         <span>{insight}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="recommendations" className="mt-4">
//             <Card className="bg-white border-2 border-indigo-200 hover:shadow-lg transition-shadow">
//               <CardHeader className="bg-indigo-50 rounded-t-lg">
//                 <CardTitle className="text-indigo-700">Your Super Power Activities</CardTitle>
//                 <CardDescription>
//                   Fun things to try that can help boost your brain powers!
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="pt-4">
//                 <div className="space-y-4">
//                   {analysisResults.inattention.score > 50 && (
//                     <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                       <h3 className="font-bold flex items-center mb-2 text-blue-700">
//                         <Brain className="mr-2" size={18} />
//                         Focus Power Activities
//                       </h3>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
//                         <div className="bg-white p-3 rounded-lg shadow-sm flex items-start">
//                           <div className="bg-blue-100 p-2 rounded-full mr-3">
//                             <Clock size={16} className="text-blue-600" />
//                           </div>
//                           <div>
//                             <p className="font-semibold">Breathing Game</p>
//                             <p className="text-sm">Take 5 slow breaths, counting to 5 each time</p>
//                           </div>
//                         </div>
//                         <div className="bg-white p-3 rounded-lg shadow-sm flex items-start">
//                           <div className="bg-blue-100 p-2 rounded-full mr-3">
//                             <Target size={16} className="text-blue-600" />
//                           </div>
//                           <div>
//                             <p className="font-semibold">I Spy Game</p>
//                             <p className="text-sm">Find 5 blue things around you</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
                  
//                   {analysisResults.impulsivity.score > 50 && (
//                     <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
//                       <h3 className="font-bold flex items-center mb-2 text-purple-700">
//                         <Zap className="mr-2" size={18} />
//                         Patience Power Activities
//                       </h3>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
//                         <div className="bg-white p-3 rounded-lg shadow-sm flex items-start">
//                           <div className="bg-purple-100 p-2 rounded-full mr-3">
//                             <Clock size={16} className="text-purple-600" />
//                           </div>
//                           <div>
//                             <p className="font-semibold">Freeze Dance</p>
//                             <p className="text-sm">Dance when music plays, freeze when it stops!</p>
//                           </div>
//                         </div>
//                         <div className="bg-white p-3 rounded-lg shadow-sm flex items-start">
//                           <div className="bg-purple-100 p-2 rounded-full mr-3">
//                             <Activity size={16} className="text-purple-600" />
//                           </div>
//                           <div>
//                             <p className="font-semibold">Red Light, Green Light</p>
//                             <p className="text-sm">Practice stopping and going with a friend</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//                     <h3 className="font-bold flex items-center mb-2 text-green-700">
//                       <Activity className="mr-2" size={18} />
//                       Brain Boost Activities
//                     </h3>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
//                       <div className="bg-white p-3 rounded-lg shadow-sm flex items-start">
//                         <div className="bg-green-100 p-2 rounded-full mr-3">
//                           <Target size={16} className="text-green-600" />
//                         </div>
//                         <div>
//                           <p className="font-semibold">Super Sleep</p>
//                           <p className="text-sm">Try to go to bed at the same time every night</p>
//                         </div>
//                       </div>
//                       <div className="bg-white p-3 rounded-lg shadow-sm flex items-start">
//                         <div className="bg-green-100 p-2 rounded-full mr-3">
//                           <Star size={16} className="text-green-600" />
//                         </div>
//                         <div>
//                           <p className="font-semibold">Body Power</p>
//                           <p className="text-sm">Jump, run, or dance for 15 minutes each day</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
        
//         {/* Progress Tracker */}
//         <div className="mt-8 text-center">
//           <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition hover:scale-105">
//             Play Again!
//           </button>
//           <p className="mt-4 text-indigo-600 font-medium">Keep playing to earn more achievements!</p>
//         </div>
//       </div>}
//       </Container>
//     );
//   };
  
//   export default GameAnalytics;

// // // // import React, { useState, useEffect } from 'react';
// // // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// // // // import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// // // // import { Progress } from './ui/progress';
// // // // import { AlertCircle, Activity, Brain, Clock, BarChart2, Zap, Target, XCircle, TrendingUp, Award } from 'lucide-react';
// // // // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// // // const GameAnalytics = ({ gameData }) => {
// // //   const [analysisResults, setAnalysisResults] = useState({
// // //     inattention: { score: 0, level: '', insights: [] },
// // //     impulsivity: { score: 0, level: '', insights: [] },
// // //     combined: { score: 0, level: '', insights: [] }
// // //   });
// // //   const [activeInsight, setActiveInsight] = useState(null);
// // //   const [showTrends, setShowTrends] = useState(false);

// // //   useEffect(() => {
// // //     if (gameData) {
// // //       if (gameData.reactionTimes && gameData.reactionTimes.length > 0) {
// // //         const mean = gameData.averageReactionTime;
// // //         const variance = gameData.reactionTimes.reduce((sum, time) => 
// // //           sum + Math.pow(time - mean, 2), 0) / gameData.reactionTimes.length;
// // //         gameData.reactionTimeVariability = Math.sqrt(variance);
// // //       }
// // //       const results = analyzeGameData(gameData);
// // //       setAnalysisResults(results);
// // //     }
// // //   }, [gameData]);

// // //   // All the analysis functions remain the same
// // //   const analyzeGameData = (data) => {
// // //     // 1. Inattention Analysis
// // //     const inattentionScore = calculateInattentionScore(data);
// // //     const inattentionLevel = getScoreLevel(inattentionScore);
// // //     const inattentionInsights = generateInattentionInsights(data, inattentionScore);

// // //     // 2. Impulsivity Analysis
// // //     const impulsivityScore = calculateImpulsivityScore(data);
// // //     const impulsivityLevel = getScoreLevel(impulsivityScore);
// // //     const impulsivityInsights = generateImpulsivityInsights(data, impulsivityScore);

// // //     // 3. Combined Analysis
// // //     const combinedScore = (inattentionScore + impulsivityScore) / 2;
// // //     const combinedLevel = getScoreLevel(combinedScore);
// // //     const combinedInsights = generateCombinedInsights(inattentionScore, impulsivityScore, data);

// // //     return {
// // //       inattention: {
// // //         score: inattentionScore,
// // //         level: inattentionLevel,
// // //         insights: inattentionInsights
// // //       },
// // //       impulsivity: {
// // //         score: impulsivityScore,
// // //         level: impulsivityLevel,
// // //         insights: impulsivityInsights
// // //       },
// // //       combined: {
// // //         score: combinedScore,
// // //         level: combinedLevel,
// // //         insights: combinedInsights
// // //       }
// // //     };
// // //   };

// // //   // All calculation functions remain unchanged
// // //   const calculateInattentionScore = (data) => {
// // //     const missedStarsFactor = Math.min(data.missedStars * 5, 40);
    
// // //     const avgReactionTime = data.averageReactionTime;
// // //     let reactionTimeFactor = 0;
// // //     if (avgReactionTime > 1000) reactionTimeFactor = 30;
// // //     else if (avgReactionTime > 800) reactionTimeFactor = 20;
// // //     else if (avgReactionTime > 600) reactionTimeFactor = 10;
    
// // //     const maxMissedStreak = Math.max(...data.missedStarStreaks, 0);
// // //     const streakFactor = maxMissedStreak * 10;
    
// // //     return Math.min(missedStarsFactor + reactionTimeFactor + streakFactor, 100);
// // //   };

// // //   const calculateImpulsivityScore = (data) => {
// // //     const prematureClicksRatio = data.prematureClicks / 
// // //       (data.reactionTimes.length + data.prematureClicks) * 100;
// // //     const prematureClicksFactor = Math.min(prematureClicksRatio, 50);
    
// // //     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
// // //     const fastResponseRatio = (fastResponses / data.reactionTimes.length) * 100;
// // //     const fastResponseFactor = Math.min(fastResponseRatio * 0.5, 30);
    
// // //     let variabilityFactor = 0;
// // //     if (data.reactionTimeVariability) {
// // //       if (data.reactionTimeVariability > 300) variabilityFactor = 20;
// // //       else if (data.reactionTimeVariability > 200) variabilityFactor = 10;
// // //     }
    
// // //     return Math.min(prematureClicksFactor + fastResponseFactor + variabilityFactor, 100);
// // //   };

// // //   const getScoreLevel = (score) => {
// // //     if (score < 20) return 'Low';
// // //     if (score < 40) return 'Below Average';
// // //     if (score < 60) return 'Average';
// // //     if (score < 80) return 'Above Average';
// // //     return 'High';
// // //   };

// // //   const generateInattentionInsights = (data, score) => {
// // //     const insights = [];
    
// // //     if (data.missedStars > 5) {
// // //       insights.push("Missed several stars, suggesting potential attention lapses.");
// // //     }
    
// // //     if (data.averageReactionTime > 1000) {
// // //       insights.push("Slower reaction times indicate possible difficulty maintaining focus.");
// // //     }
    
// // //     if (Math.max(...data.missedStarStreaks, 0) >= 2) {
// // //       insights.push("Consecutive missed stars suggest periods of significant inattention.");
// // //     }
    
// // //     if (score < 30) {
// // //       insights.push("Overall attention levels appear strong.");
// // //     }
    
// // //     return insights.length > 0 ? insights : ["Attention metrics are within normal ranges."];
// // //   };

// // //   const generateImpulsivityInsights = (data, score) => {
// // //     const insights = [];
    
// // //     if (data.prematureClicks > data.reactionTimes.length * 0.3) {
// // //       insights.push("High number of premature clicks suggests impulsive responding.");
// // //     }
    
// // //     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
// // //     if (fastResponses > data.reactionTimes.length * 0.2) {
// // //       insights.push("Many unusually fast responses may indicate impulsive decision making.");
// // //     }
    
// // //     if (data.reactionTimeVariability && data.reactionTimeVariability > 300) {
// // //       insights.push("High variability in response times suggests inconsistent attention control.");
// // //     }
    
// // //     if (score < 30) {
// // //       insights.push("Shows good impulse control overall.");
// // //     }
    
// // //     return insights.length > 0 ? insights : ["Impulsivity metrics are within normal ranges."];
// // //   };

// // //   const generateCombinedInsights = (inattentionScore, impulsivityScore, data) => {
// // //     const insights = [];
    
// // //     if (inattentionScore > 60 && impulsivityScore > 60) {
// // //       insights.push("Shows both inattentive and impulsive patterns, consider activities to strengthen focus and response control.");
// // //     } else if (inattentionScore > 60) {
// // //       insights.push("Primarily shows inattentive patterns. Consider focus-building activities.");
// // //     } else if (impulsivityScore > 60) {
// // //       insights.push("Primarily shows impulsive patterns. Consider impulse-control activities.");
// // //     }
    
// // //     if (data.score > 200) {
// // //       insights.push("Despite challenges, achieved a good game score, showing persistence.");
// // //     }
    
// // //     if (data.correctStreak > 15) {
// // //       insights.push("Achieved significant correct streak, demonstrating capacity for sustained attention.");
// // //     }
    
// // //     return insights.length > 0 ? insights : ["Overall performance is within typical ranges."];
// // //   };

// // //   // Get color based on level - enhanced with more vibrant colors
// // //   const getLevelColor = (level) => {
// // //     switch (level) {
// // //       case 'Low': return 'text-emerald-500';
// // //       case 'Below Average': return 'text-blue-500';
// // //       case 'Average': return 'text-amber-500';
// // //       case 'Above Average': return 'text-orange-500';
// // //       case 'High': return 'text-red-500';
// // //       default: return 'text-gray-500';
// // //     }
// // //   };

// // //   // Get background color for cards based on level
// // //   const getLevelBgColor = (level) => {
// // //     switch (level) {
// // //       case 'Low': return 'bg-emerald-50 border-emerald-200';
// // //       case 'Below Average': return 'bg-blue-50 border-blue-200';
// // //       case 'Average': return 'bg-amber-50 border-amber-200';
// // //       case 'Above Average': return 'bg-orange-50 border-orange-200';
// // //       case 'High': return 'bg-red-50 border-red-200';
// // //       default: return 'bg-gray-50 border-gray-200';
// // //     }
// // //   };

// // //   // Get progress bar color based on score - enhanced with gradient options
// // //   const getProgressColor = (score) => {
// // //     if (score < 30) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
// // //     if (score < 50) return 'bg-gradient-to-r from-blue-400 to-blue-500';
// // //     if (score < 70) return 'bg-gradient-to-r from-amber-400 to-amber-500';
// // //     if (score < 85) return 'bg-gradient-to-r from-orange-400 to-orange-500';
// // //     return 'bg-gradient-to-r from-red-400 to-red-500';
// // //   };

// // //   // NEW: Generate reaction time chart data
// // //   const getReactionTimeData = () => {
// // //     if (!gameData?.reactionTimes || gameData.reactionTimes.length === 0) return [];
    
// // //     return gameData.reactionTimes.map((time, index) => ({
// // //       name: `Star ${index + 1}`,
// // //       time: time
// // //     }));
// // //   };

// // //   // NEW: Function to create gauge-style visualization
// // //   const renderRadialGauge = (score, label, color) => {
// // //     const rotation = (score / 100) * 180;
    
// // //     return (
// // //       <div className="relative h-32 flex flex-col items-center justify-center mb-2">
// // //         <div className="w-full flex justify-center">
// // //           <div className="relative h-16 w-32">
// // //             {/* Background arc */}
// // //             <div className="absolute h-16 w-32 rounded-t-full overflow-hidden bg-gray-200"></div>
// // //             {/* Colored fill */}
// // //             <div 
// // //               className={`absolute h-16 w-32 rounded-t-full overflow-hidden ${color}`} 
// // //               style={{ 
// // //                 clipPath: `polygon(50% 100%, 0 100%, 0 100%, 0 0, 100% 0, 100% 100%, 50% 100%)`,
// // //                 transform: `rotate(${rotation}deg)`,
// // //                 transformOrigin: 'bottom center'
// // //               }}>
// // //             </div>
// // //             {/* Center dot */}
// // //             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full"></div>
// // //             {/* Needle */}
// // //             <div 
// // //               className="absolute bottom-0 left-1/2 h-16 w-1 bg-gray-800 rounded-t-full"
// // //               style={{ 
// // //                 transform: `translateX(-50%) rotate(${rotation}deg)`,
// // //                 transformOrigin: 'bottom center'  
// // //               }}
// // //             ></div>
// // //           </div>
// // //         </div>
// // //         <div className="mt-2 text-center">
// // //           <div className="text-xl font-bold">{score.toFixed(1)}</div>
// // //           <div className="text-sm text-gray-600">{label}</div>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // NEW: Tooltip component for insights
// // //   const InsightTooltip = ({ insight, visible, onClose }) => {
// // //     if (!visible) return null;
    
// // //     return (
// // //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
// // //         <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg" onClick={e => e.stopPropagation()}>
// // //           <h3 className="text-xl font-bold mb-4">Understanding This Insight</h3>
// // //           <p className="mb-4">{insight}</p>
// // //           <div className="mb-4">
// // //             <h4 className="font-semibold mb-2">What This Means:</h4>
// // //             <p>This pattern may indicate specific cognitive processing tendencies related to attention and response control.</p>
// // //           </div>
// // //           <div className="mb-4">
// // //             <h4 className="font-semibold mb-2">Potential Actions:</h4>
// // //             <ul className="list-disc pl-5">
// // //               <li>Consider targeted exercises that strengthen this cognitive domain</li>
// // //               <li>Track this metric over time to see improvements</li>
// // //               <li>Discuss this pattern with a cognitive specialist if it persists</li>
// // //             </ul>
// // //           </div>
// // //           <button 
// // //             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // //             onClick={onClose}
// // //           >
// // //             Close
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // NEW: Mock trend data (in a real app, this would come from historical data)
// // //   const trendData = [
// // //     { date: 'Week 1', attention: 75, impulsivity: 62 },
// // //     { date: 'Week 2', attention: 70, impulsivity: 58 },
// // //     { date: 'Week 3', attention: 65, impulsivity: 55 },
// // //     { date: 'Week 4', attention: 60, impulsivity: 50 },
// // //     { date: 'Week 5', attention: 55, impulsivity: 48 },
// // //     { date: 'Current', attention: analysisResults.inattention.score, impulsivity: analysisResults.impulsivity.score },
// // //   ];

// // //   if (!gameData) {
// // //     return <div className="p-4">No game data available</div>;
// // //   }

// // //   return (
// // //     <div className="container mx-auto p-4">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <h1 className="text-2xl font-bold">Game Performance Analytics</h1>
// // //         <button 
// // //           onClick={() => setShowTrends(!showTrends)}
// // //           className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
// // //         >
// // //           <TrendingUp className="mr-2" size={18} />
// // //           {showTrends ? "Hide Trends" : "Show Trends"}
// // //         </button>
// // //       </div>
      
// // //       {/* NEW: Trend Chart Section */}
// // //       {showTrends && (
// // //         <Card className="mb-8 overflow-hidden">
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <TrendingUp className="mr-2" size={20} />
// // //               <span>Performance Trends Over Time</span>
// // //             </CardTitle>
// // //             <CardDescription>
// // //               Track your progress across multiple gameplay sessions
// // //             </CardDescription>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="h-64 w-full">
// // //               <ResponsiveContainer width="100%" height="100%">
// // //                 <LineChart
// // //                   data={trendData}
// // //                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// // //                 >
// // //                   <CartesianGrid strokeDasharray="3 3" />
// // //                   <XAxis dataKey="date" />
// // //                   <YAxis />
// // //                   <Tooltip />
// // //                   <Line 
// // //                     type="monotone" 
// // //                     name="Attention Score" 
// // //                     dataKey="attention" 
// // //                     stroke="#ef4444" 
// // //                     activeDot={{ r: 8 }}
// // //                     strokeWidth={2}
// // //                   />
// // //                   <Line 
// // //                     type="monotone" 
// // //                     name="Impulsivity Score" 
// // //                     dataKey="impulsivity" 
// // //                     stroke="#3b82f6" 
// // //                     strokeWidth={2}
// // //                   />
// // //                 </LineChart>
// // //               </ResponsiveContainer>
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       )}
      
// // //       {/* Score Overview Cards - Enhanced with animations and gauges */}
// // //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
// // //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.inattention.level)}`}>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <Brain className="mr-2" size={20} />
// // //               <span>Attention Score</span>
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             {/* NEW: Radial gauge replaces simple progress bar */}
// // //             {renderRadialGauge(
// // //               analysisResults.inattention.score, 
// // //               analysisResults.inattention.level,
// // //               getProgressColor(analysisResults.inattention.score)
// // //             )}
// // //           </CardContent>
// // //         </Card>
        
// // //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.impulsivity.level)}`}>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <Zap className="mr-2" size={20} />
// // //               <span>Impulsivity Score</span>
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             {renderRadialGauge(
// // //               analysisResults.impulsivity.score, 
// // //               analysisResults.impulsivity.level,
// // //               getProgressColor(analysisResults.impulsivity.score)
// // //             )}
// // //           </CardContent>
// // //         </Card>
        
// // //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.combined.level)}`}>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <Activity className="mr-2" size={20} />
// // //               <span>Combined Score</span>
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             {renderRadialGauge(
// // //               analysisResults.combined.score, 
// // //               analysisResults.combined.level,
// // //               getProgressColor(analysisResults.combined.score)
// // //             )}
// // //           </CardContent>
// // //         </Card>
// // //       </div>
      
// // //       {/* NEW: Achievement Card */}
// // //       {gameData.correctStreak > 10 && (
// // //         <Card className="mb-8 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300">
// // //           <CardContent className="p-4">
// // //             <div className="flex items-center">
// // //               <div className="mr-4 bg-amber-400 rounded-full p-3">
// // //                 <Award size={24} className="text-white" />
// // //               </div>
// // //               <div>
// // //                 <h3import React, { useState, useEffect } from 'react';
// // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// // // import { Progress } from './ui/progress';
// // // import { AlertCircle, Activity, Brain, Clock, BarChart2, Zap, Target, XCircle, TrendingUp, Award } from 'lucide-react';
// // // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// // // const GameAnalytics = ({ gameData }) => {
// // //   const [analysisResults, setAnalysisResults] = useState({
// // //     inattention: { score: 0, level: '', insights: [] },
// // //     impulsivity: { score: 0, level: '', insights: [] },
// // //     combined: { score: 0, level: '', insights: [] }
// // //   });
// // //   const [activeInsight, setActiveInsight] = useState(null);
// // //   const [showTrends, setShowTrends] = useState(false);

// // //   useEffect(() => {
// // //     if (gameData) {
// // //       if (gameData.reactionTimes && gameData.reactionTimes.length > 0) {
// // //         const mean = gameData.averageReactionTime;
// // //         const variance = gameData.reactionTimes.reduce((sum, time) => 
// // //           sum + Math.pow(time - mean, 2), 0) / gameData.reactionTimes.length;
// // //         gameData.reactionTimeVariability = Math.sqrt(variance);
// // //       }
// // //       const results = analyzeGameData(gameData);
// // //       setAnalysisResults(results);
// // //     }
// // //   }, [gameData]);

// // //   // All the analysis functions remain the same
// // //   const analyzeGameData = (data) => {
// // //     // 1. Inattention Analysis
// // //     const inattentionScore = calculateInattentionScore(data);
// // //     const inattentionLevel = getScoreLevel(inattentionScore);
// // //     const inattentionInsights = generateInattentionInsights(data, inattentionScore);

// // //     // 2. Impulsivity Analysis
// // //     const impulsivityScore = calculateImpulsivityScore(data);
// // //     const impulsivityLevel = getScoreLevel(impulsivityScore);
// // //     const impulsivityInsights = generateImpulsivityInsights(data, impulsivityScore);

// // //     // 3. Combined Analysis
// // //     const combinedScore = (inattentionScore + impulsivityScore) / 2;
// // //     const combinedLevel = getScoreLevel(combinedScore);
// // //     const combinedInsights = generateCombinedInsights(inattentionScore, impulsivityScore, data);

// // //     return {
// // //       inattention: {
// // //         score: inattentionScore,
// // //         level: inattentionLevel,
// // //         insights: inattentionInsights
// // //       },
// // //       impulsivity: {
// // //         score: impulsivityScore,
// // //         level: impulsivityLevel,
// // //         insights: impulsivityInsights
// // //       },
// // //       combined: {
// // //         score: combinedScore,
// // //         level: combinedLevel,
// // //         insights: combinedInsights
// // //       }
// // //     };
// // //   };

// // //   // All calculation functions remain unchanged
// // //   const calculateInattentionScore = (data) => {
// // //     const missedStarsFactor = Math.min(data.missedStars * 5, 40);
    
// // //     const avgReactionTime = data.averageReactionTime;
// // //     let reactionTimeFactor = 0;
// // //     if (avgReactionTime > 1000) reactionTimeFactor = 30;
// // //     else if (avgReactionTime > 800) reactionTimeFactor = 20;
// // //     else if (avgReactionTime > 600) reactionTimeFactor = 10;
    
// // //     const maxMissedStreak = Math.max(...data.missedStarStreaks, 0);
// // //     const streakFactor = maxMissedStreak * 10;
    
// // //     return Math.min(missedStarsFactor + reactionTimeFactor + streakFactor, 100);
// // //   };

// // //   const calculateImpulsivityScore = (data) => {
// // //     const prematureClicksRatio = data.prematureClicks / 
// // //       (data.reactionTimes.length + data.prematureClicks) * 100;
// // //     const prematureClicksFactor = Math.min(prematureClicksRatio, 50);
    
// // //     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
// // //     const fastResponseRatio = (fastResponses / data.reactionTimes.length) * 100;
// // //     const fastResponseFactor = Math.min(fastResponseRatio * 0.5, 30);
    
// // //     let variabilityFactor = 0;
// // //     if (data.reactionTimeVariability) {
// // //       if (data.reactionTimeVariability > 300) variabilityFactor = 20;
// // //       else if (data.reactionTimeVariability > 200) variabilityFactor = 10;
// // //     }
    
// // //     return Math.min(prematureClicksFactor + fastResponseFactor + variabilityFactor, 100);
// // //   };

// // //   const getScoreLevel = (score) => {
// // //     if (score < 20) return 'Low';
// // //     if (score < 40) return 'Below Average';
// // //     if (score < 60) return 'Average';
// // //     if (score < 80) return 'Above Average';
// // //     return 'High';
// // //   };

// // //   const generateInattentionInsights = (data, score) => {
// // //     const insights = [];
    
// // //     if (data.missedStars > 5) {
// // //       insights.push("Missed several stars, suggesting potential attention lapses.");
// // //     }
    
// // //     if (data.averageReactionTime > 1000) {
// // //       insights.push("Slower reaction times indicate possible difficulty maintaining focus.");
// // //     }
    
// // //     if (Math.max(...data.missedStarStreaks, 0) >= 2) {
// // //       insights.push("Consecutive missed stars suggest periods of significant inattention.");
// // //     }
    
// // //     if (score < 30) {
// // //       insights.push("Overall attention levels appear strong.");
// // //     }
    
// // //     return insights.length > 0 ? insights : ["Attention metrics are within normal ranges."];
// // //   };

// // //   const generateImpulsivityInsights = (data, score) => {
// // //     const insights = [];
    
// // //     if (data.prematureClicks > data.reactionTimes.length * 0.3) {
// // //       insights.push("High number of premature clicks suggests impulsive responding.");
// // //     }
    
// // //     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
// // //     if (fastResponses > data.reactionTimes.length * 0.2) {
// // //       insights.push("Many unusually fast responses may indicate impulsive decision making.");
// // //     }
    
// // //     if (data.reactionTimeVariability && data.reactionTimeVariability > 300) {
// // //       insights.push("High variability in response times suggests inconsistent attention control.");
// // //     }
    
// // //     if (score < 30) {
// // //       insights.push("Shows good impulse control overall.");
// // //     }
    
// // //     return insights.length > 0 ? insights : ["Impulsivity metrics are within normal ranges."];
// // //   };

// // //   const generateCombinedInsights = (inattentionScore, impulsivityScore, data) => {
// // //     const insights = [];
    
// // //     if (inattentionScore > 60 && impulsivityScore > 60) {
// // //       insights.push("Shows both inattentive and impulsive patterns, consider activities to strengthen focus and response control.");
// // //     } else if (inattentionScore > 60) {
// // //       insights.push("Primarily shows inattentive patterns. Consider focus-building activities.");
// // //     } else if (impulsivityScore > 60) {
// // //       insights.push("Primarily shows impulsive patterns. Consider impulse-control activities.");
// // //     }
    
// // //     if (data.score > 200) {
// // //       insights.push("Despite challenges, achieved a good game score, showing persistence.");
// // //     }
    
// // //     if (data.correctStreak > 15) {
// // //       insights.push("Achieved significant correct streak, demonstrating capacity for sustained attention.");
// // //     }
    
// // //     return insights.length > 0 ? insights : ["Overall performance is within typical ranges."];
// // //   };

// // //   // Get color based on level - enhanced with more vibrant colors
// // //   const getLevelColor = (level) => {
// // //     switch (level) {
// // //       case 'Low': return 'text-emerald-500';
// // //       case 'Below Average': return 'text-blue-500';
// // //       case 'Average': return 'text-amber-500';
// // //       case 'Above Average': return 'text-orange-500';
// // //       case 'High': return 'text-red-500';
// // //       default: return 'text-gray-500';
// // //     }
// // //   };

// // //   // Get background color for cards based on level
// // //   const getLevelBgColor = (level) => {
// // //     switch (level) {
// // //       case 'Low': return 'bg-emerald-50 border-emerald-200';
// // //       case 'Below Average': return 'bg-blue-50 border-blue-200';
// // //       case 'Average': return 'bg-amber-50 border-amber-200';
// // //       case 'Above Average': return 'bg-orange-50 border-orange-200';
// // //       case 'High': return 'bg-red-50 border-red-200';
// // //       default: return 'bg-gray-50 border-gray-200';
// // //     }
// // //   };

// // //   // Get progress bar color based on score - enhanced with gradient options
// // //   const getProgressColor = (score) => {
// // //     if (score < 30) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
// // //     if (score < 50) return 'bg-gradient-to-r from-blue-400 to-blue-500';
// // //     if (score < 70) return 'bg-gradient-to-r from-amber-400 to-amber-500';
// // //     if (score < 85) return 'bg-gradient-to-r from-orange-400 to-orange-500';
// // //     return 'bg-gradient-to-r from-red-400 to-red-500';
// // //   };

// // //   // NEW: Generate reaction time chart data
// // //   const getReactionTimeData = () => {
// // //     if (!gameData?.reactionTimes || gameData.reactionTimes.length === 0) return [];
    
// // //     return gameData.reactionTimes.map((time, index) => ({
// // //       name: `Star ${index + 1}`,
// // //       time: time
// // //     }));
// // //   };

// // //   // NEW: Function to create gauge-style visualization
// // //   const renderRadialGauge = (score, label, color) => {
// // //     const rotation = (score / 100) * 180;
    
// // //     return (
// // //       <div className="relative h-32 flex flex-col items-center justify-center mb-2">
// // //         <div className="w-full flex justify-center">
// // //           <div className="relative h-16 w-32">
// // //             {/* Background arc */}
// // //             <div className="absolute h-16 w-32 rounded-t-full overflow-hidden bg-gray-200"></div>
// // //             {/* Colored fill */}
// // //             <div 
// // //               className={`absolute h-16 w-32 rounded-t-full overflow-hidden ${color}`} 
// // //               style={{ 
// // //                 clipPath: `polygon(50% 100%, 0 100%, 0 100%, 0 0, 100% 0, 100% 100%, 50% 100%)`,
// // //                 transform: `rotate(${rotation}deg)`,
// // //                 transformOrigin: 'bottom center'
// // //               }}>
// // //             </div>
// // //             {/* Center dot */}
// // //             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full"></div>
// // //             {/* Needle */}
// // //             <div 
// // //               className="absolute bottom-0 left-1/2 h-16 w-1 bg-gray-800 rounded-t-full"
// // //               style={{ 
// // //                 transform: `translateX(-50%) rotate(${rotation}deg)`,
// // //                 transformOrigin: 'bottom center'  
// // //               }}
// // //             ></div>
// // //           </div>
// // //         </div>
// // //         <div className="mt-2 text-center">
// // //           <div className="text-xl font-bold">{score.toFixed(1)}</div>
// // //           <div className="text-sm text-gray-600">{label}</div>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // NEW: Tooltip component for insights
// // //   const InsightTooltip = ({ insight, visible, onClose }) => {
// // //     if (!visible) return null;
    
// // //     return (
// // //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
// // //         <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg" onClick={e => e.stopPropagation()}>
// // //           <h3 className="text-xl font-bold mb-4">Understanding This Insight</h3>
// // //           <p className="mb-4">{insight}</p>
// // //           <div className="mb-4">
// // //             <h4 className="font-semibold mb-2">What This Means:</h4>
// // //             <p>This pattern may indicate specific cognitive processing tendencies related to attention and response control.</p>
// // //           </div>
// // //           <div className="mb-4">
// // //             <h4 className="font-semibold mb-2">Potential Actions:</h4>
// // //             <ul className="list-disc pl-5">
// // //               <li>Consider targeted exercises that strengthen this cognitive domain</li>
// // //               <li>Track this metric over time to see improvements</li>
// // //               <li>Discuss this pattern with a cognitive specialist if it persists</li>
// // //             </ul>
// // //           </div>
// // //           <button 
// // //             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // //             onClick={onClose}
// // //           >
// // //             Close
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // NEW: Mock trend data (in a real app, this would come from historical data)
// // //   const trendData = [
// // //     { date: 'Week 1', attention: 75, impulsivity: 62 },
// // //     { date: 'Week 2', attention: 70, impulsivity: 58 },
// // //     { date: 'Week 3', attention: 65, impulsivity: 55 },
// // //     { date: 'Week 4', attention: 60, impulsivity: 50 },
// // //     { date: 'Week 5', attention: 55, impulsivity: 48 },
// // //     { date: 'Current', attention: analysisResults.inattention.score, impulsivity: analysisResults.impulsivity.score },
// // //   ];

// // //   if (!gameData) {
// // //     return <div className="p-4">No game data available</div>;
// // //   }

// // //   return (
// // //     <div className="container mx-auto p-4">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <h1 className="text-2xl font-bold">Game Performance Analytics</h1>
// // //         <button 
// // //           onClick={() => setShowTrends(!showTrends)}
// // //           className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
// // //         >
// // //           <TrendingUp className="mr-2" size={18} />
// // //           {showTrends ? "Hide Trends" : "Show Trends"}
// // //         </button>
// // //       </div>
      
// // //       {/* NEW: Trend Chart Section */}
// // //       {showTrends && (
// // //         <Card className="mb-8 overflow-hidden">
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <TrendingUp className="mr-2" size={20} />
// // //               <span>Performance Trends Over Time</span>
// // //             </CardTitle>
// // //             <CardDescription>
// // //               Track your progress across multiple gameplay sessions
// // //             </CardDescription>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="h-64 w-full">
// // //               <ResponsiveContainer width="100%" height="100%">
// // //                 <LineChart
// // //                   data={trendData}
// // //                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// // //                 >
// // //                   <CartesianGrid strokeDasharray="3 3" />
// // //                   <XAxis dataKey="date" />
// // //                   <YAxis />
// // //                   <Tooltip />
// // //                   <Line 
// // //                     type="monotone" 
// // //                     name="Attention Score" 
// // //                     dataKey="attention" 
// // //                     stroke="#ef4444" 
// // //                     activeDot={{ r: 8 }}
// // //                     strokeWidth={2}
// // //                   />
// // //                   <Line 
// // //                     type="monotone" 
// // //                     name="Impulsivity Score" 
// // //                     dataKey="impulsivity" 
// // //                     stroke="#3b82f6" 
// // //                     strokeWidth={2}
// // //                   />
// // //                 </LineChart>
// // //               </ResponsiveContainer>
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       )}
      
// // //       {/* Score Overview Cards - Enhanced with animations and gauges */}
// // //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
// // //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.inattention.level)}`}>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <Brain className="mr-2" size={20} />
// // //               <span>Attention Score</span>
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             {/* NEW: Radial gauge replaces simple progress bar */}
// // //             {renderRadialGauge(
// // //               analysisResults.inattention.score, 
// // //               analysisResults.inattention.level,
// // //               getProgressColor(analysisResults.inattention.score)
// // //             )}
// // //           </CardContent>
// // //         </Card>
        
// // //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.impulsivity.level)}`}>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <Zap className="mr-2" size={20} />
// // //               <span>Impulsivity Score</span>
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             {renderRadialGauge(
// // //               analysisResults.impulsivity.score, 
// // //               analysisResults.impulsivity.level,
// // //               getProgressColor(analysisResults.impulsivity.score)
// // //             )}
// // //           </CardContent>
// // //         </Card>
        
// // //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.combined.level)}`}>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <Activity className="mr-2" size={20} />
// // //               <span>Combined Score</span>
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             {renderRadialGauge(
// // //               analysisResults.combined.score, 
// // //               analysisResults.combined.level,
// // //               getProgressColor(analysisResults.combined.score)
// // //             )}
// // //           </CardContent>
// // //         </Card>
// // //       </div>
      
// // //       {/* NEW: Achievement Card
// // //       {gameData.correctStreak > 10 && (
// // //       <Card className="mb-8 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300">
// // //       <CardContent className="p-4">
// // //       <div className="flex items-center">
// // //         <div className="mr-4 bg-amber-400 rounded-full p-3">
// // //           <Award size={24} className="text-white" />
// // //         </div>
// // //         <div>
// // //           <h3 className="font-bold flex items-center mb-2">
// // //             <Brain className="mr-2" size={18} />
// // //             Attention Strengthening Activities
// // //           </h3>
// // //           <ul className="list-disc pl-5 space-y-1">
// // //             <li>Practice mindfulness exercises for 5-10 minutes daily</li>
// // //             <li>Try games that require sustained attention, like puzzles or memory games</li>
// // //             <li>Break tasks into smaller, manageable chunks with clear completion criteria</li>
// // //             <li>Create a distraction-free environment during focus-intensive activities</li>
// // //           </ul>
// // //         </div>
// // //       </div>
// // //       </CardContent>
// // //       </Card>
// // //         )}

                
// // //                 {analysisResults.impulsivity.score > 60 && (
// // //                   <div className="p-4 bg-yellow-50 rounded-lg">
// // //                     <h3 className="font-bold flex items-center mb-2">
// // //                       <Zap className="mr-2" size={18} />
// // //                       Impulse Control Activities
// // //                     </h3>
// // //                     <ul className="list-disc pl-5 space-y-1">
// // //                       <li>Practice the "stop and think" technique before responding</li>
// // //                       <li>Try games that reward patience and planning</li>
// // //                       <li>Use timers to practice waiting before responding</li>
// // //                       <li>Practice deep breathing when feeling the urge to respond immediately</li>
// // //                     </ul>
// // //                   </div>
// // //                 )}
                
// // //                 {analysisResults.combined.score > 60 && (
// // //                   <div className="p-4 bg-green-50 rounded-lg">
// // //                     <h3 className="font-bold flex items-center mb-2">
// // //                       <Activity className="mr-2" size={18} />
// // //                       General Cognitive Strengthening
// // //                     </h3>
// // //                     <ul className="list-disc pl-5 space-y-1">
// // //                       <li>Ensure consistent sleep schedule of 8-10 hours per night</li>
// // //                       <li>Regular physical activity helps improve focus and cognitive control</li>
// // //                       <li>Limit screen time, particularly before bedtime</li>
// // //                       <li>Consider trying different games that target both attention and response control</li>
// // //                     </ul>
// // //                   </div>
// // //                 )}
                
// // //                 {analysisResults.combined.score <= 60 && (
// // //                   <div className="p-4 bg-indigo-50 rounded-lg">
// // //                     <h3 className="font-bold flex items-center mb-2">
// // //                       <Target className="mr-2" size={18} />
// // //                       Maintenance Recommendations
// // //                     </h3>
// // //                     <p>Your performance shows good cognitive control patterns. Continue with:</p>
// // //                     <ul className="list-disc pl-5 space-y-1 mt-2">
// // //                       <li>Regular cognitive games to maintain skills</li>
// // //                       <li>Consistent sleep and physical activity</li>
// // //                       <li>Try increasing game difficulty to provide appropriate challenge</li>
// // //                     </ul>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </CardContent>
// // //           </Card>
// // //         </TabsContent>
// // //         </Tabs>*/}
// // //     </div> 
// // //   );


// // // export default GameAnalytics;

// // // import React, { useState, useEffect } from 'react';
// // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// // // import { Progress } from './ui/progress';
// // // import { AlertCircle, Activity, Brain, Clock, BarChart2, Zap, Target, XCircle, TrendingUp, Award } from 'lucide-react';
// // // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// // // const GameAnalytics = ({ gameData }) => {
// // //   const [analysisResults, setAnalysisResults] = useState({
// // //     inattention: { score: 0, level: '', insights: [] },
// // //     impulsivity: { score: 0, level: '', insights: [] },
// // //     combined: { score: 0, level: '', insights: [] }
// // //   });
// // //   const [activeInsight, setActiveInsight] = useState(null);
// // //   const [showTrends, setShowTrends] = useState(false);

// // //   useEffect(() => {
// // //     if (gameData) {
// // //       if (gameData.reactionTimes && gameData.reactionTimes.length > 0) {
// // //         const mean = gameData.averageReactionTime;
// // //         const variance = gameData.reactionTimes.reduce((sum, time) => 
// // //           sum + Math.pow(time - mean, 2), 0) / gameData.reactionTimes.length;
// // //         gameData.reactionTimeVariability = Math.sqrt(variance);
// // //       }
// // //       const results = analyzeGameData(gameData);
// // //       setAnalysisResults(results);
// // //     }
// // //   }, [gameData]);

// // //   const analyzeGameData = (data) => {
// // //     const inattentionScore = calculateInattentionScore(data);
// // //     const inattentionLevel = getScoreLevel(inattentionScore);
// // //     const inattentionInsights = generateInattentionInsights(data, inattentionScore);

// // //     const impulsivityScore = calculateImpulsivityScore(data);
// // //     const impulsivityLevel = getScoreLevel(impulsivityScore);
// // //     const impulsivityInsights = generateImpulsivityInsights(data, impulsivityScore);

// // //     const combinedScore = (inattentionScore + impulsivityScore) / 2;
// // //     const combinedLevel = getScoreLevel(combinedScore);
// // //     const combinedInsights = generateCombinedInsights(inattentionScore, impulsivityScore, data);

// // //     return {
// // //       inattention: {
// // //         score: inattentionScore,
// // //         level: inattentionLevel,
// // //         insights: inattentionInsights
// // //       },
// // //       impulsivity: {
// // //         score: impulsivityScore,
// // //         level: impulsivityLevel,
// // //         insights: impulsivityInsights
// // //       },
// // //       combined: {
// // //         score: combinedScore,
// // //         level: combinedLevel,
// // //         insights: combinedInsights
// // //       }
// // //     };
// // //   };

// // //   const calculateInattentionScore = (data) => {
// // //     const missedStarsFactor = Math.min(data.missedStars * 5, 40);
// // //     const avgReactionTime = data.averageReactionTime;
// // //     let reactionTimeFactor = 0;
// // //     if (avgReactionTime > 1000) reactionTimeFactor = 30;
// // //     else if (avgReactionTime > 800) reactionTimeFactor = 20;
// // //     else if (avgReactionTime > 600) reactionTimeFactor = 10;
// // //     const maxMissedStreak = Math.max(...data.missedStarStreaks, 0);
// // //     const streakFactor = maxMissedStreak * 10;
// // //     return Math.min(missedStarsFactor + reactionTimeFactor + streakFactor, 100);
// // //   };

// // //   const calculateImpulsivityScore = (data) => {
// // //     const prematureClicksRatio = data.prematureClicks / 
// // //       (data.reactionTimes.length + data.prematureClicks) * 100;
// // //     const prematureClicksFactor = Math.min(prematureClicksRatio, 50);
// // //     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
// // //     const fastResponseRatio = (fastResponses / data.reactionTimes.length) * 100;
// // //     const fastResponseFactor = Math.min(fastResponseRatio * 0.5, 30);
// // //     let variabilityFactor = 0;
// // //     if (data.reactionTimeVariability) {
// // //       if (data.reactionTimeVariability > 300) variabilityFactor = 20;
// // //       else if (data.reactionTimeVariability > 200) variabilityFactor = 10;
// // //     }
// // //     return Math.min(prematureClicksFactor + fastResponseFactor + variabilityFactor, 100);
// // //   };

// // //   const getScoreLevel = (score) => {
// // //     if (score < 20) return 'Low';
// // //     if (score < 40) return 'Below Average';
// // //     if (score < 60) return 'Average';
// // //     if (score < 80) return 'Above Average';
// // //     return 'High';
// // //   };

// // //   const generateInattentionInsights = (data, score) => {
// // //     const insights = [];
// // //     if (data.missedStars > 5) {
// // //       insights.push("Missed several stars, suggesting potential attention lapses.");
// // //     }
// // //     if (data.averageReactionTime > 1000) {
// // //       insights.push("Slower reaction times indicate possible difficulty maintaining focus.");
// // //     }
// // //     if (Math.max(...data.missedStarStreaks, 0) >= 2) {
// // //       insights.push("Consecutive missed stars suggest periods of significant inattention.");
// // //     }
// // //     if (score < 30) {
// // //       insights.push("Overall attention levels appear strong.");
// // //     }
// // //     return insights.length > 0 ? insights : ["Attention metrics are within normal ranges."];
// // //   };

// // //   const generateImpulsivityInsights = (data, score) => {
// // //     const insights = [];
// // //     if (data.prematureClicks > data.reactionTimes.length * 0.3) {
// // //       insights.push("High number of premature clicks suggests impulsive responding.");
// // //     }
// // //     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
// // //     if (fastResponses > data.reactionTimes.length * 0.2) {
// // //       insights.push("Many unusually fast responses may indicate impulsive decision making.");
// // //     }
// // //     if (data.reactionTimeVariability && data.reactionTimeVariability > 300) {
// // //       insights.push("High variability in response times suggests inconsistent attention control.");
// // //     }
// // //     if (score < 30) {
// // //       insights.push("Shows good impulse control overall.");
// // //     }
// // //     return insights.length > 0 ? insights : ["Impulsivity metrics are within normal ranges."];
// // //   };

// // //   const generateCombinedInsights = (inattentionScore, impulsivityScore, data) => {
// // //     const insights = [];
// // //     if (inattentionScore > 60 && impulsivityScore > 60) {
// // //       insights.push("Shows both inattentive and impulsive patterns, consider activities to strengthen focus and response control.");
// // //     } else if (inattentionScore > 60) {
// // //       insights.push("Primarily shows inattentive patterns. Consider focus-building activities.");
// // //     } else if (impulsivityScore > 60) {
// // //       insights.push("Primarily shows impulsive patterns. Consider impulse-control activities.");
// // //     }
// // //     if (data.score > 200) {
// // //       insights.push("Despite challenges, achieved a good game score, showing persistence.");
// // //     }
// // //     if (data.correctStreak > 15) {
// // //       insights.push("Achieved significant correct streak, demonstrating capacity for sustained attention.");
// // //     }
// // //     return insights.length > 0 ? insights : ["Overall performance is within typical ranges."];
// // //   };

// // //   const getLevelColor = (level) => {
// // //     switch (level) {
// // //       case 'Low': return 'text-emerald-500';
// // //       case 'Below Average': return 'text-blue-500';
// // //       case 'Average': return 'text-amber-500';
// // //       case 'Above Average': return 'text-orange-500';
// // //       case 'High': return 'text-red-500';
// // //       default: return 'text-gray-500';
// // //     }
// // //   };

// // //   const getLevelBgColor = (level) => {
// // //     switch (level) {
// // //       case 'Low': return 'bg-emerald-50 border-emerald-200';
// // //       case 'Below Average': return 'bg-blue-50 border-blue-200';
// // //       case 'Average': return 'bg-amber-50 border-amber-200';
// // //       case 'Above Average': return 'bg-orange-50 border-orange-200';
// // //       case 'High': return 'bg-red-50 border-red-200';
// // //       default: return 'bg-gray-50 border-gray-200';
// // //     }
// // //   };

// // //   const getProgressColor = (score) => {
// // //     if (score < 30) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
// // //     if (score < 50) return 'bg-gradient-to-r from-blue-400 to-blue-500';
// // //     if (score < 70) return 'bg-gradient-to-r from-amber-400 to-amber-500';
// // //     if (score < 85) return 'bg-gradient-to-r from-orange-400 to-orange-500';
// // //     return 'bg-gradient-to-r from-red-400 to-red-500';
// // //   };

// // //   const getReactionTimeData = () => {
// // //     if (!gameData?.reactionTimes || gameData.reactionTimes.length === 0) return [];
// // //     return gameData.reactionTimes.map((time, index) => ({
// // //       name: `Star ${index + 1}`,
// // //       time: time
// // //     }));
// // //   };

// // //   const renderRadialGauge = (score, label, color) => {
// // //     const rotation = (score / 100) * 180;
// // //     return (
// // //       <div className="relative h-32 flex flex-col items-center justify-center mb-2">
// // //         <div className="w-full flex justify-center">
// // //           <div className="relative h-16 w-32">
// // //             <div className="absolute h-16 w-32 rounded-t-full overflow-hidden bg-gray-200"></div>
// // //             <div 
// // //               className={`absolute h-16 w-32 rounded-t-full overflow-hidden ${color}`} 
// // //               style={{ 
// // //                 clipPath: `polygon(50% 100%, 0 100%, 0 100%, 0 0, 100% 0, 100% 100%, 50% 100%)`,
// // //                 transform: `rotate(${rotation}deg)`,
// // //                 transformOrigin: 'bottom center'
// // //               }}>
// // //             </div>
// // //             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full"></div>
// // //             <div 
// // //               className="absolute bottom-0 left-1/2 h-16 w-1 bg-gray-800 rounded-t-full"
// // //               style={{ 
// // //                 transform: `translateX(-50%) rotate(${rotation}deg)`,
// // //                 transformOrigin: 'bottom center'  
// // //               }}
// // //             ></div>
// // //           </div>
// // //         </div>
// // //         <div className="mt-2 text-center">
// // //           <div className="text-xl font-bold">{score.toFixed(1)}</div>
// // //           <div className="text-sm text-gray-600">{label}</div>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   const InsightTooltip = ({ insight, visible, onClose }) => {
// // //     if (!visible) return null;
// // //     return (
// // //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
// // //         <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg" onClick={e => e.stopPropagation()}>
// // //           <h3 className="text-xl font-bold mb-4">Understanding This Insight</h3>
// // //           <p className="mb-4">{insight}</p>
// // //           <div className="mb-4">
// // //             <h4 className="font-semibold mb-2">What This Means:</h4>
// // //             <p>This pattern may indicate specific cognitive processing tendencies related to attention and response control.</p>
// // //           </div>
// // //           <div className="mb-4">
// // //             <h4 className="font-semibold mb-2">Potential Actions:</h4>
// // //             <ul className="list-disc pl-5">
// // //               <li>Consider targeted exercises that strengthen this cognitive domain</li>
// // //               <li>Track this metric over time to see improvements</li>
// // //               <li>Discuss this pattern with a cognitive specialist if it persists</li>
// // //             </ul>
// // //           </div>
// // //           <button 
// // //             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// // //             onClick={onClose}
// // //           >
// // //             Close
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   const trendData = [
// // //     { date: 'Week 1', attention: 75, impulsivity: 62 },
// // //     { date: 'Week 2', attention: 70, impulsivity: 58 },
// // //     { date: 'Week 3', attention: 65, impulsivity: 55 },
// // //     { date: 'Week 4', attention: 60, impulsivity: 50 },
// // //     { date: 'Week 5', attention: 55, impulsivity: 48 },
// // //     { date: 'Current', attention: analysisResults.inattention.score, impulsivity: analysisResults.impulsivity.score },
// // //   ];

// // //   if (!gameData) {
// // //     return <div className="p-4">No game data available</div>;
// // //   }

// // //   return (
// // //     <div className="container mx-auto p-4">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <h1 className="text-2xl font-bold">Game Performance Analytics</h1>
// // //         <button 
// // //           onClick={() => setShowTrends(!showTrends)}
// // //           className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
// // //         >
// // //           <TrendingUp className="mr-2" size={18} />
// // //           {showTrends ? "Hide Trends" : "Show Trends"}
// // //         </button>
// // //       </div>
      
// // //       {showTrends && (
// // //         <Card className="mb-8 overflow-hidden">
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <TrendingUp className="mr-2" size={20} />
// // //               <span>Performance Trends Over Time</span>
// // //             </CardTitle>
// // //             <CardDescription>
// // //               Track your progress across multiple gameplay sessions
// // //             </CardDescription>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="h-64 w-full">
// // //               <ResponsiveContainer width="100%" height="100%">
// // //                 <LineChart
// // //                   data={trendData}
// // //                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// // //                 >
// // //                   <CartesianGrid strokeDasharray="3 3" />
// // //                   <XAxis dataKey="date" />
// // //                   <YAxis />
// // //                   <Tooltip />
// // //                   <Line 
// // //                     type="monotone" 
// // //                     name="Attention Score" 
// // //                     dataKey="attention" 
// // //                     stroke="#ef4444" 
// // //                     activeDot={{ r: 8 }}
// // //                     strokeWidth={2}
// // //                   />
// // //                   <Line 
// // //                     type="monotone" 
// // //                     name="Impulsivity Score" 
// // //                     dataKey="impulsivity" 
// // //                     stroke="#3b82f6" 
// // //                     strokeWidth={2}
// // //                   />
// // //                 </LineChart>
// // //               </ResponsiveContainer>
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       )}
      
// // //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
// // //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.inattention.level)}`}>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <Brain className="mr-2" size={20} />
// // //               <span>Attention Score</span>
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             {renderRadialGauge(
// // //               analysisResults.inattention.score, 
// // //               analysisResults.inattention.level,
// // //               getProgressColor(analysisResults.inattention.score)
// // //             )}
// // //           </CardContent>
// // //         </Card>
        
// // //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.impulsivity.level)}`}>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <Zap className="mr-2" size={20} />
// // //               <span>Impulsivity Score</span>
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             {renderRadialGauge(
// // //               analysisResults.impulsivity.score, 
// // //               analysisResults.impulsivity.level,
// // //               getProgressColor(analysisResults.impulsivity.score)
// // //             )}
// // //           </CardContent>
// // //         </Card>
        
// // //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.combined.level)}`}>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="flex items-center">
// // //               <Activity className="mr-2" size={20} />
// // //               <span>Combined Score</span>
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             {renderRadialGauge(
// // //               analysisResults.combined.score, 
// // //               analysisResults.combined.level,
// // //               getProgressColor(analysisResults.combined.score)
// // //             )}
// // //           </CardContent>
// // //         </Card>
// // //       </div>
      
// // //       {gameData.correctStreak > 10 && (
// // //         <Card className="mb-8 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300">
// // //           <CardContent className="p-4">
// // //             <div className="flex items-center">
// // //               <div className="mr-4 bg-amber-400 rounded-full p-3">
// // //                 <Award size={24} className="text-white" />
// // //               </div>
// // //               <div>
// // //                 <h3 className="font-bold text-amber-800">Achievement Unlocked!</h3>
// // //                 <p className="text-amber-700">You reached a streak of {gameData.correctStreak} correct responses!</p>
// // //               </div>
// //            import React, { useState, useEffect } from 'react';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// // import { Progress } from './ui/progress';
// // import { AlertCircle, Activity, Brain, Clock, BarChart2, Zap, Target, XCircle, TrendingUp, Award } from 'lucide-react';
// // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// // const GameAnalytics = ({ gameData }) => {
// //   const [analysisResults, setAnalysisResults] = useState({
// //     inattention: { score: 0, level: '', insights: [] },
// //     impulsivity: { score: 0, level: '', insights: [] },
// //     combined: { score: 0, level: '', insights: [] }
// //   });
// //   const [activeInsight, setActiveInsight] = useState(null);
// //   const [showTrends, setShowTrends] = useState(false);

// //   useEffect(() => {
// //     if (gameData) {
// //       if (gameData.reactionTimes && gameData.reactionTimes.length > 0) {
// //         const mean = gameData.averageReactionTime;
// //         const variance = gameData.reactionTimes.reduce((sum, time) => 
// //           sum + Math.pow(time - mean, 2), 0) / gameData.reactionTimes.length;
// //         gameData.reactionTimeVariability = Math.sqrt(variance);
// //       }
// //       const results = analyzeGameData(gameData);
// //       setAnalysisResults(results);
// //     }
// //   }, [gameData]);

// //   const analyzeGameData = (data) => {
// //     const inattentionScore = calculateInattentionScore(data);
// //     const inattentionLevel = getScoreLevel(inattentionScore);
// //     const inattentionInsights = generateInattentionInsights(data, inattentionScore);

// //     const impulsivityScore = calculateImpulsivityScore(data);
// //     const impulsivityLevel = getScoreLevel(impulsivityScore);
// //     const impulsivityInsights = generateImpulsivityInsights(data, impulsivityScore);

// //     const combinedScore = (inattentionScore + impulsivityScore) / 2;
// //     const combinedLevel = getScoreLevel(combinedScore);
// //     const combinedInsights = generateCombinedInsights(inattentionScore, impulsivityScore, data);

// //     return {
// //       inattention: {
// //         score: inattentionScore,
// //         level: inattentionLevel,
// //         insights: inattentionInsights
// //       },
// //       impulsivity: {
// //         score: impulsivityScore,
// //         level: impulsivityLevel,
// //         insights: impulsivityInsights
// //       },
// //       combined: {
// //         score: combinedScore,
// //         level: combinedLevel,
// //         insights: combinedInsights
// //       }
// //     };
// //   };

// //   const calculateInattentionScore = (data) => {
// //     const missedStarsFactor = Math.min(data.missedStars * 5, 40);
// //     const avgReactionTime = data.averageReactionTime;
// //     let reactionTimeFactor = 0;
// //     if (avgReactionTime > 1000) reactionTimeFactor = 30;
// //     else if (avgReactionTime > 800) reactionTimeFactor = 20;
// //     else if (avgReactionTime > 600) reactionTimeFactor = 10;
// //     const maxMissedStreak = Math.max(...data.missedStarStreaks, 0);
// //     const streakFactor = maxMissedStreak * 10;
// //     return Math.min(missedStarsFactor + reactionTimeFactor + streakFactor, 100);
// //   };

// //   const calculateImpulsivityScore = (data) => {
// //     const prematureClicksRatio = data.prematureClicks / 
// //       (data.reactionTimes.length + data.prematureClicks) * 100;
// //     const prematureClicksFactor = Math.min(prematureClicksRatio, 50);
// //     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
// //     const fastResponseRatio = (fastResponses / data.reactionTimes.length) * 100;
// //     const fastResponseFactor = Math.min(fastResponseRatio * 0.5, 30);
// //     let variabilityFactor = 0;
// //     if (data.reactionTimeVariability) {
// //       if (data.reactionTimeVariability > 300) variabilityFactor = 20;
// //       else if (data.reactionTimeVariability > 200) variabilityFactor = 10;
// //     }
// //     return Math.min(prematureClicksFactor + fastResponseFactor + variabilityFactor, 100);
// //   };

// //   const getScoreLevel = (score) => {
// //     if (score < 20) return 'Low';
// //     if (score < 40) return 'Below Average';
// //     if (score < 60) return 'Average';
// //     if (score < 80) return 'Above Average';
// //     return 'High';
// //   };

// //   const generateInattentionInsights = (data, score) => {
// //     const insights = [];
// //     if (data.missedStars > 5) {
// //       insights.push("Missed several stars, suggesting potential attention lapses.");
// //     }
// //     if (data.averageReactionTime > 1000) {
// //       insights.push("Slower reaction times indicate possible difficulty maintaining focus.");
// //     }
// //     if (Math.max(...data.missedStarStreaks, 0) >= 2) {
// //       insights.push("Consecutive missed stars suggest periods of significant inattention.");
// //     }
// //     if (score < 30) {
// //       insights.push("Overall attention levels appear strong.");
// //     }
// //     return insights.length > 0 ? insights : ["Attention metrics are within normal ranges."];
// //   };

// //   const generateImpulsivityInsights = (data, score) => {
// //     const insights = [];
// //     if (data.prematureClicks > data.reactionTimes.length * 0.3) {
// //       insights.push("High number of premature clicks suggests impulsive responding.");
// //     }
// //     const fastResponses = data.reactionTimes.filter(time => time < 400).length;
// //     if (fastResponses > data.reactionTimes.length * 0.2) {
// //       insights.push("Many unusually fast responses may indicate impulsive decision making.");
// //     }
// //     if (data.reactionTimeVariability && data.reactionTimeVariability > 300) {
// //       insights.push("High variability in response times suggests inconsistent attention control.");
// //     }
// //     if (score < 30) {
// //       insights.push("Shows good impulse control overall.");
// //     }
// //     return insights.length > 0 ? insights : ["Impulsivity metrics are within normal ranges."];
// //   };

// //   const generateCombinedInsights = (inattentionScore, impulsivityScore, data) => {
// //     const insights = [];
// //     if (inattentionScore > 60 && impulsivityScore > 60) {
// //       insights.push("Shows both inattentive and impulsive patterns, consider activities to strengthen focus and response control.");
// //     } else if (inattentionScore > 60) {
// //       insights.push("Primarily shows inattentive patterns. Consider focus-building activities.");
// //     } else if (impulsivityScore > 60) {
// //       insights.push("Primarily shows impulsive patterns. Consider impulse-control activities.");
// //     }
// //     if (data.score > 200) {
// //       insights.push("Despite challenges, achieved a good game score, showing persistence.");
// //     }
// //     if (data.correctStreak > 15) {
// //       insights.push("Achieved significant correct streak, demonstrating capacity for sustained attention.");
// //     }
// //     return insights.length > 0 ? insights : ["Overall performance is within typical ranges."];
// //   };

// //   const getLevelColor = (level) => {
// //     switch (level) {
// //       case 'Low': return 'text-emerald-500';
// //       case 'Below Average': return 'text-blue-500';
// //       case 'Average': return 'text-amber-500';
// //       case 'Above Average': return 'text-orange-500';
// //       case 'High': return 'text-red-500';
// //       default: return 'text-gray-500';
// //     }
// //   };

// //   const getLevelBgColor = (level) => {
// //     switch (level) {
// //       case 'Low': return 'bg-emerald-50 border-emerald-200';
// //       case 'Below Average': return 'bg-blue-50 border-blue-200';
// //       case 'Average': return 'bg-amber-50 border-amber-200';
// //       case 'Above Average': return 'bg-orange-50 border-orange-200';
// //       case 'High': return 'bg-red-50 border-red-200';
// //       default: return 'bg-gray-50 border-gray-200';
// //     }
// //   };

// //   const getProgressColor = (score) => {
// //     if (score < 30) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
// //     if (score < 50) return 'bg-gradient-to-r from-blue-400 to-blue-500';
// //     if (score < 70) return 'bg-gradient-to-r from-amber-400 to-amber-500';
// //     if (score < 85) return 'bg-gradient-to-r from-orange-400 to-orange-500';
// //     return 'bg-gradient-to-r from-red-400 to-red-500';
// //   };

// //   const getReactionTimeData = () => {
// //     if (!gameData?.reactionTimes || gameData.reactionTimes.length === 0) return [];
// //     return gameData.reactionTimes.map((time, index) => ({
// //       name: `Star ${index + 1}`,
// //       time: time
// //     }));
// //   };

// //   const renderRadialGauge = (score, label, color) => {
// //     const rotation = (score / 100) * 180;
// //     return (
// //       <div className="relative h-32 flex flex-col items-center justify-center mb-2">
// //         <div className="w-full flex justify-center">
// //           <div className="relative h-16 w-32">
// //             <div className="absolute h-16 w-32 rounded-t-full overflow-hidden bg-gray-200"></div>
// //             <div 
// //               className={`absolute h-16 w-32 rounded-t-full overflow-hidden ${color}`} 
// //               style={{ 
// //                 clipPath: `polygon(50% 100%, 0 100%, 0 100%, 0 0, 100% 0, 100% 100%, 50% 100%)`,
// //                 transform: `rotate(${rotation}deg)`,
// //                 transformOrigin: 'bottom center'
// //               }}>
// //             </div>
// //             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full"></div>
// //             <div 
// //               className="absolute bottom-0 left-1/2 h-16 w-1 bg-gray-800 rounded-t-full"
// //               style={{ 
// //                 transform: `translateX(-50%) rotate(${rotation}deg)`,
// //                 transformOrigin: 'bottom center'  
// //               }}
// //             ></div>
// //           </div>
// //         </div>
// //         <div className="mt-2 text-center">
// //           <div className="text-xl font-bold">{score.toFixed(1)}</div>
// //           <div className="text-sm text-gray-600">{label}</div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const InsightTooltip = ({ insight, visible, onClose }) => {
// //     if (!visible) return null;
// //     return (
// //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
// //         <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg" onClick={e => e.stopPropagation()}>
// //           <h3 className="text-xl font-bold mb-4">Understanding This Insight</h3>
// //           <p className="mb-4">{insight}</p>
// //           <div className="mb-4">
// //             <h4 className="font-semibold mb-2">What This Means:</h4>
// //             <p>This pattern may indicate specific cognitive processing tendencies related to attention and response control.</p>
// //           </div>
// //           <div className="mb-4">
// //             <h4 className="font-semibold mb-2">Potential Actions:</h4>
// //             <ul className="list-disc pl-5">
// //               <li>Consider targeted exercises that strengthen this cognitive domain</li>
// //               <li>Track this metric over time to see improvements</li>
// //               <li>Discuss this pattern with a cognitive specialist if it persists</li>
// //             </ul>
// //           </div>
// //           <button 
// //             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //             onClick={onClose}
// //           >
// //             Close
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const trendData = [
// //     { date: 'Week 1', attention: 75, impulsivity: 62 },
// //     { date: 'Week 2', attention: 70, impulsivity: 58 },
// //     { date: 'Week 3', attention: 65, impulsivity: 55 },
// //     { date: 'Week 4', attention: 60, impulsivity: 50 },
// //     { date: 'Week 5', attention: 55, impulsivity: 48 },
// //     { date: 'Current', attention: analysisResults.inattention.score, impulsivity: analysisResults.impulsivity.score },
// //   ];

// //   if (!gameData) {
// //     return <div className="p-4">No game data available</div>;
// //   }

// //   return (
// //     <div className="container mx-auto p-4">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-bold">Game Performance Analytics</h1>
// //         <button 
// //           onClick={() => setShowTrends(!showTrends)}
// //           className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
// //         >
// //           <TrendingUp className="mr-2" size={18} />
// //           {showTrends ? "Hide Trends" : "Show Trends"}
// //         </button>
// //       </div>
      
// //       {showTrends && (
// //         <Card className="mb-8 overflow-hidden">
// //           <CardHeader className="pb-2">
// //             <CardTitle className="flex items-center">
// //               <TrendingUp className="mr-2" size={20} />
// //               <span>Performance Trends Over Time</span>
// //             </CardTitle>
// //             <CardDescription>
// //               Track your progress across multiple gameplay sessions
// //             </CardDescription>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="h-64 w-full">
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <LineChart
// //                   data={trendData}
// //                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// //                 >
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="date" />
// //                   <YAxis />
// //                   <Tooltip />
// //                   <Line 
// //                     type="monotone" 
// //                     name="Attention Score" 
// //                     dataKey="attention" 
// //                     stroke="#ef4444" 
// //                     activeDot={{ r: 8 }}
// //                     strokeWidth={2}
// //                   />
// //                   <Line 
// //                     type="monotone" 
// //                     name="Impulsivity Score" 
// //                     dataKey="impulsivity" 
// //                     stroke="#3b82f6" 
// //                     strokeWidth={2}
// //                   />
// //                 </LineChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}
      
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
// //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.inattention.level)}`}>
// //           <CardHeader className="pb-2">
// //             <CardTitle className="flex items-center">
// //               <Brain className="mr-2" size={20} />
// //               <span>Attention Score</span>
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             {renderRadialGauge(
// //               analysisResults.inattention.score, 
// //               analysisResults.inattention.level,
// //               getProgressColor(analysisResults.inattention.score)
// //             )}
// //           </CardContent>
// //         </Card>
        
// //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.impulsivity.level)}`}>
// //           <CardHeader className="pb-2">
// //             <CardTitle className="flex items-center">
// //               <Zap className="mr-2" size={20} />
// //               <span>Impulsivity Score</span>
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             {renderRadialGauge(
// //               analysisResults.impulsivity.score, 
// //               analysisResults.impulsivity.level,
// //               getProgressColor(analysisResults.impulsivity.score)
// //             )}
// //           </CardContent>
// //         </Card>
        
// //         <Card className={`transition-all duration-300 hover:shadow-lg ${getLevelBgColor(analysisResults.combined.level)}`}>
// //           <CardHeader className="pb-2">
// //             <CardTitle className="flex items-center">
// //               <Activity className="mr-2" size={20} />
// //               <span>Combined Score</span>
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             {renderRadialGauge(
// //               analysisResults.combined.score, 
// //               analysisResults.combined.level,
// //               getProgressColor(analysisResults.combined.score)
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>
      
// //       {/* {gameData.correctStreak > 10 && (
// //         <Card className="mb-8 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300">
// //           <CardContent className="p-4">
// //             <div className="flex items-center">
// //               <div className="mr-4 bg-amber-400 rounded-full p-3">
// //                 <Award size={24} className="text-white" />
// //               </div>
// //               <div>
// //                 <h3 className="font-bold text-amber-800">Achievement Unlocked!</h3>
// //                 <p className="text-amber-700">You reached a streak of {gameData.correctStreak} correct responses!</p>
// //               </div>
// //               <h3 className="font-bold flex items-center mb-2">
// //                       <Brain className="mr-2" size={18} />
// //                       Attention Strengthening Activities
// //                     </h3>
// //                     <ul className="list-disc pl-5 space-y-1">
// //                       <li>Practice mindfulness exercises for 5-10 minutes daily</li>
// //                       <li>Try games that require sustained attention, like puzzles or memory games</li>
// //                       <li>Break tasks into smaller, manageable chunks with clear completion criteria</li>
// //                       <li>Create a distraction-free environment during focus-intensive activities</li>
// //                     </ul>
// //                   </div>
// //                 )} */}

// // {gameData.correctStreak > 10 && (
// //   <Card className="mb-8 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300">
// //     <CardContent className="p-4">
// //       <div className="flex items-center">
// //         <div className="mr-4 bg-amber-400 rounded-full p-3">
// //           <Award size={24} className="text-white" />
// //         </div>
// //         <div>
// //           <h3 className="font-bold flex items-center mb-2">
// //             <Brain className="mr-2" size={18} />
// //             Attention Strengthening Activities
// //           </h3>
// //           <ul className="list-disc pl-5 space-y-1">
// //             <li>Practice mindfulness exercises for 5-10 minutes daily</li>
// //             <li>Try games that require sustained attention, like puzzles or memory games</li>
// //             <li>Break tasks into smaller, manageable chunks with clear completion criteria</li>
// //             <li>Create a distraction-free environment during focus-intensive activities</li>
// //           </ul>
// //         </div>
// //       </div>
// //     </CardContent>
// //   </Card>
// // )}
                
// //                 {analysisResults.impulsivity.score > 60 && (
// //                   <div className="p-4 bg-yellow-50 rounded-lg">
// //                     <h3 className="font-bold flex items-center mb-2">
// //                       <Zap className="mr-2" size={18} />
// //                       Impulse Control Activities
// //                     </h3>
// //                     <ul className="list-disc pl-5 space-y-1">
// //                       <li>Practice the "stop and think" technique before responding</li>
// //                       <li>Try games that reward patience and planning</li>
// //                       <li>Use timers to practice waiting before responding</li>
// //                       <li>Practice deep breathing when feeling the urge to respond immediately</li>
// //                     </ul>
// //                   </div>
// //                 )}
                
// //                 {analysisResults.combined.score > 60 && (
// //                   <div className="p-4 bg-green-50 rounded-lg">
// //                     <h3 className="font-bold flex items-center mb-2">
// //                       <Activity className="mr-2" size={18} />
// //                       General Cognitive Strengthening
// //                     </h3>
// //                     <ul className="list-disc pl-5 space-y-1">
// //                       <li>Ensure consistent sleep schedule of 8-10 hours per night</li>
// //                       <li>Regular physical activity helps improve focus and cognitive control</li>
// //                       <li>Limit screen time, particularly before bedtime</li>
// //                       <li>Consider trying different games that target both attention and response control</li>
// //                     </ul>
// //                   </div>
// //                 )}
                
// //                 {analysisResults.combined.score <= 60 && (
// //                   <div className="p-4 bg-indigo-50 rounded-lg">
// //                     <h3 className="font-bold flex items-center mb-2">
// //                       <Target className="mr-2" size={18} />
// //                       Maintenance Recommendations
// //                     </h3>
// //                     <p>Your performance shows good cognitive control patterns. Continue with:</p>
// //                     <ul className="list-disc pl-5 space-y-1 mt-2">
// //                       <li>Regular cognitive games to maintain skills</li>
// //                       <li>Consistent sleep and physical activity</li>
// //                       <li>Try increasing game difficulty to provide appropriate challenge</li>
// //                     </ul>
// //                   </div>
// //                 )}
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </TabsContent>
// //       </Tabs>
// //     </div>
    
// //   );
// // };

// // export default GameAnalytics;
           
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { AlertCircle, Activity, Brain, Clock, BarChart2, Zap, Target, XCircle, ChevronDown, ChevronUp, Info, Award, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import axios from 'axios';
//import { Award } from 'lucide-react';

const API_ENDPOINT = 'http://localhost:5000/predict';




// Move these variable definitions from ADHDAssessmentCard to the GameAnalytics component
// Add these at the beginning of the GameAnalytics component function
const GameAnalytics = ({ gameData }) => {
  const [analysisResults, setAnalysisResults] = useState({
    inattention: { score: 0, level: '', insights: [] },
    impulsivity: { score: 0, level: '', insights: [] },
    combined: { score: 0, level: '', insights: [] }
  });
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [showMetricInfo, setShowMetricInfo] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [adhdType, setADHDType] = useState(null);
  const [modelConfidence, setModelConfidence] = useState(null);
  const [modelInsights, setModelInsights] = useState(null);
  const [scoreLevels, setScoreLevels] = useState({
    inattention: '',
    impulsivity: ''
  });

  // Add these missing variable definitions - moved from ADHDAssessmentCard
  // Emoji mapping for various elements
  const typeEmojis = {
    'Primarily Inattentive': '🔍',
    'Primarily Hyperactive-Impulsive': '⚡',
    'Combined Type': '🔄',
    'Minimal Symptoms': '✅'
  };

  // Default emoji if type not found
  const defaultEmoji = '🧩';
  
  // Level indicators with emojis
  const getLevelEmoji = (level) => {
    switch(level) {
      case 'High': return '🔴';
      case 'Above Average': return '🟠';
      case 'Average': return '🟡';
      case 'Below Average': return '🟢';
      case 'Low': return '🔵';
      default: return '⚪';
    }
  };
  
  // Progress bar colors
  const getProgressColors = (level) => {
    switch(level) {
      case 'High': return 'bg-red-500';
      case 'Above Average': return 'bg-orange-400';
      case 'Average': return 'bg-yellow-400';
      case 'Below Average': return 'bg-green-400';
      case 'Low': return 'bg-blue-400';
      default: return 'bg-gray-300';
    }
  };

  // Get progress width based on level
  const getProgressWidth = (level) => {
    switch(level) {
      case 'High': return 'w-full';
      case 'Above Average': return 'w-4/5';
      case 'Average': return 'w-3/5';
      case 'Below Average': return 'w-2/5';
      case 'Low': return 'w-1/5';
      default: return 'w-0';
    }
  };


  // Rest of your component code...
  // Enhanced function to fetch predictions from the ML model
const fetchPredictionFromModel = async (gameData) => {
  try {
    // Format the data according to what your backend expects
    const modelInput = {
      reactionTimes: gameData.reactionTimes || [],
      correctStreak: gameData.correctStreak || 0,
      prematureClicks: gameData.prematureClicks || 0,
      missedStars: gameData.missedStars || 0,
      score: gameData.score || 0,
      // Include maxMissedStreak if available
      maxMissedStreak: gameData.maxMissedStreak || 0,
      // Include missedStarStreaks if available for more accurate predictions
      missedStarStreaks: gameData.missedStarStreaks || []
    };
    
    console.log('Sending data to ML model:', modelInput);
    const response = await axios.post(API_ENDPOINT, modelInput);
    console.log('Received prediction from ML model:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction from ML model:', error);
    return null;
  }
};

  // useEffect(() => {
  //   if (gameData) {
  //     if (gameData.reactionTimes && gameData.reactionTimes.length > 0) {
  //       const mean = gameData.averageReactionTime;
  //       const variance = gameData.reactionTimes.reduce((sum, time) => 
  //         sum + Math.pow(time - mean, 2), 0) / gameData.reactionTimes.length;
  //       gameData.reactionTimeVariability = Math.sqrt(variance);
  //     }
  //     const results = analyzeGameData(gameData);
  //     setAnalysisResults(results);
      
  //     // Generate fake historical data for demonstration
  //     generateHistoricalData();
  //   }
  // }, [gameData]);
  // Enhanced useEffect for your GameAnalytics component
useEffect(() => {
  if (gameData) {
    // Calculate derived metrics that the ML model expects
    const processedData = { ...gameData };
    
    // Calculate variability if not already calculated
    if (processedData.reactionTimes && processedData.reactionTimes.length > 0) {
      const mean = processedData.averageReactionTime || 
        processedData.reactionTimes.reduce((sum, time) => sum + time, 0) / processedData.reactionTimes.length;
      processedData.averageReactionTime = mean;
      
      const variance = processedData.reactionTimes.reduce((sum, time) => 
        sum + Math.pow(time - mean, 2), 0) / processedData.reactionTimes.length;
      processedData.reactionTimeVariability = Math.sqrt(variance);
    }
    
    // Try to get prediction from ML model
    fetchPredictionFromModel(processedData)
      .then(prediction => {
        if (prediction && !prediction.error) {
          // Set ADHD type and confidence from the model response
          setADHDType(prediction.adhd_type);
          
          // Find the highest probability for confidence
          const highestProbability = Math.max(...Object.values(prediction.probabilities));
          setModelConfidence(highestProbability);
          
          // Store insights from the model for display
          setModelInsights(prediction.insights);
          
          // Use detailed scores from the model response
          setAnalysisResults({
            inattention: {
              score: prediction.scores.inattention.score,
              level: prediction.scores.inattention.level,
              insights: prediction.insights.inattention || []
            },
            impulsivity: {
              score: prediction.scores.impulsivity.score,
              level: prediction.scores.impulsivity.level,
              insights: prediction.insights.impulsivity || []
            },
            combined: {
              score: (prediction.scores.inattention.score + prediction.scores.impulsivity.score) / 2,
              level: getScoreLevel((prediction.scores.inattention.score + prediction.scores.impulsivity.score) / 2),
              insights: prediction.insights.combined || []
            }
          });
          
          // Store score levels for display
          setScoreLevels({
            inattention: prediction.scores.inattention.level,
            impulsivity: prediction.scores.impulsivity.level
          });
        } else {
          console.warn('ML model prediction failed or returned an error, falling back to rule-based analysis');
          // Fall back to rule-based analysis if ML prediction fails
          const results = analyzeGameData(processedData);
          setAnalysisResults(results);
          
          // Clear model-specific data
          setADHDType(null);
          setModelConfidence(null);
          setModelInsights(null);
        }
        
        // Generate fake historical data for demonstration (if needed)
        generateHistoricalData();
      });
  }
}, [gameData]);


  const generateHistoricalData = () => {
    // Mock historical data for the visualization
    const fakeHistory = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      fakeHistory.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        attentionScore: Math.floor(Math.random() * 40) + 30,
        impulsivityScore: Math.floor(Math.random() * 40) + 30,
        score: Math.floor(Math.random() * 150) + 150
      });
    }
    // Add current data point
    fakeHistory.push({
      date: 'Today',
      attentionScore: analysisResults.inattention.score,
      impulsivityScore: analysisResults.impulsivity.score,
      score: gameData.score
    });
    setHistoricalData(fakeHistory);
  };

  // Analyze game data to calculate metrics
  const analyzeGameData = (data) => {
    // 1. Inattention Analysis
    const inattentionScore = calculateInattentionScore(data);
    const inattentionLevel = getScoreLevel(inattentionScore);
    const inattentionInsights = generateInattentionInsights(data, inattentionScore);

    // 2. Impulsivity Analysis
    const impulsivityScore = calculateImpulsivityScore(data);
    const impulsivityLevel = getScoreLevel(impulsivityScore);
    const impulsivityInsights = generateImpulsivityInsights(data, impulsivityScore);

    // 3. Combined Analysis
    const combinedScore = (inattentionScore + impulsivityScore) / 2;
    const combinedLevel = getScoreLevel(combinedScore);
    const combinedInsights = generateCombinedInsights(inattentionScore, impulsivityScore, data);

    // Enhanced Card UI with more comprehensive details from the ML model

    return {
      inattention: {
        score: inattentionScore,
        level: inattentionLevel,
        insights: inattentionInsights
      },
      impulsivity: {
        score: impulsivityScore,
        level: impulsivityLevel,
        insights: impulsivityInsights
      },
      combined: {
        score: combinedScore,
        level: combinedLevel,
        insights: combinedInsights
      }
    };
  };

  // Calculate inattention score from 0-100 (higher = more inattentive)
  const calculateInattentionScore = (data) => {
    // Factors indicating inattention:
    // 1. Missed stars
    const missedStarsFactor = Math.min(data.missedStars * 5, 40);
    
    // 2. Long reaction times
    const avgReactionTime = data.averageReactionTime;
    let reactionTimeFactor = 0;
    if (avgReactionTime > 1000) reactionTimeFactor = 30;
    else if (avgReactionTime > 800) reactionTimeFactor = 20;
    else if (avgReactionTime > 600) reactionTimeFactor = 10;
    
    // 3. Missed star streaks (consecutive misses)
    const maxMissedStreak = Math.max(...data.missedStarStreaks, 0);
    const streakFactor = maxMissedStreak * 10;
    
    // Calculate final score (cap at 100)
    return Math.min(missedStarsFactor + reactionTimeFactor + streakFactor, 100);
  };

  // Calculate impulsivity score from 0-100 (higher = more impulsive)
  const calculateImpulsivityScore = (data) => {
    // Factors indicating impulsivity:
    // 1. Premature clicks
    const prematureClicksRatio = data.prematureClicks / 
      (data.reactionTimes.length + data.prematureClicks) * 100;
    const prematureClicksFactor = Math.min(prematureClicksRatio, 50);
    
    // 2. Very fast reaction times (potentially impulsive responses)
    const fastResponses = data.reactionTimes.filter(time => time < 400).length;
    const fastResponseRatio = (fastResponses / data.reactionTimes.length) * 100;
    const fastResponseFactor = Math.min(fastResponseRatio * 0.5, 30);
    
    // 3. Variability in reaction times (inconsistent behavior)
    // Calculate standard deviation if we have it
    let variabilityFactor = 0;
    if (data.reactionTimeVariability) {
      if (data.reactionTimeVariability > 300) variabilityFactor = 20;
      else if (data.reactionTimeVariability > 200) variabilityFactor = 10;
    }
    
    // Calculate final score (cap at 100)
    return Math.min(prematureClicksFactor + fastResponseFactor + variabilityFactor, 100);
  };

  // Generate score level based on numerical score
  const getScoreLevel = (score) => {
    if (score < 20) return 'Low';
    if (score < 40) return 'Below Average';
    if (score < 60) return 'Average';
    if (score < 80) return 'Above Average';
    return 'High';
  };

  // Generate insights for inattention
  const generateInattentionInsights = (data, score) => {
    const insights = [];
    
    if (data.missedStars > 5) {
      insights.push("Missed several stars, suggesting potential attention lapses.");
    }
    
    if (data.averageReactionTime > 1000) {
      insights.push("Slower reaction times indicate possible difficulty maintaining focus.");
    }
    
    if (Math.max(...data.missedStarStreaks, 0) >= 2) {
      insights.push("Consecutive missed stars suggest periods of significant inattention.");
    }
    
    if (score < 30) {
      insights.push("Overall attention levels appear strong.");
    }
    
    return insights.length > 0 ? insights : ["Attention metrics are within normal ranges."];
  };

  // Generate insights for impulsivity
  const generateImpulsivityInsights = (data, score) => {
    const insights = [];
    
    if (data.prematureClicks > data.reactionTimes.length * 0.3) {
      insights.push("High number of premature clicks suggests impulsive responding.");
    }
    
    const fastResponses = data.reactionTimes.filter(time => time < 400).length;
    if (fastResponses > data.reactionTimes.length * 0.2) {
      insights.push("Many unusually fast responses may indicate impulsive decision making.");
    }
    
    if (data.reactionTimeVariability && data.reactionTimeVariability > 300) {
      insights.push("High variability in response times suggests inconsistent attention control.");
    }
    
    if (score < 30) {
      insights.push("Shows good impulse control overall.");
    }
    
    return insights.length > 0 ? insights : ["Impulsivity metrics are within normal ranges."];
  };

  // Generate combined insights
  const generateCombinedInsights = (inattentionScore, impulsivityScore, data) => {
    const insights = [];
    
    if (inattentionScore > 60 && impulsivityScore > 60) {
      insights.push("Shows both inattentive and impulsive patterns, consider activities to strengthen focus and response control.");
    } else if (inattentionScore > 60) {
      insights.push("Primarily shows inattentive patterns. Consider focus-building activities.");
    } else if (impulsivityScore > 60) {
      insights.push("Primarily shows impulsive patterns. Consider impulse-control activities.");
    }
    
    if (data.score > 200) {
      insights.push("Despite challenges, achieved a good game score, showing persistence.");
    }
    
    if (data.correctStreak > 15) {
      insights.push("Achieved significant correct streak, demonstrating capacity for sustained attention.");
    }
    
    return insights.length > 0 ? insights : ["Overall performance is within typical ranges."];
  };

  // Get color based on level
  const getLevelColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-500';
      case 'Below Average': return 'text-blue-500';
      case 'Average': return 'text-yellow-500';
      case 'Above Average': return 'text-orange-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Get progress bar color based on score
  const getProgressColor = (score) => {
    if (score < 30) return 'bg-green-500';
    if (score < 50) return 'bg-blue-500';
    if (score < 70) return 'bg-yellow-500';
    if (score < 85) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get the color for the trending indicator
  const getTrendColor = (current, previous) => {
    if (current < previous) return 'text-green-500';
    if (current > previous) return 'text-red-500';
    return 'text-gray-500';
  };

  // Generate reaction time distribution data for chart
  const getReactionTimeDistribution = () => {
    if (!gameData || !gameData.reactionTimes || gameData.reactionTimes.length === 0) {
      return [];
    }

    // Create bins for reaction times
    const bins = [
      { name: '<400ms', count: 0 }, 
      { name: '400-600ms', count: 0 },
      { name: '600-800ms', count: 0 },
      { name: '800-1000ms', count: 0 },
      { name: '>1000ms', count: 0 }
    ];

    gameData.reactionTimes.forEach(time => {
      if (time < 400) bins[0].count++;
      else if (time < 600) bins[1].count++;
      else if (time < 800) bins[2].count++;
      else if (time < 1000) bins[3].count++;
      else bins[4].count++;
    });

    return bins;
  };

  // Prepare radar chart data
  const getRadarData = () => {
    return [
      {
        subject: 'Attention',
        score: 100 - analysisResults.inattention.score,
        fullMark: 100
      },
      {
        subject: 'Response Control',
        score: 100 - analysisResults.impulsivity.score,
        fullMark: 100
      },
      {
        subject: 'Reaction Time',
        score: Math.max(0, 100 - (gameData.averageReactionTime / 10)),
        fullMark: 100
      },
      {
        subject: 'Consistency',
        score: Math.max(0, 100 - (gameData.reactionTimeVariability / 4)),
        fullMark: 100
      },
      {
        subject: 'Streak',
        score: Math.min(100, gameData.correctStreak * 5),
        fullMark: 100
      }
    ];
  };

  // Get metric descriptions for tooltips
  const getMetricInfo = (metric) => {
    const info = {
      attention: "Measures ability to sustain focus and respond to targets. Lower scores indicate better attention control.",
      impulsivity: "Measures ability to wait for appropriate cues. Lower scores indicate better impulse control.",
      reactionTime: "Average time taken to respond to targets. Lower is faster.",
      variability: "Consistency of response times. Lower values indicate more consistent responses.",
      missedStars: "Number of targets not clicked when they should have been.",
      prematureClicks: "Number of clicks made when no target was present.",
      correctStreak: "Longest sequence of correctly captured targets."
    };
    return info[metric] || "No additional information available.";
  };

  

  if (!gameData) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-600">No Game Data Available</h2>
          <p className="text-gray-500 mt-2">Complete a game session to view your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mt-12 -mr-12 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200 rounded-full -mb-8 -ml-8 opacity-50"></div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800 relative z-10">Game Performance Analytics</h1>
        <p className="text-gray-600 relative z-10">Detailed analysis of your cognitive performance patterns</p>
        <button 
          onClick={() => setShowTips(!showTips)} 
          className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors z-10"
        >
          <Info size={20} className="text-blue-500" />
        </button>
        
        {showTips && (
          <div className="absolute top-16 right-6 bg-white p-4 rounded-lg shadow-lg z-20 w-64 text-sm">
            <h3 className="font-bold mb-2">Understanding Scores</h3>
            <p className="mb-3">Higher scores for Attention and Impulsivity metrics indicate more challenges in these areas.</p>
            <p className="mb-2">Score ranges:</p>
            <div className="space-y-1">
              <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div> 0-30: Low (Good)</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div> 30-50: Below Average</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div> 50-70: Average</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div> 70-85: Above Average</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> 85-100: High (Challenge)</div>
            </div>
            <button 
              onClick={() => setShowTips(false)}
              className="mt-3 text-blue-500 hover:text-blue-700 text-xs font-semibold"
            >
              Close
            </button>
          </div>
          
        )}
        
      </div>

      

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="overflow-hidden shadow hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center">
              <Brain className="mr-2 text-blue-600" size={20} />
              <span>Attention Score</span>
              <button 
                className="ml-auto"
                onClick={() => setShowMetricInfo(showMetricInfo === 'attention' ? null : 'attention')}
              >
                <Info size={16} className="text-blue-400 hover:text-blue-600" />
              </button>
            </CardTitle>
            {showMetricInfo === 'attention' && (
              <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                {getMetricInfo('attention')}
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{analysisResults.inattention.score.toFixed(1)}</span>
              <div className="flex items-center">
                <span className={`font-bold ${getLevelColor(analysisResults.inattention.level)}`}>
                  {analysisResults.inattention.level}
                </span>
                <TrendingUp 
                  size={16} 
                  className={`ml-2 ${getTrendColor(analysisResults.inattention.score, 50)}`}
                />
              </div>
            </div>
            <Progress value={analysisResults.inattention.score} className={getProgressColor(analysisResults.inattention.score)} />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden shadow hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-yellow-50 to-yellow-100">
            <CardTitle className="flex items-center">
              <Zap className="mr-2 text-yellow-600" size={20} />
              <span>Impulsivity Score</span>
              <button 
                className="ml-auto"
                onClick={() => setShowMetricInfo(showMetricInfo === 'impulsivity' ? null : 'impulsivity')}
              >
                <Info size={16} className="text-yellow-400 hover:text-yellow-600" />
              </button>
            </CardTitle>
            {showMetricInfo === 'impulsivity' && (
              <div className="mt-2 text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                {getMetricInfo('impulsivity')}
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{analysisResults.impulsivity.score.toFixed(1)}</span>
              <div className="flex items-center">
                <span className={`font-bold ${getLevelColor(analysisResults.impulsivity.level)}`}>
                  {analysisResults.impulsivity.level}
                </span>
                <TrendingUp 
                  size={16} 
                  className={`ml-2 ${getTrendColor(analysisResults.impulsivity.score, 45)}`}
                />
              </div>
            </div>
            <Progress value={analysisResults.impulsivity.score} className={getProgressColor(analysisResults.impulsivity.score)} />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden shadow hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="flex items-center">
              <Activity className="mr-2 text-purple-600" size={20} />
              <span>Combined Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{analysisResults.combined.score.toFixed(1)}</span>
              <div className="flex items-center">
                <span className={`font-bold ${getLevelColor(analysisResults.combined.level)}`}>
                  {analysisResults.combined.level}
                </span>
                <TrendingUp 
                  size={16} 
                  className={`ml-2 ${getTrendColor(analysisResults.combined.score, 50)}`}
                />
              </div>
            </div>
            <Progress value={analysisResults.combined.score} className={getProgressColor(analysisResults.combined.score)} />
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <Card className="overflow-hidden shadow-md">
          <CardHeader className="pb-2">
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Your cognitive metrics over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="attentionScore" name="Attention Score" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line yAxisId="left" type="monotone" dataKey="impulsivityScore" name="Impulsivity Score" stroke="#82ca9d" />
                  <Line yAxisId="right" type="monotone" dataKey="score" name="Game Score" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="overflow-hidden shadow-md">
          <CardHeader className="pb-2">
            <CardTitle>Reaction Time Distribution</CardTitle>
            <CardDescription>Frequency of response times by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getReactionTimeDistribution()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Responses" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden shadow-md">
          <CardHeader className="pb-2">
            <CardTitle>Cognitive Profile</CardTitle>
            <CardDescription>Performance across different cognitive domains</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={getRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Performance" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden shadow hover:shadow-lg transition-all duration-300 border-2 border-green-200">
      <CardHeader className="pb-2 bg-gradient-to-r from-green-100 to-blue-100">
        <CardTitle className="flex items-center">
          <Award className="mr-2 text-green-600" size={20} />
          <span>ADHD Brain Explorer 🧠</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {adhdType ? (
          <>
            <div className="text-center mb-4 p-2 bg-green-50 rounded-lg">
              <span className="text-2xl mr-2">
                {typeEmojis[adhdType] || defaultEmoji}
              </span>
              <span className="text-xl font-bold">
                {adhdType}
              </span>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Brain-o-meter: 🔬</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-blue-500 h-4 rounded-full transition-all duration-500" 
                      style={{ width: `${modelConfidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold">{(modelConfidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            {/* Assessment levels with interactive elements */}
            <div className="mt-3 border-t border-dashed border-purple-200 pt-3">
              <h4 className="font-medium text-sm mb-3 flex items-center">
                <span className="mr-2">🔎</span> 
                Your Brain Powers:
              </h4>
              
              <div className="space-y-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Focus Power: 👁️</span>
                    <span className="text-sm font-medium flex items-center">
                      {getLevelEmoji(scoreLevels?.inattention)}
                      <span className="ml-1">{scoreLevels?.inattention || 'N/A'}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${getProgressColors(scoreLevels?.inattention)} ${getProgressWidth(scoreLevels?.inattention)} h-3 rounded-full transition-all duration-500`}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Action Power: 🚀</span>
                    <span className="text-sm font-medium flex items-center">
                      {getLevelEmoji(scoreLevels?.impulsivity)}
                      <span className="ml-1">{scoreLevels?.impulsivity || 'N/A'}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${getProgressColors(scoreLevels?.impulsivity)} ${getProgressWidth(scoreLevels?.impulsivity)} h-3 rounded-full transition-all duration-500`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Insights with emojis */}
            {modelInsights && (
              <div className="mt-4 border-t border-dashed border-blue-200 pt-3">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <span className="mr-2">✨</span>
                  Brain Discoveries:
                </h4>
                <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                  {modelInsights.combined && modelInsights.combined.length > 0 && (
                    <p className="mb-2 flex">
                      <span className="mr-2">🧠</span>
                      <span>{modelInsights.combined[0]}</span>
                    </p>
                  )}
                  {modelInsights.inattention && modelInsights.inattention.length > 0 && (
                    <p className="mb-2 flex">
                      <span className="mr-2">👁️</span>
                      <span>{modelInsights.inattention[0]}</span>
                    </p>
                  )}
                  {modelInsights.impulsivity && modelInsights.impulsivity.length > 0 && (
                    <p className="flex">
                      <span className="mr-2">🚀</span>
                      <span>{modelInsights.impulsivity[0]}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 p-2 bg-purple-50 rounded-lg text-xs text-center">
              <p>✨ This is just a game-based brain map, not a doctor's diagnosis ✨</p>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🔮</div>
            <p className="text-gray-500">Your brain map is still loading...</p>
            <p className="text-gray-400 text-xs mt-2">Play more games to help us understand your superpowers!</p>
          </div>
        )}
      </CardContent>
    </Card>

      
      
      </div>
    
  );
};

export default GameAnalytics;
    
            