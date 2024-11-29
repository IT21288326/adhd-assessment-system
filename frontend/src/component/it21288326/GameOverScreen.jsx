// const GameOverScreen = ({ score, missedStars, averageReactionTime, prematureClicks, correctStreak, performanceComment, onRestart }) => (
//     <div style={{
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       backgroundColor: 'rgba(0, 0, 0, 0.8)',
//       color: '#fff',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: 10,
//     }}>
//       <h1>Game Over</h1>
//       <p><strong>Score:</strong> {score}</p>
//       <p><strong>Missed Stars:</strong> {missedStars}</p>
//       <p><strong>Average Reaction Time:</strong> {averageReactionTime.toFixed(2)} ms</p>
//       <p><strong>Premature Clicks:</strong> {prematureClicks}</p>
//       <p><strong>Correct Streak:</strong> {correctStreak}</p>
//       <p><strong>Performance Comment:</strong> {performanceComment}</p>
//       <button style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }} onClick={onRestart}>
//         Restart Game
//       </button>
//     </div>
//   );
  