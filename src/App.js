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
  const [codingPercentile, setCodingPercentile] = useState("0");
  const [communicationsPercentile, setCommunicationsPercentile] = useState("0");

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
    var communicatonScore = computeCommunicationScore(
      candidate,
      similarEmployees
    );
    var codingScore = computeCodingScore(candidate, similarEmployees);
    setCodingPercentile(`%${(codingScore * 100).toFixed(2)}`);
    setCommunicationsPercentile(`%${(communicatonScore * 100).toFixed(2)}`);
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
  function computeCommunicationScore(candidate, similarEmployees) {
    let placements = similarEmployees.sort(
      (a, b) => a.communication_score - b.communication_score
    );
    var percentile;
    placements.map((elem, i) => {
      if (elem.candidate_id === candidate.candidate_id) {
        percentile = (1 / placements.length) * (i + 1);
      }
    });
    return percentile;
  }
  function computeCodingScore(candidate, similarEmployees) {
    let placements = similarEmployees.sort(
      (a, b) => a.coding_score - b.coding_score
    );
    var percentile;
    placements.map((elem, i) => {
      if (elem.candidate_id === candidate.candidate_id) {
        percentile = (1 / placements.length) * (i + 1);
      }
    });
    return percentile;
  }

  return (
    <div className="App">
      <h1>Joshua Constine Coding Challenge</h1>
      <div>
        <form>
          <label htmlFor="candidate_id">candidate_id: </label>
          <input type="text" ref={candidateRef} name="candidate_id"></input>
          <button type="submit" onClick={(e) => handleSubmit(e)}>
            submit
          </button>
        </form>
      </div>
      <div>
        <h1>{`Coding Percentile: ${codingPercentile}`}</h1>
        <h1>{`Communications Percentile: ${communicationsPercentile}`}</h1>
      </div>
    </div>
  );
}

export default App;
