
// // import React, { useEffect, useRef, useState } from 'react';
// // import Phaser from 'phaser';
// // import axios from 'axios';
// // import { useLocation } from 'react-router-dom'; // Import to access location state

// // const GameOverScreen = ({ stats, comment, onRestart }) => (
// //   <div style={{
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     width: '100%',
// //     height: '100%',
// //     backgroundColor: 'rgba(0, 0, 0, 0.8)',
// //     color: '#fff',
// //     display: 'flex',
// //     flexDirection: 'column',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     zIndex: 10,
// //   }}>
// //     <h1>Game Over</h1>
// //     <p><strong>Score:</strong> {stats.score}</p>
// //     <p><strong>Missed Stars:</strong> {stats.missedStars}</p>
// //     {/* <p><strong>Average Reaction Time:</strong> {stats.averageReactionTime.toFixed(2)} ms</p>
// //     <p><strong>Premature Clicks:</strong> {stats.prematureClicks}</p> */}
// //     <p><strong>Correct Streak:</strong> {stats.correctStreak}</p>
// //     <p><strong>Performance Comment:</strong> {comment}</p>
// //     <button style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }} onClick={onRestart}>
// //       Restart Game
// //     </button>
// //   </div>
// // );

// // const ReactiontimeGame = () => {
// //   const gameRef = useRef(null);
// //   const [gameOver, setGameOver] = useState(false);
// //   const [stats, setStats] = useState({});
// //   const [comment, setComment] = useState('');
// //   const [score, setScore] = useState(1);
// //   // const [missedStars, setMissedStars] = useState(2);
// //   const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
// //   const location = useLocation(); // Use the hook to access location
// //   const [childId, setChildId] = useState(location.state?.childId || null); // Initialize childId as null
// //   const missedStarsRef = useRef([]); // Use a reference instead of a variable
// //   const prematureClickTimes = useRef([]);




// //   const reactionTimes = useRef([]);
// //   const starResponseLogs = useRef([]);
// //   const scoreRef = useRef(0);
// //   // const missedStarsRef = useRef(0);

// //   let prematureClicks = 0;
// //   let correctStreak = 0;
// //   let speedDown = 100;
// //   const speedDownIncrement = 10;
// //   let starAppearTime;

// //   useEffect(() => {
// //     const id = location.state?.childId;
// //     if (!id) {
// //       alert("Child ID is missing. Please log in again.");
// //     } else {
// //       setChildId(id); // Set childId from location state
// //     }
// //   }, [location.state]);

// //   useEffect(() => {
// //     if (!childId) return; // Wait until childId is available

// //     const config = {
// //       type: Phaser.AUTO,
// //       width: window.innerWidth,
// //       height: window.innerHeight,
// //       parent: 'phaser-container',
// //       physics: {
// //         default: 'arcade',
// //         arcade: { gravity: { y: 0 }, debug: false },
// //       },
// //       scene: { preload, create, update },
// //     };

// //     gameRef.current = new Phaser.Game(config);

// //     return () => {
// //       if (gameRef.current) {
// //         gameRef.current.destroy(true);
// //       }
// //       clearInterval(gameTimer);
// //     };
    
// //   }, [childId]);

  

// //   let star, specialStar, meteor, fireball;
// //   let specialStarActive = false;
// //   let clickSound, backgroundMusic;
// //   let gameTimer;
// //   let gameTimerActive = false;

// //   function preload() {
// //     this.load.image('sky', '/assets/it21288326/sky.png');
// //     this.load.image('star', '/assets/it21288326/star.png');
// //     this.load.image('pointer', '/assets/it21288326/pointer.png');
// //     this.load.audio('clickSound', '/assets/it21288326/clickSound.mp3');
// //     this.load.audio('backgroundMusic', '/assets/it21288326/backgroundMusic.mp3');
// //     this.load.spritesheet('meteor', '/assets/it21288326/meteor.gif', {
// //       frameWidth: 128,
// //       frameHeight: 128,
// //     });
// //     this.load.spritesheet('fireball', '/assets/it21288326/fireball.gif', {
// //       frameWidth: 1024,
// //       frameHeight: 1024,
// //     });
// //   }

// //   function create() {
// //     this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);

// //     star = this.physics.add.image(Phaser.Math.Between(50, window.innerWidth - 50), 0, 'star')
// //       .setScale(0.05)
// //       .setVelocityY(speedDown)
// //       .setInteractive();

// //     this.input.on('gameobjectdown', handleStarClick, this);

// //     this.input.setDefaultCursor('url(/assets/it21288326/pointer.png), pointer');

// //     backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
// //     backgroundMusic.play();

// //     specialStar = this.physics.add.image(-100, -100, 'star');
// //     specialStar.setScale(0.1);
// //     specialStar.setVelocityY(0);
// //     specialStar.setInteractive();
// //     specialStar.setTint(0xffd700);
// //     specialStar.setVisible(false);
// //     this.input.on('gameobjectdown', handleSpecialStarClick, this);

// //     starAppearTime = Date.now();
// //     clickSound = this.sound.add('clickSound');

// //     this.time.addEvent({
// //       delay: Phaser.Math.Between(10000, 20000),
// //       callback: showSpecialStar,
// //       callbackScope: this,
// //       loop: true,
// //     });

// //     meteor = this.add.sprite(Phaser.Math.Between(50, window.innerWidth - 50), -100, 'meteor');
// //     meteor.setVisible(false);
// //     meteor.setScale(0.5);

// //     fireball = this.physics.add.sprite(Phaser.Math.Between(50, window.innerWidth - 50), -100, 'fireball');
// //     fireball.setVisible(false);
// //     fireball.setScale(2);

// //     this.time.addEvent({
// //       delay: Phaser.Math.Between(5000, 10000),
// //       callback: showMeteor,
// //       callbackScope: this,
// //       loop: true,
// //     });

// //     this.time.addEvent({
// //       delay: Phaser.Math.Between(7000, 12000),
// //       callback: showFireball,
// //       callbackScope: this,
// //       loop: true,
// //     });

// //     this.input.on('pointerdown', handlePrematureClick, this);

// //     gameTimerActive = true;
// //     gameTimer = setInterval(() => {
// //       setTimeLeft((prev) => {
// //         if (prev <= 1) {
// //           clearInterval(gameTimer);
// //           endGame();
// //           return 0;
// //         }
// //         return prev - 1;
// //       });
// //     }, 1000);
// //   }

// //   function update() {
// //     if (!gameTimerActive) return;

// //     if (star.y > window.innerHeight) {
// //       missedStarsRef.current.push(Date.now()); // Store timestamp when a star is missed
// //       resetStar();
// //     }
    

// //     if (specialStarActive && specialStar.y > window.innerHeight) {
// //       specialStar.setVisible(false);
// //       specialStarActive = false;
// //     }
// //   }

// //   // function handleStarClick(pointer, clickedStar) {
// //   //   if (!gameTimerActive || clickedStar !== star) return;

// //   //   const reactionTime = Date.now() - starAppearTime;
// //   //   reactionTimes.current.push(reactionTime);
// //   //   correctStreak++;

// //   //   if (correctStreak % 5 === 0) speedDown += speedDownIncrement;

// //   //   scoreRef.current += 1;
// //   //   setScore(scoreRef.current);

// //   //   resetStar();
// //   // }
// //   function handleStarClick(pointer, clickedStar) {
// //     if (!clickedStar) return;
// //     const reactionTime = Date.now() - starAppearTime;
// //     reactionTimes.current.push(reactionTime);
// //     starResponseLogs.current.push({ event: 'clicked', reactionTime, timestamp: Date.now() });
// //     correctStreak++;
// //     if (correctStreak % 5 === 0) speedDown += speedDownIncrement;
// //     scoreRef.current += 1;
// //     setScore(scoreRef.current);
// //     resetStar();
// //   }

// //   function handleSpecialStarClick(pointer, clickedStar) {
// //     if (!gameTimerActive || clickedStar !== specialStar) return;

// //     const specialStarReactionTime = Date.now() - starAppearTime;
// //     reactionTimes.current.push(specialStarReactionTime);

// //     scoreRef.current += 5; // Bonus points for clicking the special star
// //     setScore(scoreRef.current);

