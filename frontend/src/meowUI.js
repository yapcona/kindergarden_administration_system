import React from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function MeowUI() {
  const navigate = useNavigate();

  return (
    <div className="god-container" style={{ position: 'relative' }}>
      <h1 className="headline" style={{marginBottom: "4px"}}> Standort wählen </h1>
      
      <div className="box-row">
        
        <button
          className="info-box offset"
          style={{backgroundColor: "#cdffcb"}}
          onClick={() => navigate('/manage/sonnenstrahl')}
        >
          <h2 id="sonnenstrahl" className="box-title">Sonnenstrahl </h2>
          <h2 style={{fontSize: "30px"}}>🌞</h2>
        </button>
        
        <button
          className="info-box offset"
          style={{backgroundColor: "#cdffcb"}}
          onClick={() => navigate('/manage/regenbogen')}
        >
          <h2 id="regenbogen" className="box-title"> Regenbogen </h2>
          
        </button>
        
        <button
          className="info-box offset"
          style={{backgroundColor: "#cdffcb"}}
          onClick={() => navigate('/manage/add')}
        >
          <h2 id="addLocation" className="box-title"> + </h2>
        </button>
      </div>
    </div>
  );
}

export default MeowUI;