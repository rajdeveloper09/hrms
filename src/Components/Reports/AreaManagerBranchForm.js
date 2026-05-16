import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ojmee.in/employee";

export default function AreaManagerBranchForm() {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [assignedBranches, setAssignedBranches] = useState([]);

  const [form, setForm] = useState({
    emp_id: "",
    emp_name: "",
    allowed_branch_date: "",
    branches: [],
  });

  useEffect(() => {
    fetchEmployees();
    fetchBranches();
    fetchAssignedBranches();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/get_employee`);
      const data = res.data.data || [];

      const areaManagers = data.filter(
        (emp) =>
          emp.department === "Head Office" &&
          emp.designation === "Area Manager"
      );

      setEmployees(areaManagers);
    } catch (error) {
      console.log("Employee API Error:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API}/branches`);
      setBranches(res.data.data || []);
    } catch (error) {
      console.log("Branch API Error:", error);
    }
  };

  const fetchAssignedBranches = async () => {
    try {
      const res = await axios.get(`${API}/area_manager_branches`);
      setAssignedBranches(res.data.data || []);
    } catch (error) {
      console.log("Assigned API Error:", error);
    }
  };

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    const emp = employees.find((item) => item.employee_id === empId);

    if (!emp) {
      setForm({
        emp_id: "",
        emp_name: "",
        allowed_branch_date: "",
        branches: [],
      });
      return;
    }

    setForm({
      emp_id: emp.employee_id,
      emp_name: emp.full_name,
      allowed_branch_date: "",
      branches: [],
    });
  };

  const isBranchAssignedToOther = (branchId) => {
    return assignedBranches.some(
      (item) =>
        item.branch_id === branchId &&
        item.emp_id !== form.emp_id &&
        String(item.status) === "1"
    );
  };

  const handleBranchCheck = (branch) => {
    const exists = form.branches.some(
      (item) => item.branch_id === branch.branch_id
    );

    if (exists) {
      setForm((prev) => ({
        ...prev,
        branches: prev.branches.filter(
          (item) => item.branch_id !== branch.branch_id
        ),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        branches: [
          ...prev.branches,
          {
            branch_id: branch.branch_id,
            branch_name: branch.branch_name,
          },
        ],
      }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!form.emp_id) return alert("Select Area Manager");
    if (!form.allowed_branch_date) return alert("Select allowed branch date");
    if (form.branches.length === 0) return alert("Select at least one branch");

    try {
      const res = await axios.post(`${API}/area_manager_branches_post`, form);

      if (res.data.status) {
        alert(res.data.message);

        setForm({
          emp_id: "",
          emp_name: "",
          allowed_branch_date: "",
          branches: [],
        });

        fetchAssignedBranches();
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Post Error:", error);
      alert(error.response?.data?.message || error.message || "API not working");
    }
  };

  const updateStatus = async (item, status) => {
    try {
      const res = await axios.post(`${API}/area_manager_branches_update`, {
        id: item.id,
        status,
      });

      if (res.data.status) {
        alert(res.data.message);
        fetchAssignedBranches();
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (error) {
      console.log("Update Error:", error);
      alert(error.response?.data?.message || error.message || "API not working");
    }
  };

  const visibleBranches = branches.filter(
    (branch) => !isBranchAssignedToOther(branch.branch_id)
  );

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Area Manager Wise Branch
      </h1>

      <form
        onSubmit={submitForm}
        className="bg-white rounded-2xl shadow p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="label">Area Manager</label>
            <select
              value={form.emp_id}
              onChange={handleEmployeeChange}
              required
              className="input"
            >
              <option value="">Select Area Manager</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          <Input label="Employee Name" value={form.emp_name} readOnly />

          <Input
            label="Allowed Branch Date"
            type="date"
            value={form.allowed_branch_date}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                allowed_branch_date: e.target.value,
              }))
            }
            required
          />
        </div>

        <h2 className="text-lg font-bold text-slate-700 mb-3">
          Select Branches
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {visibleBranches.length === 0 ? (
            <div className="md:col-span-4 text-slate-500">
              No branch available. All branches are assigned.
            </div>
          ) : (
            visibleBranches.map((branch) => {
              const checked = form.branches.some(
                (item) => item.branch_id === branch.branch_id
              );

              return (
                <label
                  key={branch.branch_id}
                  className={`border rounded-xl p-4 cursor-pointer flex items-center gap-3 ${
                    checked
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleBranchCheck(branch)}
                  />

                  <span className="font-medium">
                    {branch.branch_name} - {branch.branch_id}
                  </span>
                </label>
              );
            })
          )}
        </div>

        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
          Save Branch Permission
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3">Emp ID</th>
              <th className="p-3">Area Manager</th>
              <th className="p-3">Branch ID</th>
              <th className="p-3">Branch Name</th>
              <th className="p-3">Allowed Date</th>
              <th className="p-3">Checkbox</th>
            </tr>
          </thead>

          <tbody>
            {assignedBranches.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-5 text-center text-slate-500">
                  No assigned branch found
                </td>
              </tr>
            ) : (
              assignedBranches.map((item) => (
                <tr key={item.id} className="border-b text-center">
                  <td className="p-3">{item.emp_id}</td>
                  <td className="p-3">{item.emp_name}</td>
                  <td className="p-3">{item.branch_id}</td>
                  <td className="p-3">{item.branch_name}</td>
                  <td className="p-3">{item.allowed_branch_date}</td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={String(item.status) === "1"}
                      onChange={(e) =>
                        updateStatus(item, e.target.checked ? 1 : 0)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}