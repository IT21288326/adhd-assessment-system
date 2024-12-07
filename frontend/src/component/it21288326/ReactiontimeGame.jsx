
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import to access location state

const GameOverScreen = ({ stats, comment, onRestart }) => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  }}>
    <h1>Game Over</h1>
    <p><strong>Score:</strong> {stats.score}</p>
    <p><strong>Missed Stars:</strong> {stats.missedStars}</p>
    {/* <p><strong>Average Reaction Time:</strong> {stats.averageReactionTime.toFixed(2)} ms</p>
    <p><strong>Premature Clicks:</strong> {stats.prematureClicks}</p> */}
    <p><strong>Correct Streak:</strong> {stats.correctStreak}</p>
    <p><strong>Performance Comment:</strong> {comment}</p>
    <button style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }} onClick={onRestart}>
      Restart Game
    </button>
  </div>
);

const ReactiontimeGame = () => {
  const gameRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [stats, setStats] = useState({});
  const [comment, setComment] = useState('');
  const [score, setScore] = useState(1);
  const [missedStars, setMissedStars] = useState(2);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const location = useLocation(); // Use the hook to access location
  const [childId, setChildId] = useState(location.state?.childId || null); // Initialize childId as null



  const reactionTimes = useRef([]);
  const scoreRef = useRef(0);
  const missedStarsRef = useRef(0);

  let prematureClicks = 0;
  let correctStreak = 0;
  let speedDown = 100;
  const speedDownIncrement = 10;
  let starAppearTime;

  useEffect(() => {
    const id = location.state?.childId;
    if (!id) {
      alert("Child ID is missing. Please log in again.");
    } else {
      setChildId(id); // Set childId from location state
    }
  }, [location.state]);

  useEffect(() => {
    if (!childId) return; // Wait until childId is available

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
    };
  }, [childId]);

  let star, specialStar, meteor, fireball;
  let specialStarActive = false;
  let clickSound, backgroundMusic;
  let gameTimer;
  let gameTimerActive = false;

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

    star = this.physics.add.image(Phaser.Math.Between(50, window.innerWidth - 50), 0, 'star')
      .setScale(0.05)
      .setVelocityY(speedDown)
      .setInteractive();

    this.input.on('gameobjectdown', handleStarClick, this);

    this.input.setDefaultCursor('url(/assets/it21288326/pointer.png), pointer');

    backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
    backgroundMusic.play();

    specialStar = this.physics.add.image(-100, -100, 'star');
    specialStar.setScale(0.1);
    specialStar.setVelocityY(0);
    specialStar.setInteractive();
    specialStar.setTint(0xffd700);
    specialStar.setVisible(false);
    this.input.on('gameobjectdown', handleSpecialStarClick, this);

    starAppearTime = Date.now();
    clickSound = this.sound.add('clickSound');

    this.time.addEvent({
      delay: Phaser.Math.Between(10000, 20000),
      callback: showSpecialStar,
      callbackScope: this,
      loop: true,
    });

    meteor = this.add.sprite(Phaser.Math.Between(50, window.innerWidth - 50), -100, 'meteor');
    meteor.setVisible(false);
    meteor.setScale(0.5);

    fireball = this.physics.add.sprite(Phaser.Math.Between(50, window.innerWidth - 50), -100, 'fireball');
    fireball.setVisible(false);
    fireball.setScale(2);

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

    this.input.on('pointerdown', handlePrematureClick, this);

    gameTimerActive = true;
    gameTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function update() {
    if (!gameTimerActive) return;

    if (star.y > window.innerHeight) {
      missedStarsRef.current += 1;
      setMissedStars(missedStarsRef.current);
      resetStar();
    }

    if (specialStarActive && specialStar.y > window.innerHeight) {
      specialStar.setVisible(false);
      specialStarActive = false;
    }
  }

  function handleStarClick(pointer, clickedStar) {
    if (!gameTimerActive || clickedStar !== star) return;

    const reactionTime = Date.now() - starAppearTime;
    reactionTimes.current.push(reactionTime);
    correctStreak++;

    if (correctStreak % 5 === 0) speedDown += speedDownIncrement;

    scoreRef.current += 1;
    setScore(scoreRef.current);

    resetStar();
  }

  function handleSpecialStarClick(pointer, clickedStar) {
    if (!gameTimerActive || clickedStar !== specialStar) return;

    const specialStarReactionTime = Date.now() - starAppearTime;
    reactionTimes.current.push(specialStarReactionTime);

    scoreRef.current += 5; // Bonus points for clicking the special star
    setScore(scoreRef.current);

    clickSound.play();
    specialStar.setVisible(false);
    specialStarActive = false;
  }

  function resetStar() {
    star.y = 0;
    star.x = Phaser.Math.Between(50, window.innerWidth - 50);
    star.setVelocityY(speedDown);
    starAppearTime = Date.now();
  }

  function showSpecialStar() {
    specialStar.x = Phaser.Math.Between(50, window.innerWidth - 50);
    specialStar.y = 0;
    specialStar.setVelocityY(speedDown / 2);
    specialStar.setVisible(true);
    specialStarActive = true;
  }

  function showMeteor() {
    meteor.x = Phaser.Math.Between(50, window.innerWidth - 50);
    meteor.y = -100;
    meteor.setVisible(true);
  }

  function showFireball() {
    fireball.x = Phaser.Math.Between(50, window.innerWidth - 50);
    fireball.y = -100;
    fireball.setVisible(true);
    fireball.setAngle(-60);

    const angleInRadians = Phaser.Math.DegToRad(120);
    const speedMagnitude = 200;
    const velocityX = Math.cos(angleInRadians) * speedMagnitude;
    const velocityY = Math.sin(angleInRadians) * speedMagnitude;
    fireball.setVelocity(velocityX, velocityY);
  }

  function handlePrematureClick(pointer) {
    if (!gameTimerActive || star.getBounds().contains(pointer.x, pointer.y)) return;
    prematureClicks++;
  }

  async function endGame() {
    setGameOver(true);
    gameTimerActive = false;
    star.setVelocityY(0);
    backgroundMusic.stop();
    clearInterval(gameTimer);

    const averageReactionTime = reactionTimes.current.length
      ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length
      : 0;

    const gameData = {
      childId,
      reactionTimes: reactionTimes.current,
      averageReactionTime,
      correctStreak,
      prematureClicks,
      missedStars: missedStarsRef.current,
      score: scoreRef.current,
    };

    setStats(gameData);

    const performanceComment = generateComment(gameData);
    setComment(performanceComment);

    try {
      await axios.post('http://localhost:8800/api/metrics/create', gameData);

      const predictionResponse = await axios.post('http://localhost:5001/predict', {
        averageReactionTime: gameData.averageReactionTime,
        correctStreak: gameData.correctStreak,
        prematureClicks: gameData.prematureClicks,
        missedStars: gameData.missedStars,
        score: gameData.score,
      });

      alert(`Predicted ADHD Type: ${predictionResponse.data.ADHD_Type}`);
    } catch (error) {
      console.error('Error sending data to backend or predicting ADHD type:', error);
    }
  }

  const generateComment = ({ averageReactionTime, missedStars, prematureClicks, correctStreak }) => {
    if (correctStreak >= 10) return 'Excellent attention and reaction skills!';
    if (missedStars > 5) return 'Try to focus more next time!';
    if (prematureClicks > 5) return 'You seem impulsive. Try to pace yourself.';
    return 'Good effort! Keep practicing to improve!';
  };

  const restartGame = () => {
    setGameOver(false);
    reactionTimes.current = [];
    prematureClicks = 0;
    correctStreak = 0;
    missedStarsRef.current = 0;
    scoreRef.current = 0;
    setScore(1);
    setMissedStars(2);
    setTimeLeft(180);
    gameRef.current.scene.restart();
  };

  return (
    <div id="phaser-container">
      {gameOver && <GameOverScreen stats={stats} comment={comment} onRestart={restartGame} />}
    </div>
  );
};

export default ReactiontimeGame;

