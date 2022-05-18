import "./App.css";
import { useRef, useState } from "react";
import Papa from "papaparse";
import companies from "./companies.csv";
import scoreRecords from "./score-records .csv";

function App() {
  const candidateRef = useRef(null);
  //holds data from the csv files
  var companyData = [];
  var scoreRecordsData = [];

  //state that will hole the percentile of the selected candidate
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

  /*when the submit is called the program finds a list of similar employees  based
  on the companies fractal score.*/
  async function handleSubmit(e) {
    e.preventDefault();
    var candidate = await searchById(candidateRef.current.value);
    var similarEmployees = findSimilarEmployees(candidate);
    var communicatonScore = computeCommunicationScore(
      candidate,
      similarEmployees
    );
    var codingScore = computeCodingScore(candidate, similarEmployees);
    //update state with a percentile for the candidate, founded to 2 decimal places
    setCodingPercentile(`%${(codingScore * 100).toFixed(2)}`);
    setCommunicationsPercentile(`%${(communicatonScore * 100).toFixed(2)}`);
  }

  //function takes an id and returns the data for that candidate.
  //will alert if the user is not found
  function searchById(candidateId) {
    var candidate = null;
    scoreRecordsData.map((elem, i) => {
      if (elem.candidate_id === candidateId) candidate = elem;
      else return;
    });
    if (candidate === null) {
      window.alert("user not found");
    }
    return candidate;
  }

  //function that returns an array of employees similar to the candidate that was input to the function
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

  //returns a decimal that will be used for the percentile based on the communication score
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
  //returns a decimal that will be used for the percentile based on the coding score

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
