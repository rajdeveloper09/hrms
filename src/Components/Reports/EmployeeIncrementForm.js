import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  IndianRupee,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Save,
  Search,
  Sparkles,
  Trash2,
  CalendarDays,
} from "lucide-react";
import SideNav from "../SideNav";
import toast, { Toaster } from "react-hot-toast";

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

  const [attendanceData, setAttendanceData] = useState([]);

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
    loadPage();
  }, [loadPage]);



  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.log("Invalid API Response:", text);
      return { success: false, message: "Invalid JSON response from API" };
    }
  };

  const loadPage = async () => {
    setLoading(true);
    await Promise.all([fetchEmployees(), fetchCompleted(), fetchAttendance()]);
    setLoading(false);
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${API_BASE}/emp_attendance`);
      const json = await safeJson(res);

      const list = json.data || json.result || json || [];
      setAttendanceData(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    }
  };


  const toMinutes = (time) => {
    if (!time) return 0;

    const str = String(time).trim();

    if (str.includes(" ")) {
      return toMinutes(str.split(" ")[1]);
    }

    if (str.includes("AM") || str.includes("PM")) {
      const date = new Date(`2000-01-01 ${str}`);
      return date.getHours() * 60 + date.getMinutes();
    }

    const [h, m] = str.split(":").map(Number);
    return (Number(h) || 0) * 60 + (Number(m) || 0);
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_employee`);
      const json = await safeJson(res);

      if (json.status || json.success) {
        const list = json.data || [];
        setEmployees(list);
        list.forEach((emp) => fetchRecommendation(emp.employee_id));
      }
    } catch (err) {
      console.error(err);
      alert("Employee API error");
    }
  };

  const fetchCompleted = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_completed_increments`);
      const json = await safeJson(res);

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
      const json = await safeJson(res);

      if (json.success || json.status) {
        const safeData = {
          ...json.data,
          eligible: json.data?.eligible === true,
          avg_late_minutes: Number(json.data?.avg_late_minutes || 0),
          complaint_count: Number(json.data?.complaint_count || 0),
          penalty_count: Number(json.data?.penalty_count || 0),
          late_deduction_percent: Number(json.data?.late_deduction_percent || 0),
          complaint_deduction_percent: Number(json.data?.complaint_deduction_percent || 0),
          penalty_deduction_percent: Number(json.data?.penalty_deduction_percent || 0),
          final_recommend_percent: Math.max(
            0,
            Number(json.data?.final_recommend_percent || 0)
          ),
          final_recommend_amount: Math.max(
            0,
            Number(json.data?.final_recommend_amount || 0)
          ),
        };

        setRecommendations((prev) => ({
          ...prev,
          [empId]: safeData,
        }));

        setForms((prev) => ({
          ...prev,
          [empId]: prev[empId] || {
            custom_increment_type: "auto",
            custom_increment_value: "",
            effective_date: "",
            next_increment_date: "",
            remark: "",
          },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCompleted = useMemo(() => {
    const q = search.toLowerCase();
    return completed.filter((item) => {
      return (
        item.emp_id?.toLowerCase().includes(q) ||
        item.emp_name?.toLowerCase().includes(q)
      );
    });
  }, [completed, search]);

  const completedMap = useMemo(() => {
    const map = {};
    completed.forEach((item) => {
      if (!map[item.emp_id]) map[item.emp_id] = item;
    });
    return map;
  }, [completed]);

  const upcomingEmployees = useMemo(() => {
    const q = search.toLowerCase();

    return employees.filter((emp) => {
      const last = completedMap[emp.employee_id];

      const match =
        emp.employee_id?.toLowerCase().includes(q) ||
        emp.full_name?.toLowerCase().includes(q);

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

    let finalValue = value;

    if (name === "custom_increment_value") {
      finalValue = Math.max(0, Number(value || 0));
    }

    setForms((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [name]: finalValue,
      },
    }));
  };

  const getPreview = (empId) => {
    const rec = recommendations[empId];
    const form = forms[empId];

    if (!rec || !form) {
      return { currentPercent: 0, amount: 0 };
    }

    if (rec.eligible === false) {
      return { currentPercent: 0, amount: 0 };
    }

    const salary = Number(rec.current_salary || 0);
    const type = form.custom_increment_type;
    const value = Math.max(0, Number(form.custom_increment_value || 0));

    let currentPercent = Math.max(0, Number(rec.final_recommend_percent || 0));
    let amount = Math.max(0, Number(rec.final_recommend_amount || 0));

    if (type === "percentage") {
      currentPercent = value;
      amount = (salary * value) / 100;
    }

    if (type === "amount") {
      amount = value;
      currentPercent = salary > 0 ? (value / salary) * 100 : 0;
    }

    return {
      currentPercent: Math.max(0, Number(currentPercent.toFixed(2))),
      amount: Math.max(0, Number(amount.toFixed(2))),
    };
  };

  const saveIncrement = async (empId) => {
    if (!canAdd) {
      return toast.error("You do not have add permission");
    }

    const rec = recommendations[empId];
    const form = forms[empId];
    const emp = employees.find((e) => e.employee_id === empId);

    if (!rec || !form) {
      toast.error("Recommendation not loaded");
      return;
    }

    if (!form.effective_date) {
      toast.error("Please enter increment effective date");
      return;
    }
    if (!form.next_increment_date) {
      toast.error("Please enter next increment date");
      return;
    }

    if (!form.remark || form.remark.trim() === "") {
      toast.error("Please enter remark");
      return;
    }

    if (rec.eligible === false) {
      toast.error(rec.message || "You are eligible after 1 month");
      return;
    }

    if (!form.effective_date) {
      toast.error("Please select effective date");
      return;
    }

    if (
      new Date(form.effective_date) <
      new Date(new Date().toISOString().slice(0, 10))
    ) {
      toast.error("Past effective date not allowed");
      return;
    }

    const preview = getPreview(empId);

    const ok = window.confirm(
      `Are you sure you want to complete increment for ${empId}?

