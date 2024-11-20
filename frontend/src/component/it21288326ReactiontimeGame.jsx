// // // import React, { useEffect, useRef, useState } from 'react';
// // // import Phaser from 'phaser';
// // // import axios from 'axios'; // Import axios for HTTP requests

// // // const it21288326ReactiontimeGame = () => {
// // //   const gameRef = useRef(null);
// // //   const [gameOver, setGameOver] = useState(false);
// // //   const [score, setScore] = useState(0);
// // //   const [missedStars, setMissedStars] = useState(0);
// // //   const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
// // //   let speedDown = 100;
// // //   let starAppearTime;
// // //   let reactionTimes = [];
// // //   let prematureClicks = 0;
// // //   let correctStreak = 0;
// // //   let speedDownIncrement = 10;

// // //   useEffect(() => {
// // //     const config = {
// // //       type: Phaser.AUTO,
// // //       width: window.innerWidth,
// // //       height: window.innerHeight,
// // //       parent: 'phaser-container',
// // //       physics: {
// // //         default: 'arcade',
// // //         arcade: {
// // //           gravity: { y: 0 },
// // //           debug: false,
// // //         },
// // //       },
// // //       scene: {
// // //         preload,
// // //         create,
// // //         update,
// // //       },
// // //     };

// // //     gameRef.current = new Phaser.Game(config);
// // //     window.addEventListener('resize', resizeGame);
// // //     function resizeGame() {
// // //       gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
// // //     }

// // //     return () => {
// // //       if (gameRef.current) {
// // //         gameRef.current.destroy(true);
// // //       }
// // //       window.removeEventListener('resize', resizeGame);
// // //     };
// // //   }, []);

// // //   let star;
// // //   let specialStar;
// // //   let specialStarActive = false;
// // //   let clickSound;
// // //   let meteor;
// // //   let fireball;
// // //   let backgroundMusic;
// // //   let gameTimer;
// // //   let gameTimerActive = false;

// // //   function preload() {
// // //     this.load.image('sky', '/assets/it21288326sky.png');
// // //     this.load.image('star', '/assets/it21288326star.png');
// // //     this.load.image('pointer', '/assets/it21288326pointer.png');
// // //     this.load.audio('clickSound', '/assets/it21288326clickSound.mp3');
// // //     this.load.audio('backgroundMusic', '/assets/it21288326backgroundMusic.mp3');
// // //     this.load.spritesheet('meteor', '/assets/it21288326meteor.gif', {
// // //       frameWidth: 128,
// // //       frameHeight: 128,
// // //     });
// // //     this.load.spritesheet('fireball', '/assets/it21288326fireball.gif', {
// // //       frameWidth: 1024,
// // //       frameHeight: 1024,
// // //     });
// // //   }

// // //   function create() {
// // //     this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
// // //     star = this.physics.add.image(Phaser.Math.Between(50, window.innerWidth - 50), 0, 'star');
// // //     star.setScale(0.05);
// // //     star.setVelocityY(speedDown);
// // //     star.setInteractive();
// // //     this.input.on('gameobjectdown', handleStarClick, this);
// // //     this.input.setDefaultCursor('url(/assets/it21288326pointer.png), pointer');
    
// // //     specialStar = this.physics.add.image(-100, -100, 'star');
// // //     specialStar.setScale(0.1);
// // //     specialStar.setVelocityY(0);
// // //     specialStar.setInteractive();
// // //     specialStar.setTint(0xffd700);
// // //     specialStar.setVisible(false);
// // //     this.input.on('gameobjectdown', handleSpecialStarClick, this);

// // //     starAppearTime = Date.now();
// // //     clickSound = this.sound.add('clickSound');
// // //     backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
// // //     backgroundMusic.play();

// // //     this.time.addEvent({
// // //       delay: Phaser.Math.Between(10000, 20000),
// // //       callback: showSpecialStar,
// // //       callbackScope: this,
// // //       loop: true,
// // //     });

// // //     meteor = this.add.sprite(Phaser.Math.Between(50, window.innerWidth - 50), -100, 'meteor');
// // //     meteor.setVisible(false);
// // //     meteor.setScale(0.5);

