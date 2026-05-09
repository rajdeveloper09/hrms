import React from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../SideNav";

export default function EmployeeList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <SideNav />

      <div className="flex-1 p-6 ml-72 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Employee List
          </h1>

          <button
            onClick={() => navigate("/add-employee")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 transition text-white px-6 py-2 rounded-full shadow-md"
          >
            Add Employee
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>No employees yet...</p>
        </div>
      </div>
    </div>
  );
}