// //     clickSound.play();
// //     specialStar.setVisible(false);
// //     specialStarActive = false;
// //   }

// //   function resetStar() {
// //     star.y = 0;
// //     star.x = Phaser.Math.Between(50, window.innerWidth - 50);
// //     star.setVelocityY(speedDown);
// //     starAppearTime = Date.now();
// //   }

// //   function showSpecialStar() {
// //     specialStar.x = Phaser.Math.Between(50, window.innerWidth - 50);
// //     specialStar.y = 0;
// //     specialStar.setVelocityY(speedDown / 2);
// //     specialStar.setVisible(true);
// //     specialStarActive = true;
// //   }

// //   function showMeteor() {
// //     meteor.x = Phaser.Math.Between(50, window.innerWidth - 50);
// //     meteor.y = -100;
// //     meteor.setVisible(true);
// //   }

// //   function showFireball() {
// //     fireball.x = Phaser.Math.Between(50, window.innerWidth - 50);
// //     fireball.y = -100;
// //     fireball.setVisible(true);
// //     fireball.setAngle(-60);

// //     const angleInRadians = Phaser.Math.DegToRad(120);
// //     const speedMagnitude = 200;
// //     const velocityX = Math.cos(angleInRadians) * speedMagnitude;
// //     const velocityY = Math.sin(angleInRadians) * speedMagnitude;
// //     fireball.setVelocity(velocityX, velocityY);
// //   }

// //   // function handlePrematureClick(pointer) {
// //   //   if (!gameTimerActive || star.getBounds().contains(pointer.x, pointer.y)) return;
// //   //   prematureClicks++;
// //   // }
// //   function handlePrematureClick(pointer) {
// //     if (star.getBounds().contains(pointer.x, pointer.y)) return;
// //     prematureClickTimes.current.push(Date.now()); // Store timestamp of premature click
// //   }
  
  

// //   // async function endGame() {
// //   //   setGameOver(true);
// //   //   gameTimerActive = false;
// //   //   star.setVelocityY(0);
// //   //   backgroundMusic.stop();
// //   //   clearInterval(gameTimer);

// //   //   const averageReactionTime = reactionTimes.current.length
// //   //     ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length
// //   //     : 0;

// //   //   const gameData = {
// //   //     childId,
// //   //     reactionTimes: reactionTimes.current,
// //   //     averageReactionTime,
// //   //     correctStreak,
// //   //     prematureClicks,
// //   //     missedStars: missedStarsRef.current,
// //   //     score: scoreRef.current,
// //   //   };

// //   //   setStats(gameData);

// //   //   const performanceComment = generateComment(gameData);
// //   //   setComment(performanceComment);

// //   //   try {
// //   //     await axios.post('http://localhost:8800/api/metrics/create', gameData);

// //   //     const predictionResponse = await axios.post('http://localhost:5001/predict', {
// //   //       averageReactionTime: gameData.averageReactionTime,
// //   //       correctStreak: gameData.correctStreak,
// //   //       prematureClicks: gameData.prematureClicks,
// //   //       missedStars: gameData.missedStars,
// //   //       score: gameData.score,
// //   //     });

// //   //     alert(`Predicted ADHD Type: ${predictionResponse.data.ADHD_Type}`);
// //   //   } catch (error) {
// //   //     console.error('Error sending data to backend or predicting ADHD type:', error);
// //   //   }
// //   // }

// //   // 
  
// //   const calculateReactionTimeVariability = (reactionTimes, avgTime) => {
// //     if (reactionTimes.length <= 1) return 0;
  
// //     return Math.sqrt(
// //       reactionTimes.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / reactionTimes.length
// //     );
// //   };
  


// //     reactionTimes.length > 1 
// //       ? Math.sqrt(reactionTimes.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / reactionTimes.length)
// //       : 0;
  
// //       const calculateMissedStarStreaks = (missedStars) => {
// //         if (!Array.isArray(missedStars)) return [];
      
// //         return missedStars.reduce((streaks, miss, index, arr) => {
// //           if (miss) streaks.currentStreak++;
// //           else if (streaks.currentStreak > 0) {
// //             streaks.data.push(streaks.currentStreak);
// //             streaks.currentStreak = 0;
// //           }
// //           if (index === arr.length - 1 && streaks.currentStreak > 0) {
// //             streaks.data.push(streaks.currentStreak);
// //           }
// //           return streaks;
// //         }, { data: [], currentStreak: 0 }).data;
// //       };
      
  
// //   // const endGame = async () => {
// //   //   const reactionTimeVariability = calculateReactionTimeVariability(reactionTimes.current, averageReactionTime);
// //   //   const missedStarStreaks = calculateMissedStarStreaks(missedStarsRef.current);
// //   //   const clickTimestamps = prematureClickTimes.current;
  
// //   //   const gameData = {
// //   //     childId,
// //   //     reactionTimes: reactionTimes.current,
// //   //     reactionTimeVariability,
// //   //     averageReactionTime,
// //   //     missedStarStreaks,
// //   //     clickTimestamps,
// //   //     correctStreak,
// //   //     prematureClicks,
// //   //     missedStars: missedStarsRef.current,
// //   //     score: scoreRef.current,
// //   //   };
  
// //   //   try {
// //   //     await axios.post('http://localhost:8800/api/metrics/create', gameData);
// //   //   } catch (error) {
// //   //     console.error('Error saving game metrics:', error);
// //   //   }
// //   // };
// //   const endGame = async () => {
// //     const averageReactionTime = reactionTimes.current.length
// //       ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length
// //       : 0;
  
// //     const reactionTimeVariability = reactionTimes.current.length > 1
// //       ? calculateReactionTimeVariability(reactionTimes.current, averageReactionTime)
// //       : 0;
    
// //     const missedStarStreaks = calculateMissedStarStreaks(missedStarsRef.current || []);
// //     const clickTimestamps = prematureClickTimes.current || [];
    
// //     const gameData = {
// //       childId,
// //       reactionTimes: reactionTimes.current,
// //       reactionTimeVariability,
// //       averageReactionTime,
// //       missedStarStreaks,
// //       clickTimestamps,
// //       correctStreak,
// //       prematureClicks: prematureClickTimes.current.length, // Get count from array
// //       missedStars: missedStarsRef.current.length, // Get count from array
// //       score: scoreRef.current,
// //     };
  
// //     try {
// //       await axios.post('http://localhost:8800/api/metrics/create', gameData);
// //     } catch (error) {
// //       console.error('Error saving game metrics:', error);
// //     }
// //   };
  
  
  

// //   const generateComment = ({ averageReactionTime, missedStars, prematureClicks, correctStreak }) => {
// //     if (correctStreak >= 10) return 'Excellent attention and reaction skills!';
// //     if (missedStars > 5) return 'Try to focus more next time!';
// //     if (prematureClicks > 5) return 'You seem impulsive. Try to pace yourself.';
// //     return 'Good effort! Keep practicing to improve!';
// //   };

// //   // const restartGame = () => {
// //   //   setGameOver(false);
// //   //   reactionTimes.current = [];
// //   //   prematureClicks = 0;
// //   //   correctStreak = 0;
// //   //   missedStarsRef.current = 0;
// //   //   scoreRef.current = 0;
// //   //   setScore(1);
// //   //   setMissedStars(2);
// //   //   setTimeLeft(180);
// //   //   gameRef.current.scene.restart();
// //   // };
// //   const restartGame = () => {
// //     setGameOver(false);
// //     reactionTimes.current = [];
// //     prematureClicks = 0;
// //     correctStreak = 0;
// //     missedStarsRef.current = 0;
// //     scoreRef.current = 0;
// //     setScore(1);
// //     setMissedStars(2);
// //     setTimeLeft(180);
  
// //     if (gameRef.current) {
// //       gameRef.current.scene.scenes[0].scene.restart();
// //     }
// //   };
  

// //   return (
// //     <div id="phaser-container">
// //       {gameOver && <GameOverScreen stats={stats} comment={comment} onRestart={restartGame} />}
// //     </div>
// //   );
// // };

// // export default ReactiontimeGame;

