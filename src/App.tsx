
import "./App.css";
import SketchPad from "./components/SketchPad";
import { Routes, Route } from "react-router-dom";
import Entry from "./pages/Entry";
import Room from "./pages/Room";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Entry />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  );
}

export default App;
