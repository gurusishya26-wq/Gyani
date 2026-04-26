// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Dashboard from "./Dashboard";
import CoursePage from "./components/CoursePage";
import BecomeInstructor from './BecomeInstructor'; 
import Courses from './components/Courses';
import TestPage from './TestPage';
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
      </Routes>
    </Router>
  );
}

export default App;