// // //     fireball = this.physics.add.sprite(Phaser.Math.Between(50, window.innerWidth - 50), -100, 'fireball');
// // //     fireball.setVisible(false);
// // //     fireball.setScale(2);

// // //     this.time.addEvent({
// // //       delay: Phaser.Math.Between(5000, 10000),
// // //       callback: showMeteor,
// // //       callbackScope: this,
// // //       loop: true,
// // //     });

// // //     this.time.addEvent({
// // //       delay: Phaser.Math.Between(7000, 12000),
// // //       callback: showFireball,
// // //       callbackScope: this,
// // //       loop: true,
// // //     });

// // //     this.input.on('pointerdown', handlePrematureClick, this);
// // //     gameTimerActive = true;
// // //     gameTimer = setInterval(() => {
// // //       setTimeLeft((prevTimeLeft) => {
// // //         if (prevTimeLeft <= 1) {
// // //           clearInterval(gameTimer);
// // //           endGame();
// // //           return 0;
// // //         }
// // //         return prevTimeLeft - 1;
// // //       });
// // //     }, 1000);
// // //   }

// // //   function update() {
// // //     if (!gameTimerActive) return;
// // //     if (star.y > window.innerHeight) {
// // //       resetStar();
// // //       setMissedStars((prevMissed) => prevMissed + 1);
// // //     }

// // //     if (specialStarActive && specialStar.y > window.innerHeight) {
// // //       specialStar.setVisible(false);
// // //       specialStarActive = false;
// // //     }

// // //     if (meteor.visible) {
// // //       meteor.y += 5;
// // //       if (meteor.y > window.innerHeight) {
// // //         meteor.setVisible(false);
// // //       }
// // //     }

// // //     if (fireball.visible) {
// // //       if (fireball.y > window.innerHeight || fireball.x < 0) {
// // //         fireball.setVisible(false);
// // //       }
// // //     }
// // //   }

// // //   function handleStarClick(pointer, clickedStar) {
// // //     if (!gameTimerActive || clickedStar !== star) return;
// // //     const reactionTime = Date.now() - starAppearTime;
// // //     reactionTimes.push(reactionTime);
// // //     correctStreak++;
// // //     if (correctStreak % 5 === 0) {
// // //       speedDown += speedDownIncrement;
// // //     }

// // //     clickSound.play();
// // //     star.setTint(0x00ff00);
// // //     setScore((prevScore) => prevScore + 1);
// // //     resetStar();
// // //   }

// // //   function handleSpecialStarClick(pointer, clickedStar) {
// // //     if (!gameTimerActive || clickedStar !== specialStar) return;
// // //     const specialStarReactionTime = Date.now() - starAppearTime;
// // //     reactionTimes.push(specialStarReactionTime);
// // //     setScore((prevScore) => prevScore + 5); // Special star bonus score
// // //     clickSound.play();
// // //     specialStar.setVisible(false);
// // //     specialStarActive = false;
// // //   }

// // //   function resetStar() {
// // //     star.clearTint();
// // //     star.y = 0;
// // //     star.x = Phaser.Math.Between(50, window.innerWidth - 50);
// // //     star.setVelocityY(speedDown);
// // //     starAppearTime = Date.now();
// // //   }

// // //   function showSpecialStar() {
// // //     if (!gameTimerActive) return;
// // //     specialStar.x = Phaser.Math.Between(50, window.innerWidth - 50);
// // //     specialStar.y = 0;
// // //     specialStar.setVelocityY(speedDown / 2);
// // //     specialStar.setVisible(true);
// // //     specialStarActive = true;
// // //   }

// // //   function showMeteor() {
// // //     meteor.x = Phaser.Math.Between(50, window.innerWidth - 50);
// // //     meteor.y = -100;
// // //     meteor.setVisible(true);
// // //   }

// // //   function showFireball() {
// // //     fireball.x = Phaser.Math.Between(50, window.innerWidth - 50);
// // //     fireball.y = -100;
// // //     fireball.setVisible(true);
// // //     fireball.setAngle(-60);
// // //     const angleInRadians = Phaser.Math.DegToRad(120);
// // //     const speedMagnitude = 200;
// // //     const velocityX = Math.cos(angleInRadians) * speedMagnitude;
// // //     const velocityY = Math.sin(angleInRadians) * speedMagnitude;
// // //     fireball.setVelocity(velocityX, velocityY);
// // //   }

