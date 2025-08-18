import React from "react";
import "./App.css";
import { useParams, useNavigate } from "react-router-dom";

function Manage() {
  const { standort } = useParams();
  const navigate = useNavigate();

  let headlineText = "Was möchten Sie heute tun?";
  if (standort === "sonnenstrahl") headlineText = "Kita Sonnenstrahl";
  if (standort === "regenbogen") headlineText = "Kita Regenbogen";
  if (standort === "add") headlineText = "Neuen Standort hinzufügen";

  return (
    <div className="god-container" style={{ position: "relative" }}>
      <h1 className="headline" style={{ marginBottom: "4px" }}>
        {headlineText}
      </h1>

      <div className="box-row">
        <button
          className="info-box offset"
          style={{ backgroundColor: "#cdffcb" }}
          onClick={() => navigate(`/planung/${standort}`)}
        >
          <h2 id="btn-planung" className="box-title">
            {" "}
            Planung{" "}
          </h2>
          <p className="normalText"></p>
        </button>

        <button
          className="info-box offset"
          style={{ backgroundColor: "#cdffcb" }}
        >
          <h2 id="btn-zahlenhistorie" className="box-title">
            {" "}
            Zahlenhistorie{" "}
          </h2>
          <p> </p>
        </button>

        <button
          className="info-box offset"
          style={{ backgroundColor: "#cdffcbff" }}
        >
          <h2 id="btn-gruppen" className="box-title">
            {" "}
            Gruppen{" "}
          </h2>
          <p> </p>
        </button>

        <button
          className="info-box offset"
          style={{ backgroundColor: "#cdffcb" }}
        >
          <h2 id="btn-Mitarbeiter" className="box-title">
            {" "}
            Mitarbeiter{" "}
          </h2>
          <p> </p>
        </button>

        <button
          className="info-box offset"
          style={{ backgroundColor: "#cdffcb" }}
        >
          <h2 id="btn-Kinder" className="box-title">
            {" "}
            Kinder{" "}
          </h2>
          <p> </p>
        </button>

        <button
          className="info-box offset"
          style={{ backgroundColor: "#cdffcb" }}
        >
          <h2 id="btn-Eltern" className="box-title">
            {" "}
            Eltern{" "}
          </h2>
          <p> </p>
        </button>
      </div>
    </div>
  );
}

export default Manage;
