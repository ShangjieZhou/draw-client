import React from "react";
import logo from "./logo.svg";
import "./App.css";
import SketchPad from "./components/SketchPad";

function App() {
  return (
    <div className="w-screen min-h-screen">
      <header className="w-full h-full">
        <div className="w-96 h-96">
          <SketchPad />
        </div>
      </header>
    </div>
  );
}

export default App;