// import React, { useEffect, useRef, useState } from 'react';
// import Phaser from 'phaser';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// const GameOverScreen = ({ stats, comment, onRestart }) => (
//   <div style={{
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     color: '#fff',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   }}>
//     <h1>Game Over</h1>
//     <p><strong>Score:</strong> {stats.score}</p>
//     <p><strong>Missed Stars:</strong> {stats.missedStars}</p>
//     <p><strong>Correct Streak:</strong> {stats.correctStreak}</p>
//     <p><strong>Performance Comment:</strong> {comment}</p>
//     <button style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }} onClick={onRestart}>
//       Restart Game
//     </button>
//   </div>
// );

// const ReactiontimeGame = () => {
//   const gameRef = useRef(null);
//   const [gameOver, setGameOver] = useState(false);
//   const [stats, setStats] = useState({
//     score: 0,
//     missedStars: 0,
//     correctStreak: 0,
//     prematureClicks: 0,
//     averageReactionTime: 0
//   });
//   const [comment, setComment] = useState('');
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
//   const location = useLocation();
//   const [childId, setChildId] = useState(location.state?.childId || null);
  
//   // Refs for tracking game metrics
//   const missedStarsRef = useRef([]);
//   const prematureClickTimes = useRef([]);
//   const reactionTimes = useRef([]);
//   const starResponseLogs = useRef([]);
//   const scoreRef = useRef(0);
//   const correctStreakRef = useRef(0);
  
//   // Game variables
//   const speedDownRef = useRef(100);
//   const speedDownIncrement = 10;
//   const starAppearTimeRef = useRef(0);
  
//   // Game objects refs
//   const starRef = useRef(null);
//   const specialStarRef = useRef(null);
//   const meteorRef = useRef(null);
//   const fireballRef = useRef(null);
//   const backgroundMusicRef = useRef(null);
//   const clickSoundRef = useRef(null);
  
//   // Game state
//   const specialStarActiveRef = useRef(false);
//   const gameTimerRef = useRef(null);
//   const gameTimerActiveRef = useRef(false);

//   useEffect(() => {
//     const id = location.state?.childId;
//     if (!id) {
//       alert("Child ID is missing. Please log in again.");
//     } else {
//       setChildId(id);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     if (!childId) return; // Wait until childId is available

//     const config = {
//       type: Phaser.AUTO,
//       width: window.innerWidth,
//       height: window.innerHeight,
//       parent: 'phaser-container',
//       physics: {
//         default: 'arcade',
//         arcade: { gravity: { y: 0 }, debug: false },
//       },
//       scene: { preload, create, update },
//     };

//     gameRef.current = new Phaser.Game(config);

//     return () => {
//       if (gameRef.current) {
//         gameRef.current.destroy(true);
//       }
//       if (gameTimerRef.current) {
//         clearInterval(gameTimerRef.current);
//       }
//     };
//   }, [childId]);

//   function preload() {
//     this.load.image('sky', '/assets/it21288326/sky.png');
//     this.load.image('star', '/assets/it21288326/star.png');
//     this.load.image('pointer', '/assets/it21288326/pointer.png');
//     this.load.audio('clickSound', '/assets/it21288326/clickSound.mp3');
//     this.load.audio('backgroundMusic', '/assets/it21288326/backgroundMusic.mp3');
//     this.load.spritesheet('meteor', '/assets/it21288326/meteor.gif', {
//       frameWidth: 128,
//       frameHeight: 128,
//     });
//     this.load.spritesheet('fireball', '/assets/it21288326/fireball.gif', {
//       frameWidth: 1024,
//       frameHeight: 1024,
//     });
//   }

//   function create() {
//     this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);

//     // Create star
//     starRef.current = this.physics.add.image(
//       Phaser.Math.Between(50, window.innerWidth - 50), 
//       0, 
//       'star'
//     )
//       .setScale(0.05)
//       .setVelocityY(speedDownRef.current)
//       .setInteractive();

//     this.input.on('gameobjectdown', handleStarClick, this);
//     this.input.setDefaultCursor('url(/assets/it21288326/pointer.png), pointer');

//     // Add sounds
//     backgroundMusicRef.current = this.sound.add('backgroundMusic', { loop: true });
//     backgroundMusicRef.current.play();
//     clickSoundRef.current = this.sound.add('clickSound');

//     // Create special star
//     specialStarRef.current = this.physics.add.image(-100, -100, 'star');
//     specialStarRef.current.setScale(0.1);
//     specialStarRef.current.setVelocityY(0);
//     specialStarRef.current.setInteractive();
//     specialStarRef.current.setTint(0xffd700);
//     specialStarRef.current.setVisible(false);
//     this.input.on('gameobjectdown', handleSpecialStarClick, this);

//     starAppearTimeRef.current = Date.now();

//     // Schedule special star appearances
//     this.time.addEvent({
//       delay: Phaser.Math.Between(10000, 20000),
//       callback: showSpecialStar,
//       callbackScope: this,
//       loop: true,
//     });

//     // Create meteor
//     meteorRef.current = this.add.sprite(
//       Phaser.Math.Between(50, window.innerWidth - 50), 
//       -100, 
//       'meteor'
//     );
//     meteorRef.current.setVisible(false);
//     meteorRef.current.setScale(0.5);

//     // Create fireball
//     fireballRef.current = this.physics.add.sprite(
//       Phaser.Math.Between(50, window.innerWidth - 50), 
//       -100, 
//       'fireball'
//     );
//     fireballRef.current.setVisible(false);
//     fireballRef.current.setScale(2);

//     // Schedule meteor and fireball appearances
//     this.time.addEvent({
//       delay: Phaser.Math.Between(5000, 10000),
//       callback: showMeteor,
//       callbackScope: this,
//       loop: true,
//     });

//     this.time.addEvent({
//       delay: Phaser.Math.Between(7000, 12000),
//       callback: showFireball,
//       callbackScope: this,
//       loop: true,
//     });

//     this.input.on('pointerdown', handlePrematureClick, this);

//     // Start game timer
//     gameTimerActiveRef.current = true;
//     gameTimerRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(gameTimerRef.current);
//           endGame();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   }

//   function update() {
//     if (!gameTimerActiveRef.current) return;

//     if (starRef.current && starRef.current.y > window.innerHeight) {
//       missedStarsRef.current.push(Date.now()); // Store timestamp when a star is missed
//       resetStar();
//     }

//     if (specialStarActiveRef.current && specialStarRef.current && specialStarRef.current.y > window.innerHeight) {
//       specialStarRef.current.setVisible(false);
//       specialStarActiveRef.current = false;
//     }
//   }

//   function handleStarClick(pointer, clickedStar) {
//     if (!clickedStar || clickedStar !== starRef.current) return;
    
//     const reactionTime = Date.now() - starAppearTimeRef.current;
//     reactionTimes.current.push(reactionTime);
//     starResponseLogs.current.push({ 
//       event: 'clicked', 
//       reactionTime, 
//       timestamp: Date.now() 
//     });
    
//     correctStreakRef.current++;
//     if (correctStreakRef.current % 5 === 0) {
//       speedDownRef.current += speedDownIncrement;
//     }
    
//     scoreRef.current += 1;
//     setScore(scoreRef.current);
    
//     resetStar();
//   }

//   function handleSpecialStarClick(pointer, clickedStar) {
//     if (!gameTimerActiveRef.current || !clickedStar || clickedStar !== specialStarRef.current) return;

//     const specialStarReactionTime = Date.now() - starAppearTimeRef.current;
//     reactionTimes.current.push(specialStarReactionTime);

//     scoreRef.current += 5; // Bonus points for clicking the special star
//     setScore(scoreRef.current);

//     clickSoundRef.current.play();
//     specialStarRef.current.setVisible(false);
//     specialStarActiveRef.current = false;
//   }

//   function resetStar() {
//     if (!starRef.current) return;
    
//     starRef.current.y = 0;
//     starRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     starRef.current.setVelocityY(speedDownRef.current);
//     starAppearTimeRef.current = Date.now();
//   }

//   function showSpecialStar() {
//     if (!specialStarRef.current) return;
    
