import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import {
  Search,
  Wallet,
  User,
  RefreshCcw,
  Save,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API = "https://ojmee.in/employee";

const SALARY_TYPES = [
  { label: "Online", value: "Online" },
  { label: "Cheque", value: "Cheque" },
  { label: "Cash", value: "Cash" },
  { label: "Hold", value: "Hold" },
];

export default function UpdateEmployeeSalaryType() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/get_employee`);
      setEmployees(res.data.data || []);
    } catch {
      toast.error("Employee list fetch failed");
    }
  };

  const selectedEmployee = employees.find(
    (emp) => emp.employee_id === selectedEmpId
  );

  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return employees;

    return employees.filter((emp) =>
      [
        emp.employee_id,
        emp.full_name,
        emp.mobile,
        emp.department,
        emp.designation,
        emp.salary_type,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [employees, search]);

  const handleEmployeeSelect = (empId) => {
    const emp = employees.find((e) => e.employee_id === empId);

    setSelectedEmpId(empId);
    setSalaryType(emp?.salary_type || "Online");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmpId) {
      toast.error("Please select employee");
      return;
    }

    if (!salaryType) {
      toast.error("Please select salary type");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/update_employee_salary_type.php`, {
        employee_id: selectedEmpId,
        salary_type: salaryType,
      });

      if (res.data.status) {
        toast.success(res.data.message || "Salary type updated");

        setEmployees((prev) =>
          prev.map((emp) =>
            emp.employee_id === selectedEmpId
              ? { ...emp, salary_type: salaryType }
              : emp
          )
        );
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "API not working"
      );
    } finally {
      setLoading(false);
    }
  };

  const badgeClass = (type) => {
    if (type === "Online") return "bg-emerald-100 text-emerald-700";
    if (type === "Cheque") return "bg-blue-100 text-blue-700";
    if (type === "Cash") return "bg-amber-100 text-amber-700";
    if (type === "Hold") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster position="top-right" />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-4 md:p-6 overflow-y-auto">
        <div className="bg-gradient-to-r from-slate-900 via-pink-700 to-rose-600 rounded-[32px] p-6 text-white shadow-2xl mb-6">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Wallet /> Update Employee Salary Type
          </h1>

          <p className="text-pink-100 mt-2">
            Online, Cheque, Cash ya Hold salary type update karein
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] shadow-2xl border border-pink-100 overflow-hidden">
            <div className="bg-slate-900 text-white p-5">
              <h2 className="text-xl font-black">Salary Type Form</h2>
              <p className="text-sm text-slate-300">
                Employee select karke salary type update karein
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="label">
                  <User size={17} /> Select Employee
                </label>

                <select
                  value={selectedEmpId}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select Employee</option>

                  {employees.map((emp) => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_id} - {emp.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEmployee && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pink-50 border border-pink-100 rounded-3xl p-5">
                  <Info title="Employee ID" value={selectedEmployee.employee_id} />
                  <Info title="Name" value={selectedEmployee.full_name} />
                  <Info title="Department" value={selectedEmployee.department} />
                  <Info title="Designation" value={selectedEmployee.designation} />
                  <Info
                    title="Current Salary Type"
                    value={selectedEmployee.salary_type || "Online"}
                  />
                  <Info
                    title="Salary"
                    value={`₹${(
                      Number(selectedEmployee.basic_salary || 0) +
                      Number(selectedEmployee.allowances || 0)
                    ).toLocaleString("en-IN")}`}
                  />
                </div>
              )}

              <div>
                <label className="label">
                  <Wallet size={17} /> Salary Type
                </label>

                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select Salary Type</option>

                  {SALARY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-60"
              >
                <Save size={18} />
                {loading ? "Updating..." : "Update Salary Type"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-[32px] shadow-2xl border border-pink-100 overflow-hidden">
            <div className="bg-slate-900 text-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">Employee Salary Type List</h2>
                  <p className="text-sm text-slate-300">
                    Total Employees: {employees.length}
                  </p>
                </div>

                <button
                  onClick={fetchEmployees}
                  className="bg-white text-pink-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                  <RefreshCcw size={16} />
                  Refresh
                </button>
              </div>

              <div className="relative mt-4">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-pink-50 text-slate-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Salary Type</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500">
                        No employee found
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr
                        key={emp.employee_id}
                        className="border-b text-center hover:bg-pink-50/60"
                      >
                        <td className="p-3">
                          <div className="font-black text-slate-800">
                            {emp.employee_id}
                          </div>
                          <div className="text-xs text-slate-500">
                            {emp.full_name}
                          </div>
                        </td>

                        <td className="p-3">
                          <div>{emp.department || "-"}</div>
                          <div className="text-xs text-slate-500">
                            {emp.designation || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black ${badgeClass(
                              emp.salary_type || "Online"
                            )}`}
                          >
                            {emp.salary_type || "Online"}
                          </span>
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleEmployeeSelect(emp.employee_id)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <style>{`
          .label {
            display: flex;
            align-items: center;
            gap: 7px;
            margin-bottom: 8px;
            font-weight: 800;
            color: #334155;
          }

          .input {
            width: 100%;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            border-radius: 18px;
            padding: 14px 16px;
            outline: none;
            font-weight: 700;
          }

          .input:focus {
            border-color: #ec4899;
            box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.13);
            background: white;
          }
        `}</style>
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-pink-100">
      <p className="text-xs font-black text-pink-500 uppercase">{title}</p>
      <h3 className="text-sm font-black text-slate-800 mt-1 break-words">
        {value || "-"}
      </h3>
    </div>
  );
}