// // //   function handlePrematureClick(pointer) {
// // //     if (!gameTimerActive || star.getBounds().contains(pointer.x, pointer.y)) return;
// // //     prematureClicks++;
// // //   }

// // //   async function endGame() {
// // //     setGameOver(true);
// // //     gameTimerActive = false;
// // //     star.setVelocityY(0);
// // //     specialStar.setVelocityY(0);
// // //     backgroundMusic.stop();
// // //     clearInterval(gameTimer);

// // //     const averageReactionTime = reactionTimes.length > 0
// // //       ? reactionTimes.reduce((acc, cur) => acc + cur, 0) / reactionTimes.length
// // //       : 0;

// // //     const gameData = {
// // //       score,
// // //       missedStars,
// // //       averageReactionTime,
// // //       prematureClicks,
// // //       timeLeft,
// // //       dateTime: new Date().toISOString(),
// // //       // Add any other metrics you want to send
// // //     };

// // //     try {
// // //       // Replace with your actual backend URL
// // //       await axios.post('http://localhost:8800/api/metrics/create', gameData);
// // //       console.log('Game data sent to backend:', gameData);
// // //     } catch (error) {
// // //       console.error('Error sending game data to backend:', error);
// // //     }
// // //   }

// // //   return <div id="phaser-container"></div>;
// // // };

// // // export default it21288326ReactiontimeGame;
// // // import React, { useEffect, useRef, useState } from 'react';
// // // import Phaser from 'phaser';
// // // import axios from 'axios';

// // // const it21288326ReactiontimeGame = () => {
// // //   const gameRef = useRef(null);
// // //   const [gameOver, setGameOver] = useState(false);
// // //   const [score, setScore] = useState(0);
// // //   const [missedStars, setMissedStars] = useState(0);
// // //   const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
// // //   let speedDown = 100;
// // //   let starAppearTime;
// // //   let reactionTimes = [];
// // //   let prematureClicks = 0;
// // //   let correctStreak = 0;
// // //   let speedDownIncrement = 10;

// // //   useEffect(() => {
// // //     const config = {
// // //       type: Phaser.AUTO,
// // //       width: window.innerWidth,
// // //       height: window.innerHeight,
// // //       parent: 'phaser-container',
// // //       physics: {
// // //         default: 'arcade',
// // //         arcade: {
// // //           gravity: { y: 0 },
// // //           debug: false,
// // //         },
// // //       },
// // //       scene: {
// // //         preload,
// // //         create,
// // //         update,
// // //       },
// // //     };

// // //     gameRef.current = new Phaser.Game(config);
// // //     window.addEventListener('resize', resizeGame);
// // //     function resizeGame() {
// // //       gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
// // //     }

// // //     return () => {
// // //       if (gameRef.current) {
// // //         gameRef.current.destroy(true);
// // //       }
// // //       window.removeEventListener('resize', resizeGame);
// // //     };
// // //   }, []);

// // //   let star;
// // //   let specialStar;
// // //   let specialStarActive = false;
// // //   let clickSound;
// // //   let meteor;
// // //   let backgroundMusic;
// // //   let fireball;
// // //   let gameTimer;
// // //   let gameTimerActive = false;

// // //   function preload() {
// // //     this.load.image('sky', '/assets/it21288326sky.png');
// // //     this.load.image('star', '/assets/it21288326star.png');
// // //     this.load.image('pointer', '/assets/it21288326pointer.png');
// // //     this.load.audio('clickSound', '/assets/it21288326clickSound.mp3');
// // //     this.load.audio('backgroundMusic', '/assets/it21288326backgroundMusic.mp3');
// // //     this.load.spritesheet('meteor', '/assets/it21288326meteor.gif', {
// // //       frameWidth: 128,
// // //       frameHeight: 128,
// // //     });
// // //     this.load.spritesheet('fireball', '/assets/it21288326fireball.gif', {
// // //       frameWidth: 1024,
// // //       frameHeight: 1024,
// // //     });
// // //   }

