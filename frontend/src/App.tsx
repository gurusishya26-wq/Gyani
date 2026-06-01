// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home.js';
import Dashboard from './Dashboard.js';
import CoursePage from './components/CoursePage.js';
import BecomeInstructor from './BecomeInstructor.js';
import Courses from './components/Courses.js';
import TestPage from './TestPage.js';
import AdminPanel from "./AdminPanel.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/become-instructor" element={<BecomeInstructor />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="*" element={<Home />} />
        <Route
          path="/admin"
          element={<AdminPanel />}
        />
      </Routes>
    </Router>
  );
}

export default App;