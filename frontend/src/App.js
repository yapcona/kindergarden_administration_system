// frontend/src/App.js
import React, { useState } from "react";
import "./App.css";
import MeowUI from "./meowUI";
import Login from "./Login";
import Manage from "./manage.js";
import Planung from "./planung";
import Zahlen from "./zahlen";
import Gruppen from "./gruppen.js";
import Mitarbeiter from "./mitarbeiter.js";
import Eltern from "./eltern.js";
import Kinder from "./kinder.js";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {!isLoggedIn ? (
            <Route
              path="/"
              element={<Login onLogin={() => setIsLoggedIn(true)} />}
            />
          ) : (
            <>
              <Route path="/" element={<MeowUI />} />
              <Route path="/manage/:standort" element={<Manage />} />
              <Route path="/planung/:standort" element={<Planung />} />
              <Route path="/zahlen/:standort" element={<Zahlen />} />
              <Route path="/gruppen/:standort" element={<Gruppen />} />
              <Route path="/mitarbeiter/:standort" element={<Mitarbeiter />} />
              <Route path="/eltern/:standort" element={<Eltern />} />
              <Route path="/kinder/:standort" element={<Kinder />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