// // //   function create() {
// // //     this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);
// // //     star = this.physics.add.image(Phaser.Math.Between(50, window.innerWidth - 50), 0, 'star');
// // //     star.setScale(0.05);
// // //     star.setVelocityY(speedDown);
// // //     star.setInteractive();
// // //     this.input.on('gameobjectdown', handleStarClick, this);
// // //     this.input.setDefaultCursor('url(/assets/it21288326pointer.png), pointer');

// // //     specialStar = this.physics.add.image(-100, -100, 'star');
// // //     specialStar.setScale(0.1);
// // //     specialStar.setVelocityY(0);
// // //     specialStar.setInteractive();
// // //     specialStar.setTint(0xffd700);
// // //     specialStar.setVisible(false);
// // //     this.input.on('gameobjectdown', handleSpecialStarClick, this);

// // //     starAppearTime = Date.now();
// // //     clickSound = this.sound.add('clickSound');
// // //     backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
// // //     backgroundMusic.play();

// // //         this.time.addEvent({
// // //       delay: Phaser.Math.Between(10000, 20000),
// // //       callback: showSpecialStar,
// // //       callbackScope: this,
// // //       loop: true,
// // //     });

// // //     meteor = this.add.sprite(Phaser.Math.Between(50, window.innerWidth - 50), -100, 'meteor');
// // //     meteor.setVisible(false);
// // //     meteor.setScale(0.5);

// // //     fireball = this.physics.add.sprite(Phaser.Math.Between(50, window.innerWidth - 50), -100, 'fireball');
// // //     fireball.setVisible(false);
// // //     fireball.setScale(2);

// // //     this.time.addEvent({
// // //       delay: Phaser.Math.Between(5000, 10000),
// // //       callback: showMeteor,
// // //       callbackScope: this,
// // //       loop: true,
// // //     });

// // //     this.time.addEvent({
// // //       delay: Phaser.Math.Between(7000, 12000),
// // //       callback: showFireball,
// // //       callbackScope: this,
// // //       loop: true,
// // //     });

// // //     this.input.on('pointerdown', handlePrematureClick, this);

    
// // //     gameTimerActive = true;
// // //     gameTimer = setInterval(() => {
// // //       setTimeLeft((prevTimeLeft) => {
// // //         if (prevTimeLeft <= 1) {
// // //           clearInterval(gameTimer);
// // //           endGame();
// // //           return 0;
// // //         }
// // //         return prevTimeLeft - 1;
// // //       });
// // //     }, 1000);
// // //   }

// // //   function update() {
// // //     if (!gameTimerActive) return;

// // //     if (star.y > window.innerHeight) {
// // //       resetStar();
// // //       setMissedStars((prevMissed) => prevMissed + 1);
// // //     }
// // //         if (specialStarActive && specialStar.y > window.innerHeight) {
// // //       specialStar.setVisible(false);
// // //       specialStarActive = false;
// // //     }

// // //     if (meteor.visible) {
// // //       meteor.y += 5;
// // //       if (meteor.y > window.innerHeight) {
// // //         meteor.setVisible(false);
// // //       }
// // //     }

// // //     if (fireball.visible) {
// // //       if (fireball.y > window.innerHeight || fireball.x < 0) {
// // //         fireball.setVisible(false);
// // //       }
// // //     }
// // //   }
  

// // //   function handleStarClick(pointer, clickedStar) {
// // //     if (!gameTimerActive || clickedStar !== star) return;

// // //     const reactionTime = Date.now() - starAppearTime;
// // //     reactionTimes.push(reactionTime);
// // //     correctStreak++;
// // //     if (correctStreak % 5 === 0) {
// // //             speedDown += speedDownIncrement;
// // //           }

// // //     clickSound.play();
// // //     star.setTint(0x00ff00);
// // //     setScore((prevScore) => prevScore + 1);
// // //     resetStar();
// // //   }

// // //     function handleSpecialStarClick(pointer, clickedStar) {
// // //     if (!gameTimerActive || clickedStar !== specialStar) return;
// // //     const specialStarReactionTime = Date.now() - starAppearTime;
// // //     reactionTimes.push(specialStarReactionTime);
// // //     setScore((prevScore) => prevScore + 5); // Special star bonus score
// // //     clickSound.play();
// // //     specialStar.setVisible(false);
// // //     specialStarActive = false;
// // //   }

