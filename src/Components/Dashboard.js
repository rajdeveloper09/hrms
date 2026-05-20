import { useState } from "react";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

import Chart1 from "./Charts/Chart1";
import Chart2 from "./Charts/Chart2";
import Chart3 from "./Charts/Chart3";
import Chart4 from "./Charts/Chart4";
import Chart5 from "./Charts/Chart5";
import Chart6 from "./Charts/Chart6";
import Chart7 from "./Charts/Chart7";
import Chart8 from "./Charts/Chart8";
import Chart9 from "./Charts/Chart9";
import EmployeeAdvance from "./EmployeeAdvance";
import { Chart10 } from "./Charts/Chart10";

export default function Dashboard({ setIsAuth }) {

  const stats = [
    { label: "Employees", value: 128, color: "bg-blue-400" },
    { label: "Salary Payout", value: "₹8,45,000", color: "bg-green-400" },
    { label: "On Leave", value: 12, color: "bg-yellow-400" },
    { label: "Attendance", value: "92%", color: "bg-purple-400" }
  ];

  const [employees] = useState([
    { id: 1, name: "Aman Kumar", role: "Manager", dept: "Admin", salary: 45000, status: "Active" },
    { id: 2, name: "Ravi Sharma", role: "Sales Executive", dept: "Sales", salary: 25000, status: "Active" },
    { id: 3, name: "Neha Singh", role: "HR Executive", dept: "HR", salary: 35000, status: "On Leave" },
    { id: 4, name: "John Doe", role: "Developer", dept: "IT", salary: 55000, status: "Active" },
    { id: 5, name: "Priya Verma", role: "Accountant", dept: "Finance", salary: 40000, status: "Active" }
  ]);

  return (
     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
          <SideNav />
    
           <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <TopBar setIsAuth={setIsAuth} />
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className="text-2xl font-bold text-pink-600">{s.value}</p>
            </div>
          ))}
        </div> */}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Chart4 />
          <Chart1 />
          <Chart2 /> 

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">        
         
          <Chart9 />
          <Chart8 />
          <Chart6 />
          
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Chart5 />
          <Chart7 />
          <Chart3 />
        </div>
        {/* Charts */}

        <EmployeeAdvance/>



      </div>
    </div>
  );
}