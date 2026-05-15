import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ClipboardPen,
  Send,
  BriefcaseBusiness,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const EMPLOYEE_API = "https://ojmee.in/employee/get_employee";
const MEETING_POST_API = "https://ojmee.in/employee/emp_meetings_post";

export default function EmployeeMeetingForm() {
  const [employees, setEmployees] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [form, setForm] = useState({
    designation: "",
    employee_ids: [],
    employee_names: [],
    meeting_date: "",
    meeting_time: "",
    place: "",
    meeting_attend_by: "",
    remark: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(EMPLOYEE_API);
      const json = await res.json();

      const list = Array.isArray(json) ? json : json.data || [];

      setEmployees(list);

      const uniqueDesignations = [
        ...new Set(
          list
            .map((emp) => emp.designation)
            .filter((item) => item && item.trim() !== "")
        ),
      ];

      setDesignations(uniqueDesignations);
    } catch (error) {
      toast.error("Employee data fetch failed");
    }
  };

  const handleDesignationChange = (e) => {
    const designation = e.target.value;

    const filtered = employees.filter(
      (emp) =>
        String(emp.designation || "").toLowerCase() ===
        String(designation || "").toLowerCase()
    );

    setFilteredEmployees(filtered);

    setForm({
      ...form,
      designation,
      employee_ids: [],
      employee_names: [],
    });
  };

  const handleEmployeeCheckbox = (emp) => {
    const empId = emp.employee_id || emp.emp_id || emp.id;
    const empName = emp.full_name || emp.employee_name || emp.name || "";

    const alreadySelected = form.employee_ids.includes(empId);

    if (alreadySelected) {
      setForm({
        ...form,
        employee_ids: form.employee_ids.filter((id) => id !== empId),
        employee_names: form.employee_names.filter((name) => name !== empName),
      });
    } else {
      setForm({
        ...form,
        employee_ids: [...form.employee_ids, empId],
        employee_names: [...form.employee_names, empName],
      });
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      designation: "",
      employee_ids: [],
      employee_names: [],
      meeting_date: "",
      meeting_time: "",
      place: "",
      meeting_attend_by: "",
      remark: "",
    });

    setFilteredEmployees([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.designation ||
      form.employee_ids.length === 0 ||
      !form.meeting_date ||
      !form.meeting_time
    ) {
      toast.error("Designation, Employee, Date and Time required");
      return;
    }

    try {
      const res = await fetch(MEETING_POST_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Meeting created successfully");
        resetForm();
      } else {
        toast.error(json.message || "Meeting create failed");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <Users size={34} />

            <div>
              <h1 className="text-2xl font-bold">Meeting Management</h1>
              <p className="text-sm text-indigo-100">
                Create meeting designation wise
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">
                <BriefcaseBusiness size={16} /> Meeting Designation
              </label>

              <select
                name="designation"
                value={form.designation}
                onChange={handleDesignationChange}
                className="input"
                required
              >
                <option value="">Select designation</option>

                {designations.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <Users size={16} /> Selected Employees
              </label>

              <input
                value={`${form.employee_ids.length} employee selected`}
                readOnly
                className="input bg-slate-100"
              />
            </div>
          </div>

          {form.designation && (
            <div>
              <label className="label">
                <Users size={16} /> Employees
              </label>

              {filteredEmployees.length === 0 ? (
                <div className="border border-red-200 bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold">
                  No employee found for this designation
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border rounded-2xl p-4 bg-slate-50">
                  {filteredEmployees.map((emp, index) => {
                    const empId = emp.employee_id || emp.emp_id || emp.id;
                    const empName =
                      emp.full_name || emp.employee_name || emp.name || "";

                    return (
                      <label
                        key={index}
                        className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3 cursor-pointer hover:bg-indigo-50"
                      >
                        <input
                          type="checkbox"
                          checked={form.employee_ids.includes(empId)}
                          onChange={() => handleEmployeeCheckbox(emp)}
                          className="w-4 h-4"
                        />

                        <span className="text-sm font-medium text-slate-700">
                          {empId} - {empName}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="label">
                <CalendarDays size={16} /> Meeting Date
              </label>

              <input
                type="date"
                name="meeting_date"
                value={form.meeting_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">
                <Clock size={16} /> Meeting Time
              </label>

              <input
                type="time"
                name="meeting_time"
                value={form.meeting_time}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">
                <MapPin size={16} /> Place
              </label>

              <input
                name="place"
                value={form.place}
                onChange={handleChange}
                placeholder="Enter meeting place"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">
              <ClipboardPen size={16} /> Meeting Attend By
            </label>

            <input
              name="meeting_attend_by"
              value={form.meeting_attend_by}
              onChange={handleChange}
              placeholder="Enter meeting attend by"
              className="input"
            />
          </div>

          <div>
            <label className="label">
              <ClipboardPen size={16} /> Remark
            </label>

            <textarea
              name="remark"
              value={form.remark}
              onChange={handleChange}
              rows="4"
              placeholder="Enter remark"
              className="input resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all"
            >
              <Send size={18} />
              Submit Meeting
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }

        .input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 12px 14px;
          outline: none;
          font-size: 14px;
          background: white;
        }

        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
      `}</style>
    </div>
  );
}