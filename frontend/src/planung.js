// frontend/src/Planung.js
// dies ist eine react-komponente für eine dynamische mitarbeiterplanung.
// der code wurde so angepasst, dass die daten lokal im browser über localstorage gespeichert werden.
// die ui wurde komplett überarbeitet, um ein großes gantt-diagramm anzuzeigen.

import React, { useState, useEffect } from "react";

// hauptkomponente für die gesamte mitarbeiterplanung.
const Planung = () => {
  // lade die initialdaten aus dem lokalen speicher oder verwende die standarddaten.
  const initialEmployees = JSON.parse(localStorage.getItem("employees")) || [
    { id: "1", name: "sel" },
    { id: "2", name: "max" },
    { id: "3", name: "julia" },
  ];

  const initialTasks = JSON.parse(localStorage.getItem("tasks")) || [
    {
      id: "1-1",
      name: "meeting vorbereiten",
      start: "2025-08-01",
      end: "2025-08-05",
      employeeId: "1",
    },
    {
      id: "2-1",
      name: "präsentation designen",
      start: "2025-08-05",
      end: "2025-08-10",
      employeeId: "2",
    },
    {
      id: "1-2",
      name: "code review",
      start: "2025-08-10",
      end: "2025-08-25",
      employeeId: "1",
    },
    {
      id: "3-1",
      name: "qa-tests",
      start: "2025-08-25",
      end: "2025-08-30",
      employeeId: "3",
    },
  ];

  // zustand für mitarbeiter- und aufgabendaten.
  const [employees, setEmployees] = useState(initialEmployees);
  const [tasks, setTasks] = useState(initialTasks);

  // zustände für formularfelder und bearbeitung.
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newTask, setNewTask] = useState({
    name: "",
    start: "",
    end: "",
    employeeId: "",
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // neuer zustand, um die ausgewählte aufgabe zu speichern
  const [activeTaskId, setActiveTaskId] = useState(null);

  // speichere daten in localstorage, wenn sich die zustände ändern.
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // wandelt datumsstrings in date-objekte um.
  const parseDate = (dateStr) => new Date(dateStr);

  // hilfsfunktion, um aufgaben nach mitarbeiter-id zu filtern.
  const getEmployeeTasks = (employeeId) => {
    return tasks.filter((task) => task.employeeId === employeeId);
  };

  // berechnet den frühesten start- und spätesten endpunkt aller aufgaben.
  const calculateOverallTimeline = () => {
    if (tasks.length === 0) {
      return { minDate: new Date(), maxDate: new Date() };
    }
    const allDates = tasks.flatMap((task) => [
      parseDate(task.start),
      parseDate(task.end),
    ]);
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = calculateOverallTimeline();
  const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24) + 1;

  // fügt einen neuen mitarbeiter hinzu.
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployeeName.trim()) return;
    // use timestamp for a more unique id
    const newId = Date.now().toString();
    setEmployees([...employees, { id: newId, name: newEmployeeName }]);
    setNewEmployeeName("");
  };

  // löscht einen mitarbeiter und alle seine aufgaben.
  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    setTasks(tasks.filter((task) => task.employeeId !== id));
  };

  // fügt eine neue aufgabe hinzu.
  const handleAddTask = (e) => {
    e.preventDefault();
    if (
      !newTask.name.trim() ||
      !newTask.start ||
      !newTask.end ||
      !newTask.employeeId
    )
      return;
    // use timestamp for a more unique id
    const newId = Date.now().toString();
    setTasks([...tasks, { ...newTask, id: `${newId}` }]);
    setNewTask({ name: "", start: "", end: "", employeeId: "" });
  };

  // löscht eine aufgabe.
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    // deaktiviere die anzeige der buttons, nachdem die aufgabe gelöscht wurde
    setActiveTaskId(null);
  };

  // setzt den bearbeitungsmodus für einen mitarbeiter.
  const handleEditEmployee = (employee) => {
    setEditingEmployeeId(employee.id);
    setNewEmployeeName(employee.name);
  };

  // speichert bearbeitete mitarbeiterdaten.
  const handleSaveEmployee = (e) => {
    e.preventDefault();
    setEmployees(
      employees.map((emp) =>
        emp.id === editingEmployeeId ? { ...emp, name: newEmployeeName } : emp
      )
    );
    setEditingEmployeeId(null);
    setNewEmployeeName("");
  };

  // setzt den bearbeitungsmodus für eine aufgabe.
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setNewTask({ ...task });
  };

  // speichert bearbeitete aufgabendaten.
  const handleSaveTask = (e) => {
    e.preventDefault();
    setTasks(
      tasks.map((task) => (task.id === editingTaskId ? { ...newTask } : task))
    );
    setEditingTaskId(null);
    setNewTask({ name: "", start: "", end: "", employeeId: "" });
  };

  return (
    <div className="planung-container">
      {/* styles sind hier inline, um import-fehler zu vermeiden */}
      <style>{`
        body {
          font-family: -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, oxygen-sans, ubuntu, cantarell, 'Helvetica Neue', sans-serif;
          background-color: #f4f7f9;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .planung-container {
          padding: 1.5rem;
          max-width: 100%;
          margin: auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          width: 1800px;
        }
        .planung-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #1a202c;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 10px;
          text-align: center;
        }
        .form-section {
            margin-bottom: 2.5rem;
            padding: 2rem;
            background-color: #f0f4f7;
            border-radius: 10px;
        }
        .form-section h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #2d3748;
        }
        .form-row {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .form-row input, .form-row select, .form-row button {
            padding: 0.75rem;
            border-radius: 8px;
            border: 1px solid #ccc;
            flex-grow: 1;
        }
        .form-row button {
            background-color: #4299e1;
            color: white;
            border: none;
            cursor: pointer;
            font-weight: 600;
        }
        .form-row button:hover {
            background-color: #3182ce;
        }
        .crud-buttons {
            display: flex;
            gap: 0.5rem;
        }
        .crud-buttons button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        .crud-buttons .edit {
            background-color: #cdffcb;
            color: #000000ff;
        }
        .crud-buttons .delete {
            background-color: #cdffcb;
            color: #fff;
        }
        .crud-buttons .edit:hover {
            background-color: #7fde7bff;
        }
        .crud-buttons .delete:hover {
            background-color: #7fde7bff;
        }
        .gantt-chart-wrapper {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        .gantt-chart-grid {
            display: grid;
            grid-template-columns: 400px 1fr;
            border: 1px solid #e2e2e2;
            border-radius: 8px;
            background-color: #ffffff;
            padding: 20px;
            overflow-x: auto;
        }
        .gantt-header, .gantt-row {
            display: contents;
        }
        .header-cell, .employee-cell, .task-cell {
            padding: 10px;
            border: 1px solid #e2e2e2;
            border-top: none;
            border-left: none;
            overflow: hidden;
            text-align: center;
        }
        .employee-cell {
            font-weight: bold;
            text-align: left;
            position: sticky;
            left: 0;
            z-index: 10;
            background-color: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }
        .timeline-container {
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
        }
        .task-bar {
            height: 25px;
            background-color: #4299e1;
            border-radius: 4px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            transition: width 0.3s ease, left 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 5px;
            cursor: pointer;
        }
        .task-bar-content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 5px;
            color: white;
            font-weight: 500;
            line-height: 25px;
        }
        .date-header {
            display: flex;
            border-bottom: 1px solid #e2e2e2;
        }
        .date-cell {
            text-align: center;
            padding: 10px;
            font-weight: 600;
            background-color: #f0f4f7;
            flex-grow: 1;
            flex-shrink: 0;
        }
        .gantt-chart-main {
            display: grid;
            grid-template-columns: 200px 1fr;
        }
        .gantt-chart-header {
            grid-column: 2 / 3;
            display: flex;
            overflow-x: auto;
        }
        .gantt-chart-body {
            grid-column: 2 / 3;
            overflow-x: auto;
        }
      `}</style>

      <h1 className="planung-title">mitarbeiter-zeitplanung</h1>

      {/* sektion zum hinzufügen/bearbeiten von mitarbeitern */}
      <div className="form-section">
        <h2>mitarbeiter {editingEmployeeId ? "bearbeiten" : "hinzufügen"}</h2>
        <form
          onSubmit={editingEmployeeId ? handleSaveEmployee : handleAddEmployee}
        >
          <div className="form-row">
            <input
              type="text"
              placeholder="name des mitarbeiters"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
            />
            <button type="submit">
              {editingEmployeeId ? "speichern" : "hinzufügen"}
            </button>
          </div>
        </form>
      </div>

      {/* sektion zum hinzufügen/bearbeiten von aufgaben */}
      <div className="form-section">
        <h2>aufgabe {editingTaskId ? "bearbeiten" : "hinzufügen"}</h2>
        <form onSubmit={editingTaskId ? handleSaveTask : handleAddTask}>
          <div className="form-row">
            <input
              type="text"
              placeholder="aufgabenname"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
            <input
              type="date"
              value={newTask.start}
              onChange={(e) => setNewTask({ ...newTask, end: e.target.value })}
            />
            <input
              type="date"
              value={newTask.end}
              onChange={(e) => setNewTask({ ...newTask, end: e.target.value })}
            />
            <select
              value={newTask.employeeId}
              onChange={(e) =>
                setNewTask({ ...newTask, employeeId: e.target.value })
              }
            >
              <option value="">mitarbeiter auswählen</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <button type="submit">
              {editingTaskId ? "speichern" : "hinzufügen"}
            </button>
          </div>
        </form>
      </div>

      <div className="gantt-chart-wrapper">
        <div className="gantt-chart-grid">
          {/* header-zeile */}
          <div
            className="employee-cell"
            style={{
              borderTop: "1px solid #e2e2e2",
              backgroundColor: "#f0f4f7",
              justifyContent: "flex-start",
            }}
          >
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              mitarbeiter
            </span>
          </div>
          <div className="date-header">
            {Array.from({ length: totalDays }, (_, i) => {
              const date = new Date(minDate);
              date.setDate(minDate.getDate() + i);
              return (
                <div
                  key={i}
                  className="date-cell"
                  style={{
                    width: `calc(100% / ${totalDays})`,
                    flexBasis: `calc(100% / ${totalDays})`,
                  }}
                >
                  {date.getDate()}.{date.getMonth() + 1}
                </div>
              );
            })}
          </div>

          {/* chart-zeilen */}
          {employees.map((employee) => {
            const employeeTasks = getEmployeeTasks(employee.id);
            return (
              <React.Fragment key={employee.id}>
                <div className="employee-cell">
                  <span>{employee.name}</span>
                  <div className="crud-buttons">
                    <button
                      className="edit"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="timeline-container">
                  {employeeTasks.map((task) => {
                    const startDate = parseDate(task.start);
                    const endDate = parseDate(task.end);
                    const taskDuration =
                      (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
                    const taskOffset =
                      (startDate - minDate) / (1000 * 60 * 60 * 24);

                    const barWidth = (taskDuration / totalDays) * 100;
                    const barLeft = (taskOffset / totalDays) * 100;

                    return (
                      <div
                        key={task.id}
                        className="task-bar"
                        style={{ width: `${barWidth}%`, left: `${barLeft}%` }}
                        onClick={() =>
                          setActiveTaskId(
                            task.id === activeTaskId ? null : task.id
                          )
                        }
                      >
                        <span className="task-bar-content">{task.name}</span>
                        {/* buttons werden nur angezeigt, wenn die aufgabe aktiv ist */}
                        {activeTaskId === task.id && (
                          <div className="crud-buttons">
                            <button
                              className="edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                            >
                              bearbeiten
                            </button>
                            <button
                              className="delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                            >
                              löschen
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Planung;