//     specialStarRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     specialStarRef.current.y = 0;
//     specialStarRef.current.setVelocityY(speedDownRef.current / 2);
//     specialStarRef.current.setVisible(true);
//     specialStarActiveRef.current = true;
//   }

//   function showMeteor() {
//     if (!meteorRef.current) return;
    
//     meteorRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     meteorRef.current.y = -100;
//     meteorRef.current.setVisible(true);
//   }

//   function showFireball() {
//     if (!fireballRef.current) return;
    
//     fireballRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     fireballRef.current.y = -100;
//     fireballRef.current.setVisible(true);
//     fireballRef.current.setAngle(-60);

//     const angleInRadians = Phaser.Math.DegToRad(120);
//     const speedMagnitude = 200;
//     const velocityX = Math.cos(angleInRadians) * speedMagnitude;
//     const velocityY = Math.sin(angleInRadians) * speedMagnitude;
//     fireballRef.current.setVelocity(velocityX, velocityY);
//   }

//   function handlePrematureClick(pointer) {
//     if (!starRef.current || starRef.current.getBounds().contains(pointer.x, pointer.y)) return;
//     prematureClickTimes.current.push(Date.now()); // Store timestamp of premature click
//   }

//   const calculateReactionTimeVariability = (reactionTimes, avgTime) => {
//     if (!reactionTimes || reactionTimes.length <= 1) return 0;
  
//     return Math.sqrt(
//       reactionTimes.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / reactionTimes.length
//     );
//   };

//   const calculateMissedStarStreaks = (missedStars) => {
//     if (!Array.isArray(missedStars) || missedStars.length === 0) return [];
  
//     // This function should analyze the timestamps to find streaks
//     // For simplicity, we'll just return the array length for now
//     return [missedStars.length];
//   };

//   const endGame = async () => {
//     setGameOver(true);
//     gameTimerActiveRef.current = false;
    
//     if (starRef.current) {
//       starRef.current.setVelocityY(0);
//     }
    
//     if (backgroundMusicRef.current) {
//       backgroundMusicRef.current.stop();
//     }
    
//     if (gameTimerRef.current) {
//       clearInterval(gameTimerRef.current);
//     }

//     const averageReactionTime = reactionTimes.current.length
//       ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length
//       : 0;
  
//     const reactionTimeVariability = calculateReactionTimeVariability(
//       reactionTimes.current, 
//       averageReactionTime
//     );
    
//     const missedStarStreaks = calculateMissedStarStreaks(missedStarsRef.current);
    
//     const gameData = {
//       childId,
//       reactionTimes: reactionTimes.current,
//       reactionTimeVariability,
//       averageReactionTime,
//       missedStarStreaks,
//       clickTimestamps: prematureClickTimes.current,
//       correctStreak: correctStreakRef.current,
//       prematureClicks: prematureClickTimes.current.length,
//       missedStars: missedStarsRef.current.length,
//       score: scoreRef.current,
//     };
  
//     setStats({
//       score: scoreRef.current,
//       missedStars: missedStarsRef.current.length,
//       correctStreak: correctStreakRef.current,
//       prematureClicks: prematureClickTimes.current.length,
//       averageReactionTime
//     });

//     const performanceComment = generateComment({
//       averageReactionTime,
//       missedStars: missedStarsRef.current.length,
//       prematureClicks: prematureClickTimes.current.length,
//       correctStreak: correctStreakRef.current
//     });
    
//     setComment(performanceComment);
  
//     try {
//       await axios.post('http://localhost:8800/api/metrics/create', gameData);
//     } catch (error) {
//       console.error('Error saving game metrics:', error);
//     }
//   };

//   const generateComment = ({ averageReactionTime, missedStars, prematureClicks, correctStreak }) => {
//     if (correctStreak >= 10) return 'Excellent attention and reaction skills!';
//     if (missedStars > 5) return 'Try to focus more next time!';
//     if (prematureClicks > 5) return 'You seem impulsive. Try to pace yourself.';
//     return 'Good effort! Keep practicing to improve!';
//   };

//   const restartGame = () => {
//     setGameOver(false);
//     reactionTimes.current = [];
//     prematureClickTimes.current = [];
//     missedStarsRef.current = [];
//     correctStreakRef.current = 0;
//     scoreRef.current = 0;
//     speedDownRef.current = 100;
    
//     setScore(0);
//     setTimeLeft(180);
//     setStats({
//       score: 0,
//       missedStars: 0,
//       correctStreak: 0,
//       prematureClicks: 0,
//       averageReactionTime: 0
//     });
//     setComment('');
  
//     if (gameRef.current && gameRef.current.scene.scenes[0]) {
//       gameRef.current.scene.scenes[0].scene.restart();
//     }
//   };

//   return (
//     <div id="phaser-container">
//       {gameOver && <GameOverScreen stats={stats} comment={comment} onRestart={restartGame} />}
//     </div>
//   );
// };

// export default ReactiontimeGame;

// import React, { useEffect, useRef, useState } from 'react';
// import Phaser from 'phaser';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// const GameOverScreen = ({ stats, comment, onRestart }) => (
//   <div style={{
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     color: '#fff',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   }}>
//     <h1>Game Over</h1>
//     <p><strong>Score:</strong> {stats.score}</p>
//     <p><strong>Missed Stars:</strong> {stats.missedStars}</p>
//     <p><strong>Correct Streak:</strong> {stats.correctStreak}</p>
//     <p><strong>Performance Comment:</strong> {comment}</p>
//     <button style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }} onClick={onRestart}>
//       Restart Game
//     </button>
//   </div>
// );

// const ReactiontimeGame = () => {
//   const gameRef = useRef(null);
//   const [gameOver, setGameOver] = useState(false);
//   const [stats, setStats] = useState({
//     score: 0,
//     missedStars: 0,
//     correctStreak: 0,
//     prematureClicks: 0,
//     averageReactionTime: 0
//   });
//   const [comment, setComment] = useState('');
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
//   const location = useLocation();
//   const [childId, setChildId] = useState(location.state?.childId || null);
  
//   // Refs for tracking game metrics
//   const missedStarsRef = useRef([]);
//   const prematureClicksRef = useRef(0);
//   const prematureClickTimes = useRef([]);
//   const reactionTimes = useRef([]);
//   const starResponseLogs = useRef([]);
//   const scoreRef = useRef(0);
//   const correctStreakRef = useRef(0);
//   const gameStartTimeRef = useRef(0);
  
//   // Game variables
//   const speedDownRef = useRef(100);
//   const speedDownIncrement = 10;
//   const starAppearTimeRef = useRef(0);
  
//   // Game objects refs
//   const starRef = useRef(null);
//   const specialStarRef = useRef(null);
//   const meteorRef = useRef(null);
//   const fireballRef = useRef(null);
//   const backgroundMusicRef = useRef(null);
//   const clickSoundRef = useRef(null);
  
//   // Game state
//   const specialStarActiveRef = useRef(false);
//   const gameTimerRef = useRef(null);
//   const gameTimerActiveRef = useRef(false);

//   useEffect(() => {
//     const id = location.state?.childId;
//     if (!id) {
//       alert("Child ID is missing. Please log in again.");
//     } else {
//       setChildId(id);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     if (!childId) return; // Wait until childId is available

//     gameStartTimeRef.current = Date.now();

//     const config = {
//       type: Phaser.AUTO,
//       width: window.innerWidth,
//       height: window.innerHeight,
//       parent: 'phaser-container',
//       physics: {
//         default: 'arcade',
//         arcade: { gravity: { y: 0 }, debug: false },
//       },
//       scene: { preload, create, update },
//     };

//     gameRef.current = new Phaser.Game(config);

//     return () => {
//       if (gameRef.current) {
//         gameRef.current.destroy(true);
//       }
//       if (gameTimerRef.current) {
//         clearInterval(gameTimerRef.current);
//       }
//     };
//   }, [childId]);

