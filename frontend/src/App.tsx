// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Dashboard from "./Dashboard";
import CoursePage from "./components/CoursePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route 
          path="/courses" 
          element={
            <div className="p-20 text-center text-3xl min-h-screen flex items-center justify-center bg-gray-50">
              Courses Page Coming Soon...
            </div>
          } 
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;