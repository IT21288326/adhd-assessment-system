import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Activity, Brain, Clock, BarChart2, Zap, Target, XCircle } from 'lucide-react';

const GameAnalytics = ({ gameData }) => {
  const [analysisResults, setAnalysisResults] = useState({
    inattention: { score: 0, level: '', insights: [] },
    impulsivity: { score: 0, level: '', insights: [] },
    combined: { score: 0, level: '', insights: [] }
  });

  useEffect(() => {
    if (gameData) {
      const results = analyzeGameData(gameData);
      setAnalysisResults(results);
    }
  }, [gameData]);

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

  if (!gameData) {
    return <div className="p-4">No game data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Game Performance Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Brain className="mr-2" size={20} />
              <span>Attention Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{analysisResults.inattention.score.toFixed(1)}</span>
              <span className={`font-bold ${getLevelColor(analysisResults.inattention.level)}`}>
                {analysisResults.inattention.level}
              </span>
            </div>
            <Progress value={analysisResults.inattention.score} className={getProgressColor(analysisResults.inattention.score)} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Zap className="mr-2" size={20} />
              <span>Impulsivity Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{analysisResults.impulsivity.score.toFixed(1)}</span>
              <span className={`font-bold ${getLevelColor(analysisResults.impulsivity.level)}`}>
                {analysisResults.impulsivity.level}
              </span>
            </div>
            <Progress value={analysisResults.impulsivity.score} className={getProgressColor(analysisResults.impulsivity.score)} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Activity className="mr-2" size={20} />
              <span>Combined Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{analysisResults.combined.score.toFixed(1)}</span>
              <span className={`font-bold ${getLevelColor(analysisResults.combined.level)}`}>
                {analysisResults.combined.level}
              </span>
            </div>
            <Progress value={analysisResults.combined.score} className={getProgressColor(analysisResults.combined.score)} />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="metrics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Game Metrics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Target className="mr-2" size={16} />
                  <span>Final Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{gameData.score}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Clock className="mr-2" size={16} />
                  <span>Avg Reaction Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{gameData.averageReactionTime.toFixed(0)} ms</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <XCircle className="mr-2" size={16} />
                  <span>Missed Stars</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{gameData.missedStars}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <AlertCircle className="mr-2" size={16} />
                  <span>Premature Clicks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{gameData.prematureClicks}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <BarChart2 className="mr-2" size={16} />
                  <span>Reaction Time Variability</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {gameData.reactionTimeVariability ? gameData.reactionTimeVariability.toFixed(0) : "N/A"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Streak Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-sm">Correct Streak: </span>
                    <span>{gameData.correctStreak}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Max Missed Streak: </span>
                    <span>{Math.max(...gameData.missedStarStreaks, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2" size={20} />
                  Attention Insights
                </CardTitle>
                <CardDescription>
                  Analysis of focus and attention patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {analysisResults.inattention.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2" size={20} />
                  Impulsivity Insights
                </CardTitle>
                <CardDescription>
                  Analysis of response control patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {analysisResults.impulsivity.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2" size={20} />
                  Combined Analysis
                </CardTitle>
                <CardDescription>
                  Overall performance assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {analysisResults.combined.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                Based on gameplay performance patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.inattention.score > 60 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold flex items-center mb-2">
                      <Brain className="mr-2" size={18} />
                      Attention Strengthening Activities
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Practice mindfulness exercises for 5-10 minutes daily</li>
                      <li>Try games that require sustained attention, like puzzles or memory games</li>
                      <li>Break tasks into smaller, manageable chunks with clear completion criteria</li>
                      <li>Create a distraction-free environment during focus-intensive activities</li>
                    </ul>
                  </div>
                )}
                
                {analysisResults.impulsivity.score > 60 && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-bold flex items-center mb-2">
                      <Zap className="mr-2" size={18} />
                      Impulse Control Activities
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Practice the "stop and think" technique before responding</li>
                      <li>Try games that reward patience and planning</li>
                      <li>Use timers to practice waiting before responding</li>
                      <li>Practice deep breathing when feeling the urge to respond immediately</li>
                    </ul>
                  </div>
                )}
                
                {analysisResults.combined.score > 60 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-bold flex items-center mb-2">
                      <Activity className="mr-2" size={18} />
                      General Cognitive Strengthening
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ensure consistent sleep schedule of 8-10 hours per night</li>
                      <li>Regular physical activity helps improve focus and cognitive control</li>
                      <li>Limit screen time, particularly before bedtime</li>
                      <li>Consider trying different games that target both attention and response control</li>
                    </ul>
                  </div>
                )}
                
                {analysisResults.combined.score <= 60 && (
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h3 className="font-bold flex items-center mb-2">
                      <Target className="mr-2" size={18} />
                      Maintenance Recommendations
                    </h3>
                    <p>Your performance shows good cognitive control patterns. Continue with:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Regular cognitive games to maintain skills</li>
                      <li>Consistent sleep and physical activity</li>
                      <li>Try increasing game difficulty to provide appropriate challenge</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameAnalytics;