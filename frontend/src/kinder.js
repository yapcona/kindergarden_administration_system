// frontend/src/kinder.js
// a simple component to list children with add, edit, and delete functionality.

import React, { useState } from "react";

const Kinder = () => {
  // state to hold children data
  const [children, setChildren] = useState([
    {
      id: "1",
      vorname: "lena",
      nachname: "meier",
      standort: "berlin",
      eltern: "sabine meier",
    },
    {
      id: "2",
      vorname: "leo",
      nachname: "mueller",
      standort: "berlin",
      eltern: "thomas müller",
    },
    {
      id: "3",
      vorname: "ben",
      nachname: "schmidt",
      standort: "potsdam",
      eltern: "anna schmidt",
    },
  ]);
  // state to hold the search term
  const [searchTerm, setSearchTerm] = useState("");
  // state to control the visibility of the form
  const [isFormVisible, setIsFormVisible] = useState(false);
  // state for form data, either for new or existing child
  const [formData, setFormData] = useState({
    id: null,
    vorname: "",
    nachname: "",
    standort: "",
    eltern: "",
  });

  // handle search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // handle form input changes
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle saving a new or edited child
  const handleSave = (event) => {
    event.preventDefault();
    if (formData.id) {
      // update existing child
      setChildren(
        children.map((child) =>
          child.id === formData.id ? { ...formData } : child
        )
      );
    } else {
      // add new child
      const newChild = { ...formData, id: crypto.randomUUID() };
      setChildren([...children, newChild]);
    }
    // reset form and hide it
    setFormData({
      id: null,
      vorname: "",
      nachname: "",
      standort: "",
      eltern: "",
    });
    setIsFormVisible(false);
  };

  // delete a child
  const handleDelete = (id) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  // open form to edit child data
  const handleEdit = (child) => {
    setFormData(child);
    setIsFormVisible(true);
  };

  // open form to add new child
  const handleAddClick = () => {
    setFormData({
      id: null,
      vorname: "",
      nachname: "",
      standort: "",
      eltern: "",
    });
    setIsFormVisible(true);
  };

  // cancel the form
  const handleCancel = () => {
    setIsFormVisible(false);
  };

  // filter children based on search term
  const filteredChildren = children.filter(
    (child) =>
      child.vorname.toLowerCase().includes(searchTerm) ||
      child.nachname.toLowerCase().includes(searchTerm) ||
      child.standort.toLowerCase().includes(searchTerm) ||
      child.eltern.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="kinder-main-container">
      <style>
        {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

                .kinder-main-container {
                    padding: 2rem;
                    background-color: #f9fafb;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                    border-radius: 0.75rem;
                }

                .kinder-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #1a202c;
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .kinder-card {
                    background-color: #ffffff;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                }
                
                .kinder-grid {
                    display: grid;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                    gap: 1rem;
                    padding: 1.5rem 2rem;
                }
                
                @media (min-width: 768px) {
                    .kinder-grid {
                        grid-template-columns: repeat(5, minmax(0, 1fr));
                        gap: 1rem;
                    }
                }
                
                .grid-header {
                    font-weight: 600;
                    color: #4b5563;
                    border-bottom: 1px solid #d1d5db;
                    padding-bottom: 1rem;
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                }
                
                .grid-row {
                    display: grid;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                    gap: 1rem;
                    align-items: center;
                    padding-top: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                
                .grid-row:last-child {
                    border-bottom: none;
                }
                
                @media (min-width: 768px) {
                    .grid-row {
                        grid-template-columns: repeat(5, minmax(0, 1fr));
                        gap: 1rem;
                    }
                }
                
                .grid-item {
                    font-size: 1rem;
                    color: #4b53f7;
                }

                .grid-item.name {
                    font-weight: 600;
                    color: #111827;
                }

                .grid-item.hidden-md {
                    display: none;
                }

                @media (min-width: 768px) {
                    .grid-item.hidden-md {
                        display: block;
                    }
                }

                .search-container {
                    margin-bottom: 1.5rem;
                    display: flex;
                    justify-content: center;
                }

                .search-input {
                    width: 100%;
                    max-width: 400px;
                    padding: 0.75rem 1rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    color: #1f2937;
                }

                .add-button-container {
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
                
                .add-button {
                    background-color: #22c55e;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.2s ease-in-out;
                }
                .add-button:hover {
                    background-color: #16a34a;
                }

                .action-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.25rem;
                    margin: 0 0.25rem;
                    padding: 0.5rem;
                    border-radius: 0.375rem;
                    transition: background-color 0.2s ease-in-out;
                }

                .edit-button {
                    color: #2563eb;
                }
                .edit-button:hover {
                    background-color: #eff6ff;
                }

                .delete-button {
                    color: #dc2626;
                }
                .delete-button:hover {
                    background-color: #fef2f2;
                }

                .form-container {
                    background-color: #ffffff;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    padding: 2rem;
                    margin-bottom: 2rem;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                    gap: 1rem;
                }

                @media (min-width: 768px) {
                    .form-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-label {
                    font-weight: 600;
                    color: #4b5563;
                    margin-bottom: 0.5rem;
                }

                .form-input {
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                }

                .form-checkbox-group {
                    display: flex;
                    align-items: center;
                    margin-top: 1rem;
                }

                .form-checkbox {
                    margin-right: 0.5rem;
                }

                .form-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .form-button-save {
                    background-color: #22c55e;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    border: none;
                    cursor: pointer;
                }

                .form-button-cancel {
                    background-color: #9ca3af;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    border: none;
                    cursor: pointer;
                }
                `}
      </style>

      <h1 className="kinder-title">kinder</h1>

      <div className="add-button-container">
        <button className="add-button" onClick={handleAddClick}>
          neues kind hinzufügen
        </button>
      </div>

      {isFormVisible && (
        <div className="form-container">
          <h2 className="kinder-title">
            {formData.id ? "kind bearbeiten" : "neues kind hinzufügen"}
          </h2>
          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="vorname">
                  vorname
                </label>
                <input
                  type="text"
                  id="vorname"
                  name="vorname"
                  value={formData.vorname}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nachname">
                  nachname
                </label>
                <input
                  type="text"
                  id="nachname"
                  name="nachname"
                  value={formData.nachname}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="standort">
                  standort
                </label>
                <input
                  type="text"
                  id="standort"
                  name="standort"
                  value={formData.standort}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="eltern">
                  eltern
                </label>
                <input
                  type="text"
                  id="eltern"
                  name="eltern"
                  value={formData.eltern}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="form-button-save">
                speichern
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="form-button-cancel"
              >
                abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="kinder-card">
        <div className="kinder-grid">
          <span className="grid-header">vorname</span>
          <span className="grid-header">nachname</span>
          <span className="grid-header hidden-md">standort</span>
          <span className="grid-header">eltern</span>
          <span className="grid-header">aktionen</span>
        </div>
        {filteredChildren.length > 0 ? (
          filteredChildren.map((child) => (
            <div key={child.id} className="grid-row">
              <span className="grid-item name">{child.vorname}</span>
              <span className="grid-item">{child.nachname}</span>
              <span className="grid-item hidden-md">{child.standort}</span>
              <span className="grid-item">{child.eltern}</span>
              <span className="grid-item actions">
                <button
                  className="action-button edit-button"
                  onClick={() => handleEdit(child)}
                >
                  ✏️
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(child.id)}
                >
                  🗑️
                </button>
              </span>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            keine kinder gefunden.
          </div>
        )}
      </div>
    </div>
  );
};

export default Kinder;
