import React, { useEffect, useState } from "react";

import {
  AlertTriangle,
  Building2,
  CalendarDays,
  ClipboardPen,
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

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] = useState({

    emp_id: "",
    branch_id: "",

    complaint_type: "Emp vs Emp",

    second_employee_id: "",
    other_person_name: "",

    suspected_type: "Employee",

    suspected_employee: "",

    remark: "",
    incident_datetime: "",
    incident_place: "",

    status: "Pending",

    complaint_raise_by: "",

  });
  /* ======================================================
      FETCH EMPLOYEES
  ====================================================== */

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

      let employeeList = [];

      if (Array.isArray(data)) {

        employeeList = data;

      } else if (Array.isArray(data.data)) {

        employeeList = data.data;

      } else if (Array.isArray(data.result)) {

        employeeList = data.result;

      }

      setEmployees(employeeList);

      /* AUTO SELECT FIRST EMPLOYEE */


    } catch (error) {

      console.log(error);

      toast.error("Failed to load employees");

    } finally {

      setLoadingEmployees(false);

    }

  };

  /* ======================================================
      HELPERS
  ====================================================== */

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
      ""
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

  /* ======================================================
      SELECTED EMPLOYEE DATA
  ====================================================== */

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

  /* ======================================================
      MAIN EMPLOYEE CHANGE
  ====================================================== */

  const handleEmployeeSelect = (e) => {

    const selectedEmpId =
      e.target.value;

    const selectedEmployee =
      employees.find(
        (emp) =>
          getEmployeeId(emp) ===
          selectedEmpId
      );

    setFormData((prev) => ({

      ...prev,

      emp_id: selectedEmpId,
      suspected_type: "Employee",
      branch_id:
        getEmployeeBranch(
          selectedEmployee
        ),

      second_employee_id: "",
      suspected_employee: "",

    }));

  };

  /* ======================================================
      HANDLE CHANGE
  ====================================================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => {

      /* =====================================
         SUSPECTED TYPE CHANGE
      ===================================== */

      if (name === "suspected_type") {

        return {

          ...prev,

          suspected_type: value,

          /* AUTO SET */

          suspected_employee:
            value === "Other"
              ? "Other"
              : "",

        };

      }

      return {

        ...prev,

        [name]: value,

      };

    });

  };

  /* ======================================================
    SECOND EMPLOYEE OPTIONS
    -> HIDE FIRST EMPLOYEE
====================================================== */

  const secondEmployeeOptions =
    employees.filter(
      (emp) =>
        getEmployeeId(emp) !==
        formData.emp_id
    );

  /* ======================================================
     SUSPECTED EMPLOYEE OPTIONS
 ====================================================== */

  let suspectedEmployeeOptions = [];

  /* =========================================
     EMP vs EMP
     -> SHOW FIRST + SECOND EMPLOYEE
  ========================================= */

  if (
    formData.complaint_type ===
    "Emp vs Emp"
  ) {

    suspectedEmployeeOptions =
      employees.filter((emp) => {

        const empId =
          getEmployeeId(emp);

        return (

          empId ===
          formData.emp_id ||

          empId ===
          formData.second_employee_id

        );

      });

  }

  /* =========================================
     EMP vs OTHER
     -> SHOW ONLY FIRST EMPLOYEE
  ========================================= */

  else {

    suspectedEmployeeOptions =
      employees.filter((emp) => {

        return (
          getEmployeeId(emp) ===
          formData.emp_id
        );

      });

  }

  /* ======================================================
      SUBMIT
  ====================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const payload = {

        ...formData,

        branch_id: branchName,

        complaint_between:
          formData.complaint_type ===
            "Emp vs Emp"
            ? formData.second_employee_id
            : formData.other_person_name,

      };

      console.log(
        "SUBMIT PAYLOAD:",
        payload
      );

      const response =
        await fetch(
          `${API_BASE_URL}/emp_complaints_post`,
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),

          }
        );

      const data =
        await response.json();

      console.log(data);

      if (
        data.success ||
        data.status
      ) {

        toast.success(
          "Complaint Added Successfully"
        );

        const firstEmployee =
          employees?.[0];

        setFormData({

          emp_id: firstEmployee
            ? getEmployeeId(
              firstEmployee
            )
            : "",

          branch_id: firstEmployee
            ? getEmployeeBranch(
              firstEmployee
            )
            : "",

          complaint_type:
            "Emp vs Emp",

          second_employee_id: "",
          other_person_name: "",

          suspected_employee: "",

          remark: "",
          incident_datetime: "",
          incident_place: "",

          status: "Pending",

          complaint_raise_by: "",

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

  /* ======================================================
      FILTER EMPLOYEES
  ====================================================== */

  const filteredEmployees =
    employees.filter(
      (emp) =>
        getEmployeeId(emp) !==
        formData.emp_id
    );

  const inputStyle =
    "w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all";

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">

      <Toaster />

      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">

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
                      ? "Loading..."
                      : "Select Employee"}
                  </option>

                  {employees.map(
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
                  readOnly
                  value={branchName || ""}
                  className={`${inputStyle} bg-slate-200 cursor-not-allowed`}
                />

              </div>

              {/* COMPLAINT TYPE */}

              <div>

                <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                  <Users size={18} />

                  Complaint Type

                </label>

                <select
                  name="complaint_type"
                  value={
                    formData.complaint_type
                  }
                  onChange={handleChange}
                  className={inputStyle}
                >

                  <option value="Emp vs Emp">
                    Emp vs Emp
                  </option>

                  <option value="Emp vs Other">
                    Emp vs Other
                  </option>

                </select>

              </div>

              {/* EMP VS EMP */}

              {formData.complaint_type ===
                "Emp vs Emp" ? (

                <>
                  {/* SECOND EMPLOYEE */}

                  <div>

                    <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                      <Users size={18} />

                      Complaint Between

                    </label>

                    <select
                      name="second_employee_id"
                      value={
                        formData.second_employee_id
                      }
                      onChange={handleChange}
                      className={inputStyle}
                      required
                    >

                      <option value="">
                        Select Second Employee
                      </option>

                      {secondEmployeeOptions.map(
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
                      value={formData.suspected_employee}
                      onChange={handleChange}
                      className={inputStyle}
                      required
                    >

                      <option value="">
                        Select Suspected Employee
                      </option>

                      {suspectedEmployeeOptions.map((emp) => (

                        <option
                          key={getEmployeeId(emp)}
                          value={getEmployeeId(emp)}
                        >

                          {getEmployeeId(emp)}
                          {" - "}
                          {getEmployeeName(emp)}

                        </option>

                      ))}

                    </select>

                  </div>
                </>

              ) : (

                <>
                  {/* OTHER PERSON */}

                  <div>

                    <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                      <Users size={18} />

                      Other Person Name

                    </label>

                    <input
                      type="text"
                      name="other_person_name"
                      value={
                        formData.other_person_name
                      }
                      onChange={handleChange}
                      placeholder="Enter Other Person Name"
                      className={inputStyle}
                      required
                    />

                  </div>

                  {/* SUSPECTED TYPE */}

                  <div>

                    <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                      <AlertTriangle size={18} />

                      Suspected Type

                    </label>

                    <select
                      name="suspected_type"
                      value={formData.suspected_type}
                      onChange={handleChange}
                      className={inputStyle}
                    >

                      <option value="Employee">
                        Employee
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* SUSPECTED EMPLOYEE / OTHER */}

                  <div>

                    <label className="flex items-center gap-2 mb-2 font-semibold text-slate-700">

                      <AlertTriangle size={18} />

                      Suspected Employee

                    </label>

                    {formData.suspected_type === "Employee" ? (

                      <select
                        name="suspected_employee"
                        value={formData.suspected_employee}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                      >

                        <option value="">
                          Select Employee
                        </option>

                        {suspectedEmployeeOptions.map((emp) => (

                          <option
                            key={emp.id}
                            value={getEmployeeId(emp)}
                          >

                            {getEmployeeId(emp)}
                            {" - "}
                            {getEmployeeName(emp)}

                          </option>

                        ))}

                      </select>

                    ) : (

                      <input
                        type="text"
                        name="suspected_employee"
                        value={formData.suspected_employee}
                        onChange={handleChange}
                        placeholder="Enter Suspected Person"
                        className={inputStyle}
                        required
                        readOnly
                      />

                    )}

                  </div>
                </>

              )}

              {/* INCIDENT DATE */}

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

              {/* INCIDENT PLACE */}

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
                  required
                />

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
                  required
                />

              </div>

              {/* REMARK */}

              <div className="md:col-span-3">

                <label className="block mb-2 font-semibold text-slate-700">

                  Remark

                </label>

                <textarea
                  name="remark"
                  rows="4"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Enter Remark"
                  className={inputStyle}
                  required
                />

              </div>

            </div>

            {/* BUTTON */}

            <div className="pt-8 flex justify-center">

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-[320px] bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 hover:scale-[1.01] active:scale-[0.99] text-white py-4 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 disabled:opacity-60"
              >

                {loading
                  ? "Submitting..."
                  : "Submit Complaint"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
    </div>

  );

}