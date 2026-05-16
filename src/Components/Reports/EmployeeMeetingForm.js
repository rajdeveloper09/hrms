import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ClipboardPen,
  Send,
  BriefcaseBusiness,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SideNav from "../SideNav";

const EMPLOYEE_API = "https://ojmee.in/employee/get_employee";
const MEETING_GET_API = "https://ojmee.in/employee/emp_meetings";
const MEETING_POST_API = "https://ojmee.in/employee/emp_meetings_post";

export default function EmployeeMeetingForm() {
  const [employees, setEmployees] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");

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
    fetchMeetings();
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
    } catch {
      toast.error("Employee data fetch failed");
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await fetch(MEETING_GET_API);
      const json = await res.json();
      setMeetings(json.data || []);
    } catch {
      toast.error("Meeting list fetch failed");
    }
  };

  const filteredMeetings = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return meetings;

    return meetings.filter((item) =>
      [
        item.meeting_id,
        item.designation,
        item.employee_ids,
        item.employee_names,
        item.meeting_date,
        item.meeting_time,
        item.place,
        item.meeting_attend_by,
        item.remark,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [meetings, search]);

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
        fetchMeetings();
      } else {
        toast.error(json.message || "Meeting create failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster/>
      <SideNav />

      <div className="flex-1 ml-72 p-4 overflow-y-auto min-h-screen">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-6 text-white shadow-xl mb-6">
          <div className="flex items-center gap-3">
            <Users size={36} />
            <div>
              <h1 className="text-3xl font-black">Meeting Management</h1>
              <p className="text-blue-100 mt-1">
                Create meeting designation wise and manage meeting history
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* LEFT FORM */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="p-5 bg-blue-50 border-b border-blue-100">
              <h2 className="text-xl font-black text-slate-800">
                Create Meeting
              </h2>
              <p className="text-sm text-slate-500">
                Select designation, employees and meeting details
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

                <Input
                  icon={<Users size={16} />}
                  label="Selected Employees"
                  value={`${form.employee_ids.length} employee selected`}
                  readOnly
                />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-2xl p-4 bg-slate-50 max-h-64 overflow-y-auto">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  icon={<CalendarDays size={16} />}
                  label="Meeting Date"
                  type="date"
                  name="meeting_date"
                  value={form.meeting_date}
                  onChange={handleChange}
                  required
                />

                <Input
                  icon={<Clock size={16} />}
                  label="Meeting Time"
                  type="time"
                  name="meeting_time"
                  value={form.meeting_time}
                  onChange={handleChange}
                  required
                />

                <Input
                  icon={<MapPin size={16} />}
                  label="Place"
                  name="place"
                  value={form.place}
                  onChange={handleChange}
                  placeholder="Enter meeting place"
                />

                <Input
                  icon={<ClipboardPen size={16} />}
                  label="Meeting Attend By"
                  name="meeting_attend_by"
                  value={form.meeting_attend_by}
                  onChange={handleChange}
                  placeholder="Enter meeting attend by"
                />
              </div>

              <TextArea
                icon={<ClipboardPen size={16} />}
                label="Remark"
                name="remark"
                value={form.remark}
                onChange={handleChange}
                rows="4"
                placeholder="Enter remark"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-700 to-cyan-600 hover:from-indigo-800 hover:to-cyan-700 text-white px-7 py-3 rounded-2xl font-black shadow-lg transition-all"
              >
                <Send size={18} />
                Submit Meeting
              </button>
            </form>
          </div>

          {/* RIGHT LIST */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white">
              <h2 className="text-xl font-black">Meeting History</h2>
              <p className="text-sm text-slate-300">
                Search meeting records
              </p>

              <div className="relative mt-4">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by designation, employee, place..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[780px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 text-slate-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Employees</th>
                    <th className="p-3">Date / Time</th>
                    <th className="p-3">Place</th>
                    <th className="p-3">Attend By</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMeetings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">
                        No meeting data found
                      </td>
                    </tr>
                  ) : (
                    filteredMeetings.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-b text-center hover:bg-blue-50/60"
                      >
                        <td className="p-3 font-black text-slate-800">
                          {item.designation || "-"}
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-slate-800">
                            {item.employee_ids || "-"}
                          </div>
                          <div className="text-xs text-slate-500 max-w-52 truncate">
                            {item.employee_names || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <div>{item.meeting_date || "-"}</div>
                          <div className="text-xs text-slate-500">
                            {item.meeting_time || "-"}
                          </div>
                        </td>

                        <td className="p-3">{item.place || "-"}</td>
                        <td className="p-3">{item.meeting_attend_by || "-"}</td>
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
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
          }

          .input[readonly] {
            background: #f8fafc;
          }
        `}</style>
      </div>
    </div>
  );
}

function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="label">
        {icon}
        {label}
      </label>
      <input {...props} className="input" />
    </div>
  );
}

function TextArea({ label, icon, rows = "4", ...props }) {
  return (
    <div>
      <label className="label">
        {icon}
        {label}
      </label>
      <textarea {...props} rows={rows} className="input resize-none" />
    </div>
  );
}