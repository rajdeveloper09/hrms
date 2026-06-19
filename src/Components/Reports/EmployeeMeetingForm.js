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
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SideNav from "../SideNav";

const API = "https://hrms-apis-ezda.onrender.com";
const CURRENT_PATH = "/add-meeting";

const EMPLOYEE_API = `${API}/get_employee`;
const MEETING_GET_API = `${API}/emp_meetings`;
const MEETING_POST_API = `${API}/emp_meetings_post`;
const MEETING_UPDATE_API = `${API}/emp_meetings_update`;
const MEETING_DELETE_API = `${API}/emp_meetings_delete`;

const emptyForm = {
  id: "",
  designation: "",
  employee_ids: [],
  employee_names: [],
  meeting_date: "",
  meeting_time: "",
  place: "",
  meeting_attend_by: "",
  remark: "",
};

export default function EmployeeMeetingForm() {
  const [employees, setEmployees] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState(emptyForm);

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

  const normalizeIds = (value) => {
    if (Array.isArray(value)) return value;
    return String(value || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  };

  const normalizeNames = (value) => {
    if (Array.isArray(value)) return value;
    return String(value || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  };

  const handleDesignationChange = (e) => {
    if (!editMode && !canAdd) return toast.error("You do not have add permission");
    if (editMode && !canEdit) return toast.error("You do not have edit permission");

    const designation = e.target.value;

    const filtered = employees.filter(
      (emp) =>
        String(emp.designation || "").toLowerCase() ===
        String(designation || "").toLowerCase()
    );

    setFilteredEmployees(filtered);

    setForm((prev) => ({
      ...prev,
      designation,
      employee_ids: [],
      employee_names: [],
    }));
  };

  const handleEmployeeCheckbox = (emp) => {
    if (!editMode && !canAdd) return toast.error("You do not have add permission");
    if (editMode && !canEdit) return toast.error("You do not have edit permission");

    const empId = emp.employee_id || emp.emp_id || emp.id;
    const empName = emp.full_name || emp.employee_name || emp.name || "";

    const alreadySelected = form.employee_ids.includes(empId);

    if (alreadySelected) {
      setForm((prev) => ({
        ...prev,
        employee_ids: prev.employee_ids.filter((id) => id !== empId),
        employee_names: prev.employee_names.filter((name) => name !== empName),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        employee_ids: [...prev.employee_ids, empId],
        employee_names: [...prev.employee_names, empName],
      }));
    }
  };

  const handleChange = (e) => {
    if (!editMode && !canAdd) return toast.error("You do not have add permission");
    if (editMode && !canEdit) return toast.error("You do not have edit permission");

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditMode(false);
    setForm(emptyForm);
    setFilteredEmployees([]);
  };

  const validateForm = () => {
    if (
      !form.designation ||
      form.employee_ids.length === 0 ||
      !form.meeting_date ||
      !form.meeting_time
    ) {
      return "Designation, Employee, Date and Time required";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canAdd) return toast.error("You do not have add permission");

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      const res = await fetch(MEETING_POST_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.success || json.status) {
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

  const handleEdit = (item) => {
    if (!canEdit) return toast.error("You do not have edit permission");

    const ids = normalizeIds(item.employee_ids);
    const names = normalizeNames(item.employee_names);

    const filtered = employees.filter(
      (emp) =>
        String(emp.designation || "").toLowerCase() ===
        String(item.designation || "").toLowerCase()
    );

    setFilteredEmployees(filtered);

    setForm({
      id: item.id || "",
      designation: item.designation || "",
      employee_ids: ids,
      employee_names: names,
      meeting_date: item.meeting_date || "",
      meeting_time: item.meeting_time || "",
      place: item.place || "",
      meeting_attend_by: item.meeting_attend_by || "",
      remark: item.remark || "",
    });

    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!canEdit) return toast.error("You do not have edit permission");
    if (!form.id) return toast.error("Meeting ID missing");

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      const res = await fetch(MEETING_UPDATE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Meeting updated successfully");
        resetForm();
        fetchMeetings();
      } else {
        toast.error(json.message || "Meeting update failed");
      }
    } catch {
      toast.error("Update server error");
    }
  };

  const handleDelete = async (item) => {
    if (!canDelete) return toast.error("You do not have delete permission");

    if (!window.confirm("Delete this meeting?")) return;

    try {
      const res = await fetch(MEETING_DELETE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Meeting deleted successfully");
        fetchMeetings();
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch {
      toast.error("Delete server error");
    }
  };

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

  const formAllowed = editMode ? canEdit : canAdd;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
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
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="p-5 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800">
                    {editMode ? "Update Meeting" : "Create Meeting"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {formAllowed
                      ? "Select designation, employees and meeting details"
                      : editMode
                      ? "View Only Permission - Edit Not Allowed"
                      : "View Only Permission - Add Not Allowed"}
                  </p>
                </div>

                {editMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-slate-700 text-white px-4 py-2 rounded-xl font-black flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>

              <form
                onSubmit={editMode ? handleUpdate : handleSubmit}
                className="p-6 space-y-5"
              >
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
                      disabled={!formAllowed}
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
                              className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 ${
                                formAllowed
                                  ? "cursor-pointer hover:bg-indigo-50"
                                  : "cursor-not-allowed opacity-70"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={form.employee_ids.includes(empId)}
                                onChange={() => handleEmployeeCheckbox(emp)}
                                disabled={!formAllowed}
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
                    readOnly={!formAllowed}
                    required
                  />

                  <Input
                    icon={<Clock size={16} />}
                    label="Meeting Time"
                    type="time"
                    name="meeting_time"
                    value={form.meeting_time}
                    onChange={handleChange}
                    readOnly={!formAllowed}
                    required
                  />

                  <Input
                    icon={<MapPin size={16} />}
                    label="Place"
                    name="place"
                    value={form.place}
                    onChange={handleChange}
                    readOnly={!formAllowed}
                    placeholder="Enter meeting place"
                  />

                  <Input
                    icon={<ClipboardPen size={16} />}
                    label="Meeting Attend By"
                    name="meeting_attend_by"
                    value={form.meeting_attend_by}
                    onChange={handleChange}
                    readOnly={!formAllowed}
                    placeholder="Enter meeting attend by"
                  />
                </div>

                <TextArea
                  icon={<ClipboardPen size={16} />}
                  label="Remark"
                  name="remark"
                  value={form.remark}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  rows="4"
                  placeholder="Enter remark"
                />

                {formAllowed ? (
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-700 to-cyan-600 hover:from-indigo-800 hover:to-cyan-700 text-white px-7 py-3 rounded-2xl font-black shadow-lg transition-all"
                  >
                    <Send size={18} />
                    {editMode ? "Update Meeting" : "Submit Meeting"}
                  </button>
                ) : (
                  <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-700 px-7 py-3 rounded-2xl font-black text-center">
                    {editMode
                      ? "View Only Permission - Edit Not Allowed"
                      : "View Only Permission - Add Not Allowed"}
                  </div>
                )}
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="p-5 bg-slate-900 text-white">
                <h2 className="text-xl font-black">Meeting History</h2>
                <p className="text-sm text-slate-300">Search meeting records</p>

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
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMeetings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
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
                          <td className="p-3">
                            {item.meeting_attend_by || "-"}
                          </td>

                          <td className="p-3">
                            <div className="flex gap-2 justify-center">
                              {canEdit ? (
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="bg-amber-500 text-white px-3 py-2 rounded-xl font-bold flex items-center gap-1"
                                >
                                  <Edit size={15} />
                                  Edit
                                </button>
                              ) : (
                                <span className="text-xs font-black text-slate-400">
                                  View Only
                                </span>
                              )}

                              {canDelete && (
                                <button
                                  onClick={() => handleDelete(item)}
                                  className="bg-red-600 text-white px-3 py-2 rounded-xl font-bold flex items-center gap-1"
                                >
                                  <Trash2 size={15} />
                                  Delete
                                </button>
                              )}
                            </div>
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

            .input[readonly],
            .input:disabled,
            textarea[readonly] {
              background: #f8fafc;
              cursor: not-allowed;
            }
          `}</style>
        </div>
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