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

  async function handleSubmit(e) {
    e.preventDefault();
    var candidate = await searchById(candidateRef.current.value);
    var similarEmployees = findSimilarEmployees(candidate);
    console.log("similar employees", similarEmployees);
  }

  

  function searchById(candidateId) {
    var candidate = {};
    scoreRecordsData.map((elem, i) => {
      if (elem.candidate_id === candidateId) candidate = elem;
      else return;
    });

    return candidate;
  }





  function findSimilarEmployees(candidate) {
    var index;
    var title = candidate.title;

    companyData.map((elem) => {
      if (elem.company_id === candidate.company_id) {
        index = elem.fractal_index;
      }
    });

    var similerCompanies = {};
    companyData.map((elem) => {
      if (Math.abs(index - elem.fractal_index) < 0.15) {
        similerCompanies[elem.company_id] = true;
      }
    });

    var similarEmployees = [];
    scoreRecordsData.map((elem) => {
      if (similerCompanies[elem.company_id] && elem.title === title) {
        similarEmployees.push(elem);
      }
    });

    return similarEmployees;
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
