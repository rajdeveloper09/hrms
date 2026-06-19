import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  FileText,
  IndianRupee,
  User,
  Building2,
  CalendarDays,
  ClipboardPen,
  Send,
  Search,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SideNav from "../SideNav";

const API = "https://hrms-apis-ezda.onrender.com";
const CURRENT_PATH = "/add-penalty";

const COMPLAINT_API = `${API}/emp_complaints`;
const EMPLOYEE_API = `${API}/get_employee`;
const PENALTY_GET_API = `${API}/emp_penalties`;
const PENALTY_POST_API = `${API}/emp_penalties_post`;
const PENALTY_UPDATE_API = `${API}/emp_penalties_update`;
const PENALTY_DELETE_API = `${API}/emp_penalties_delete`;

const emptyForm = {
  id: "",
  penalty_id: "",
  complaint_id: "",
  emp_id: "",
  emp_name: "",
  branch_id: "",
  complaint_date: "",
  penalty_date: "",
  penalty_amount: "",
  remark: "",
  reported_by: "",
  status: "Pending",
};

export default function EmployeePenaltyForm() {
  const [penaltyType, setPenaltyType] = useState("Complaint");
  const [complaints, setComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [search] = useState("");
  const [penaltySearch, setPenaltySearch] = useState("");
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
    fetchComplaintsAndPenalties();
    fetchEmployees();
  }, []);

  const fetchComplaintsAndPenalties = async () => {
    try {
      const [complaintRes, penaltyRes] = await Promise.all([
        fetch(COMPLAINT_API),
        fetch(PENALTY_GET_API),
      ]);

      const complaintJson = await complaintRes.json();
      const penaltyJson = await penaltyRes.json();

      const complaintList = Array.isArray(complaintJson)
        ? complaintJson
        : complaintJson.data || [];

      const penaltyList = Array.isArray(penaltyJson)
        ? penaltyJson
        : penaltyJson.data || [];

      setAllComplaints(complaintList);
      setPenalties(penaltyList);

      const penalizedComplaintIds = penaltyList
        .filter((p) => p.penalty_type === "Complaint")
        .map((p) => String(p.complaint_id));

      const filtered = complaintList.filter((item) => {
        const suspected = String(item.suspected_employee || "")
          .trim()
          .toLowerCase();

        const status = String(item.status || "")
          .trim()
          .toLowerCase();

        const complaintId = String(item.complaint_id || item.id);

        return (
          suspected !== "" &&
          suspected !== "other" &&
          status === "completed" &&
          !penalizedComplaintIds.includes(complaintId)
        );
      });

      setComplaints(filtered);
    } catch {
      toast.error("Complaint / penalty data fetch failed");
    }
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

  const getEmployeeName = (empId) => {
    const emp = employees.find(
      (e) =>
        String(e.employee_id) === String(empId) ||
        String(e.emp_id) === String(empId) ||
        String(e.id) === String(empId)
    );

    return emp?.full_name || emp?.employee_name || emp?.name || "";
  };

  const resetForm = () => {
    setEditMode(false);
    setPenaltyType("Complaint");
    setSelectedComplaint("");
    setForm(emptyForm);
  };

  const handlePenaltyTypeChange = (value) => {
    if (!editMode && !canAdd) return toast.error("You do not have add permission");
    if (editMode && !canEdit) return toast.error("You do not have edit permission");

    setPenaltyType(value);
    setSelectedComplaint("");
    setForm(emptyForm);
  };

  const handleComplaintSelect = (complaintId) => {
    if (!editMode && !canAdd) return toast.error("You do not have add permission");
    if (editMode && !canEdit) return toast.error("You do not have edit permission");

    setSelectedComplaint(complaintId);

    const complaint = complaints.find(
      (item) => String(item.complaint_id || item.id) === String(complaintId)
    );

    if (!complaint) return;

    const penaltyEmpId = complaint.suspected_employee;
    const empName = getEmployeeName(penaltyEmpId);

    setForm({
      ...emptyForm,
      complaint_id: complaint.complaint_id || complaint.id || "",
      emp_id: penaltyEmpId || "",
      emp_name: empName,
      branch_id: complaint.branch_id || "",
      complaint_date: complaint.created_at || complaint.incident_datetime || "",
      remark: complaint.remark || complaint.full_details || "",
      reported_by: complaint.complaint_raise_by || "",
      status: "Pending",
    });
  };

  const handleEmployeeSelect = (empId) => {
    if (!editMode && !canAdd) return toast.error("You do not have add permission");
    if (editMode && !canEdit) return toast.error("You do not have edit permission");

    const emp = employees.find(
      (e) =>
        String(e.employee_id) === String(empId) ||
        String(e.emp_id) === String(empId) ||
        String(e.id) === String(empId)
    );

    setForm((prev) => ({
      ...prev,
      emp_id: empId,
      emp_name: emp?.full_name || emp?.employee_name || emp?.name || "",
      branch_id:
        emp?.branch_id ||
        emp?.branch ||
        emp?.branch_name ||
        emp?.work_location ||
        "",
    }));
  };


  const handleChange = (e) => {
    if (!editMode && !canAdd) return toast.error("You do not have add permission");
    if (editMode && !canEdit) return toast.error("You do not have edit permission");

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!form.emp_id || !form.branch_id || !form.penalty_amount) {
      return "Employee, Branch and Penalty Amount required";
    }

    if (penaltyType === "Complaint" && !form.complaint_id) {
      return "Please select complaint";
    }

    return "";
  };

  const buildPayload = () => ({
    id: form.id,
    penalty_id: form.penalty_id,
    penalty_type: penaltyType,
    complaint_id: penaltyType === "Complaint" ? form.complaint_id : "",
    emp_id: form.emp_id,
    emp_name: form.emp_name,
    branch_id: form.branch_id,
    penalty_date: form.penalty_date,
    complaint_date: penaltyType === "Complaint" ? form.complaint_date : "",
    penalty_amount: form.penalty_amount,
    remark: form.remark,
    reported_by: form.reported_by,
    status: form.status,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canAdd) return toast.error("You do not have add permission");

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      const res = await fetch(PENALTY_POST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Penalty saved successfully");
        resetForm();
        await fetchComplaintsAndPenalties();
      } else {
        toast.error(json.message || "Penalty save failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) return toast.error("You do not have edit permission");

    const type = item.penalty_type || "New";

    setPenaltyType(type);
    setSelectedComplaint(item.complaint_id || "");
    setEditMode(true);

    setForm({
      id: item.id || "",
      penalty_id: item.penalty_id || "",
      complaint_id: item.complaint_id || "",
      emp_id: item.emp_id || "",
      emp_name: item.emp_name || "",
      branch_id: item.branch_id || "",
      complaint_date: item.complaint_date || "",
      penalty_date: item.penalty_date || "",
      penalty_amount: item.penalty_amount || "",
      remark: item.remark || "",
      reported_by: item.reported_by || "",
      status: item.status || "Pending",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!canEdit) return toast.error("You do not have edit permission");
    if (!form.id) return toast.error("Penalty ID missing");

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      const res = await fetch(PENALTY_UPDATE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Penalty updated successfully");
        resetForm();
        await fetchComplaintsAndPenalties();
      } else {
        toast.error(json.message || "Penalty update failed");
      }
    } catch {
      toast.error("Update server error");
    }
  };

  const handleDelete = async (item) => {
    if (!canDelete) return toast.error("You do not have delete permission");

    if (!window.confirm("Delete this penalty?")) return;

    try {
      const res = await fetch(PENALTY_DELETE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Penalty deleted successfully");
        await fetchComplaintsAndPenalties();
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch {
      toast.error("Delete server error");
    }
  };


  const filteredPenalties = useMemo(() => {
    const q = penaltySearch.toLowerCase().trim();
    if (!q) return penalties;

    return penalties.filter((item) =>
      [
        item.penalty_id,
        item.penalty_type,
        item.complaint_id,
        item.emp_id,
        item.emp_name,
        item.branch_id,
        item.penalty_amount,
        item.penalty_date,
        item.reported_by,
        item.status,
        item.remark,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [penalties, penaltySearch]);

  const noCompletedComplaint =
    penaltyType === "Complaint" && complaints.length === 0;

  const formAllowed = editMode ? canEdit : canAdd;

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
      <Toaster position="top-right" />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-4 overflow-y-auto min-h-screen">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 p-6 shadow-2xl mb-6">
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-5">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
                <AlertTriangle size={38} className="text-white" />
              </div>

              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  Employee Penalty
                </h1>
                <p className="text-red-100 mt-2 text-lg">
                  Complaint reference penalty or new manual penalty
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard title="Complaints" value={allComplaints.length} />
              <StatCard title="Available" value={complaints.length} />
              <StatCard title="Penalties" value={penalties.length} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white shadow-2xl overflow-hidden">
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    {editMode ? "Update Penalty" : "Penalty Information"}
                  </h2>
                  <p className="text-sm text-slate-300">
                    {formAllowed
                      ? "Fill employee penalty details carefully"
                      : editMode
                        ? "View Only Permission - Edit Not Allowed"
                        : "View Only Permission - Add Not Allowed"}
                  </p>
                </div>

                {editMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-white text-red-600 px-4 py-2 rounded-xl font-black flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>

              <form
                onSubmit={editMode ? handleUpdate : handleSubmit}
                className="p-6 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Penalty Type" icon={<AlertTriangle size={16} />}>
                    <select
                      value={penaltyType}
                      onChange={(e) => handlePenaltyTypeChange(e.target.value)}
                      className="input"
                      disabled={!formAllowed || editMode}
                    >
                      <option value="Complaint">Already Complaint & Status Accepted </option>
                      <option value="New">New Penalty</option>
                    </select>
                  </Field>

                  {penaltyType === "Complaint" && !noCompletedComplaint && !editMode && (
                    <Field label="Complaint Number" icon={<FileText size={16} />}>
                      <select
                        value={selectedComplaint}
                        onChange={(e) => handleComplaintSelect(e.target.value)}
                        className="input"
                        disabled={!formAllowed}
                        required
                      >
                        <option value="">Select completed complaint</option>

                        {complaints.map((item) => (
                          <option
                            key={item.complaint_id || item.id}
                            value={item.complaint_id || item.id}
                          >
                            CMP-{item.complaint_id || item.id} /{" "}
                            {item.suspected_employee}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  <Field label="Employee" icon={<User size={16} />}>
                    {penaltyType === "Complaint" || editMode ? (
                      <input
                        value={`${form.emp_id} ${form.emp_name ? "- " + form.emp_name : ""
                          }`}
                        readOnly
                        className="input read"
                      />
                    ) : (
                      <select
                        value={form.emp_id}
                        onChange={(e) => handleEmployeeSelect(e.target.value)}
                        className="input"
                        disabled={!formAllowed}
                      >
                        <option value="">Select employee</option>

                        {employees.map((emp, index) => {
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
                    )}
                  </Field>

                  <Field label="Branch" icon={<Building2 size={16} />}>
                    <input value={form.branch_id} readOnly className="input read" />
                  </Field>

                  <Field label="Penalty Date" icon={<CalendarDays size={16} />}>
                    <input
                      type="date"
                      name="penalty_date"
                      value={form.penalty_date}
                      onChange={handleChange}
                      className="input"
                      readOnly={!formAllowed}
                      required
                    />
                  </Field>

                  <Field label="Penalty Amount" icon={<IndianRupee size={16} />}>
                    <input
                      type="number"
                      name="penalty_amount"
                      value={form.penalty_amount}
                      onChange={handleChange}
                      placeholder="Enter penalty amount"
                      className="input"
                      readOnly={!formAllowed}
                      required
                    />
                  </Field>

                  <Field label="Reported By" icon={<ClipboardPen size={16} />}>
                    <input
                      name="reported_by"
                      value={form.reported_by}
                      onChange={handleChange}
                      placeholder="Reported by"
                      className="input"
                      readOnly={!formAllowed}
                    />
                  </Field>

                  <Field label="Status" icon={<ClipboardPen size={16} />}>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="input"
                      disabled={!formAllowed}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </Field>
                </div>

                <Field label="Remark" icon={<FileText size={16} />}>
                  <textarea
                    name="remark"
                    value={form.remark}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Write detailed remark..."
                    className="input resize-none"
                    readOnly={!formAllowed}
                  />
                </Field>

                {formAllowed ? (
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-500 text-white px-10 py-4 rounded-2xl font-black shadow-2xl"
                  >
                    <Send size={19} />
                    {editMode ? "Update Penalty" : "Submit Penalty"}
                  </button>
                ) : (
                  <div className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
                    <div className="text-yellow-700 font-black">
                      {editMode
                        ? "View Only Permission - Edit Not Allowed"
                        : "View Only Permission - Add Not Allowed"}
                    </div>
                  </div>
                )}
              </form>
            </div>

          </div>

          <div className="bg-white rounded-[32px] border border-white shadow-2xl overflow-hidden">

            <div className="bg-white rounded-[32px] border border-white shadow-2xl overflow-hidden">
              <div className="bg-slate-900 text-white p-5">
                <h2 className="text-xl font-black">Penalty List</h2>

                <div className="relative mt-4">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={penaltySearch}
                    onChange={(e) => setPenaltySearch(e.target.value)}
                    placeholder="Search penalty, employee, status..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-red-50 text-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Penalty</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPenalties.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500">
                          No penalty data found
                        </td>
                      </tr>
                    ) : (
                      filteredPenalties.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b text-center hover:bg-red-50/60"
                        >
                          <td className="p-3">
                            <div className="font-black">{item.emp_id}</div>
                            <div className="text-xs text-slate-500">
                              {item.emp_name || "-"}
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="font-bold">{item.penalty_type}</div>
                            <div className="text-xs text-slate-500">
                              {item.complaint_id
                                ? `CMP-${item.complaint_id}`
                                : "Manual"}
                            </div>
                          </td>

                          <td className="p-3 font-black text-red-600">
                            ₹{Number(item.penalty_amount || 0).toLocaleString("en-IN")}
                          </td>

                          <td className="p-3">
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-700">
                              {item.status || "Pending"}
                            </span>
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
        </div>

        <style>{`
          .field-card {
            background: linear-gradient(180deg, #ffffff, #f8fafc);
            border: 1px solid #e2e8f0;
            padding: 18px;
            border-radius: 24px;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
          }

          .label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 800;
            color: #334155;
            margin-bottom: 10px;
          }

          .input {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 14px 16px;
            outline: none;
            font-size: 14px;
            background: white;
            transition: all 0.25s ease;
          }

          .input:focus {
            border-color: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
          }

          .input:read-only,
          .input:disabled,
          textarea:read-only {
            background: #f8fafc;
            color: #64748b;
            cursor: not-allowed;
          }

          .read {
            background: #f8fafc;
            color: #64748b;
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div className="field-card">
      <label className="label">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white/15 border border-white/20 backdrop-blur-xl rounded-3xl px-6 py-4 shadow-lg text-white min-w-[150px]">
      <div className="text-white/80 text-sm font-medium">{title}</div>
      <div className="text-white text-3xl font-black">{value}</div>
    </div>
  );
}