// // //   function resetStar() {
// // //     star.clearTint();
// // //     star.y = 0;
// // //     star.x = Phaser.Math.Between(50, window.innerWidth - 50);
// // //     star.setVelocityY(speedDown);
// // //     starAppearTime = Date.now();
// // //   }

// // //   function showSpecialStar() {
// // //     if (!gameTimerActive) return;
// // //     specialStar.x = Phaser.Math.Between(50, window.innerWidth - 50);
// // //     specialStar.y = 0;
// // //     specialStar.setVelocityY(speedDown / 2);
// // //     specialStar.setVisible(true);
// // //     specialStarActive = true;
// // //   }

// // //   function showMeteor() {
// // //     meteor.x = Phaser.Math.Between(50, window.innerWidth - 50);
// // //     meteor.y = -100;
// // //     meteor.setVisible(true);
// // //   }

// // //   function showFireball() {
// // //     fireball.x = Phaser.Math.Between(50, window.innerWidth - 50);
// // //     fireball.y = -100;
// // //     fireball.setVisible(true);
// // //     fireball.setAngle(-60);
// // //     const angleInRadians = Phaser.Math.DegToRad(120);
// // //     const speedMagnitude = 200;
// // //     const velocityX = Math.cos(angleInRadians) * speedMagnitude;
// // //     const velocityY = Math.sin(angleInRadians) * speedMagnitude;
// // //     fireball.setVelocity(velocityX, velocityY);
// // //   }

// // //   function handlePrematureClick(pointer) {
// // //     if (!gameTimerActive || star.getBounds().contains(pointer.x, pointer.y)) return;
// // //     prematureClicks++;
// // //   }

// // //   async function endGame() {
// // //     setGameOver(true);
// // //     gameTimerActive = false;
// // //     star.setVelocityY(0);
// // //     backgroundMusic.stop();
// // //     clearInterval(gameTimer);

// // //     const averageReactionTime = reactionTimes.length > 0
// // //       ? reactionTimes.reduce((acc, cur) => acc + cur, 0) / reactionTimes.length
// // //       : 0;

// // //     const gameData = {
// // //       reactionTimes,
// // //       averageReactionTime,
// // //       correctStreak,
// // //       prematureClicks,
// // //       missedStars,
// // //       score,
// // //     };

// // //     try {
// // //       await axios.post('http://localhost:8800/api/metrics/create', gameData);
// // //       console.log('Game data sent to backend:', gameData);
// // //     } catch (error) {
// // //       console.error('Error sending game data to backend:', error);
// // //     }
// // //   }

// // //   return <div id="phaser-container"></div>;
// // // };

// // // export default it21288326ReactiontimeGame;

import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import axios from 'axios';

