import React, { useEffect, useState } from "react";
import {
  User,
  IndianRupee,
  Clock,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Save,
} from "lucide-react";

const API_BASE = "https://ojmee.in/employee";

export default function EmployeeIncrementForm() {
  const [employees, setEmployees] = useState([]);
  const [empId, setEmpId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_employee`);
      const json = await res.json();

      if (json.status || json.success) {
        setEmployees(json.data || []);
      }
    } catch (error) {
      console.error(error);
      alert("Employee API error");
    }
  };

  const fetchRecommendation = async (selectedEmpId) => {
    if (!selectedEmpId) return;

    setLoading(true);
    setData(null);

    try {
      const url = `${API_BASE}/get_increment_recommendation?emp_id=${selectedEmpId}`;

      const res = await fetch(url);
      const text = await res.text();

      console.log("API RAW RESPONSE:", text);

      let json;

      try {
        json = JSON.parse(text);
      } catch (e) {
        alert("API JSON nahi de rahi. Console check karo.");
        return;
      }

      if (json.success) {
        setData(json.data);
      } else {
        alert(json.message || "Recommendation not found");
      }
    } catch (error) {
      console.error("Recommendation API error:", error);
      alert("Recommendation API error");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    const value = e.target.value;
    setEmpId(value);
    fetchRecommendation(value);
  };

  const saveRecommendation = async () => {
    if (!data) return;

    setSaving(true);

    try {
      const payload = {
        ...data,
        remark,
      };

      const res = await fetch(`${API_BASE}/save_increment_recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        alert("Recommendation saved successfully");
        setRemark("");
      } else {
        alert(json.message || "Save failed");
      }
    } catch (error) {
      console.error(error);
      alert("Save API error");
    } finally {
      setSaving(false);
    }
  };

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  const statusColor =
    Number(data?.final_recommend_percent || 0) >= 0
      ? "text-emerald-600"
      : "text-red-600";

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              Employee Increment Recommendation
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              Attendance, complaints, penalty aur salary ke behalf par auto
              calculation
            </p>
          </div>

          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Employee
            </label>

            <select
              value={empId}
              onChange={handleEmployeeChange}
              className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.full_name}
                </option>
              ))}
            </select>

            {loading && (
              <div className="mt-6 text-center text-blue-600 font-semibold">
                Calculating recommendation...
              </div>
            )}

            {data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                  <Card
                    title="Employee"
                    value={`${data.emp_id} - ${data.emp_name}`}
                    icon={<User />}
                  />

                  <Card
                    title="Current Salary"
                    value={formatMoney(data.current_salary)}
                    icon={<IndianRupee />}
                  />

                  <Card
                    title="Shift Time"
                    value={data.shift_time}
                    icon={<Clock />}
                  />

                  <Card
                    title="Last Increment Date"
                    value={data.last_increment_date}
                    icon={<TrendingUp />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <CalculationCard
                    title="Average Late"
                    main={`${data.avg_late_minutes} min`}
                    sub={`Deduction: -${data.late_deduction_percent}%`}
                    icon={<Clock />}
                    color="amber"
                  />

                  <CalculationCard
                    title="Complaints"
                    main={data.complaint_count}
                    sub={`Deduction: -${data.complaint_deduction_percent}%`}
                    icon={<AlertTriangle />}
                    color="red"
                  />

                  <CalculationCard
                    title="Penalty"
                    main={data.penalty_count}
                    sub={`Deduction: -${data.penalty_deduction_percent}%`}
                    icon={<ShieldAlert />}
                    color="rose"
                  />
                </div>

                <div className="mt-8 bg-slate-50 rounded-3xl border border-slate-200 p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">
                    Final Calculation
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white rounded-2xl p-5 border">
                      <p className="text-sm text-slate-500">
                        Base Increment Percentage
                      </p>
                      <h3 className="text-3xl font-bold text-blue-600 mt-1">
                        +{data.base_increment_percent}%
                      </h3>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border">
                      <p className="text-sm text-slate-500">
                        Final Recommended Percentage
                      </p>
                      <h3 className={`text-3xl font-bold mt-1 ${statusColor}`}>
                        {data.final_recommend_percent}%
                      </h3>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border md:col-span-2">
                      <p className="text-sm text-slate-500">
                        Final Recommended Amount
                      </p>
                      <h3 className={`text-4xl font-bold mt-1 ${statusColor}`}>
                        {formatMoney(data.final_recommend_amount)}
                      </h3>

                      <p className="text-sm text-slate-500 mt-3">
                        Formula: Salary × Final Percentage ÷ 100
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Remark
                  </label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    rows="4"
                    placeholder="Enter remark..."
                    className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={saveRecommendation}
                  disabled={saving}
                  className="mt-6 h-12 px-6 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Recommendation"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          {React.cloneElement(icon, { size: 22 })}
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="font-bold text-slate-800">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function CalculationCard({ title, main, sub, icon, color }) {
  const colors = {
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    rose: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}
      >
        {React.cloneElement(icon, { size: 24 })}
      </div>

      <p className="text-sm text-slate-500 mt-4">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800 mt-1">{main}</h3>
      <p className="text-sm font-semibold text-red-500 mt-1">{sub}</p>
    </div>
  );
}