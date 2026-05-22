import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDefaultRedirect } from "./utils/permissionRedirect";
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
import EmployeeTransferForm from "./Components/Reports/EmployeeTransferForm";
import EmployeeAdvanceForm from "./Components/Reports/EmployeeAdvanceForm";
import EmployeeExpensesForm from "./Components/Reports/EmployeeExpensesForm";
import AreaManagerBranchForm from "./Components/Reports/AreaManagerBranchForm";
import Welcome from "./Components/Welcome";
import EmployeeEsicPfForm from "./Components/Reports/EmployeeEsicPfForm";
import AddOfficeAssetsForm from "./Components/Reports/AddOfficeAssetsForm";
import AddOfficeAssetsCategory from "./Components/Reports/AddOfficeAssetsCategory";
import CreateLoginNewUser from "./Components/CreateLoginNewUser";
import EmployeePermissionPage from "./Components/EmployeePermissionPage";
import EmployeeAssetsListForm from "./Components/Reports/EmployeeAssetsListForm"
import FinalSalaryCurrentMonth from "./Components/Reports/FinalSalaryCurrentMonth"


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
              isAuth ? (
                <Navigate to={getDefaultRedirect()} replace />
              ) : (
                <Login setIsAuth={setIsAuth} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuth ? <Dashboard setIsAuth={setIsAuth} /> : <Navigate to="/" />
            }
          >
          </Route>

          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/welcome" element={isAuth ? <Welcome /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />

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
          <Route path="/add-transfer" element={<EmployeeTransferForm />} />
          <Route path="/add-advance" element={<EmployeeAdvanceForm />} />
          <Route path="/add-expenses" element={<EmployeeExpensesForm />} />
          <Route path="/add-areaManagerBranch" element={<AreaManagerBranchForm />} />
          <Route path="/add-EsicPf" element={<EmployeeEsicPfForm />} />
          <Route path="/add-office-assets" element={<AddOfficeAssetsForm />} />
          <Route path="/add-office-assets-category" element={<AddOfficeAssetsCategory />} />
          <Route path="/create-user" element={<CreateLoginNewUser />} />
          <Route path="/create-user-permission" element={<EmployeePermissionPage />} />
          <Route path="/add-employee-assets-list" element={<EmployeeAssetsListForm />} />
          <Route path="/final-salary" element={<FinalSalaryCurrentMonth />} />
        </Routes>
      </Router>
    </>

  );
}

export default App;