Increment: ${preview.currentPercent}%
Amount: ${formatMoney(preview.amount)}
Effective Date: ${form.effective_date}
Next Increment Date: ${form.next_increment_date}`
    );

    if (!ok) return;

    setSavingId(empId);

    try {
      const payload = {
        emp_id: rec.emp_id || empId,
        emp_name: rec.emp_name || rec.full_name || emp?.full_name || "",
        current_salary: Number(rec.current_salary || emp?.basic_salary || 0),

        last_increment_date:
          rec.last_increment_date || new Date().toISOString().slice(0, 10),

        avg_late_minutes: Number(rec.avg_late_minutes || 0),
        complaint_count: Number(rec.complaint_count || 0),
        penalty_count: Number(rec.penalty_count || 0),

        late_deduction_percent: Number(rec.late_deduction_percent || 0),
        complaint_deduction_percent: Number(rec.complaint_deduction_percent || 0),
        penalty_deduction_percent: Number(rec.penalty_deduction_percent || 0),
        base_increment_percent: Number(rec.base_increment_percent || 0),

        final_recommend_percent: Math.max(
          0,
          Number(rec.final_recommend_percent || 0)
        ),
        final_recommend_amount: Math.max(
          0,
          Number(rec.final_recommend_amount || 0)
        ),

        custom_increment_type: form.custom_increment_type || "auto",
        custom_increment_value: Math.max(
          0,
          Number(form.custom_increment_value || 0)
        ),
        next_increment_date: form.next_increment_date,
        effective_date: form.effective_date,
        remark: form.remark || "",
      };

      const res = await fetch(`${API_BASE}/post_increment_recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await safeJson(res);

      if (json.success || json.status) {
        alert(json.message || "Increment completed successfully");
        await fetchCompleted();
        await fetchEmployees();
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
        body: JSON.stringify({ id: item.id }),
      });

      const json = await safeJson(res);

      if (json.success || json.status) {
        alert(json.message || "Increment deleted successfully");
        await fetchCompleted();
        await fetchEmployees();
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
                                Joining Date: {
                                  emp.joining_date
                                    ? new Date(emp.joining_date).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                    : "N/A"
                                }
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
                          <div className="p-3 space-y-3">
                            <div className="grid grid-cols-3 gap-2">
                              <MiniBox
                                icon={<IndianRupee size={17} />}
                                title="Salary"
                                value={formatMoney(rec.current_salary)}
                              />

                              <MiniBox
                                icon={<AlertTriangle size={17} />}
                                title="Complaints"
                                value={Number(rec.complaint_count || 0)}
                              />

                              <MiniBox
                                icon={<ShieldAlert size={17} />}
                                title="Penalty"
                                value={Number(rec.penalty_count || 0)}
                              />
                              <MiniBox
                                icon={<Clock size={17} />}
                                title="Shift Start"
                                value={
                                  rec.shift_time
                                    ? new Date(`2000-01-01 ${rec.shift_time}`).toLocaleTimeString("en-IN", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                    : "-"
                                }
                              />
                              <MiniBox
                                icon={<Clock size={17} />}
                                title="Avg Late"
                                value={`${Number(rec.avg_late_minutes || 0)}m`}
                              />
                            </div>

                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500">
                                  Auto Recommendation
                                </p>

                                <p
                                  className={`font-black text-xl ${rec.eligible === false ? "text-red-600" : "text-emerald-600"
                                    }`}
                                >
                                  {Math.max(0, Number(rec.final_recommend_percent || 0))}%
                                </p>


                              </div>

                              <p className="text-xs text-slate-400 mt-1">
                                {rec.eligible === false
                                  ? rec.message || "You are eligible after 1 month"
                                  : `${rec.completed_months || 0} month completed = ${rec.base_increment_percent || 0
                                  }% base increment`}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                Amount:{" "}
                                {formatMoney(
                                  Math.max(0, Number(rec.final_recommend_amount || 0))
                                )}
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
                                  min="0"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                  <CalendarDays size={14} />
                                  Increment Effective Date
                                </label>

                                <input
                                  type="date"
                                  min={new Date().toISOString().slice(0, 10)}
                                  value={form.effective_date || ""}
                                  required
                                  placeholder="Select Effective Date"
                                  onChange={(e) =>
                                    handleFormChange(
                                      emp.employee_id,
                                      "effective_date",
                                      e.target.value
                                    )
                                  }
                                  disabled={!canAdd}
                                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                  <CalendarDays size={14} />
                                  Next Increment Date
                                </label>
                                <input
                                  type="date"
                                  value={form.next_increment_date || ""}
                                  min={new Date().toISOString().split("T")[0]}
                                  required
                                  placeholder="Select Next Increment Date"
                                  onChange={(e) =>
                                    handleFormChange(
                                      emp.employee_id,
                                      "next_increment_date",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      saveIncrement(emp.employee_id);
                                    }
                                  }}
                                  disabled={!canAdd}
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
                              required
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

                            {canAdd && rec.eligible !== false ? (
                              <button
                                onClick={() => saveIncrement(emp.employee_id)}
                                disabled={savingId === emp.employee_id}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
                              >
                                <Save size={18} />
                                {savingId === emp.employee_id ? "Saving..." : "Complete Increment"}
                              </button>
                            ) : (
                              <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-700 py-3 rounded-xl font-black text-center">
                                {rec.eligible === false
                                  ? rec.message || "You are eligible after 1 month"
                                  : "View Only Permission - Add Not Allowed"}
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
              </div>

              <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
                {filteredCompleted.length === 0 && (
                  <div className="text-center py-10 text-slate-500">
                    No completed increment
                  </div>
                )}

                {filteredCompleted.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <h3 className="font-black text-slate-800">
                      {item.emp_id} - {item.emp_name}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <HistoryBox
                        title="Final"
                        value={`${item.final_increment_percent ||
                          item.final_recommend_percent ||
                          0
                          }%`}
                      />
                      <HistoryBox
                        title="Amount"
                        value={formatMoney(
                          item.final_increment_amount ||
                          item.final_recommend_amount ||
                          0
                        )}
                      />
                      <HistoryBox
                        title="Increment Effective Date"
                        value={item.effective_date
                          ? new Date(item.effective_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "N/A"}
                      />
                      <HistoryBox
                        title="Next Increment Date"
                        value={item.next_increment_date
                          ? new Date(item.next_increment_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "N/A"}
                      />
                      <HistoryBox
                        title="Status"
                        value={item.approval_status || "Approved"}
                      />

                      {item.remark && (
                        <p className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                          {item.remark}
                        </p>
                      )}
                    </div>


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
              are completed as new entries.
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