const it21288326ReactiontimeGame = () => {
  const gameRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(1);
  const [missedStars, setMissedStars] = useState(2);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
  let speedDown = 100;
  let starAppearTime;
  const reactionTimes = useRef([]);
  let prematureClicks = 0;
  let correctStreak = 0;
  const speedDownIncrement = 10;


  //   // Use refs for real-time tracking
  const scoreRef = useRef(0);
  const missedStarsRef = useRef(0);


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
  let specialStar;
  let specialStarActive = false;
  let clickSound;
  let meteor;
  let backgroundMusic;
  let fireball;
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

    specialStar = this.physics.add.image(-100, -100, 'star');
    specialStar.setScale(0.1);
    specialStar.setVelocityY(0);
    specialStar.setInteractive();
    specialStar.setTint(0xffd700);
    specialStar.setVisible(false);
    this.input.on('gameobjectdown', handleSpecialStarClick, this);

    starAppearTime = Date.now();
    clickSound = this.sound.add('clickSound');
    backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
    backgroundMusic.play();

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
      setMissedStars((prevMissed) => {
        // console.log(`Missed stars: ${prevMissed + 1}`);
        // return prevMissed + 1;
      missedStarsRef.current += 1; // Update ref
      setMissedStars(missedStarsRef.current); // Update state for UI
      });
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
    if (correctStreak % 5 === 0) {
      speedDown += speedDownIncrement;
    }

    clickSound.play();
    star.setTint(0x00ff00);
    // setScore((prevScore) => {
    //   const newScore = prevScore + 1;
    //   console.log(`Score after star click: ${newScore}`);
    //   return newScore;
    // });
        scoreRef.current += 1; // Update ref
    setScore(scoreRef.current); // Update state for UI
    resetStar();
  }

  function handleSpecialStarClick(pointer, clickedStar) {
    if (!gameTimerActive || clickedStar !== specialStar) return;

    const specialStarReactionTime = Date.now() - starAppearTime;
    reactionTimes.current.push(specialStarReactionTime);
    setScore((prevScore) => prevScore + 5); // Special star bonus score
    clickSound.play();
    specialStar.setVisible(false);
    specialStarActive = false;
  }

  function resetStar() {
    star.clearTint();
    star.y = 0;
    star.x = Phaser.Math.Between(50, window.innerWidth - 50);
    star.setVelocityY(speedDown);
    starAppearTime = Date.now();
  }

  function showSpecialStar() {
    if (!gameTimerActive) return;

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

      // Ensure we use the latest state values
  const finalScore = score;
  const finalMissedStars = missedStars;

    const averageReactionTime =
      reactionTimes.current.length > 0
        ? reactionTimes.current.reduce((acc, cur) => acc + cur, 0) / reactionTimes.current.length
        : 0;

    const gameData = {
      reactionTimes: reactionTimes.current,
      averageReactionTime,
      correctStreak,
      prematureClicks,
      missedStars: missedStarsRef.current, // Use ref value
      score: scoreRef.current,            // Use ref value
    };

    try {
      await axios.post('http://localhost:8800/api/metrics/create', gameData);
      console.log('Game data sent to backend:', gameData);
    } catch (error) {
      console.error('Error sending game data to backend:', error);
    }
  }

  return <div id="phaser-container"></div>;
};

export default it21288326ReactiontimeGame;

// import React, { useEffect, useRef, useState } from 'react';
// import Phaser from 'phaser';
// import axios from 'axios';

// const it21288326ReactiontimeGame = () => {
//   const gameRef = useRef(null);
//   const [gameOver, setGameOver] = useState(false);
//   const [score, setScore] = useState(0);
//   const [missedStars, setMissedStars] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds

//   // Use refs for real-time tracking
//   const scoreRef = useRef(0);
//   const missedStarsRef = useRef(0);
//   const reactionTimes = useRef([]);
//   const prematureClicksRef = useRef(0);
//   const correctStreakRef = useRef(0);

//   let speedDown = 100;
//   let starAppearTime;
//   const speedDownIncrement = 10;

//   useEffect(() => {
//     const config = {
//       type: Phaser.AUTO,
//       width: window.innerWidth,
//       height: window.innerHeight,
//       parent: 'phaser-container',
//       physics: {
//         default: 'arcade',
//         arcade: {
//           gravity: { y: 0 },
//           debug: false,
//         },
//       },
//       scene: {
//         preload,
//         create,
//         update,
//       },
//     };

//     gameRef.current = new Phaser.Game(config);

//     window.addEventListener('resize', resizeGame);
//     function resizeGame() {
//       gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
//     }

//     return () => {
//       if (gameRef.current) {
//         gameRef.current.destroy(true);
//       }
//       window.removeEventListener('resize', resizeGame);
//     };
//   }, []);

//   let star;
//   let clickSound;
//   let backgroundMusic;
//   let gameTimer;
//   let gameTimerActive = false;

//   function preload() {
//     this.load.image('sky', '/assets/it21288326sky.png');
//     this.load.image('star', '/assets/it21288326star.png');
//     this.load.audio('clickSound', '/assets/it21288326clickSound.mp3');
//     this.load.audio('backgroundMusic', '/assets/it21288326backgroundMusic.mp3');
//   }

//   function create() {
//     this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);

//     star = this.physics.add.image(Phaser.Math.Between(50, window.innerWidth - 50), 0, 'star');
//     star.setScale(0.05);
//     star.setVelocityY(speedDown);
//     star.setInteractive();

