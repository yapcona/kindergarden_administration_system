import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="ring">
      <i style={{ "--clr": "#7fef70" }}></i>
      <i style={{ "--clr": "#cdffcb" }}></i>
      <i style={{ "--clr": "#7fef70" }}></i>
      <div className="login">
        <h2>Kita Dashboard</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputBx">
            <input
              type="text"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginBottom: "12px" }}
            />
          </div>
          <div className="inputBx">
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "18px" }}
            />
          </div>
          <div className="inputBx">
            <input type="submit" value="Eingabe" />
          </div>
        </form>
        <div className="links">
          <a href="#" style={{ marginLeft: "58px" }}>
            Passwort vergessen
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
