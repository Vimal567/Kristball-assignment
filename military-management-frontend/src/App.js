import { useState, useEffect } from "react";
import "./Styles.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Purchases from "./pages/Purchases/Purchases";
import Transfers from "./pages/Transfers/Transfers";
import Expenditures from "./pages/Expenditures/Expenditures";
import api from "./services/api";
import Register from "./pages/Register/Register";

function App() {
  const [user, setUser] = useState({
    "id": "",
    "name": "",
    "email": "",
    "role": "",
    "baseId": ""
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      setUser(JSON.parse(userStr));
      api.setToken(token);
      if (location.pathname === "/login") {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const handleLogin = (token, userObj) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    api.setToken(token);
    setUser(userObj);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.setToken(null);
    setUser({
      "id": "",
      "name": "",
      "email": "",
      "role": "",
      "baseId": ""
    }
    );
    navigate("/login");
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/purchases" element={<Purchases user={user} />} />
          <Route path="/transfers" element={<Transfers user={user} />} />
          <Route path="/expenditures" element={<Expenditures user={user} />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