//     this.input.on('gameobjectdown', handleStarClick, this);

//     starAppearTime = Date.now();
//     clickSound = this.sound.add('clickSound');
//     backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
//     backgroundMusic.play();

//     gameTimerActive = true;
//     gameTimer = setInterval(() => {
//       setTimeLeft((prevTimeLeft) => {
//         if (prevTimeLeft <= 1) {
//           clearInterval(gameTimer);
//           endGame();
//           return 0;
//         }
//         return prevTimeLeft - 1;
//       });
//     }, 1000);
//   }

//   function update() {
//     if (!gameTimerActive) return;

//     if (star.y > window.innerHeight) {
//       resetStar();
//       missedStarsRef.current += 1; // Update ref
//       setMissedStars(missedStarsRef.current); // Update state for UI
//     }
//   }

//   function handleStarClick(pointer, clickedStar) {
//     if (!gameTimerActive || clickedStar !== star) return;

//     const reactionTime = Date.now() - starAppearTime;
//     reactionTimes.current.push(reactionTime);
//     correctStreakRef.current += 1; // Update ref

//     if (correctStreakRef.current % 5 === 0) {
//       speedDown += speedDownIncrement;
//     }

//     clickSound.play();
//     star.setTint(0x00ff00);
//     scoreRef.current += 1; // Update ref
//     setScore(scoreRef.current); // Update state for UI
//     resetStar();
//   }

//   function resetStar() {
//     star.clearTint();
//     star.y = 0;
//     star.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     star.setVelocityY(speedDown);
//     starAppearTime = Date.now();
//   }

//   async function endGame() {
//     setGameOver(true);
//     gameTimerActive = false;
//     star.setVelocityY(0);
//     backgroundMusic.stop();
//     clearInterval(gameTimer);

//     const averageReactionTime =
//       reactionTimes.current.length > 0
//         ? reactionTimes.current.reduce((acc, cur) => acc + cur, 0) / reactionTimes.current.length
//         : 0;

//     const gameData = {
//       reactionTimes: reactionTimes.current,
//       averageReactionTime,
//       correctStreak: correctStreakRef.current,
//       prematureClicks: prematureClicksRef.current,
//       missedStars: missedStarsRef.current, // Use ref value
//       score: scoreRef.current,            // Use ref value
//     };

//     try {
//       await axios.post('http://localhost:8800/api/metrics/create', gameData);
//       console.log('Game data sent to backend:', gameData);
//     } catch (error) {
//       console.error('Error sending game data to backend:', error);
//     }
//   }

//   return <div id="phaser-container"></div>;
// };

// export default it21288326ReactiontimeGame;








// import React, { useEffect, useRef, useState } from 'react';
// import Phaser from 'phaser';
// import axios from 'axios';

// const it21288326ReactiontimeGame = () => {
//   const gameRef = useRef(null);
//   const [gameOver, setGameOver] = useState(false);
//   const [score, setScore] = useState(0);
//   const [missedStars, setMissedStars] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds

//   // Real-time tracking using refs
//   const scoreRef = useRef(0);
//   const missedStarsRef = useRef(0);
//   const prematureClicksRef = useRef(0);
//   const reactionTimes = useRef([]);
//   const correctStreakRef = useRef(0);

//   let speedDown = 100;
//   let starAppearTime;
//   const speedDownIncrement = 10;

//   useEffect(() => {
//     const config = {
//       type: Phaser.AUTO,
//       width: window.innerWidth,
//       height: window.innerHeight,
//       parent: 'phaser-container',
//       physics: {
//         default: 'arcade',
//         arcade: {
//           gravity: { y: 0 },
//           debug: false,
//         },
//       },
//       scene: {
//         preload,
//         create,
//         update,
//       },
//     };

//     gameRef.current = new Phaser.Game(config);

//     window.addEventListener('resize', resizeGame);
//     function resizeGame() {
//       gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
//     }

//     return () => {
//       if (gameRef.current) {
//         gameRef.current.destroy(true);
//       }
//       window.removeEventListener('resize', resizeGame);
//     };
//   }, []);

//   let star;
//   let clickSound;
//   let backgroundMusic;
//   let gameTimer;
//   let gameTimerActive = false;

