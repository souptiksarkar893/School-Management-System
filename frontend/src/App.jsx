import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import AddSchool from "./pages/AddSchool";
import ShowSchools from "./pages/ShowSchools";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<ShowSchools />} />
            <Route path="/schools" element={<ShowSchools />} />
            <Route path="/add-school" element={<AddSchool />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
