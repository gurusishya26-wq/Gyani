// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home.js';
import Dashboard from './Dashboard.js';
import BecomeInstructor from './BecomeInstructor.js';
import Courses from './components/Courses.js';
import CourseDetail from './components/CourseDetail.js';
import TestPage from './components/TestPage.js';
import AdminPanel from "./AdminPanel.js";
import CourseBuilder from './CourseBuilder.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/become-instructor" element={<BecomeInstructor />} />
        <Route path="/courses" element={<Courses />} />

        <Route path="/course/:id" element={<CourseDetail />} />

        <Route path="/test" element={<TestPage />} /> 
        <Route path="*" element={<Home />} />
        <Route
          path="/admin"
          element={<AdminPanel />}
        />
        <Route path="/admin/course-builder" element={<CourseBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;