//   function preload() {
//     this.load.image('sky', '/assets/it21288326sky.png');
//     this.load.image('star', '/assets/it21288326star.png');
//     this.load.audio('clickSound', '/assets/it21288326clickSound.mp3');
//     this.load.audio('backgroundMusic', '/assets/it21288326backgroundMusic.mp3');
//   }

//   function create() {
//     this.add.image(0, 0, 'sky').setOrigin(0, 0).setDisplaySize(window.innerWidth, window.innerHeight);

//     star = this.physics.add.image(Phaser.Math.Between(50, window.innerWidth - 50), 0, 'star');
//     star.setScale(0.05);
//     star.setVelocityY(speedDown);
//     star.setInteractive();

//     // Handle star clicks
//     this.input.on('gameobjectdown', handleStarClick, this);

//     // Handle premature clicks
//     this.input.on('pointerdown', handlePrematureClick, this);

//     starAppearTime = Date.now();
//     clickSound = this.sound.add('clickSound');
//     backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
//     backgroundMusic.play();

//     // Start game timer
//     gameTimerActive = true;
//     gameTimer = setInterval(() => {
//       setTimeLeft((prevTimeLeft) => {
//         if (prevTimeLeft <= 1) {
//           clearInterval(gameTimer);
//           endGame();
//           return 0;
//         }
//         return prevTimeLeft - 1;
//       });
//     }, 1000);
//   }

//   function update() {
//     if (!gameTimerActive) return;

//     if (star.y > window.innerHeight) {
//       resetStar();
//       missedStarsRef.current += 1; // Increment missed stars ref
//       setMissedStars(missedStarsRef.current); // Update state for UI
//     }
//   }

//   function handleStarClick(pointer, clickedStar) {
//     if (!gameTimerActive || clickedStar !== star) return;

//     const reactionTime = Date.now() - starAppearTime;
//     reactionTimes.current.push(reactionTime); // Store reaction time
//     correctStreakRef.current += 1; // Increment correct streak

//     if (correctStreakRef.current % 5 === 0) {
//       speedDown += speedDownIncrement; // Increase speed every 5 correct hits
//     }

//     clickSound.play();
//     star.setTint(0x00ff00);
//     scoreRef.current += 1; // Increment score ref
//     setScore(scoreRef.current); // Update state for UI
//     resetStar();
//   }

//   function handlePrematureClick(pointer) {
//     // Check if the click is not on the star and register as a premature click
//     if (!gameTimerActive || !pointer.hitTest(star)) {
//       prematureClicksRef.current += 1; // Increment premature clicks ref
//     }
//   }

//   function resetStar() {
//     star.clearTint();
//     star.y = 0;
//     star.x = Phaser.Math.Between(50, window.innerWidth - 50);
//     star.setVelocityY(speedDown);
//     starAppearTime = Date.now(); // Reset star appearance time
//   }

//   async function endGame() {
//     setGameOver(true);
//     gameTimerActive = false;
//     star.setVelocityY(0);
//     backgroundMusic.stop();
//     clearInterval(gameTimer);

//     const averageReactionTime =
//       reactionTimes.current.length > 0
//         ? reactionTimes.current.reduce((acc, cur) => acc + cur, 0) / reactionTimes.current.length
//         : 0;

//     const gameData = {
//       reactionTimes: reactionTimes.current,
//       averageReactionTime,
//       correctStreak: correctStreakRef.current,
//       prematureClicks: prematureClicksRef.current,
//       missedStars: missedStarsRef.current, // Use ref value
//       score: scoreRef.current,            // Use ref value
//     };

//     try {
//       await axios.post('http://localhost:8800/api/metrics/create', gameData);
//       console.log('Game data sent to backend:', gameData);
//     } catch (error) {
//       console.error('Error sending game data to backend:', error);
//     }
//   }

//   return (
//     <div>
//       <div id="phaser-container"></div>
//       <div>
//         <p>Score: {score}</p>
//         <p>Missed Stars: {missedStars}</p>
//         <p>Time Left: {timeLeft} seconds</p>
//       </div>
//     </div>
//   );
// };

// export default it21288326ReactiontimeGame;
