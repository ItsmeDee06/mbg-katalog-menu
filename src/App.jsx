import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicMenu from './pages/PublicMenu';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicMenu />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;