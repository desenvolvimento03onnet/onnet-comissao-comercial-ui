import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/Pages/Login/Login.jsx";
import Dashboard from "./components/Pages/Dashboard/Dashboard.jsx";
import ValidaUsuarioLogado from "./services/validaUsuárioLogado.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login}  />
        <Route path="/Dashboard" element={
        <ValidaUsuarioLogado>
          <Dashboard />
        </ValidaUsuarioLogado>} 
        />
      </Routes>
    </Router>
  );
}
export default App;
