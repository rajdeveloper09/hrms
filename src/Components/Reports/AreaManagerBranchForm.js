import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import { Toaster } from "react-hot-toast";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const API = "https://ojmee.in/employee";
const CURRENT_PATH = "/add-areaManagerBranch";

const cleanText = (value) =>
  String(value || "").toLowerCase().replace(/\s+/g, "").trim();

export default function AreaManagerBranchForm() {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [assignedBranches, setAssignedBranches] = useState([]);
  const [activeEmpTab, setActiveEmpTab] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    emp_id: "",
    emp_name: "",
    allowed_branch_date: "",
    branches: [],
  });

  const role = localStorage.getItem("role") || "view";
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  const pagePermission =
    role === "superAdmin"
      ? { can_view: 1, can_add: 1, can_edit: 1, can_delete: 1 }
      : permissions.find((p) => p.route_path === CURRENT_PATH) || {};

  const canView = role === "superAdmin" || Number(pagePermission.can_view) === 1;
  const canAdd = role === "superAdmin" || Number(pagePermission.can_add) === 1;
  const canEdit = role === "superAdmin" || Number(pagePermission.can_edit) === 1;
  const canDelete = role === "superAdmin" || Number(pagePermission.can_delete) === 1;

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

  const activeAssignedEmpIds = [
    ...new Set(
      assignedBranches
        .filter((item) => String(item.status) === "1")
        .map((item) => item.emp_id)
    ),
  ];

  const availableEmployees = employees.filter(
    (emp) => !activeAssignedEmpIds.includes(emp.employee_id)
  );

  const activeAssignedBranchIds = assignedBranches
    .filter((item) => String(item.status) === "1")
    .map((item) => item.branch_id);

  const visibleBranches = branches.filter(
    (branch) => !activeAssignedBranchIds.includes(branch.branch_id)
  );

  const handleEmployeeChange = (e) => {
    if (!canAdd) return alert("You do not have add permission");

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

  const handleBranchCheck = (branch) => {
    if (!canAdd) return alert("You do not have add permission");

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

    if (!canAdd) return alert("You do not have add permission");
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
    if (!canEdit) return alert("You do not have edit permission");

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

  const groupedAssigned = useMemo(() => {
    const map = {};

    assignedBranches.forEach((item) => {
      if (!map[item.emp_id]) {
        map[item.emp_id] = {
          emp_id: item.emp_id,
          emp_name: item.emp_name,
          branches: [],
        };
      }

      map[item.emp_id].branches.push(item);
    });

    return Object.values(map);
  }, [assignedBranches]);

  const filteredGroupedAssigned = useMemo(() => {
    const q = cleanText(search);
    if (!q) return groupedAssigned;

    return groupedAssigned
      .map((emp) => {
        const empSearchText = cleanText(`${emp.emp_id} ${emp.emp_name}`);
        const employeeMatched = empSearchText.includes(q);

        const matchedBranches = emp.branches.filter((branch) => {
          const branchSearchText = cleanText(
            `${branch.branch_id} ${branch.branch_name}`
          );

          return branchSearchText.includes(q);
        });

        if (employeeMatched) return emp;

        if (matchedBranches.length > 0) {
          return {
            ...emp,
            branches: matchedBranches,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [groupedAssigned, search]);

  useEffect(() => {
    if (filteredGroupedAssigned.length > 0) {
      const exists = filteredGroupedAssigned.some(
        (emp) => emp.emp_id === activeEmpTab
      );

      if (!activeEmpTab || !exists) {
        setActiveEmpTab(filteredGroupedAssigned[0].emp_id);
      }
    } else {
      setActiveEmpTab("");
    }
  }, [filteredGroupedAssigned, activeEmpTab]);

  const activeEmployee = filteredGroupedAssigned.find(
    (emp) => emp.emp_id === activeEmpTab
  );

  if (!canView) {
    return (
      <div className="min-h-screen bg-slate-100 flex">
        <SideNav />
        <div className="flex-1 lg:ml-72 p-6">
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
            <h1 className="text-2xl font-black text-red-600">Access Denied</h1>
            <p className="text-slate-500 mt-2">
              You do not have permission to view this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const blockedBox = (text) => (
    <div className="mt-6 w-full bg-yellow-50 border border-yellow-200 text-yellow-700 py-3 rounded-2xl font-black text-center">
      {text}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
          <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 p-5 text-white shadow-xl pl-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black">
                  Area Manager Wise Branch
                </h1>
                <p className="text-rose-100 mt-1">
                  Assign branches and view employee-wise branch permission
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TopBox title="Area Managers" value={employees.length} />
                <TopBox title="Assigned" value={assignedBranches.length} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <form
              onSubmit={submitForm}
              className="bg-white rounded-3xl shadow-xl border border-rose-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <ShieldCheck size={25} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-800">
                    Assign Branch Permission
                  </h2>
                  <p className="text-sm text-slate-500">
                    {canAdd
                      ? "Select Area Manager and allowed branches"
                      : "View only user cannot assign new branches"}
                  </p>
                </div>
              </div>

              {canAdd ? (
                <>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-bold text-slate-600">
                        Area Manager
                      </label>
                      <select
                        value={form.emp_id}
                        onChange={handleEmployeeChange}
                        required
                        className="mt-1 w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                      >
                        <option value="">Select Area Manager</option>
                        {availableEmployees.map((emp) => (
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

                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-black text-slate-800">
                      Select Branches
                    </h2>

                    <span className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                      Selected: {form.branches.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
                    {visibleBranches.length === 0 ? (
                      <div className="md:col-span-2 text-slate-500 bg-slate-50 rounded-2xl p-5 text-center">
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
                            className={`rounded-2xl p-4 cursor-pointer flex items-start gap-3 border transition-all ${
                              checked
                                ? "bg-rose-50 border-rose-500 shadow-md"
                                : "bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/40"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleBranchCheck(branch)}
                              className="mt-1 w-5 h-5 accent-rose-600"
                            />

                            <span>
                              <span className="block font-black text-slate-800">
                                {branch.branch_name}
                              </span>
                              <span className="text-xs text-slate-500">
                                {branch.branch_id}
                              </span>
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>

                  <button className="mt-6 w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 text-white py-3 rounded-2xl font-black shadow-lg">
                    Save Branch Permission
                  </button>
                </>
              ) : (
                blockedBox("View Only Permission - Add Not Allowed")
              )}
            </form>

            <div className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-900 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black">
                      Assigned Branch Result
                    </h2>
                    <p className="text-sm text-slate-300">
                      Employee ID, employee name, branch ID, branch name wise
                      search
                    </p>
                  </div>

                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-3 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search emp / branch..."
                      className="h-11 w-full md:w-72 rounded-xl bg-white text-slate-800 border border-white/20 pl-10 pr-3 outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
              </div>

              {filteredGroupedAssigned.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  No assigned branch found
                </div>
              ) : (
                <>
                  <div className="flex gap-3 overflow-x-auto p-4 bg-rose-50 border-b border-rose-100">
                    {filteredGroupedAssigned.map((emp) => (
                      <button
                        key={emp.emp_id}
                        onClick={() => setActiveEmpTab(emp.emp_id)}
                        className={`min-w-max px-5 py-3 rounded-2xl font-black transition-all ${
                          activeEmpTab === emp.emp_id
                            ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg"
                            : "bg-white text-slate-700 border border-rose-100 hover:bg-rose-100"
                        }`}
                      >
                        {emp.emp_id} - {emp.emp_name}
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            activeEmpTab === emp.emp_id
                              ? "bg-white/20 text-white"
                              : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          {emp.branches.length}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-5 max-h-[650px] overflow-y-auto">
                    {activeEmployee && (
                      <>
                        <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                              <UserRound size={27} />
                            </div>

                            <div>
                              <h3 className="text-xl font-black text-slate-800">
                                {activeEmployee.emp_id} -{" "}
                                {activeEmployee.emp_name}
                              </h3>
                              <p className="text-sm text-slate-500">
                                Total matched branches:{" "}
                                {activeEmployee.branches.length}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-2xl bg-rose-50 border border-rose-100 px-5 py-3">
                            <p className="text-xs font-bold text-rose-500">
                              Active Branches
                            </p>
                            <h4 className="text-2xl font-black text-rose-700">
                              {
                                activeEmployee.branches.filter(
                                  (b) => String(b.status) === "1"
                                ).length
                              }
                            </h4>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {activeEmployee.branches.map((item) => (
                            <div
                              key={item.id}
                              className={`rounded-3xl border p-4 shadow-sm hover:shadow-xl transition-all ${
                                String(item.status) === "1"
                                  ? "bg-emerald-50 border-emerald-200"
                                  : "bg-slate-50 border-slate-200"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-black text-slate-800 text-lg">
                                    {item.branch_name}
                                  </h4>
                                  <p className="text-sm text-slate-500">
                                    Branch ID: {item.branch_id}
                                  </p>
                                </div>

                                <div className="w-11 h-11 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-sm">
                                  <MapPin size={21} />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-5">
                                <InfoBox
                                  icon={<CalendarDays size={16} />}
                                  title="Allowed Date"
                                  value={item.allowed_branch_date || "N/A"}
                                />

                                <InfoBox
                                  icon={
                                    String(item.status) === "1" ? (
                                      <CheckCircle2 size={16} />
                                    ) : (
                                      <Building2 size={16} />
                                    )
                                  }
                                  title="Status"
                                  value={
                                    String(item.status) === "1"
                                      ? "Active"
                                      : "Inactive"
                                  }
                                  active={String(item.status) === "1"}
                                />
                              </div>

                              {canEdit ? (
                                <label className="mt-5 flex items-center justify-between rounded-2xl bg-white border px-4 py-3 cursor-pointer">
                                  <span className="text-sm font-black text-slate-700">
                                    Branch Permission
                                  </span>

                                  <input
                                    type="checkbox"
                                    checked={String(item.status) === "1"}
                                    onChange={(e) =>
                                      updateStatus(
                                        item,
                                        e.target.checked ? 1 : 0
                                      )
                                    }
                                    className="w-5 h-5 accent-rose-600"
                                  />
                                </label>
                              ) : (
                                <div className="mt-5 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 text-center font-black text-sm">
                                  View Only - Edit Not Allowed
                                </div>
                              )}

                              {!canDelete && (
                                <p className="text-[11px] text-slate-400 mt-3 text-center">
                                  Delete permission not assigned
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBox({ title, value }) {
  return (
    <div className="rounded-2xl bg-white/15 px-5 py-3">
      <p className="text-xs text-rose-100">{title}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-600">{label}</label>
      <input
        {...props}
        className="mt-1 w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:ring-2 focus:ring-rose-500 bg-white disabled:bg-slate-100"
      />
    </div>
  );
}

function InfoBox({ title, value, icon, active }) {
  return (
    <div className="rounded-2xl bg-white p-3 border">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-bold">{title}</p>
      </div>

      <h5
        className={`font-black mt-1 text-sm ${
          active ? "text-emerald-600" : "text-slate-800"
        }`}
      >
        {value}
      </h5>
    </div>
  );
}