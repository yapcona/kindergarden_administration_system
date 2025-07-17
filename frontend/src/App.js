// frontend/src/App.js
import React, { useState } from 'react';
import './App.css';
import MeowUI from './meowUI';
import Login from './Login';
import Manage from "./manage.js";
import Planung from './planung';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {!isLoggedIn ? (
            <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          ) : (
            <>
              <Route path="/" element={<MeowUI />} />
              <Route path="/manage/:standort" element={<Manage />} />
              <Route path="/planung/:standort" element={<Planung />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;