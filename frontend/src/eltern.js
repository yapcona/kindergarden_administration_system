// frontend/src/eltern.js
// a simple component to list parents with add, edit, and delete functionality.

import React, { useState } from "react";

const Eltern = () => {
  // state to hold parent data
  const [parents, setParents] = useState([
    {
      id: "1",
      vorname: "sabine",
      nachname: "meier",
      adresse: "musterstraße 1, 10115 berlin",
      email: "sabine.m@example.com",
      telefon: "0171-1234567",
      rolle: "eltern",
      login: "sm-login",
    },
    {
      id: "2",
      vorname: "thomas",
      nachname: "mueller",
      adresse: "hauptstraße 5, 14467 potsdam",
      email: "thomas.m@example.com",
      telefon: "0172-2345678",
      rolle: "eltern",
      login: "tm-login",
    },
    {
      id: "3",
      vorname: "anna",
      nachname: "schmidt",
      adresse: "nebenstraße 10, 10115 berlin",
      email: "anna.s@example.com",
      telefon: "0173-3456789",
      rolle: "eltern",
      login: "as-login",
    },
  ]);
  // state to hold the search term
  const [searchTerm, setSearchTerm] = useState("");
  // state to control the visibility of the form
  const [isFormVisible, setIsFormVisible] = useState(false);
  // state for form data, either for new or existing parent
  const [formData, setFormData] = useState({
    id: null,
    vorname: "",
    nachname: "",
    adresse: "",
    email: "",
    telefon: "",
    rolle: "",
    login: "",
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

  // handle saving a new or edited parent
  const handleSave = (event) => {
    event.preventDefault();
    if (formData.id) {
      // update existing parent
      setParents(
        parents.map((parent) =>
          parent.id === formData.id ? { ...formData } : parent
        )
      );
    } else {
      // add new parent
      const newParent = { ...formData, id: crypto.randomUUID() };
      setParents([...parents, newParent]);
    }
    // reset form and hide it
    setFormData({
      id: null,
      vorname: "",
      nachname: "",
      adresse: "",
      email: "",
      telefon: "",
      rolle: "",
      login: "",
    });
    setIsFormVisible(false);
  };

  // delete a parent
  const handleDelete = (id) => {
    setParents(parents.filter((parent) => parent.id !== id));
  };

  // open form to edit parent data
  const handleEdit = (parent) => {
    setFormData(parent);
    setIsFormVisible(true);
  };

  // open form to add new parent
  const handleAddClick = () => {
    setFormData({
      id: null,
      vorname: "",
      nachname: "",
      adresse: "",
      email: "",
      telefon: "",
      rolle: "",
      login: "",
    });
    setIsFormVisible(true);
  };

  // cancel the form
  const handleCancel = () => {
    setIsFormVisible(false);
  };

  // filter parents based on search term
  const filteredParents = parents.filter(
    (parent) =>
      parent.vorname.toLowerCase().includes(searchTerm) ||
      parent.nachname.toLowerCase().includes(searchTerm) ||
      parent.adresse.toLowerCase().includes(searchTerm) ||
      parent.email.toLowerCase().includes(searchTerm) ||
      parent.telefon.toLowerCase().includes(searchTerm) ||
      parent.rolle.toLowerCase().includes(searchTerm) ||
      parent.login.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="eltern-main-container">
      <style>
        {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

                .eltern-main-container {
                    padding: 2rem;
                    background-color: #f9fafb;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                    border-radius: 0.75rem;
                }

                .eltern-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #1a202c;
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .eltern-card {
                    background-color: #ffffff;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                }
                
                .eltern-grid {
                    display: grid;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                    gap: 1rem;
                    padding: 1.5rem 2rem;
                }
                
                @media (min-width: 768px) {
                    .eltern-grid {
                        grid-template-columns: repeat(6, minmax(0, 1fr));
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
                        grid-template-columns: repeat(6, minmax(0, 1fr));
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
                    background-color: #2563eb;
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

      <h1 className="eltern-title">eltern</h1>

      <div className="add-button-container">
        <button className="add-button" onClick={handleAddClick}>
          neuen elternteil hinzufügen
        </button>
      </div>

      {isFormVisible && (
        <div className="form-container">
          <h2 className="eltern-title">
            {formData.id
              ? "elternteil bearbeiten"
              : "neuen elternteil hinzufügen"}
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
                <label className="form-label" htmlFor="adresse">
                  adresse
                </label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="telefon">
                  telefon
                </label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="rolle">
                  rolle
                </label>
                <input
                  type="text"
                  id="rolle"
                  name="rolle"
                  value={formData.rolle}
                  onChange={handleFormChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="login">
                  login
                </label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={formData.login}
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

      <div className="eltern-card">
        <div className="eltern-grid">
          <span className="grid-header">name</span>
          <span className="grid-header hidden-md">adresse</span>
          <span className="grid-header hidden-md">email</span>
          <span className="grid-header hidden-md">telefon</span>
          <span className="grid-header hidden-md">login</span>
          <span className="grid-header">aktionen</span>
        </div>
        {filteredParents.length > 0 ? (
          filteredParents.map((parent) => (
            <div key={parent.id} className="grid-row">
              <span className="grid-item name">
                {parent.vorname} {parent.nachname}
              </span>
              <span className="grid-item hidden-md">{parent.adresse}</span>
              <span className="grid-item hidden-md">{parent.email}</span>
              <span className="grid-item hidden-md">{parent.telefon}</span>
              <span className="grid-item hidden-md">{parent.login}</span>
              <span className="grid-item actions">
                <button
                  className="action-button edit-button"
                  onClick={() => handleEdit(parent)}
                >
                  ✏️
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(parent.id)}
                >
                  🗑️
                </button>
              </span>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            keine eltern gefunden.
          </div>
        )}
      </div>
    </div>
  );
};

export default Eltern;
