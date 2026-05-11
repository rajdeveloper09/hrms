import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import EmployeeList from "./Components/Employee/EmployeeList";
import AddEmployee from "./Components/Employee/AddEmployee";
import { Toaster } from "react-hot-toast";
import EmployeeProfile from "./Components/Employee/EmployeeProfile";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  // ✅ refresh ke baad bhi login maintain
  useEffect(() => {
    const loginStatus = localStorage.getItem("login") === "true";
    setIsAuth(loginStatus);
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Router>
        <Routes>

          <Route
            path="/"
            element={
              isAuth ? <Navigate to="/dashboard" /> : <Login setIsAuth={setIsAuth} />
            }
          />

          <Route
            path="/dashboard"
            element={
              isAuth ? <Dashboard setIsAuth={setIsAuth} /> : <Navigate to="/" />
            }
          >

          </Route>
          <Route path="/employees-list" element={<EmployeeList />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/employee-profile/:employee_id" element={<EmployeeProfile />} />
        </Routes>
      </Router>
    </>

  );
}

export default App;