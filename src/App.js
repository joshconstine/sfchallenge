import logo from "./logo.svg";
import "./App.css";
import { useRef } from "react";

function App() {
  const candidateRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    console.log( candidateRef.current.value);
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
    </div>
  );
}

export default App;
