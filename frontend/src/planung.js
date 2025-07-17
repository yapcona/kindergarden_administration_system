import React from 'react';
import { useParams } from 'react-router-dom';
import Gantt from 'react-gantt'; // Default-Export statt { Gantt }

const tasksByStandort = {
  sonnenstrahl: [
    { id: 1, start: new Date('2025-07-21'), end: new Date('2025-07-23'), name: 'Mitarbeiter A', progress: 45, dependencies: [] },
    // weitere Aufgaben für Sonnenstrahl...
  ],
  regenbogen: [
    { id: 2, start: new Date('2025-07-22'), end: new Date('2025-07-25'), name: 'Mitarbeiter B', progress: 80, dependencies: [] },
    // weitere Aufgaben für Regenbogen...
  ],
  // add: [...]
};

function Planung() {
  const { standort } = useParams();
  const tasks = tasksByStandort[standort] || [];

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <h2>Arbeitszeitplanung für {standort}</h2>
      <Gantt tasks={tasks} />
    </div>
  );
}

export default Planung;