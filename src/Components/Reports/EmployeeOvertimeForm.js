import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import { Search, Clock, User, Send } from "lucide-react";

const API = "https://ojmee.in/employee";

export default function EmployeeOTPage() {
  const [employees, setEmployees] = useState([]);
  const [otList, setOtList] = useState([]);
  const [search, setSearch] = useState("");

  const emptyForm = {
    emp_id: "",
    emp_name: "",
    current_salary: "",
    working_hours: "",
    shift_time: "",
    ot_allow: "1",
    ot_type: "1",
    ot_start_date: "",
    ot_end_date: "",
    approve_by: "",
    remark: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchEmployees();
    fetchOTList();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/get_employee`);
      setEmployees(res.data.data || []);
    } catch (error) {
      console.log("Employee API Error:", error);
    }
  };

  const fetchOTList = async () => {
    try {
      const res = await axios.get(`${API}/emp_overtime`);
      setOtList(res.data.data || []);
    } catch (error) {
      console.log("OT List API Error:", error);
    }
  };

  const filteredOTList = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return otList;

    return otList.filter((item) =>
      [
        item.emp_id,
        item.emp_name,
        item.employee_name,
        item.full_name,
        item.current_salary,
        item.working_hours,
        item.ot_allow,
        item.ot_type,
        item.ot_start_date,
        item.ot_end_date,
        item.ot_earn_month,
        item.total_ot_minutes,
        item.ot_earn_amount,
        item.approve_by,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [otList, search]);

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    const emp = employees.find((x) => x.employee_id === empId);

    if (!emp) {
      setForm(emptyForm);
      return;
    }

    const salary = Number(emp.basic_salary || 0) + Number(emp.allowances || 0);

    setForm({
      ...emptyForm,
      emp_id: emp.employee_id,
      emp_name: emp.full_name || emp.employee_name || emp.name || "",
      current_salary: salary,
      working_hours: emp.working_hours || "",
      shift_time: emp.shift_time || "",
      ot_allow: emp.ot_allow === "0" ? "0" : "1",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "ot_allow" && value === "0"
        ? {
            ot_type: "1",
            ot_start_date: "",
            ot_end_date: "",
            approve_by: "",
            remark: "",
          }
        : {}),
    }));
  };

  const submitOT = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        ot_type: form.ot_allow === "0" ? "" : form.ot_type,
        ot_start_date: form.ot_allow === "0" ? "" : form.ot_start_date,
        ot_end_date: form.ot_allow === "0" ? "" : form.ot_end_date,
        approve_by: form.ot_allow === "0" ? "" : form.approve_by,
        remark: form.ot_allow === "0" ? "" : form.remark,
      };

      const res = await axios.post(`${API}/emp_overtime_post`, payload);

      if (res.data.success) {
        alert("OT saved successfully");
        setForm(emptyForm);
        fetchOTList();
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("OT Post API Error:", error);
      alert("OT Post API not working");
    }
  };

  const showOTFields = form.ot_allow === "1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <SideNav />

      <div className="flex-1 ml-72 p-4 overflow-y-auto min-h-screen">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-6 text-white shadow-xl mb-6">
          <h1 className="text-3xl font-black">Employee OT Management</h1>
          <p className="text-blue-100 mt-1">
            Manage employee overtime allowance, dates and monthly OT earnings
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* LEFT FORM */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="p-5 bg-blue-50 border-b border-blue-100">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Clock size={22} /> OT Form
              </h2>
              <p className="text-sm text-slate-500">
                Select employee and set overtime details
              </p>
            </div>

            <form
              onSubmit={submitOT}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="label">
                  <User size={16} /> Employee
                </label>

                <select
                  value={form.emp_id}
                  onChange={handleEmployeeChange}
                  required
                  className="input"
                >
                  <option value="">Select Employee</option>

                  {employees
                    .filter((emp) => {
                      return !otList.some((ot) => ot.emp_id === emp.employee_id);
                    })
                    .map((emp) => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.employee_id} - {emp.full_name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="label">OT Allow</label>
                <select
                  name="ot_allow"
                  value={form.ot_allow}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="1">Yes / 1</option>
                  <option value="0">No / 0</option>
                </select>
              </div>

              {showOTFields && (
                <>
                  <Input
                    label="Employee Name"
                    name="emp_name"
                    value={form.emp_name}
                    readOnly
                  />

                  <Input
                    label="Current Salary"
                    name="current_salary"
                    value={form.current_salary}
                    readOnly
                  />

                  <Input
                    label="Working Hours"
                    name="working_hours"
                    value={form.working_hours}
                    readOnly
                  />

                  <Input
                    label="Shift Time"
                    name="shift_time"
                    value={form.shift_time}
                    readOnly
                  />

                  <div>
                    <label className="label">OT Type</label>
                    <select
                      name="ot_type"
                      value={form.ot_type}
                      onChange={handleChange}
                      required={showOTFields}
                      className="input"
                    >
                      <option value="1">1x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>

                  <Input
                    label="OT Start Date"
                    type="date"
                    name="ot_start_date"
                    value={form.ot_start_date}
                    onChange={handleChange}
                    required={showOTFields}
                  />

                  <Input
                    label="OT End Date"
                    type="date"
                    name="ot_end_date"
                    value={form.ot_end_date}
                    onChange={handleChange}
                  />

                  <Input
                    label="Approved By"
                    name="approve_by"
                    value={form.approve_by}
                    onChange={handleChange}
                    required={showOTFields}
                  />

                  <div className="md:col-span-2">
                    <label className="label">Remark</label>
                    <textarea
                      name="remark"
                      value={form.remark}
                      onChange={handleChange}
                      className="input h-24 resize-none"
                      required={showOTFields}
                      placeholder="Enter remark"
                    />
                  </div>
                </>
              )}

              <button className="md:col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-700 to-cyan-600 text-white py-3 rounded-2xl font-black shadow-lg hover:from-indigo-800 hover:to-cyan-700">
                <Send size={18} />
                Submit OT
              </button>
            </form>
          </div>

          {/* RIGHT LIST */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white">
              <h2 className="text-xl font-black">OT History</h2>
              <p className="text-sm text-slate-300">
                Search and view employee OT records
              </p>

              <div className="relative mt-4">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by employee, month, amount, status..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[780px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 text-slate-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">OT</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Month</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Approved</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOTList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500">
                        No OT data found
                      </td>
                    </tr>
                  ) : (
                    filteredOTList.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b text-center hover:bg-blue-50/60"
                      >
                        <td className="p-3">
                          <div className="font-black text-slate-800">
                            {item.emp_id}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.emp_name || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black ${
                              item.ot_allow === "0"
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {item.ot_allow === "0" ? "No" : `${item.ot_type}x`}
                          </span>
                          <div className="text-xs text-slate-500 mt-1">
                            {item.total_ot_minutes || 0} min
                          </div>
                        </td>

                        <td className="p-3">
                          <div>{item.ot_start_date || "-"}</div>
                          <div className="text-xs text-slate-500">
                            {item.ot_end_date || "Continue"}
                          </div>
                        </td>

                        <td className="p-3">{item.ot_earn_month || "-"}</td>

                        <td className="p-3 font-black text-emerald-600">
                          ₹{Number(item.ot_earn_amount || 0).toLocaleString("en-IN")}
                        </td>

                        <td className="p-3">{item.approve_by || "-"}</td>
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
            gap: 6px;
            font-size: 14px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 6px;
          }

          .input {
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 14px;
            padding: 12px 14px;
            outline: none;
            font-size: 14px;
            background: white;
          }

          .input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
          }

          .input[readonly] {
            background: #f8fafc;
          }
        `}</style>
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