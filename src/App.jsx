import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/Pages/Login/Login.jsx";
import Dashboard from "./components/Pages/Dashboard/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login}  />
        <Route path="/Dashboard" Component={Dashboard}  />
      </Routes>
    </Router>
  );
}
export default App;
