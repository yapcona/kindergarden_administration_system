// frontend/src/zahlen.js
// a small, minimalist component for tracking monthly payments with self-contained CSS.

import React, { useState, useEffect } from "react";

// main component for the payment history
const Zahlen = () => {
  // initialize payments from local storage or with an empty array
  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem("payments");
    return savedPayments ? JSON.parse(savedPayments) : [];
  });

  // state for the new payment form
  const [newPayment, setNewPayment] = useState({
    parentName: "",
    month: "",
    amount: "",
  });

  // state for the search query
  const [searchQuery, setSearchQuery] = useState("");

  // state to track which payment is being edited
  const [editingPaymentId, setEditingPaymentId] = useState(null);

  // save payments to local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  // handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // handle adding a new payment
  const handleAddPayment = (e) => {
    e.preventDefault();
    // check if all fields are filled
    if (!newPayment.parentName || !newPayment.month || !newPayment.amount) {
      return;
    }

    // create a new payment object with a unique id and the current date
    // automatically add "fam." to the parent's name and set default status to "bezahlt"
    const newPaymentEntry = {
      id: Date.now().toString(),
      parentName: `Fam. ${newPayment.parentName}`,
      month: newPayment.month,
      amount: newPayment.amount,
      dateAdded: new Date().toISOString().split("T")[0], // format as YYYY-MM-DD
      status: "bezahlt",
    };

    // add the new payment to the list
    setPayments((prevState) => [newPaymentEntry, ...prevState]);

    // reset the form fields
    setNewPayment({
      parentName: "",
      month: "",
      amount: "",
    });
  };

  // handle updating an existing payment
  const handleUpdatePayment = (e) => {
    e.preventDefault();
    if (
      !newPayment.parentName ||
      !newPayment.month ||
      !newPayment.amount ||
      !editingPaymentId
    ) {
      return;
    }

    // update the payment list with the edited entry
    setPayments(
      payments.map((payment) =>
        payment.id === editingPaymentId
          ? {
              ...payment,
              parentName: `fam. ${newPayment.parentName.replace(
                /^fam. /i,
                ""
              )}`, // remove "fam." before updating
              month: newPayment.month,
              amount: newPayment.amount,
            }
          : payment
      )
    );

    // reset the form and editing state
    setNewPayment({
      parentName: "",
      month: "",
      amount: "",
    });
    setEditingPaymentId(null);
  };

  // handle delete a payment
  const handleDeletePayment = (id) => {
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  // handle setting the form to edit mode
  const handleEditClick = (payment) => {
    setEditingPaymentId(payment.id);
    // fill the form with the payment data, removing "fam." for better ux
    setNewPayment({
      parentName: payment.parentName.replace(/^fam. /i, ""),
      month: payment.month,
      amount: payment.amount,
    });
  };

  // handle toggling the status of a payment
  const handleToggleStatus = (id) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status: payment.status === "bezahlt" ? "ausstehend" : "bezahlt",
            }
          : payment
      )
    );
  };

  // filter payments based on search query
  const filteredPayments = payments.filter((payment) =>
    payment.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="zahlungen-main-container">
      <style>
        {`
                /* styling for the zahlen component */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

                .zahlungen-main-container {
                    padding: 2rem;
                    background-color: #f9fafb;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }

                .zahlungen-card {
                    max-width: 64rem;
                    margin-left: auto;
                    margin-right: auto;
                    background-color: #ffffff;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    padding: 2.5rem;
                }

                .zahlungen-title {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: #1a202c;
                    margin-bottom: 1.5rem;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 0.5rem;
                }

                .zahlungen-form {
                    display: grid;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background-color: #eff6ff;
                    border-radius: 0.5rem;
                }

                @media (min-width: 768px) {
                    .zahlungen-form {
                        grid-template-columns: repeat(4, minmax(0, 1fr));
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

                .form-input {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                }

                .form-input:focus {
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

                .zahlungen-tabelle-container {
                    background-color: #ffffff;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                }

                .tabelle-header-row {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    font-weight: 600;
                    color: #4a5568;
                    background-color: #edf2f7;
                    padding: 1rem;
                    border-bottom: 1px solid #e2e8f0;
                }

                @media (min-width: 768px) {
                    .tabelle-header-row {
                        grid-template-columns: repeat(6, minmax(0, 1fr));
                    }
                }

                .header-eltern {
                    grid-column: span 2 / span 2;
                }
                @media (min-width: 768px) {
                    .header-eltern {
                        grid-column: span 1 / span 1;
                    }
                }

                .header-monat, .header-betrag, .header-datum {
                    display: none;
                }
                @media (min-width: 768px) {
                    .header-monat, .header-betrag, .header-datum {
                        display: block;
                    }
                }

                .header-datum {
                    text-align: right;
                }

                .header-status {
                    text-align: center;
                }

                .header-aktionen {
                    text-align: right;
                }

                .tabelle-scroll-container {
                    max-height: 24rem;
                    overflow-y: auto;
                }

                .tabelle-scroll-container::-webkit-scrollbar {
                    width: 8px;
                }
                .tabelle-scroll-container::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .tabelle-scroll-container::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .tabelle-scroll-container::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                .tabelle-row {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid #e2e8f0;
                    font-size: 0.875rem;
                    color: #4a5568;
                }

                .tabelle-row:last-child {
                    border-bottom-width: 0;
                }

                @media (min-width: 768px) {
                    .tabelle-row {
                        grid-template-columns: repeat(6, minmax(0, 1fr));
                        font-size: 1rem;
                    }
                }

                .tabelle-eltern {
                    grid-column: span 2 / span 2;
                    font-weight: 500;
                    color: #2d3748;
                }

                @media (min-width: 768px) {
                    .tabelle-eltern {
                        grid-column: span 1 / span 1;
                    }
                    .tabelle-monat, .tabelle-betrag, .tabelle-datum {
                        display: block;
                    }
                }

                .tabelle-datum {
                    text-align: right;
                    color: #a0aec0;
                    font-size: 0.875rem;
                }

                .tabelle-status-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .status-bezahlt {
                    background-color: #d1fae5;
                    color: #065f46;
                    font-weight: 600;
                    font-size: 0.75rem;
                    padding: 0.25rem 0.625rem;
                    border-radius: 9999px;
                    cursor: pointer;
                }

                .status-ausstehend {
                    background-color: #fecaca;
                    color: #991b1b;
                    font-weight: 600;
                    font-size: 0.75rem;
                    padding: 0.25rem 0.625rem;
                    border-radius: 9999px;
                    cursor: pointer;
                }

                .tabelle-aktionen-container {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.5rem;
                }

                .action-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                }

                .tabelle-empty-message {
                    padding: 1.5rem;
                    text-align: center;
                    color: #a0aec0;
                }

                .search-input-container {
                    margin-bottom: 1rem;
                    padding: 1rem;
                    background-color: #eff6ff;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                }
                .search-input {
                    flex-grow: 1;
                }
                `}
      </style>
      <div className="zahlungen-card">
        <h1 className="zahlungen-title">zahlungsübersicht</h1>

        {/* form to add/edit new payments */}
        <form
          onSubmit={editingPaymentId ? handleUpdatePayment : handleAddPayment}
          className="zahlungen-form"
        >
          <div className="form-column">
            <label htmlFor="parentName" className="form-label">
              eltern
            </label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={newPayment.parentName}
              onChange={handleInputChange}
              placeholder="name"
              className="form-input"
            />
          </div>
          <div className="form-column">
            <label htmlFor="month" className="form-label">
              monat
            </label>
            <input
              type="month"
              id="month"
              name="month"
              value={newPayment.month}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-column">
            <label htmlFor="amount" className="form-label">
              betrag (€)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={newPayment.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              className="form-input"
              step="0.01"
            />
          </div>
          <div className="form-column-button">
            <button type="submit" className="form-button">
              {editingPaymentId ? "speichern" : "hinzufügen"}
            </button>
          </div>
        </form>

        {/* search bar */}
        <div className="search-input-container">
          <input
            type="text"
            placeholder="suchen..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-input search-input"
          />
        </div>

        {/* payment history table */}
        <div className="zahlungen-tabelle-container">
          <div className="tabelle-header-row">
            <div className="header-eltern">eltern</div>
            <div className="header-monat">monat</div>
            <div className="header-betrag">betrag</div>
            <div className="header-datum">datum</div>
            <div className="header-status">status</div>
            <div className="header-aktionen">aktionen</div>
          </div>
          <div className="tabelle-scroll-container">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <div key={payment.id} className="tabelle-row">
                  <div className="tabelle-eltern">{payment.parentName}</div>
                  <div className="tabelle-monat">{payment.month}</div>
                  <div className="tabelle-betrag">
                    €{parseFloat(payment.amount).toFixed(2)}
                  </div>
                  <div className="tabelle-datum">{payment.dateAdded}</div>
                  <div className="tabelle-status-container">
                    <span
                      onClick={() => handleToggleStatus(payment.id)}
                      className={`status-${payment.status}`}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <div className="tabelle-aktionen-container">
                    <button
                      onClick={() => handleEditClick(payment)}
                      className="action-button"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      className="action-button"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="tabelle-empty-message">
                keine zahlungen gefunden.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zahlen;
