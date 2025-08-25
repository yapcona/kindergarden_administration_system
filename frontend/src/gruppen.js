// frontend/src/gruppen.js
// a minimalist component for managing kindergarten groups and children.

import React, { useState } from "react";

// main component for group management
const Gruppen = () => {
  // initialize group data with example groups and children
  const [kindergartenData, setKindergartenData] = useState({
    sonnenstrahl: {
      name: "sonnenstrahl",
      children: [
        { id: 1, name: "mia", age: 4, gender: "w" },
        { id: 2, name: "leo", age: 5, gender: "m" },
      ],
    },
    regenbogen: {
      name: "regenbogen",
      children: [
        { id: 3, name: "anna", age: 3, gender: "w" },
        { id: 4, name: "max", age: 4, gender: "m" },
        { id: 5, name: "elias", age: 5, gender: "m" },
      ],
    },
  });

  // state for form inputs
  const [newChildData, setNewChildData] = useState({
    groupName: "sonnenstrahl", // default to 'sonnenstrahl' group
    name: "",
    age: "",
    gender: "w",
  });

  // state for tracking the child being edited
  const [editingChildId, setEditingChildId] = useState(null);

  // state for the search query
  const [searchQuery, setSearchQuery] = useState("");

  // handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChildData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handle adding a new child
  const handleAddChild = (e) => {
    e.preventDefault();
    if (!newChildData.name || !newChildData.age) {
      return;
    }

    const newChild = {
      id: Date.now(),
      name: newChildData.name,
      age: parseInt(newChildData.age, 10),
      gender: newChildData.gender,
    };

    // create a new copy of the data
    const updatedData = { ...kindergartenData };
    // add the new child to the selected group
    updatedData[newChildData.groupName].children.push(newChild);

    // update the state
    setKindergartenData(updatedData);

    // reset the form
    setNewChildData({
      ...newChildData,
      name: "",
      age: "",
    });
  };

  // handle deleting a child
  const handleDeleteChild = (groupId, childId) => {
    const updatedData = { ...kindergartenData };
    // filter out the child to be deleted
    updatedData[groupId].children = updatedData[groupId].children.filter(
      (child) => child.id !== childId
    );
    setKindergartenData(updatedData);
  };

  // handle edit button click
  const handleEditClick = (groupId, child) => {
    setEditingChildId(child.id);
    setNewChildData({
      groupName: groupId,
      name: child.name,
      age: child.age,
      gender: child.gender,
    });
  };

  // handle updating a child
  const handleUpdateChild = (e) => {
    e.preventDefault();
    if (!newChildData.name || !newChildData.age || !editingChildId) {
      return;
    }

    const updatedData = { ...kindergartenData };
    // find the group and the child to be updated
    const targetGroup = updatedData[newChildData.groupName];
    if (targetGroup) {
      targetGroup.children = targetGroup.children.map((child) =>
        child.id === editingChildId
          ? {
              ...child,
              name: newChildData.name,
              age: parseInt(newChildData.age, 10),
              gender: newChildData.gender,
            }
          : child
      );
    }

    setKindergartenData(updatedData);
    setEditingChildId(null);
    setNewChildData({
      ...newChildData,
      name: "",
      age: "",
    });
  };

  // filter children based on search query
  const filteredKindergartenData = Object.keys(kindergartenData).reduce(
    (acc, key) => {
      const group = kindergartenData[key];
      const filteredChildren = group.children.filter((child) =>
        child.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredChildren.length > 0) {
        acc[key] = { ...group, children: filteredChildren };
      }
      return acc;
    },
    {}
  );

  return (
    <div className="gruppen-main-container">
      <style>
        {`
                /* styling for the gruppen component */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

                .gruppen-main-container {
                    padding: 2rem;
                    background-color: #f9fafb;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }

                .gruppen-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #1a202c;
                    margin-bottom: 2rem;
                    text-align: center;
                }
                
                .search-bar-container {
                    max-width: 64rem;
                    margin: 0 auto 2rem;
                }

                .search-bar {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 9999px;
                    border: 1px solid #d1d5db;
                    font-size: 1rem;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }

                .search-bar:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
                }

                .gruppen-form {
                    display: grid;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background-color: #eff6ff;
                    border-radius: 0.5rem;
                    max-width: 64rem;
                    margin-left: auto;
                    margin-right: auto;
                }

                @media (min-width: 768px) {
                    .gruppen-form {
                        grid-template-columns: repeat(5, minmax(0, 1fr));
                    }
                }

                .form-column {
                    display: flex;
                    flex-direction: column;
                }

                .form-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #4a5568;
                    margin-bottom: 0.25rem;
                }

                .form-input, .form-select {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                }

                .form-input:focus, .form-select:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 1px #3b82f6;
                }

                .form-column-button {
                    display: flex;
                    align-items: flex-end;
                }

                .form-button {
                    width: 100%;
                    background-color: #2563eb;
                    color: #ffffff;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition-property: background-color;
                    transition-duration: 150ms;
                    cursor: pointer;
                }

                .form-button:hover {
                    background-color: #1d4ed8;
                }

                .gruppen-container {
                    display: grid;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                    gap: 2rem;
                    max-width: 64rem;
                    margin: 0 auto;
                }

                @media (min-width: 768px) {
                    .gruppen-container {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                .gruppen-card {
                    background-color: #ffffff;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    padding: 2rem;
                    border-top: 5px solid #6366f1;
                }

                .gruppen-card h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #4338ca;
                    margin-bottom: 1.5rem;
                    text-transform: capitalize;
                }

                .kinder-list {
                    list-style-type: none;
                    padding: 0;
                }

                .kind-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    background-color: #e0e7ff;
                    margin-bottom: 0.75rem;
                    font-weight: 500;
                }
                .kind-item:last-child {
                    margin-bottom: 0;
                }

                .kind-details {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-size: 0.875rem;
                    color: #4f46e5;
                }

                .kind-details .detail-text {
                    font-size: 1rem;
                }

                .kind-details .kind-name {
                    font-weight: 700;
                    color: #1e293b;
                }

                .kind-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .action-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                }
                `}
      </style>
      <h1 className="gruppen-title">gruppenverwaltung</h1>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="suche nach einem kind..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <form
        onSubmit={editingChildId ? handleUpdateChild : handleAddChild}
        className="gruppen-form"
      >
        <div className="form-column">
          <label htmlFor="groupName" className="form-label">
            gruppe
          </label>
          <select
            name="groupName"
            id="groupName"
            value={newChildData.groupName}
            onChange={handleInputChange}
            className="form-select"
          >
            {Object.values(kindergartenData).map((group) => (
              <option key={group.name} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-column">
          <label htmlFor="name" className="form-label">
            name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={newChildData.name}
            onChange={handleInputChange}
            placeholder="name"
            className="form-input"
          />
        </div>
        <div className="form-column">
          <label htmlFor="age" className="form-label">
            alter
          </label>
          <input
            type="number"
            name="age"
            id="age"
            value={newChildData.age}
            onChange={handleInputChange}
            placeholder="alter"
            className="form-input"
          />
        </div>
        <div className="form-column">
          <label htmlFor="gender" className="form-label">
            geschlecht
          </label>
          <select
            name="gender"
            id="gender"
            value={newChildData.gender}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="w">♀️</option>
            <option value="m">♂️</option>
            <option value="nb">🌈</option>
          </select>
        </div>
        <div className="form-column-button">
          <button type="submit" className="form-button">
            {editingChildId ? "speichern" : "hinzufügen"}
          </button>
        </div>
      </form>

      <div className="gruppen-container">
        {Object.values(filteredKindergartenData).map((group) => (
          <div key={group.name} className="gruppen-card">
            <h2>{group.name}</h2>
            <ul className="kinder-list">
              {group.children.map((child) => (
                <li key={child.id} className="kind-item">
                  <span className="kind-name">{child.name}</span>
                  <div className="kind-details">
                    <span className="detail-text">{child.age} jahre</span>
                    <span className="detail-text">
                      {child.gender === "m"
                        ? "♂️"
                        : child.gender === "w"
                        ? "♀️"
                        : "🌈"}
                    </span>
                    <div className="kind-actions">
                      <button
                        onClick={() => handleEditClick(group.name, child)}
                        className="action-button"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteChild(group.name, child.id)}
                        className="action-button"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gruppen;
