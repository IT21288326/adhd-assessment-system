// src/PhaserGame.js
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const it21288326ReactiontimeGame = () => {
  const gameRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [missedStars, setMissedStars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 5 minutes in seconds
  let speedDown = 100;
  let starAppearTime;
  let reactionTimes = [];
  let prematureClicks = 0;
  let correctStreak = 0;
  let speedDownIncrement = 10;

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'phaser-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    gameRef.current = new Phaser.Game(config);
    window.addEventListener('resize', resizeGame);
    function resizeGame() {
      gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
      window.removeEventListener('resize', resizeGame);
    };
  }, []);

  let star;
  let clickSound;
  let meteor;
  let fireball;
  let backgroundMusic;
  let gameTimer;
  let gameTimerActive = false;

  function preload() {
    this.load.image('sky', '/assets/it21288326sky.png');
    this.load.image('star', '/assets/it21288326star.png');
    this.load.image('pointer', '/assets/it21288326pointer.png');
    this.load.audio('clickSound', '/assets/it21288326clickSound.mp3');
    this.load.audio('backgroundMusic', '/assets/it21288326backgroundMusic.mp3');
    this.load.spritesheet('meteor', '/assets/it21288326meteor.gif', {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet('fireball', '/assets/it21288326fireball.gif', {
      frameWidth: 1024,
      frameHeight: 1024,
    });
  }

  function create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
    star = this.physics.add.image(Phaser.Math.Between(50, window.innerWidth - 50), 0, 'star');
    star.setScale(0.05);
    star.setVelocityY(speedDown);
    star.setInteractive();
    this.input.on('gameobjectdown', handleStarClick, this);
    this.input.setDefaultCursor('url(/assets/it21288326pointer.png), pointer');

    clickSound = this.sound.add('clickSound');
    backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
    backgroundMusic.play();

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
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(gameTimer);
          endGame();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
  }

  function update() {
    if (!gameTimerActive) return;
    if (star.y > window.innerHeight) {
      resetStar();
      setMissedStars((prevMissed) => prevMissed + 1);
    }

    if (meteor.visible) {
      meteor.y += 5;
      if (meteor.y > window.innerHeight) {
        meteor.setVisible(false);
      }
    }

    if (fireball.visible) {
      if (fireball.y > window.innerHeight || fireball.x < 0) {
        fireball.setVisible(false);
      }
    }
  }

  function handleStarClick(pointer, clickedStar) {
    if (!gameTimerActive || clickedStar !== star) return;
    const reactionTime = Date.now() - starAppearTime;
    reactionTimes.push(reactionTime);
    correctStreak++;
    if (correctStreak % 5 === 0) {
      speedDown += speedDownIncrement;
    }
    
    clickSound.play();
    star.setTint(0x00ff00);
    setScore((prevScore) => prevScore + 1);
    resetStar();
  }

  function resetStar() {
    star.clearTint();
    star.y = 0;
    star.x = Phaser.Math.Between(50, window.innerWidth - 50);
    star.setVelocityY(speedDown);
    starAppearTime = Date.now();
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

  function endGame() {
    setGameOver(true);
    gameTimerActive = false;
    star.setVelocityY(0);
    backgroundMusic.stop();
    clearInterval(gameTimer);

    const averageReactionTime = reactionTimes.length > 0
      ? reactionTimes.reduce((acc, cur) => acc + cur, 0) / reactionTimes.length
      : 0;

    alert(`Game Over! 
      Average Reaction Time: ${averageReactionTime} ms
      Total Correct Streaks: ${correctStreak}
      Premature Clicks: ${prematureClicks}`);
  }

  function restartGame() {
    setScore(0);
    setMissedStars(0);
    setGameOver(false);
    setTimeLeft(300);
    resetStar();
    gameTimerActive = true;
    backgroundMusic.play();
    gameTimer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(gameTimer);
          endGame();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
  }

  return (
    <div id="phaser-container" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: '#333',
          fontSize: '24px',
          fontFamily: 'Comic Sans MS, sans-serif',
        }}
      >
        Score: {score} | Missed Stars: {missedStars} | Time Left: {timeLeft}s
      </div>
      {gameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ff4747',
            fontSize: '32px',
            textAlign: 'center',
            fontFamily: 'Comic Sans MS, sans-serif',
          }}
        >
          Game Over!
          <div>
            <button
              onClick={restartGame}
              style={{
                backgroundColor: '#ff4747',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default it21288326ReactiontimeGame;