//   function preload() {
//     this.load.image('sky', '/assets/it21288326/sky.png');
//     this.load.image('star', '/assets/it21288326/star.png');
//     this.load.image('pointer', '/assets/it21288326/pointer.png');
//     this.load.audio('clickSound', '/assets/it21288326/clickSound.mp3');
//     this.load.audio('backgroundMusic', '/assets/it21288326/backgroundMusic.mp3');
//     this.load.spritesheet('meteor', '/assets/it21288326/meteor.gif', {
//       frameWidth: 128,
//       frameHeight: 128,
//     });
//     this.load.spritesheet('fireball', '/assets/it21288326/fireball.gif', {
//       frameWidth: 1024,
//       frameHeight: 1024,
//     });
//   }

//   function create() {
//     this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);

//     // Create star
//     starRef.current = this.physics.add.image(
//       Phaser.Math.Between(50, window.innerWidth - 50), 
//       0, 
//       'star'
//     )
//       .setScale(0.05)
//       .setVelocityY(speedDownRef.current)
//       .setInteractive();

//     this.input.on('gameobjectdown', handleStarClick, this);
//     this.input.setDefaultCursor('url(/assets/it21288326/pointer.png), pointer');

//     // Add sounds
//     backgroundMusicRef.current = this.sound.add('backgroundMusic', { loop: true });
//     backgroundMusicRef.current.play();
//     clickSoundRef.current = this.sound.add('clickSound');

//     // Create special star
//     specialStarRef.current = this.physics.add.image(-100, -100, 'star');
//     specialStarRef.current.setScale(0.1);
//     specialStarRef.current.setVelocityY(0);
//     specialStarRef.current.setInteractive();
//     specialStarRef.current.setTint(0xffd700);
//     specialStarRef.current.setVisible(false);
//     this.input.on('gameobjectdown', handleSpecialStarClick, this);

//     starAppearTimeRef.current = Date.now();

//     // Schedule special star appearances
//     this.time.addEvent({
//       delay: Phaser.Math.Between(10000, 20000),
//       callback: showSpecialStar,
//       callbackScope: this,
//       loop: true,
//     });

//     // Create meteor
//     meteorRef.current = this.add.sprite(
//       Phaser.Math.Between(50, window.innerWidth - 50), 
//       -100, 
//       'meteor'
//     );
//     meteorRef.current.setVisible(false);
//     meteorRef.current.setScale(0.5);

//     // Create fireball
//     fireballRef.current = this.physics.add.sprite(
//       Phaser.Math.Between(50, window.innerWidth - 50), 
//       -100, 
//       'fireball'
//     );
//     fireballRef.current.setVisible(false);
//     fireballRef.current.setScale(2);

//     // Schedule meteor and fireball appearances
//     this.time.addEvent({
//       delay: Phaser.Math.Between(5000, 10000),
//       callback: showMeteor,
//       callbackScope: this,
//       loop: true,
//     });

//     this.time.addEvent({
//       delay: Phaser.Math.Between(7000, 12000),
//       callback: showFireball,
//       callbackScope: this,
//       loop: true,
//     });

//     this.input.on('pointerdown', handlePrematureClick, this);

//     // Start game timer
//     gameTimerActiveRef.current = true;
//     gameTimerRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(gameTimerRef.current);
//           endGame();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   }

//   function update() {
//     if (!gameTimerActiveRef.current) return;

//     if (starRef.current && starRef.current.y > window.innerHeight) {
//       missedStarsRef.current.push(Date.now()); // Store timestamp when a star is missed
//       resetStar();
//     }

//     if (specialStarActiveRef.current && specialStarRef.current && specialStarRef.current.y > window.innerHeight) {
//       specialStarRef.current.setVisible(false);
//       specialStarActiveRef.current = false;
//     }
//   }

//   function handleStarClick(pointer, clickedStar) {
//     if (!clickedStar || clickedStar !== starRef.current) return;
    
//     const reactionTime = Date.now() - starAppearTimeRef.current;
//     reactionTimes.current.push(reactionTime);
//     starResponseLogs.current.push({ 
//       event: 'clicked', 
//       reactionTime, 
//       timestamp: Date.now() 
//     });
    
//     correctStreakRef.current++;
//     if (correctStreakRef.current % 5 === 0) {
//       speedDownRef.current += speedDownIncrement;
//     }
    
//     scoreRef.current += 1;
//     setScore(scoreRef.current);
    
//     resetStar();
//   }

//   function handleSpecialStarClick(pointer, clickedStar) {
//     if (!gameTimerActiveRef.current || !clickedStar || clickedStar !== specialStarRef.current) return;

//     const specialStarReactionTime = Date.now() - starAppearTimeRef.current;
//     reactionTimes.current.push(specialStarReactionTime);

//     scoreRef.current += 5; // Bonus points for clicking the special star
//     setScore(scoreRef.current);

//     clickSoundRef.current.play();
//     specialStarRef.current.setVisible(false);
//     specialStarActiveRef.current = false;
//   }

//   function resetStar() {
//     if (!starRef.current) return;
    
//     starRef.current.y = 0;
//     starRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     starRef.current.setVelocityY(speedDownRef.current);
//     starAppearTimeRef.current = Date.now();
//   }

//   function showSpecialStar() {
//     if (!specialStarRef.current) return;
    
//     specialStarRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     specialStarRef.current.y = 0;
//     specialStarRef.current.setVelocityY(speedDownRef.current / 2);
//     specialStarRef.current.setVisible(true);
//     specialStarActiveRef.current = true;
//   }

//   function showMeteor() {
//     if (!meteorRef.current) return;
    
//     meteorRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     meteorRef.current.y = -100;
//     meteorRef.current.setVisible(true);
//   }

//   function showFireball() {
//     if (!fireballRef.current) return;
    
//     fireballRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     fireballRef.current.y = -100;
//     fireballRef.current.setVisible(true);
//     fireballRef.current.setAngle(-60);

//     const angleInRadians = Phaser.Math.DegToRad(120);
//     const speedMagnitude = 200;
//     const velocityX = Math.cos(angleInRadians) * speedMagnitude;
//     const velocityY = Math.sin(angleInRadians) * speedMagnitude;
//     fireballRef.current.setVelocity(velocityX, velocityY);
//   }

//   function handlePrematureClick(pointer) {
//     if (!starRef.current || starRef.current.getBounds().contains(pointer.x, pointer.y)) return;
//     prematureClickTimes.current.push(Date.now()); // Store timestamp of premature click
//     prematureClicksRef.current++; // Increment the counter
//   }

//   const calculateReactionTimeVariability = (reactionTimes, avgTime) => {
//     if (!reactionTimes || reactionTimes.length <= 1) return 0;
  
//     return Math.sqrt(
//       reactionTimes.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / reactionTimes.length
//     );
//   };

//   const calculateMissedStarStreaks = (missedStars) => {
//     if (!Array.isArray(missedStars) || missedStars.length === 0) return [];
    
//     // For a basic streak calculation, we look at time gaps between missed stars
//     // If stars are missed in quick succession (less than 2 seconds apart), count as a streak
//     const streaks = [];
//     let currentStreak = 1;
    
//     for (let i = 1; i < missedStars.length; i++) {
//       const timeDiff = missedStars[i] - missedStars[i-1];
      
//       if (timeDiff < 2000) { // Less than 2 seconds apart
//         currentStreak++;
//       } else {
//         if (currentStreak > 1) {
//           streaks.push(currentStreak);
//         }
//         currentStreak = 1;
//       }
//     }
    
//     // Add the last streak if it exists
//     if (currentStreak > 1) {
//       streaks.push(currentStreak);
//     }
    
//     return streaks.length > 0 ? streaks : [1]; // Return at least one streak of 1 if no streaks found
//   };

//   const endGame = async () => {
//     setGameOver(true);
//     gameTimerActiveRef.current = false;
    
//     if (starRef.current) {
//       starRef.current.setVelocityY(0);
//     }
    
//     if (backgroundMusicRef.current) {
//       backgroundMusicRef.current.stop();
//     }
    
//     if (gameTimerRef.current) {
//       clearInterval(gameTimerRef.current);
//     }

//     const averageReactionTime = reactionTimes.current.length
//       ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length
//       : 0;
  
//     const reactionTimeVariability = calculateReactionTimeVariability(
//       reactionTimes.current, 
//       averageReactionTime
//     );
    
//     const missedStarStreaks = calculateMissedStarStreaks(missedStarsRef.current);
    
