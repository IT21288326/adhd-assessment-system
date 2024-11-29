import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReactionTimeGame from './component/it21288326/ReactiontimeGame';
import QuestionnaireForm from './component/it21288326/QuestionnaireForm';
import SignIn from './component/it21288326/SignIn';
import SignUp from './component/it21288326/SignUp';
import Profile from './component/it21288326/Profile';

function App() {
  return (
    <Router>
      
      <div className="App">

        {/* Navigation Links
        <nav>
          <ul>
            <li><Link to="/reaction-time-game">Reaction Time Game</Link></li>
            <li><Link to="/questionnaire-form">Questionnaire Form</Link></li>
          </ul>
        </nav> */}

        {/* Route Definitions */}
        <Routes>
          <Route path="/reaction-time-game" element={<ReactionTimeGame />} />
          <Route path="/questionnaire-form" element={<QuestionnaireForm />} />
          <Route path="/sign-in" element={<SignIn/>} />
          <Route path="/sign-up" element={<SignUp/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
