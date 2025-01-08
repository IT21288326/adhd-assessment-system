// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import ReactionTimeGame from './component/it21288326/ReactiontimeGame';
// import QuestionnaireForm from './component/it21288326/QuestionnaireForm';
// import SignIn from './component/it21288326/SignIn';
// import SignUp from './component/it21288326/SignUp';
// import Profile from './component/it21288326/Profile';
// import Home from './component/Home';

// function App() {
//   return (
//     <Router>
      
//       <div className="App">

//         {/* Navigation Links
//         <nav>
//           <ul>
//             <li><Link to="/reaction-time-game">Reaction Time Game</Link></li>
//             <li><Link to="/questionnaire-form">Questionnaire Form</Link></li>
//           </ul>
//         </nav> */}

//         {/* Route Definitions */}
//         <Routes>

//           <Route path="/" element={<SignIn/>} />
//           <Route path="/sign-up" element={<SignUp/>} />


//           <Route path="/profile" element={<Profile/>} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/reaction-time-game" element={<ReactionTimeGame />} />
//           <Route path="/questionnaire-form" element={<QuestionnaireForm />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactionTimeGame from './component/it21288326/ReactiontimeGame';
import QuestionnaireForm from './component/it21288326/QuestionnaireForm';
import SignIn from './component/it21288326/SignIn';
import SignUp from './component/it21288326/SignUp';
import Profile from './component/it21288326/Profile';
import Home from './component/Home';
import ProtectedRoute from './component/it21288326/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reaction-time-game"
            element={
              <ProtectedRoute>
                <ReactionTimeGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questionnaire-form"
            element={
              <ProtectedRoute>
                <QuestionnaireForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