//     const gameData = {
//       childId,
//       reactionTimes: reactionTimes.current,
//       reactionTimeVariability,
//       averageReactionTime,
//       missedStarStreaks,
//       clickTimestamps: prematureClickTimes.current,
//       correctStreak: correctStreakRef.current,
//       prematureClicks: prematureClicksRef.current,
//       missedStars: missedStarsRef.current.length,
//       score: scoreRef.current
//       // sessionDuration: Math.floor((Date.now() - gameStartTimeRef.current) / 1000)
//     };
//     console.log('Payload being sent to backend:', JSON.stringify(gameData, null, 2));
  
//     // Update local state for display
//     setStats({
//       score: scoreRef.current,
//       missedStars: missedStarsRef.current.length,
//       correctStreak: correctStreakRef.current,
//       prematureClicks: prematureClicksRef.current,
//       averageReactionTime
//     });

//     const performanceComment = generateComment({
//       averageReactionTime,
//       missedStars: missedStarsRef.current.length,
//       prematureClicks: prematureClicksRef.current,
//       correctStreak: correctStreakRef.current
//     });
    
//     setComment(performanceComment);
  
//     try {
//       // Send just one POST request to save game metrics
//       await axios.post('http://localhost:8800/api/metrics/create', gameData);
//       console.log('Game metrics saved successfully');
//     } catch (error) {
//       console.error('Error saving game metrics:', error);
//     }
//   };

//   const generateComment = ({ averageReactionTime, missedStars, prematureClicks, correctStreak }) => {
//     if (correctStreak >= 10) return 'Excellent attention and reaction skills!';
//     if (missedStars > 5) return 'Try to focus more next time!';
//     if (prematureClicks > 5) return 'You seem impulsive. Try to pace yourself.';
//     return 'Good effort! Keep practicing to improve!';
//   };

//   const restartGame = () => {
//     setGameOver(false);
//     reactionTimes.current = [];
//     prematureClickTimes.current = [];
//     prematureClicksRef.current = 0;
//     missedStarsRef.current = [];
//     correctStreakRef.current = 0;
//     scoreRef.current = 0;
//     speedDownRef.current = 100;
//     gameStartTimeRef.current = Date.now();
    
//     setScore(0);
//     setTimeLeft(180);
//     setStats({
//       score: 0,
//       missedStars: 0,
//       correctStreak: 0,
//       prematureClicks: 0,
//       averageReactionTime: 0
//     });
//     setComment('');
  
//     if (gameRef.current && gameRef.current.scene.scenes[0]) {
//       gameRef.current.scene.scenes[0].scene.restart();
//     }
//   };

//   return (
//     <div id="phaser-container">
//       {gameOver && <GameOverScreen stats={stats} comment={comment} onRestart={restartGame} />}
//     </div>
//   );
// };

// export default ReactiontimeGame;

import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';


