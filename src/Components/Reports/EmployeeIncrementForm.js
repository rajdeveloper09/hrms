import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  IndianRupee,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Save,
  CheckCircle2,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import SideNav from "../SideNav";
import { Toaster } from "react-hot-toast";

const API_BASE = "https://ojmee.in/employee";
const CURRENT_PATH = "/add-increment";

export default function EmployeeIncrementDashboard() {
  const [employees, setEmployees] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");
  const [forms, setForms] = useState({});

  const role = localStorage.getItem("role") || "view";
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  const pagePermission =
    role === "superAdmin"
      ? { can_view: 1, can_add: 1, can_edit: 1, can_delete: 1 }
      : permissions.find((p) => p.route_path === CURRENT_PATH) || {};

  const canView = role === "superAdmin" || Number(pagePermission.can_view) === 1;
  const canAdd = role === "superAdmin" || Number(pagePermission.can_add) === 1;
  const canEdit = role === "superAdmin" || Number(pagePermission.can_edit) === 1;
  const canDelete =
    role === "superAdmin" || Number(pagePermission.can_delete) === 1;

  useEffect(() => {
    loadPage();
  }, []);

  const filteredCompleted = useMemo(() => {
    return completed.filter((item) => {
      return (
        item.emp_id?.toLowerCase().includes(search.toLowerCase()) ||
        item.emp_name?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [completed, search]);

  const loadPage = async () => {
    setLoading(true);
    await Promise.all([fetchEmployees(), fetchCompleted()]);
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_employee`);
      const json = await res.json();

      if (json.status || json.success) {
        const list = json.data || [];
        setEmployees(list);

        list.forEach((emp) => {
          fetchRecommendation(emp.employee_id);
        });
      }
    } catch (err) {
      console.error(err);
      alert("Employee API error");
    }
  };

  const fetchCompleted = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_completed_increments`);
      const json = await res.json();

      if (json.success || json.status) {
        setCompleted(json.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendation = async (empId) => {
    try {
      const res = await fetch(
        `${API_BASE}/get_increment_recommendation?emp_id=${empId}`
      );

      const text = await res.text();
      let json;

      try {
        json = JSON.parse(text);
      } catch {
        console.log("Invalid JSON:", text);
        return;
      }

      if (json.success || json.status) {
        setRecommendations((prev) => ({
          ...prev,
          [empId]: json.data,
        }));

        setForms((prev) => ({
          ...prev,
          [empId]: {
            custom_increment_type: "auto",
            custom_increment_value: "",
            remark: "",
          },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const completedMap = useMemo(() => {
    const map = {};
    completed.forEach((item) => {
      if (!map[item.emp_id]) map[item.emp_id] = item;
    });
    return map;
  }, [completed]);

  const upcomingEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const last = completedMap[emp.employee_id];

      const match =
        emp.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
        emp.full_name?.toLowerCase().includes(search.toLowerCase());

      if (!match) return false;
      if (!last) return true;
      if (!last.next_increment_date) return true;

      return new Date() >= new Date(last.next_increment_date);
    });
  }, [employees, completedMap, search]);

  const handleFormChange = (empId, name, value) => {
    if (!canAdd) {
      return alert("You do not have add permission");
    }

    setForms((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [name]: value,
      },
    }));
  };

  const getPreview = (empId) => {
    const rec = recommendations[empId];
    const form = forms[empId];

    if (!rec || !form) {
      return {
        currentPercent: 0,
        amount: 0,
      };
    }

    const salary = Number(rec.current_salary || 0);
    const type = form.custom_increment_type;
    const value = Number(form.custom_increment_value || 0);

    let currentPercent = Number(rec.final_recommend_percent || 0);
    let amount = Number(rec.final_recommend_amount || 0);

    if (type === "percentage") {
      currentPercent = value;
      amount = (salary * value) / 100;
    }

    if (type === "amount") {
      amount = value;
      currentPercent = salary > 0 ? (value / salary) * 100 : 0;
    }

    return {
      currentPercent: Number(currentPercent.toFixed(2)),
      amount: Number(amount.toFixed(2)),
    };
  };

  const saveIncrement = async (empId) => {
    if (!canAdd) {
      return alert("You do not have add permission");
    }

    const rec = recommendations[empId];
    const form = forms[empId];

    if (!rec || !form) {
      alert("Recommendation not loaded");
      return;
    }

    setSavingId(empId);

    try {
      const payload = {
        ...rec,
        custom_increment_type: form.custom_increment_type,
        custom_increment_value: Number(form.custom_increment_value || 0),
        remark: form.remark,
      };

      const res = await fetch(`${API_BASE}/save_increment_recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success || json.status) {
        alert("Increment completed successfully");
        await fetchCompleted();
      } else {
        alert(json.message || "Save failed");
      }
    } catch (err) {
      console.error(err);
      alert("Save API error");
    } finally {
      setSavingId("");
    }
  };

  const deleteIncrement = async (item) => {
    if (!canDelete) {
      return alert("You do not have delete permission");
    }

    if (!window.confirm(`Delete increment of ${item.emp_id}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/delete_increment_recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
        }),
      });

      const json = await res.json();

      if (json.success || json.status) {
        alert(json.message || "Increment deleted successfully");
        fetchCompleted();
      } else {
        alert(json.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete API error");
    }
  };

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
          <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-6 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={26} />
                  <h1 className="text-2xl md:text-3xl font-black">
                    Increment Management Dashboard
                  </h1>
                </div>
                <p className="text-blue-100 mt-1">
                  Upcoming increment & completed increment history
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TopStat title="Upcoming" value={upcomingEmployees.length} />
                <TopStat title="Completed" value={completed.length} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
            <div className="xl:col-span-8 bg-white/80 backdrop-blur rounded-[28px] border border-white shadow-xl overflow-hidden">
              <div className="p-5 border-b bg-white sticky top-0 z-10">
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">
                      Upcoming Increment
                    </h2>
                    <p className="text-sm text-slate-500">
                      {canAdd
                        ? "You can complete upcoming increments"
                        : "View Only Permission - Complete Increment Not Allowed"}
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
                      placeholder="Search employee..."
                      className="h-11 w-full md:w-72 rounded-xl border border-slate-200 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 max-h-[75vh] overflow-y-auto">
                {loading && (
                  <div className="text-center py-10 font-semibold text-blue-600">
                    Loading employees...
                  </div>
                )}

                {!loading && upcomingEmployees.length === 0 && (
                  <div className="text-center py-10 text-slate-500">
                    No upcoming increment available
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {upcomingEmployees.map((emp) => {
                    const rec = recommendations[emp.employee_id];
                    const form = forms[emp.employee_id] || {};
                    const preview = getPreview(emp.employee_id);

                    return (
                      <div
                        key={emp.employee_id}
                        className="rounded-[24px] border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all overflow-hidden"
                      >
                        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-black text-lg">
                                {emp.employee_id} - {emp.full_name}
                              </h3>
                              <p className="text-xs text-slate-300">
                                Joining: {emp.joining_date || "N/A"}
                              </p>
                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                              <User size={24} />
                            </div>
                          </div>
                        </div>

                        {!rec ? (
                          <div className="p-5 text-sm text-slate-500">
                            Recommendation loading...
                          </div>
                        ) : (
                          <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <MiniBox
                                icon={<IndianRupee size={17} />}
                                title="Salary"
                                value={formatMoney(rec.current_salary)}
                              />
                              <MiniBox
                                icon={<Clock size={17} />}
                                title="Shift"
                                value={rec.shift_time}
                              />
                              <MiniBox
                                icon={<AlertTriangle size={17} />}
                                title="Complaints"
                                value={rec.complaint_count}
                              />
                              <MiniBox
                                icon={<ShieldAlert size={17} />}
                                title="Penalty"
                                value={rec.penalty_count}
                              />
                            </div>

                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500">
                                  Auto Recommendation
                                </p>
                                <p
                                  className={`font-black text-xl ${
                                    Number(rec.final_recommend_percent) >= 0
                                      ? "text-emerald-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {rec.final_recommend_percent}%
                                </p>
                              </div>

                              <p className="text-xs text-slate-400 mt-1">
                                Amount: {formatMoney(rec.final_recommend_amount)}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-bold text-slate-600">
                                  Increment Type
                                </label>
                                <select
                                  value={form.custom_increment_type || "auto"}
                                  onChange={(e) =>
                                    handleFormChange(
                                      emp.employee_id,
                                      "custom_increment_type",
                                      e.target.value
                                    )
                                  }
                                  disabled={!canAdd}
                                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                >
                                  <option value="auto">
                                    Auto Recommendation
                                  </option>
                                  <option value="percentage">
                                    Custom Percentage
                                  </option>
                                  <option value="amount">Custom Amount</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-xs font-bold text-slate-600">
                                  Custom Value
                                </label>
                                <input
                                  type="number"
                                  disabled={
                                    !canAdd ||
                                    form.custom_increment_type === "auto"
                                  }
                                  value={form.custom_increment_value || ""}
                                  onChange={(e) =>
                                    handleFormChange(
                                      emp.employee_id,
                                      "custom_increment_value",
                                      e.target.value
                                    )
                                  }
                                  placeholder={
                                    form.custom_increment_type === "amount"
                                      ? "Amount"
                                      : "Percentage"
                                  }
                                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />
                              </div>
                            </div>

                            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                              <p className="text-xs text-blue-600 font-bold">
                                Selected Increment Preview
                              </p>
                              <div className="flex items-end justify-between mt-1">
                                <h3 className="text-2xl font-black text-blue-700">
                                  {preview.currentPercent}%
                                </h3>
                                <p className="font-bold text-slate-700">
                                  {formatMoney(preview.amount)}
                                </p>
                              </div>
                            </div>

                            <textarea
                              value={form.remark || ""}
                              onChange={(e) =>
                                handleFormChange(
                                  emp.employee_id,
                                  "remark",
                                  e.target.value
                                )
                              }
                              readOnly={!canAdd}
                              placeholder="Remark..."
                              rows="2"
                              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500 read-only:bg-slate-100 read-only:cursor-not-allowed"
                            />

                            {canAdd ? (
                              <button
                                onClick={() => saveIncrement(emp.employee_id)}
                                disabled={savingId === emp.employee_id}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
                              >
                                <Save size={18} />
                                {savingId === emp.employee_id
                                  ? "Saving..."
                                  : "Complete Increment"}
                              </button>
                            ) : (
                              <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-700 py-3 rounded-xl font-black text-center">
                                View Only Permission - Add Not Allowed
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 bg-white/80 backdrop-blur rounded-[28px] border border-white shadow-xl overflow-hidden">
              <div className="p-5 border-b bg-white sticky top-0 z-10">
                <h2 className="text-xl font-black text-slate-800">
                  Completed Increment
                </h2>
                <p className="text-sm text-slate-500">
                  Completed employee increment list
                </p>
              </div>

              <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
                {completed.length === 0 && (
                  <div className="text-center py-10 text-slate-500">
                    No completed increment
                  </div>
                )}

                {filteredCompleted.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-800">
                          {item.emp_id} - {item.emp_name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {item.created_at}
                        </p>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={21} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <HistoryBox
                        title="Current"
                        value={`${
                          item.current_recommendation_percent ||
                          item.final_recommend_percent
                        }%`}
                      />
                      <HistoryBox
                        title="Final"
                        value={`${
                          item.final_increment_percent ||
                          item.final_recommend_percent
                        }%`}
                      />
                      <HistoryBox
                        title="Amount"
                        value={formatMoney(
                          item.final_increment_amount ||
                            item.final_recommend_amount
                        )}
                      />
                      <HistoryBox
                        title="Next Date"
                        value={item.next_increment_date || "N/A"}
                      />
                    </div>

                    {item.remark && (
                      <p className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                        {item.remark}
                      </p>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => deleteIncrement(item)}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-black flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!canEdit && (
            <p className="text-xs text-slate-400">
              Edit permission is not used on this page because increment records
              are completed as new entries. Add permission controls “Complete
              Increment”; Delete permission controls completed record removal.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TopStat({ title, value }) {
  return (
    <div className="rounded-2xl bg-white/15 px-5 py-3">
      <p className="text-xs text-blue-100">{title}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  );
}

function MiniBox({ title, value, icon }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-bold">{title}</p>
      </div>
      <h4 className="font-black text-slate-800 mt-1 truncate">{value}</h4>
    </div>
  );
}

function HistoryBox({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
      <p className="text-[11px] text-slate-500 font-bold">{title}</p>
      <h4 className="font-black text-slate-800 text-sm mt-1">{value}</h4>
    </div>
  );
}