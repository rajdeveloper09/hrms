import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../SideNav";
import { API_BASE_URL } from "../../config/api";


export default function EmployeeList() {

  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEARCH + FILTER
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");

  useEffect(() => {

    fetch(`${API_BASE_URL}/get_employee`)
      .then((res) => res.json())
      .then((data) => {

        if (data.status) {
          setEmployees(data.data);
        }

        setLoading(false);

      })
      .catch((err) => {

        console.log(err);
        setLoading(false);

      });

  }, []);

  // UNIQUE DEPARTMENTS
  const departments = [
    ...new Set(employees.map((emp) => emp.department))
  ];

  // UNIQUE DESIGNATIONS
  const designations = [
    ...new Set(employees.map((emp) => emp.designation))
  ];

  // UNIQUE SHIFTS
  const shifts = [
    ...new Set(employees.map((emp) => emp.shift_time))
  ];

  // FILTER DATA
  const filteredEmployees = useMemo(() => {

    return employees.filter((emp) => {

      const matchesSearch =

        emp.full_name
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        emp.employee_id
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        emp.mobile
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesDepartment =
        !departmentFilter ||
        emp.department === departmentFilter;

      const matchesDesignation =
        !designationFilter ||
        emp.designation === designationFilter;

      const matchesStatus =
        !statusFilter ||
        emp.status === statusFilter;

      const matchesShift =
        !shiftFilter ||
        emp.shift_time === shiftFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDesignation &&
        matchesStatus &&
        matchesShift
      );

    });

  }, [
    employees,
    search,
    departmentFilter,
    designationFilter,
    statusFilter,
    shiftFilter
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">

      <SideNav />

      <div className="flex-1 p-6 ml-72 overflow-y-auto">

        {/* TOP */}
        <div className="flex justify-between items-center mb-6">

          <div className="flex items-center gap-10">

            <h1 className="text-3xl font-bold text-gray-800">
              Employee List
            </h1>

            <div className="bg-rose-100 text-rose-600 px-4 py-1 rounded-full text-sm font-semibold shadow-sm mt-1">
              {employees.length} Employees
            </div>

          </div>

          <button
            onClick={() => navigate("/add-employee")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 transition text-white px-6 py-2 rounded-full shadow-md"
          >
            Add Employee
          </button>

        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white rounded-2xl shadow-xl p-5 mb-6">

          <div className="grid grid-cols-6 gap-4">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search Name / ID / Mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* DEPARTMENT */}
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) =>
                  setDepartmentFilter(e.target.value)
                }
                className="w-full appearance-none border border-gray-200 rounded-xl pl-5 pr-10 py-3 outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="">
                  All Departments
                </option>

                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}

              </select>

              {/* ICON */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                ▼
              </div>
            </div>

            {/* DESIGNATION */}
            <div className="relative">
              <select
                value={designationFilter}
                onChange={(e) =>
                  setDesignationFilter(e.target.value)
                }
                className="w-full appearance-none border border-gray-200 rounded-xl pl-5 pr-10 py-3 outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="">
                  All Designations
                </option>

                {designations.map((des, index) => (
                  <option key={index} value={des}>
                    {des}
                  </option>
                ))}

              </select>

              {/* ICON */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                ▼
              </div>
            </div>

            {/* SHIFT */}
            <div className="relative">
              <select
                value={shiftFilter}
                onChange={(e) =>
                  setShiftFilter(e.target.value)
                }
                className="w-full appearance-none border border-gray-200 rounded-xl pl-5 pr-10 py-3 outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="">
                  All Shifts
                </option>

                {shifts.map((shift, index) => (
                  <option key={index} value={shift}>
                    {shift}
                  </option>
                ))}

              </select>

              {/* ICON */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                ▼
              </div>
            </div>

            {/* STATUS */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full appearance-none border border-gray-200 rounded-xl pl-5 pr-10 py-3 outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

              {/* ICON */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                ▼
              </div>
            </div>

            {/* CLEAR FILTER */}
            <button
              onClick={() => {
                setSearch("");
                setDepartmentFilter("");
                setDesignationFilter("");
                setShiftFilter("");
                setStatusFilter("");
              }}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:scale-105 transition text-white rounded-xl px-5 py-3 font-medium shadow-md"
            >
              Clear Filter
            </button>

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading Employees...
            </div>

          ) : filteredEmployees.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No Employees Found
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">

                  <tr className="text-left">

                    <th className="p-4">Employee</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Salary</th>
                    <th className="p-4">Shift</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredEmployees.map((emp, index) => (

                    <tr
                      key={emp.id}
                      className={`border-b hover:bg-pink-50 transition ${index % 2 === 0
                        ? "bg-white"
                        : "bg-rose-50/40"
                        }`}
                    >

                      {/* EMPLOYEE */}
                      <td className="p-4">

                        <div className="flex flex-col">

                          <span className="font-bold text-gray-800 capitalize">
                            {emp.full_name}
                          </span>

                          <span className="text-sm text-gray-500">
                            {emp.employee_id}
                          </span>

                        </div>

                      </td>

                      {/* MOBILE */}
                      <td className="p-4 text-gray-700">
                        {emp.mobile}
                      </td>

                      {/* DEPARTMENT */}
                      <td className="p-4 text-gray-700">
                        {emp.department}
                      </td>

                      {/* DESIGNATION */}
                      <td className="p-4 text-gray-700">
                        {emp.designation}
                      </td>

                      {/* SALARY */}
                      <td className="p-4">

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          ₹{Number(emp.basic_salary).toLocaleString("en-IN")}
                        </span>

                      </td>

                      {/* SHIFT */}
                      <td className="p-4 text-gray-700">
                        {emp.shift_time}
                      </td>

                      {/* STATUS */}
                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${emp.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {emp.status}
                        </span>

                      </td>

                      {/* ACTION */}
                      <td className="p-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              navigate(`/employee-profile/${emp.employee_id}`)
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            View
                          </button>

                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Edit
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}