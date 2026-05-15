import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import EmployeeList from "./Components/Employee/EmployeeList";
import AddEmployee from "./Components/Employee/AddEmployee";
import { Toaster } from "react-hot-toast";
import EmployeeProfile from "./Components/Employee/EmployeeProfile";
import AllReport from "./Components/Reports/AllReport";
import ComplaintForm from "./Components/Reports/ComplaintForm";
import EmployeeAssetsForm from "./Components/Reports/EmployeeAssetsForm";
import EmployeeBonusForm from "./Components/Reports/EmployeeBonusForm";
import EmployeeIncrementForm from "./Components/Reports/EmployeeIncrementForm";
import EmployeeMeetingForm from "./Components/Reports/EmployeeMeetingForm";
import EmployeeRewardForm from "./Components/Reports/EmployeeRewardForm";
import EmployeePenaltyForm from "./Components/Reports/EmployeePenaltyForm";
import EmployeeResignationForm from "./Components/Reports/EmployeeResignationForm";
import EmployeeOvertimeForm from "./Components/Reports/EmployeeOvertimeForm";



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
          <Route path="/all-report" element={<AllReport />} />
          <Route path="/add-complaint" element={<ComplaintForm />} />
          <Route path="/add-assests" element={<EmployeeAssetsForm />} />
          <Route path="/add-bonus" element={<EmployeeBonusForm />} />
          <Route path="/add-increment" element={<EmployeeIncrementForm />} />
          <Route path="/add-meeting" element={<EmployeeMeetingForm />} />
          <Route path="/add-reward" element={<EmployeeRewardForm />} />
          <Route path="/add-penalty" element={<EmployeePenaltyForm />} />
          <Route path="/add-resignation" element={<EmployeeResignationForm />} />
          <Route path="/add-overtime" element={<EmployeeOvertimeForm />} />
        </Routes>
      </Router>
    </>

  );
}

export default App;