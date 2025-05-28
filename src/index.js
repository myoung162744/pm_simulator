import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import StudyHal from './StudyHal';
import ProjectOverview from './components/ProjectOverview';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<ProjectOverview />} />
        <Route path="/study" element={<StudyHal />} />
      </Routes>
    </Router>
  </React.StrictMode>
); 