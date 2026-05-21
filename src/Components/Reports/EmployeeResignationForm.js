import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Building2,
  CalendarDays,
  FileText,
  ClipboardPen,
  Send,
  Upload,
  Search,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SideNav from "../SideNav";

const API = "https://ojmee.in/employee";
const CURRENT_PATH = "/add-resignation";

const EMPLOYEE_API = `${API}/get_employee`;
const RESIGNATION_GET_API = `${API}/emp_resignation`;
const RESIGNATION_POST_API = `${API}/emp_resignation_post`;
const RESIGNATION_UPDATE_API = `${API}/emp_resignation_update`;
const RESIGNATION_DELETE_API = `${API}/emp_resignation_delete`;

export default function EmployeeResignationForm() {
  const emptyForm = {
    id: "",
    resignation_id: "",
    emp_id: "",
    emp_name: "",
    branch_id: "",
    branch_name: "",
    joining_date: "",
    start_date: "",
    end_date: "",
    total_working_days: "",
    reason: "",
    accepted_by: "",
    remark: "",
    status: "Pending",
  };

  const [employees, setEmployees] = useState([]);
  const [resignations, setResignations] = useState([]);
  const [letterFile, setLetterFile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);

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
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchEmployees(), fetchResignations()]);
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(EMPLOYEE_API);
      const json = await res.json();
      setEmployees(json.data || json || []);
    } catch {
      toast.error("Employee data fetch failed");
    }
  };

  const fetchResignations = async () => {
    try {
      const res = await fetch(RESIGNATION_GET_API);
      const json = await res.json();
      setResignations(json.data || []);
    } catch {
      toast.error("Resignation data fetch failed");
    }
  };

  const resignedEmpIds = resignations.map((item) => String(item.emp_id));

  const activeEmployees = employees.filter((emp) => {
    const empId = String(emp.employee_id || emp.emp_id || emp.id || "");

    if (editMode && String(form.emp_id) === empId) return true;

    return !resignedEmpIds.includes(empId);
  });

  const filteredResignations = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return resignations;

    return resignations.filter((item) =>
      [
        item.resignation_id,
        item.emp_id,
        item.emp_name,
        item.employee_name,
        item.full_name,
        item.branch_id,
        item.branch_name,
        item.start_date,
        item.end_date,
        item.status,
        item.accepted_by,
        item.reason,
        item.remark,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [resignations, search]);

  const calculateDays = (joiningDate, startDate) => {
    if (!joiningDate || !startDate) return "";

    const join = new Date(joiningDate);
    const start = new Date(startDate);

    if (isNaN(join.getTime()) || isNaN(start.getTime())) return "";

    const diffTime = start - join;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : 0;
  };

  const formAllowed = editMode ? canEdit : canAdd;

  const handleEmployeeSelect = (empId) => {
    if (!canAdd) {
      toast.error("You do not have add permission");
      return;
    }

    const emp = activeEmployees.find(
      (e) =>
        String(e.employee_id) === String(empId) ||
        String(e.emp_id) === String(empId) ||
        String(e.id) === String(empId)
    );

    const joiningDate =
      emp?.joining_date || emp?.join_date || emp?.date_of_joining || "";

    const branchId =
      emp?.branch_id ||
      emp?.branch_code ||
      emp?.branch ||
      emp?.work_location ||
      "";

    const branchName =
      emp?.branch_name || emp?.branch || emp?.work_location || branchId || "";

    const empName = emp?.full_name || emp?.employee_name || emp?.name || "";

    setForm((prev) => ({
      ...prev,
      emp_id: empId,
      emp_name: empName,
      branch_id: branchId,
      branch_name: branchName,
      joining_date: joiningDate,
      total_working_days: calculateDays(joiningDate, prev.start_date),
    }));
  };

  const handleChange = (e) => {
    if (!editMode && !canAdd) {
      toast.error("You do not have add permission");
      return;
    }

    if (editMode && !canEdit) {
      toast.error("You do not have edit permission");
      return;
    }

    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "start_date") {
        updated.total_working_days = calculateDays(updated.joining_date, value);
      }

      return updated;
    });
  };

  const handleFileChange = (e) => {
    if (!formAllowed) {
      toast.error(editMode ? "You do not have edit permission" : "You do not have add permission");
      return;
    }

    setLetterFile(e.target.files[0]);
  };

  const resetForm = () => {
    setLetterFile(null);
    setForm(emptyForm);
  };

  const cancelEdit = () => {
    setEditMode(false);
    resetForm();
  };

  const validateForm = () => {
    if (!form.emp_id || !form.branch_id || !form.start_date) {
      return "Employee, Branch and Start Date required";
    }

    return "";
  };

  const createFormData = () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value || "");
    });

    if (letterFile) {
      formData.append("resignation_letter", letterFile);
    }

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canAdd) {
      toast.error("You do not have add permission");
      return;
    }

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const alreadyResigned = resignations.some(
      (item) => String(item.emp_id) === String(form.emp_id)
    );

    if (alreadyResigned) {
      toast.error("This employee resignation already exists");
      return;
    }

    try {
      const res = await fetch(RESIGNATION_POST_API, {
        method: "POST",
        body: createFormData(),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Resignation saved successfully");
        resetForm();
        fetchResignations();
      } else {
        toast.error(json.message || "Resignation save failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) {
      toast.error("You do not have edit permission");
      return;
    }

    setEditMode(true);

    setForm({
      id: item.id || "",
      resignation_id: item.resignation_id || "",
      emp_id: item.emp_id || "",
      emp_name: item.emp_name || item.employee_name || item.full_name || "",
      branch_id: item.branch_id || "",
      branch_name: item.branch_name || "",
      joining_date: item.joining_date || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      total_working_days: item.total_working_days || "",
      reason: item.reason || "",
      accepted_by: item.accepted_by || "",
      remark: item.remark || "",
      status: item.status || "Pending",
    });

    setLetterFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!canEdit) {
      toast.error("You do not have edit permission");
      return;
    }

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    if (!form.id) {
      toast.error("Resignation ID missing");
      return;
    }

    try {
      const res = await fetch(RESIGNATION_UPDATE_API, {
        method: "POST",
        body: createFormData(),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Resignation updated successfully");
        setEditMode(false);
        resetForm();
        fetchResignations();
      } else {
        toast.error(json.message || "Resignation update failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      toast.error("You do not have delete permission");
      return;
    }

    if (!window.confirm("Delete this resignation?")) return;

    try {
      const res = await fetch(RESIGNATION_DELETE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Resignation deleted successfully");
        fetchResignations();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
          <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-rose-600 to-red-600 p-6 text-white shadow-xl mb-6">
            <h1 className="text-3xl font-black">Employee Resignation</h1>
            <p className="text-orange-100 mt-1">
              Manage employee resignation details, letters and approval history
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="p-5 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-800">
                    {editMode ? "Update Resignation" : "Resignation Form"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {formAllowed
                      ? "Fill employee resignation details carefully"
                      : editMode
                      ? "View Only Permission - Edit Not Allowed"
                      : "View Only Permission - Add Not Allowed"}
                  </p>
                </div>

                {editMode && (
                  <button
                    type="button"
                    onClick={cancelEdit}
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
                <div>
                  <label className="label">
                    <User size={16} /> Employee ID & Name
                  </label>

                  <select
                    value={form.emp_id}
                    onChange={(e) => handleEmployeeSelect(e.target.value)}
                    className="input"
                    required
                    disabled={editMode || !canAdd}
                  >
                    <option value="">Select employee</option>

                    {activeEmployees.map((emp, index) => {
                      const id = emp.employee_id || emp.emp_id || emp.id;
                      const name =
                        emp.full_name || emp.employee_name || emp.name || "";

                      return (
                        <option key={index} value={id}>
                          {id} - {name}
                        </option>
                      );
                    })}
                  </select>

                  {activeEmployees.length === 0 && !editMode && (
                    <p className="text-sm text-red-600 mt-2">
                      No employee available. All employees already resigned.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input icon={<User size={16} />} label="Employee Name" value={form.emp_name} readOnly />

                  <Input
                    icon={<Building2 size={16} />}
                    label="Branch ID & Name"
                    value={form.branch_id ? `${form.branch_id} - ${form.branch_name}` : ""}
                    readOnly
                  />

                  <Input icon={<CalendarDays size={16} />} label="Joining Date" type="date" name="joining_date" value={form.joining_date} readOnly />

                  <Input
                    icon={<CalendarDays size={16} />}
                    label="Start Date"
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    readOnly={!formAllowed}
                    required
                  />

                  <Input
                    icon={<CalendarDays size={16} />}
                    label="End Date"
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    readOnly={!formAllowed}
                  />

                  <Input
                    icon={<CalendarDays size={16} />}
                    label="Day Difference"
                    value={form.total_working_days !== "" ? `${form.total_working_days} Days` : ""}
                    readOnly
                  />

                  <Input
                    icon={<ClipboardPen size={16} />}
                    label="Accepted By"
                    name="accepted_by"
                    value={form.accepted_by}
                    onChange={handleChange}
                    placeholder="Accepted by"
                    readOnly={!formAllowed}
                  />

                  {editMode && (
                    <div>
                      <label className="label">
                        <ClipboardPen size={16} /> Status
                      </label>

                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="input"
                        required
                        disabled={!canEdit}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  )}
                </div>

                <TextArea
                  icon={<FileText size={16} />}
                  label="Reason"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Enter resignation reason"
                  readOnly={!formAllowed}
                />

                <div>
                  <label className="label">
                    <Upload size={16} /> Upload Resignation Letter
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="input"
                    disabled={!formAllowed}
                  />
                </div>

                <TextArea
                  icon={<ClipboardPen size={16} />}
                  label="Remark"
                  name="remark"
                  value={form.remark}
                  onChange={handleChange}
                  placeholder="Enter remark"
                  rows="3"
                  readOnly={!formAllowed}
                />

                <div className="flex gap-3">
                  {formAllowed ? (
                    <button
                      type="submit"
                      disabled={!editMode && activeEmployees.length === 0}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-7 py-3 rounded-2xl font-black shadow-lg disabled:opacity-60"
                    >
                      <Send size={18} />
                      {editMode ? "Update Resignation" : "Submit Resignation"}
                    </button>
                  ) : (
                    <div className="flex-1 bg-yellow-50 border border-yellow-200 text-yellow-700 px-7 py-3 rounded-2xl font-black text-center">
                      {editMode
                        ? "View Only Permission - Edit Not Allowed"
                        : "View Only Permission - Add Not Allowed"}
                    </div>
                  )}

                  {editMode && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-slate-600 text-white px-7 py-3 rounded-2xl font-black"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="p-5 bg-slate-900 text-white">
                <h2 className="text-xl font-black">Resignation History</h2>
                <p className="text-sm text-slate-300">
                  Search employee resignation records
                </p>

                <div className="relative mt-4">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by employee, branch, status, reason..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[780px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-orange-50 text-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Start</th>
                      <th className="p-3">End</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredResignations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No resignation data found
                        </td>
                      </tr>
                    ) : (
                      filteredResignations.map((item, index) => (
                        <tr
                          key={item.id || index}
                          className="border-b text-center hover:bg-orange-50/60"
                        >
                          <td className="p-3">
                            <div className="font-black text-slate-800">
                              {item.emp_id}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.emp_name || item.employee_name || item.full_name || "-"}
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="font-bold">{item.branch_id || "-"}</div>
                            <div className="text-xs text-slate-500">
                              {item.branch_name || "-"}
                            </div>
                          </td>

                          <td className="p-3">{item.start_date || "-"}</td>
                          <td className="p-3">{item.end_date || "-"}</td>

                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black ${
                                item.status === "Accepted"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : item.status === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {item.status || "Pending"}
                            </span>
                          </td>

                          <td className="p-3">
                            <div className="flex gap-2 justify-center">
                              {item.status === "Pending" && canEdit ? (
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1"
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
                                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1"
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
              border-color: #f97316;
              box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
            }

            .input[readonly],
            .input:disabled,
            textarea[readonly] {
              background: #f8fafc;
              color: #64748b;
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