import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from "recharts";
import SideNav from "./SideNav";
import TopBar from "./TopBar";

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

  const payrollData = [
    { name: "Aman Kumar", branch: "Delhi", salary: 45000, status: "Paid" },
    { name: "Ravi Sharma", branch: "Mumbai", salary: 25000, status: "Pending" },
    { name: "Neha Singh", branch: "Delhi", salary: 35000, status: "Paid" },
    { name: "John Doe", branch: "Bangalore", salary: 55000, status: "Pending" },
    { name: "Priya Verma", branch: "Mumbai", salary: 40000, status: "Paid" }
  ];

  const [branch, setBranch] = useState("All");

  const filteredData =
    branch === "All"
      ? payrollData
      : payrollData.filter(emp => emp.branch === branch);



  const attendanceData = [
    { name: "Mon", present: 70, late: 25, leave: 5 },
    { name: "Tue", present: 77, late: 20, leave: 3 },
    { name: "Wed", present: 70, late: 20, leave: 10 },
    { name: "Thu", present: 90, late: 5, leave: 5 },
    { name: "Fri", present: 88, late: 7, leave: 5 },
    { name: "Sat", present: 88, late: 7, leave: 5 },
    { name: "Sun", present: 88, late: 7, leave: 5 }
  ];

  const roleDataByBranch = {
    Delhi: [
      { name: "Staff", value: 40 },
      { name: "Manager", value: 15 },
      { name: "Area Manager", value: 8 },
      { name: "Cashier", value: 20 },
      { name: "Accountant", value: 10 },
    ],
    Mumbai: [
      { name: "Staff", value: 50 },
      { name: "Manager", value: 18 },
      { name: "Area Manager", value: 10 },
      { name: "Cashier", value: 22 },
      { name: "Accountant", value: 12 },
    ],
    Bangalore: [
      { name: "Staff", value: 35 },
      { name: "Manager", value: 12 },
      { name: "Area Manager", value: 6 },
      { name: "Cashier", value: 18 },
      { name: "Accountant", value: 9 },
    ],
  };

  const COLORS = ["#ec4899", "#3b82f6", "#22c55e", "#f97316", "#a855f7"];

  const [selectedBranchRole, setSelectedBranchRole] = useState("All");
  const getAllBranchRoleData = () => {
    const result = {};

    Object.values(roleDataByBranch).forEach((branch) => {
      branch.forEach((item) => {
        result[item.name] = (result[item.name] || 0) + item.value;
      });
    });

    return Object.keys(result).map((key) => ({
      name: key,
      value: result[key],
    }));
  };

  const roleData =
    selectedBranchRole === "All"
      ? getAllBranchRoleData()
      : roleDataByBranch[selectedBranchRole];

  // Multi-branch complaint comparison data
  const complaintComparisonData = [
    { month: "Jan", Delhi: 40, Mumbai: 35, Bangalore: 30 },
    { month: "Feb", Delhi: 55, Mumbai: 45, Bangalore: 50 },
    { month: "Mar", Delhi: 30, Mumbai: 25, Bangalore: 40 },
    { month: "Apr", Delhi: 70, Mumbai: 60, Bangalore: 65 },
    { month: "May", Delhi: 50, Mumbai: 55, Bangalore: 60 },
    { month: "Jun", Delhi: 50, Mumbai: 45, Bangalore: 50 },
  ];
  const [selectedBranch, setSelectedBranch] = useState("All");
  const branches = ["Delhi", "Mumbai", "Bangalore"];
  const branchTotals = branches.map((b) => ({
    name: b,
    total: complaintComparisonData.reduce((acc, item) => acc + item[b], 0),
  }));

  // Multi-branch complaint comparison data

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">

      {/* Sidebar */}
      <SideNav />

      {/* Main */}
      <div className="flex-1 ml-72 p-3 overflow-y-auto">

        {/* Top Bar */}
        <TopBar setIsAuth={setIsAuth} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className="text-2xl font-bold text-pink-600">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          <div className="bg-white rounded-2xl shadow-lg p-5">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">

              <h3 className="font-semibold text-gray-700">Attendance</h3>

              {/* Branch Dropdown */}
              <select
                className="text-xs border border-gray-300 rounded-lg px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option>All Branch</option>
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Hyderabad</option>
              </select>

            </div>

            {/* Chart */}
            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={attendanceData} barGap={2}>

                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis hide />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}
                  />

                  {/* ✅ 3 Bars */}
                  <Bar dataKey="present" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="late" fill="#facc15" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="leave" fill="#ef4444" radius={[6, 6, 0, 0]} />

                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Row */}
            <div className="flex justify-center gap-6 mt-4 text-xs font-medium">

              <span className="flex items-center gap-1 text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Present
              </span>

              <span className="flex items-center gap-1 text-yellow-500">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Late
              </span>

              <span className="flex items-center gap-1 text-red-500">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Leave
              </span>

            </div>

          </div>



          <div className="bg-white rounded-2xl shadow-lg p-5 h-[330px] flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Payroll</h3>
                <p className="text-xs text-gray-400">Employee Salary</p>
              </div>

              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="text-xs border border-gray-300 rounded-lg px-3 py-1 bg-white shadow-sm focus:ring-2 focus:ring-pink-400"
              >
                <option value="All">All Branch</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>

            {/* Employee List */}
            <div className="space-y-3 overflow-y-auto flex-1 pr-1" width="100%" height={200}>

              {filteredData.map((emp, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 hover:bg-pink-50 transition p-3 rounded-xl"
                >

                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center text-sm font-bold text-pink-600">
                      {emp.name[0]}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {emp.name}
                      </p>
                      <p className="text-xs text-gray-400">{emp.branch}</p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">
                      ₹{emp.salary}
                    </p>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${emp.status === "Paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                        }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* Complaint Comparison */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">
                Branch Wise Complaints
              </h3>
              <select
                className="text-xs border border-gray-300 rounded-lg px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="All">All Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={complaintComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                {(selectedBranch === "All" || selectedBranch === "Delhi") && (
                  <Line type="monotone" dataKey="Delhi" stroke="#3b82f6" strokeWidth={2} />
                )}
                {(selectedBranch === "All" || selectedBranch === "Mumbai") && (
                  <Line type="monotone" dataKey="Mumbai" stroke="#10b981" strokeWidth={2} />
                )}
                {(selectedBranch === "All" || selectedBranch === "Bangalore") && (
                  <Line type="monotone" dataKey="Bangalore" stroke="#f59e0b" strokeWidth={2} />
                )}
              </LineChart>
            </ResponsiveContainer>

            {/* Bottom Branch Summary */}
            <div className="mt-4 overflow-x-auto whitespace-nowrap flex gap-4">
              {branchTotals.map((b) => (
                <div
                  key={b.name}
                  className="min-w-[auto] bg-gray-50 rounded-xl p-3 shadow-sm"
                >
                  <p className="text-sm text-gray-600">{b.name}-{b.total}</p>
                </div>
              ))}
            </div>
          </div>




        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Donut + List */}
          <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col md:flex-row items-center justify-between">


            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-700">
                  Staff Distribution
                </h3>
                <select
                  className="text-xs border border-gray-300 rounded-lg px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={selectedBranchRole}
                  onChange={(e) => setSelectedBranchRole(e.target.value)}
                >
                  <option value="All">All Branch</option>
                  {Object.keys(roleDataByBranch).map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    outerRadius={90}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {roleData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right List */}
            <div className="w-full md:w-1/2 mt-0 md:mt-0 md:pl-4">

              <div className="space-y-3 max-h-[260px] overflow-y-auto">
                {roleData.map((r, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[i % COLORS.length],
                        }}
                      />
                      <p className="text-sm text-gray-700">{r.name}</p>
                    </div>

                    <p className="font-bold text-gray-800">
                      {r.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>





        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Employee List
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="p-2 text-left">Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b hover:bg-pink-50 transition">
                  <td className="p-2 font-medium">{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.dept}</td>
                  <td>₹{emp.salary}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs text-white ${emp.status === "Active"
                        ? "bg-green-400"
                        : "bg-red-400"
                        }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}