import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import companies from "./companies.csv";
import scoreRecords from "./score-records .csv";

function App() {
  const candidateRef = useRef(null);

  
  var companyData = [];
  var scoreRecordsData = [];

  //reads data from companites.csv file
  const csv = Papa.parse(companies, {
    header: true,
    download: true,
    complete: function (results) {
      companyData = results.data;
    },
  });
  //reads data from score-records.csv file
  const scoreCsv = Papa.parse(scoreRecords, {
    header: true,
    download: true,
    complete: function (results) {
      scoreRecordsData = results.data;
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    console.log(candidateRef.current.value);
  }

  return (
    <div className="App">
      <header>Joshua Constine</header>
      <form>
        <label htmlFor="candidate_id">candidate_id: </label>
        <input type="text" ref={candidateRef} name="candidate_id"></input>
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          submit
        </button>
      </form>
      <div></div>
    </div>
  );
}

export default App;
