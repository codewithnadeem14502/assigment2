import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [verificationResult, setVerificationResult] = useState("");

  const generateCode = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/codes");
      setGeneratedCode(response.data.code);
    } catch (error) {
      console.error(error);
    }
  };

  const submitCode = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/codes/use", {
        code: enteredCode,
      });
      setVerificationResult(response.data.message);
    } catch (error) {
      setVerificationResult(error.response.data.error);
    }
  };

  return (
    <div className="App">
      <div className="code-section">
        <p>Generated Code: {generatedCode}</p>
        <button onClick={generateCode}>Generate Code</button>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={enteredCode}
          onChange={(e) => setEnteredCode(e.target.value)}
        />
        <button onClick={submitCode}>Submit Code</button>
        <p className="verification-result">{verificationResult}</p>
        {console.log(verificationResult)}
      </div>
    </div>
  );
}

export default App;