const GameOverScreen = ({ stats, comment, onRestart, onViewAnalytics }) => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
     fontFamily: "'Sour Gummy', sans-serif"
  }}>
    <h1 style={{ 
      fontSize: '3rem', 
      margin: '0 0 20px 0',
      textShadow: '0 0 10px #FFD700, 0 0 20px #FFD700'
    }}>
      Game Over!
    </h1>
    
    <div style={{
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '15px',
      padding: '20px',
      margin: '10px',
      maxWidth: '500px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '24px', marginRight: '10px' }}>🌟</span>
        <p style={{ fontSize: '18px', margin: 0 }}><strong>Score:</strong> {stats.score}</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '24px', marginRight: '10px' }}>❌</span>
        <p style={{ fontSize: '18px', margin: 0 }}><strong>Missed Stars:</strong> {stats.missedStars}</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '24px', marginRight: '10px' }}>🔥</span>
        <p style={{ fontSize: '18px', margin: 0 }}><strong>Best Streak:</strong> {stats.correctStreak}</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '24px', marginRight: '10px' }}>⏱️</span>
        <p style={{ fontSize: '18px', margin: 0 }}><strong>Average Reaction:</strong> {stats.averageReactionTime.toFixed(2)} ms</p>
      </div>
    </div>
    
    <div style={{
      background: 'rgba(255, 215, 0, 0.3)',
      borderRadius: '15px',
      padding: '15px',
      margin: '20px 0',
      maxWidth: '500px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center'
    }}>
      <p style={{ fontSize: '20px', margin: 0 }}>{comment}</p>
    </div>
    
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <button 
        style={{ 
          padding: '12px 25px', 
          fontSize: '18px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        }} 
        onClick={onRestart}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Play Again! 🚀
      </button>
      
      <button 
        style={{ 
          padding: '12px 25px', 
          fontSize: '18px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        }} 
        onClick={onViewAnalytics}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        View Analytics 📊
      </button>
    </div>
  </div>
);
const GameStartScreen = ({ onStartGame }) => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
     fontFamily: "'Sour Gummy', sans-serif"
  }}>
    <h1 style={{ 
      fontSize: '3.5rem', 
      margin: '0 0 20px 0',
      textShadow: '0 0 10px #FFD700, 0 0 20px #FFD700'
    }}>
      Star Catcher
    </h1>
    
    <div style={{
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '15px',
      padding: '20px',
      margin: '20px',
      maxWidth: '600px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ fontSize: '24px', marginRight: '15px' }}>⭐</span>
        <p style={{ fontSize: '18px', margin: 0, textAlign: 'left' }}>Click the falling stars as quickly as you can!</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ fontSize: '24px', marginRight: '15px' }}>🌟</span>
        <p style={{ fontSize: '18px', margin: 0, textAlign: 'left' }}>Golden stars are worth 5 points!</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ fontSize: '24px', marginRight: '15px' }}>⏱️</span>
        <p style={{ fontSize: '18px', margin: 0, textAlign: 'left' }}>You have 3 minutes to get the highest score!</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '24px', marginRight: '15px' }}>⚠️</span>
        <p style={{ fontSize: '18px', margin: 0, textAlign: 'left' }}>Avoid clicking when no stars are present!</p>
      </div>
    </div>
    
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '20px 0'
    }}>
      <div style={{
        background: 'rgba(255, 215, 0, 0.3)',
        borderRadius: '15px',
        padding: '15px',
        maxWidth: '500px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <p style={{ fontSize: '20px', margin: 0 }}>Are you ready to test your reaction time?</p>
      </div>
      
      <button 
        style={{ 
          padding: '15px 40px', 
          fontSize: '24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        }} 
        onClick={onStartGame}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Start Game! 🚀
      </button>
    </div>
  </div>
);
const GameHUD = ({ timeLeft, score, comment }) => {
  // Convert seconds to minutes:seconds format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      padding: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      zIndex: 5,
      pointerEvents: 'none' // Allow clicks to pass through to the game
    }}>
      {/* Time and Score */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '0 0 10px 0',
        padding: '10px 20px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', color: '#fff', marginRight: '8px' }}>⏱️</span>
          <span style={{ fontSize: '20px', color: timeLeft < 30 ? '#ff5555' : '#fff', fontWeight: 'bold' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', color: '#fff', marginRight: '8px' }}>🌟</span>
          <span style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>{score}</span>
        </div>
      </div>

      {/* Comment Display */}
      {comment && (
        <div style={{
          background: 'rgba(255, 215, 0, 0.8)',
          borderRadius: '0 0 0 10px',
          padding: '10px 20px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
          animation: 'fadeIn 0.5s ease-in-out',
          color: '#000',
          fontWeight: 'bold',
          fontSize: '18px',
          maxWidth: '50%',
          textAlign: 'right'
        }}>
          {comment}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const ReactiontimeGame = () => {
  const navigate = useNavigate();
  const gameRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [stats, setStats] = useState({
    score: 0,
    missedStars: 0,
    correctStreak: 0,
    prematureClicks: 0,
    averageReactionTime: 0
  });
  const [comment, setComment] = useState('');
  const [inGameComment, setInGameComment] = useState(''); // New state for in-game comments
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const location = useLocation();
  const [childId, setChildId] = useState(location.state?.childId || null);
  const [gameId, setGameId] = useState(null); // Add gameId state
  const [gameStarted, setGameStarted] = useState(false); // Add state for game started
  
  // Refs for tracking game metrics
  const missedStarsRef = useRef([]);
  const prematureClicksRef = useRef(0);
  const prematureClickTimes = useRef([]);
  const validClickTimes = useRef([]);
  const reactionTimes = useRef([]);
  const starResponseLogs = useRef([]);
  const scoreRef = useRef(0);
  const correctStreakRef = useRef(0);
  const gameStartTimeRef = useRef(0);
  
  // Game variables
  const speedDownRef = useRef(100);
  const speedDownIncrement = 10;
  const starAppearTimeRef = useRef(0);
  
  // Game objects refs
  const starRef = useRef(null);
  const specialStarRef = useRef(null);
  const meteorRef = useRef(null);
  const fireballRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const clickSoundRef = useRef(null);
  
  // Game state
  const specialStarActiveRef = useRef(false);
  const gameTimerRef = useRef(null);
  const gameTimerActiveRef = useRef(false);
  const starVisibleRef = useRef(false);

  const commentTimeoutRef = useRef(null);

  useEffect(() => {
    const id = location.state?.childId;
    if (!id) {
      alert("Child ID is missing. Please log in again.");
    } else {
      setChildId(id);
    }
  }, [location.state]);

  useEffect(() => {
    if (!childId || !gameStarted ) return; // Wait until childId is available

    gameStartTimeRef.current = Date.now();

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'phaser-container',
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false },
      },
      scene: { preload, create, update },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (commentTimeoutRef.current) {
        clearTimeout(commentTimeoutRef.current);
      }
    };
  }, [childId,gameStarted]);

  function preload() {
    this.load.image('sky', '/assets/it21288326/sky.png');
    this.load.image('star', '/assets/it21288326/star.png');
    this.load.image('pointer', '/assets/it21288326/pointer.png');
    this.load.audio('clickSound', '/assets/it21288326/clickSound.mp3');
    this.load.audio('backgroundMusic', '/assets/it21288326/backgroundMusic.mp3');
    this.load.spritesheet('meteor', '/assets/it21288326/meteor.gif', {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet('fireball', '/assets/it21288326/fireball.gif', {
      frameWidth: 1024,
      frameHeight: 1024,
    });
  }

  function create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);

    const backgroundZone = this.add.zone(0, 0, window.innerWidth, window.innerHeight)
    .setOrigin(0, 0)
    .setInteractive();
  
  backgroundZone.on('pointerdown', (pointer) => {
    const clickTimestamp = Date.now();
    prematureClickTimes.current.push(clickTimestamp);
    prematureClicksRef.current++;

    displayInGameComment("Careful! Wait for the star to appear!");
  });

    // Create star
    starRef.current = this.physics.add.image(
      Phaser.Math.Between(50, window.innerWidth - 50), 
      0, 
      'star'
    )
      .setScale(0.05)
      .setVelocityY(speedDownRef.current)
      .setInteractive();

    this.input.on('gameobjectdown', handleStarClick, this);
    this.input.setDefaultCursor('url(/assets/it21288326/pointer.png), pointer');

    // Add sounds
    backgroundMusicRef.current = this.sound.add('backgroundMusic', { loop: true });
    backgroundMusicRef.current.play();
    clickSoundRef.current = this.sound.add('clickSound');

    // Create special star
    specialStarRef.current = this.physics.add.image(-100, -100, 'star');
    specialStarRef.current.setScale(0.1);
    specialStarRef.current.setVelocityY(0);
    specialStarRef.current.setInteractive();
    specialStarRef.current.setTint(0xffd700);
    specialStarRef.current.setVisible(false);
    this.input.on('gameobjectdown', handleSpecialStarClick, this);

    starAppearTimeRef.current = Date.now();

    // Schedule special star appearances
    this.time.addEvent({
      delay: Phaser.Math.Between(10000, 20000),
      callback: showSpecialStar,
      callbackScope: this,
      loop: true,
    });

    // Create meteor
    meteorRef.current = this.add.sprite(
      Phaser.Math.Between(50, window.innerWidth - 50), 
      -100, 
      'meteor'
    );
    meteorRef.current.setVisible(false);
    meteorRef.current.setScale(0.5);

    // Create fireball
    fireballRef.current = this.physics.add.sprite(
      Phaser.Math.Between(50, window.innerWidth - 50), 
      -100, 
      'fireball'
    );
    fireballRef.current.setVisible(false);
    fireballRef.current.setScale(2);

    // Schedule meteor and fireball appearances
    this.time.addEvent({
      delay: Phaser.Math.Between(5000, 10000),
      callback: showMeteor,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: Phaser.Math.Between(7000, 12000),
      callback: showFireball,
      callbackScope: this,
      loop: true,
    });

    // this.input.on('pointerdown', handlePrematureClick, this);

    // Start game timer
    gameTimerActiveRef.current = true;
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current);
        }if (prev === 60) {
            displayInGameComment("One minute left!");
          } else if (prev === 30) {
            displayInGameComment("30 seconds remaining!");
          } else if (prev === 10) {
            displayInGameComment("Hurry! 10 seconds left!");
          }
          
          if (prev <= 1) {
            clearInterval(gameTimerRef.current);
            endGame();
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    this.input.on('pointerdown', (pointer) => {
      const clickTimestamp = Date.now();
      
      // Check if this is a star click
      if (starRef.current && starRef.current.getBounds().contains(pointer.x, pointer.y)) {
        // Valid click on star - handled by handleStarClick
        return;
      }
      
      // If no star is visible, this is actually a premature click
      if (!starVisibleRef.current) {
        prematureClickTimes.current.push(clickTimestamp);
        prematureClicksRef.current++;
      } else {
        // If star is visible but click missed it, this could be tracked as a "miss" instead
        // missedClickTimes.current.push(clickTimestamp); // If you want to track missed clicks
      }
    });
  }

  function update() {
    if (!gameTimerActiveRef.current) return;

    if (starRef.current && starRef.current.y > window.innerHeight) {
      missedStarsRef.current.push(Date.now());
      starVisibleRef.current = false; // Star is no longer visible
      if (missedStarsRef.current.length % 3 === 0) {
        displayInGameComment("You've missed several stars. Try to focus!");
      } else {
        displayInGameComment("Missed one! Keep your eyes on the screen!");
      }
      resetStar();
    }

    if (specialStarActiveRef.current && specialStarRef.current && specialStarRef.current.y > window.innerHeight) {
      specialStarRef.current.setVisible(false);
      specialStarActiveRef.current = false;
    }
  }

  function handleStarClick(pointer, clickedStar) {
    if (!clickedStar || clickedStar !== starRef.current) return;
    
    const clickTimestamp = Date.now();
    const reactionTime = clickTimestamp - starAppearTimeRef.current;
    
    reactionTimes.current.push(reactionTime);
    validClickTimes.current.push(clickTimestamp); // Store valid click timestamp
    starResponseLogs.current.push({ 
      event: 'clicked', 
      reactionTime, 
      timestamp: clickTimestamp
    });
    
    correctStreakRef.current++;

    if (correctStreakRef.current === 5) {
      displayInGameComment("Nice! 5 in a row!");
    } else if (correctStreakRef.current === 10) {
      displayInGameComment("Great job! 10 streak!");
    } else if (correctStreakRef.current === 15) {
      displayInGameComment("Amazing! 15 streak!");
    } else if (correctStreakRef.current % 20 === 0) {
      displayInGameComment(`Incredible! ${correctStreakRef.current} streak!`);
    }

        // Add reaction time comments
        if (reactionTime < 300) {
          displayInGameComment("Lightning fast!");
        } else if (reactionTime < 500) {
          displayInGameComment("Great reflexes!");
        }

    if (correctStreakRef.current % 5 === 0) {
      speedDownRef.current += speedDownIncrement;
    }
    
    scoreRef.current += 1;
    setScore(scoreRef.current);
    
    resetStar();
  }

  function handleSpecialStarClick(pointer, clickedStar) {
    if (!gameTimerActiveRef.current || !clickedStar || clickedStar !== specialStarRef.current) return;

    const clickTimestamp = Date.now();
    const specialStarReactionTime = clickTimestamp - starAppearTimeRef.current;
    
    reactionTimes.current.push(specialStarReactionTime);
    validClickTimes.current.push(clickTimestamp); // Store valid click timestamp

    scoreRef.current += 5; // Bonus points for clicking the special star
    setScore(scoreRef.current);

    // Add special star comment
    displayInGameComment("Bonus star! +5 points!");

    clickSoundRef.current.play();
    specialStarRef.current.setVisible(false);
    specialStarActiveRef.current = false;
  }

   // Function to display in-game comments with automatic timeout
   const displayInGameComment = (message) => {
    setInGameComment(message);
    
    // Clear any existing timeout
    if (commentTimeoutRef.current) {
      clearTimeout(commentTimeoutRef.current);
    }

    commentTimeoutRef.current = setTimeout(() => {
      setInGameComment('');
    }, 2000);
  };

  function resetStar() {
    if (!starRef.current) return;
    
    starRef.current.y = 0;
    starRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
    starRef.current.setVelocityY(speedDownRef.current);
    starAppearTimeRef.current = Date.now();
    starVisibleRef.current = true; // Star is now visible
  }

  function showSpecialStar() {
    if (!specialStarRef.current) return;
    
    specialStarRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
    specialStarRef.current.y = 0;
    specialStarRef.current.setVelocityY(speedDownRef.current / 2);
    specialStarRef.current.setVisible(true);
    specialStarActiveRef.current = true;
  }

  function showMeteor() {
    if (!meteorRef.current) return;
    
    meteorRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
    meteorRef.current.y = -100;
    meteorRef.current.setVisible(true);
  }

  function showFireball() {
    if (!fireballRef.current) return;
    
    fireballRef.current.x = Phaser.Math.Between(50, window.innerWidth - 50);
    fireballRef.current.y = -100;
    fireballRef.current.setVisible(true);
    fireballRef.current.setAngle(-60);

    const angleInRadians = Phaser.Math.DegToRad(120);
    const speedMagnitude = 200;
    const velocityX = Math.cos(angleInRadians) * speedMagnitude;
    const velocityY = Math.sin(angleInRadians) * speedMagnitude;
    fireballRef.current.setVelocity(velocityX, velocityY);
  }

  function handlePrematureClick(pointer) {
    if (!starRef.current || starRef.current.getBounds().contains(pointer.x, pointer.y)) return;
    
    const clickTimestamp = Date.now();
    prematureClickTimes.current.push(clickTimestamp); // Store timestamp of premature click
    prematureClicksRef.current++; // Increment the counter
  }

  const calculateReactionTimeVariability = (reactionTimes, avgTime) => {
    if (!reactionTimes || reactionTimes.length <= 1) return 0;
  
    return Math.sqrt(
      reactionTimes.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / reactionTimes.length
    );
  };

  const calculateMissedStarStreaks = (missedStars) => {
    if (!Array.isArray(missedStars) || missedStars.length === 0) return [0];
    
    // For a basic streak calculation, we look at time gaps between missed stars
    // If stars are missed in quick succession (less than 2 seconds apart), count as a streak
    const streaks = [];
    let currentStreak = 1;
    
    for (let i = 1; i < missedStars.length; i++) {
      const timeDiff = missedStars[i] - missedStars[i-1];
      
      if (timeDiff < 2000) { // Less than 2 seconds apart
        currentStreak++;
      } else {
        if (currentStreak > 1) {
          streaks.push(currentStreak);
        }
        currentStreak = 1;
      }
    }
    
    // Add the last streak if it exists
    if (currentStreak > 1) {
      streaks.push(currentStreak);
    }
    
    return streaks.length > 0 ? streaks : [1]; // Return at least one streak of 1 if no streaks found
  };

  const endGame = async () => {
    setGameOver(true);
    gameTimerActiveRef.current = false;
    
    if (starRef.current) {
      starRef.current.setVelocityY(0);
    }
    
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.stop();
    }
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }

    const averageReactionTime = reactionTimes.current.length
      ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length
      : 0;
  
    const reactionTimeVariability = calculateReactionTimeVariability(
      reactionTimes.current, 
      averageReactionTime
    );
    
    const missedStarStreaks = calculateMissedStarStreaks(missedStarsRef.current);
    
    // Format clickTimestamps as per required structure
    const formattedClickTimestamps = [
      // Valid clicks
      ...validClickTimes.current.map(timestamp => ({
        timestamp,
        type: "valid"
      })),
      // Premature clicks  
      ...prematureClickTimes.current.map(timestamp => ({
        timestamp,
        type: "premature"
      }))
    ];
    
    // Sort by timestamp
    formattedClickTimestamps.sort((a, b) => a.timestamp - b.timestamp);
    
    const gameData = {
      childId,
      reactionTimes: reactionTimes.current,
      averageReactionTime,
      correctStreak: correctStreakRef.current,
      prematureClicks: prematureClicksRef.current,
      missedStars: missedStarsRef.current.length,
      score: scoreRef.current,
      clickTimestamps: formattedClickTimestamps,
      missedStarStreaks: missedStarStreaks,
      reactionTimeVariability, // Include this calculated value
      sessionDuration: (Date.now() - gameStartTimeRef.current) / 1000 // 
    };
    console.log('Payload being sent to backend:', JSON.stringify(gameData, null, 2));
  
    // Update local state for display
    setStats({
      score: scoreRef.current,
      missedStars: missedStarsRef.current.length,
      correctStreak: correctStreakRef.current,
      prematureClicks: prematureClicksRef.current,
      averageReactionTime
    });

    const performanceComment = generateComment({
      averageReactionTime,
      missedStars: missedStarsRef.current.length,
      prematureClicks: prematureClicksRef.current,
      correctStreak: correctStreakRef.current
    });
    
    setComment(performanceComment);
  
    try {
      // Send data to the new endpoint
      const response = await axios.post('http://localhost:8800/api/metrics/create', gameData);
      console.log('Game metrics saved successfully');
    
      // Store the returned gameId
      if (response.data && response.data._id) {
        setGameId(response.data._id);
      }
          
    } catch (error) {
      console.error('Error saving game metrics:', error);
    }
  };

  const generateComment = ({ averageReactionTime, missedStars, prematureClicks, correctStreak }) => {
    if (correctStreak >= 10) return 'Excellent attention and reaction skills!';
    if (missedStars > 5) return 'Try to focus more next time!';
    if (prematureClicks > 5) return 'You seem impulsive. Try to pace yourself.';
    return 'Good effort! Keep practicing to improve!';
  };
  const startGame = () => {
    setGameStarted(true);
    displayInGameComment("Go! Catch the stars!");
  };
  const restartGame = () => {
    setGameOver(false);
    reactionTimes.current = [];
    prematureClickTimes.current = [];
    validClickTimes.current = [];
    prematureClicksRef.current = 0;
    missedStarsRef.current = [];
    correctStreakRef.current = 0;
    scoreRef.current = 0;
    speedDownRef.current = 100;
    gameStartTimeRef.current = Date.now();
    
    setScore(0);
    setTimeLeft(180);
    setStats({
      score: 0,
      missedStars: 0,
      correctStreak: 0,
      prematureClicks: 0,
      averageReactionTime: 0
    });
    setComment('');
  
    if (gameRef.current && gameRef.current.scene.scenes[0]) {
      gameRef.current.scene.scenes[0].scene.restart();
    }
  };

  const handleViewAnalytics = () => {
    if (childId && gameId) {
      navigate(`/analytics/${childId}/${gameId}`);
    } else {
      console.error('Missing childId or gameId for navigation');
      // Fallback navigation if specific IDs aren't available
      if (childId) {
        navigate(`/analytics/${childId}`);
      } else {
        navigate('/analytics');
      }
    }
  };

  return (
    <div id="phaser-container">
      {!gameStarted && <GameStartScreen onStartGame={startGame} />}
      {gameStarted && !gameOver && <GameHUD timeLeft={timeLeft} score={score} comment={inGameComment} />}
      {gameOver && <GameOverScreen stats={stats} comment={comment} onRestart={restartGame} onViewAnalytics={handleViewAnalytics} />}
    </div>
  );
};

export default ReactiontimeGame;