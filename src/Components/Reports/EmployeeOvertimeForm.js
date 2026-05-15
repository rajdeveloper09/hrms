import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ojmee.in/employee";

export default function EmployeeOTPage() {
  const [employees, setEmployees] = useState([]);
  const [otList, setOtList] = useState([]);

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

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    const emp = employees.find((x) => x.employee_id === empId);

    if (!emp) {
      setForm(emptyForm);
      return;
    }

    const salary =
      Number(emp.basic_salary || 0) + Number(emp.allowances || 0);

    setForm({
      ...emptyForm,
      emp_id: emp.employee_id,
      emp_name: emp.full_name,
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
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Employee OT Management</h1>

      <form
        onSubmit={submitOT}
        className="bg-white p-5 rounded-2xl shadow grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div>
          <label className="label">Employee</label>
          <select
  value={form.emp_id}
  onChange={handleEmployeeChange}
  required
  className="input"
>
  <option value="">Select Employee</option>

  {employees
    .filter((emp) => {
      return !otList.some(
        (ot) => ot.emp_id === emp.employee_id
      );
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

            <div className="md:col-span-3">
              <label className="label">Remark</label>
              <textarea
                name="remark"
                value={form.remark}
                onChange={handleChange}
                className="input h-24"
                required={showOTFields}
              />
            </div>
          </>
        )}

        <button className="md:col-span-3 bg-blue-600 text-white py-3 rounded-xl font-semibold">
          Submit OT
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3">Emp ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Salary</th>
              <th className="p-3">Hours</th>
              <th className="p-3">OT Allow</th>
              <th className="p-3">OT Type</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Month</th>
              <th className="p-3">OT Minutes</th>
              <th className="p-3">OT Amount</th>
              <th className="p-3">Approved By</th>
            </tr>
          </thead>

          <tbody>
            {otList.map((item, index) => (
              <tr key={index} className="border-b text-center">
                <td className="p-3">{item.emp_id}</td>
                <td className="p-3">{item.emp_name}</td>
                <td className="p-3">
                  ₹{Number(item.current_salary || 0).toLocaleString("en-IN")}
                </td>
                <td className="p-3">{item.working_hours || "-"}</td>
                <td className="p-3">
                  {item.ot_allow === "0" ? "No" : "Yes"}
                </td>
                <td className="p-3">
                  {item.ot_allow === "0" ? "-" : `${item.ot_type}x`}
                </td>
                <td className="p-3">{item.ot_start_date || "-"}</td>
                <td className="p-3">{item.ot_end_date || "Continue"}</td>
                <td className="p-3">{item.ot_earn_month || "-"}</td>
                <td className="p-3">{item.total_ot_minutes || 0}</td>
                <td className="p-3 font-bold text-green-600">
                  ₹{Number(item.ot_earn_amount || 0).toLocaleString("en-IN")}
                </td>
                <td className="p-3">{item.approve_by || "-"}</td>
              </tr>
            ))}
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