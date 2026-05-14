import React, { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  Building2,
  CalendarDays,
  ClipboardPen,
  FileText,
  MapPin,
  ShieldAlert,
  User,
  Users,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../config/api";
import SideNav from "../SideNav";

export default function ComplaintForm() {

  const [employees, setEmployees] = useState([]);

  const [loadingEmployees, setLoadingEmployees] =
    useState(true);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    emp_id: "",
    branch_id: "",

    complaint_between: "",
    suspected_employee: "",

    full_details: "",
    remark: "",
    incident_datetime: "",
    incident_place: "",

    status: "Pending",

    complaint_raise_by: "",
    complaint_history: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {

    try {

      setLoadingEmployees(true);

      const response = await fetch(
        "https://ojmee.in/employee/get_employee"
      );

      const data = await response.json();

      console.log("EMPLOYEE API:", data);

      let employeeList = [];

      /* SUPPORT MULTIPLE API STRUCTURE */

      if (Array.isArray(data)) {

        employeeList = data;

      } else if (Array.isArray(data.data)) {

        employeeList = data.data;

      } else if (Array.isArray(data.employees)) {

        employeeList = data.employees;

      } else if (Array.isArray(data.result)) {

        employeeList = data.result;

      }

      setEmployees(employeeList);

    } catch (error) {

      console.log("Employee Fetch Error:", error);

    } finally {

      setLoadingEmployees(false);

    }

  };

  const getEmployeeId = (emp) => {

    if (!emp) return "";

    return String(
      emp.employee_id ||
      emp.emp_id ||
      emp.id ||
      ""
    );

  };

  const getEmployeeName = (emp) => {

    if (!emp) return "";

    return (
      emp.full_name ||
      emp.employee_name ||
      emp.name ||
      "Unknown"
    );

  };

  const getEmployeeBranch = (emp) => {

    if (!emp) return "";

    return (
      emp.work_location ||
      emp.branch ||
      emp.branch_name ||
      ""
    );

  };

  /* =======================================================
      SELECT MAIN EMPLOYEE
  ======================================================= */

  const handleEmployeeSelect = (e) => {

    const selectedEmpId = e.target.value;

    const selectedEmployee = employees.find(
      (emp) =>
        getEmployeeId(emp) === selectedEmpId
    );

    setFormData((prev) => ({
      ...prev,

      emp_id: selectedEmpId,

      branch_id:
        getEmployeeBranch(selectedEmployee),

      /* RESET ONLY COMPLAINT BETWEEN */
      complaint_between: "",
    }));

  };

  /* =======================================================
      NORMAL HANDLE CHANGE
  ======================================================= */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  /* =======================================================
      DROPDOWNS
  ======================================================= */

  /* EMPLOYEE
     -> SHOW ALL EMPLOYEES */

  const employeeOptions = useMemo(() => {

    return employees;

  }, [employees]);

  /* COMPLAINT BETWEEN
     -> REMOVE SELECTED EMPLOYEE */

  const complaintBetweenEmployees =
    useMemo(() => {

      return employees.filter((emp) => {

        return (
          getEmployeeId(emp) !==
          formData.emp_id
        );

      });

    }, [employees, formData.emp_id]);

  /* SUSPECTED EMPLOYEE
     -> SHOW ALL EMPLOYEES */

  const suspectedEmployees =
    useMemo(() => {

      return employees;

    }, [employees]);

  /* =======================================================
      SELECTED EMPLOYEE BRANCH
  ======================================================= */

  const selectedEmployeeData =
    employees.find(
      (emp) =>
        getEmployeeId(emp) ===
        formData.emp_id
    );

  const branchName =
    getEmployeeBranch(
      selectedEmployeeData
    );

  /* =======================================================
      SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const payload = {
        ...formData,
        branch_id: branchName,
      };

      console.log("SUBMIT PAYLOAD:", payload);

      const response = await fetch(
        `${API_BASE_URL}/emp_complaints_post`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log("SUBMIT RESPONSE:", data);

      if (data.status || data.success) {

        toast.success(
          "Complaint Added Successfully"
        );

        setFormData({
          emp_id: "",
          branch_id: "",

          complaint_between: "",
          suspected_employee: "",

          full_details: "",
          remark: "",
          incident_datetime: "",
          incident_place: "",

          status: "Pending",

          complaint_raise_by: "",
          complaint_history: "",
        });

      } else {

        toast.error(
          data.message ||
          "Failed to submit complaint"
        );

      }

    } catch (error) {

      console.log(error);

      toast.error("API Error");

    } finally {

      setLoading(false);

    }

  };


  const inputStyle =
    "w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all";

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">

      <SideNav />

      <div className="flex-1 p-4 ml-72 overflow-y-auto">

        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-white/40">

          {/* HEADER */}
          <div className="relative bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 p-8 overflow-hidden">

            <div className="absolute -top-20 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

              <div>

                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">

                  <ShieldAlert size={18} />

                  Employee Complaint System

                </div>

                <h1 className="text-4xl font-black text-white">
                  Complaint Form
                </h1>

                <p className="text-rose-100 mt-3 text-lg">
                  Submit disciplinary complaints &
                  incident reports
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl px-6 py-5 text-center">

                  <Users
                    className="mx-auto text-white"
                    size={28}
                  />

                  <div className="text-white text-2xl font-bold mt-2">
                    {employees.length}
                  </div>

                  <div className="text-rose-100 text-sm">
                    Employees
                  </div>

                </div>

                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl px-6 py-5 text-center">

                  <AlertTriangle
                    className="mx-auto text-white"
                    size={28}
                  />

                  <div className="text-white text-2xl font-bold mt-2">
                    HR
                  </div>

                  <div className="text-rose-100 text-sm">
                    Complaint Desk
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8"
          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* EMPLOYEE */}
              <div>

                <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                  <User size={18} />

                  Employee

                </label>

                <select
                  name="emp_id"
                  value={formData.emp_id}
                  onChange={handleEmployeeSelect}
                  className={inputStyle}
                  required
                >

                  <option value="">
                    {loadingEmployees
                      ? "Loading Employees..."
                      : "Select Employee"}
                  </option>

                  {employeeOptions.map(
                    (emp, index) => (

                      <option
                        key={index}
                        value={getEmployeeId(emp)}
                      >

                        {getEmployeeId(emp)}
                        {" - "}
                        {getEmployeeName(emp)}

                      </option>

                    )
                  )}

                </select>

              </div>

              {/* BRANCH */}
              <div>

                <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                  <Building2 size={18} />

                  Branch

                </label>

                <input
                  type="text"
                  value={branchName || ""}
                  readOnly
                  placeholder="Branch Auto Selected"
                  className={`${inputStyle} bg-slate-200 cursor-not-allowed`}
                />

              </div>

              {/* COMPLAINT BETWEEN */}
              <div>

                <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                  <Users size={18} />

                  Complaint Between

                </label>

                <select
                  name="complaint_between"
                  value={
                    formData.complaint_between
                  }
                  onChange={handleChange}
                  className={inputStyle}
                  required
                >

                  <option value="">
                    Select Other Employee
                  </option>

                  {complaintBetweenEmployees.map(
                    (emp, index) => (

                      <option
                        key={index}
                        value={getEmployeeId(emp)}
                      >

                        {getEmployeeId(emp)}
                        {" - "}
                        {getEmployeeName(emp)}

                      </option>

                    )
                  )}

                </select>

              </div>

              {/* SUSPECTED EMPLOYEE */}
              <div>

                <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                  <AlertTriangle size={18} />

                  Suspected Employee

                </label>

                <select
                  name="suspected_employee"
                  value={
                    formData.suspected_employee
                  }
                  onChange={handleChange}
                  className={inputStyle}
                  required
                >

                  <option value="">
                    Select Suspected Employee
                  </option>

                  {suspectedEmployees.map(
                    (emp, index) => (

                      <option
                        key={index}
                        value={getEmployeeId(emp)}
                      >

                        {getEmployeeId(emp)}
                        {" - "}
                        {getEmployeeName(emp)}

                      </option>

                    )
                  )}

                </select>

              </div>

              {/* DATE */}
              <div>

                <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                  <CalendarDays size={18} />

                  Incident Date & Time

                </label>

                <input
                  type="datetime-local"
                  name="incident_datetime"
                  value={
                    formData.incident_datetime
                  }
                  onChange={handleChange}
                  className={inputStyle}
                />

              </div>

              {/* PLACE */}
              <div>

                <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                  <MapPin size={18} />

                  Incident Place

                </label>

                <input
                  type="text"
                  name="incident_place"
                  value={
                    formData.incident_place
                  }
                  onChange={handleChange}
                  placeholder="Incident Place"
                  className={inputStyle}
                />

              </div>

              {/* STATUS */}
              <div>

                <label className="block mb-2 font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputStyle}
                >

                  <option value="Pending">
                    Pending
                  </option>

                </select>

              </div>

              {/* RAISED BY */}
              <div>

                <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                  <ClipboardPen size={18} />

                  Complaint Raise By

                </label>

                <input
                  type="text"
                  name="complaint_raise_by"
                  value={
                    formData.complaint_raise_by
                  }
                  onChange={handleChange}
                  placeholder="Raised By"
                  className={inputStyle}
                />

              </div>


              {/* REMARK */}
              <div className="md:col-span-3">

                <label className="block mb-2 font-semibold text-slate-700">
                  Remark
                </label>

                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter Remark"
                  className={inputStyle}
                />

              </div>


             

            </div>
 {/* BUTTON */}
              <div className="md:col-span-2 pt-2 mt-5 flex justify-center">

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-[320px] bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 hover:scale-[1.01] active:scale-[0.99] text-white py-4 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 disabled:opacity-60"
                >

                  {loading
                    ? "Submitting Complaint..."
                    : "Submit Complaint"}

                </button>

              </div>
          </form>

        </div>

      </div>

    </div>

  );

}