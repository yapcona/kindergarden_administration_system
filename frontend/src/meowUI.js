import React from 'react';
import './App.css';

function meowUI() {
  return (
    <div className="god-container" style={{ position: 'relative' }}>
      <h1 className="headline" style={{marginBottom: "4px", fontFamily:"Share Tech Mono"}}> kindergardenadministration system </h1>
      
      <div className="box-row">
        
        <button className="info-box offset" style={{backgroundColor: "black"}}>
          <h2 id="daily" className="box-title"> Standort </h2>
          <p className="normalText"></p>
        </button>
        
        <button className="info-box offset" style={{backgroundColor: "black"}}>
          <h2 id="goals" className="box-title"> Mitarbeiter </h2>
          <p> </p>
        </button>
        
        <button className="info-box offset" style={{backgroundColor: "black"}}>
          <h2 id="goaCreatels" className="box-title"> Eltern </h2>
          <p> </p>
        </button>
        
        <button className="info-box offset" style={{backgroundColor: "black"}}>
          <h2 id="goals" className="box-title"> Kinder </h2>
          <p> </p>
        </button>
      </div>
    </div>
  );
}

export default meowUI;