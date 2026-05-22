import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  ClipboardPen,
  MapPin,
  ShieldAlert,
  User,
  Users,
  Search,
  Send,
  Edit,
  X,
  Trash2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../config/api";
import SideNav from "../SideNav";

const CURRENT_PATH = "/add-complaint";

export default function ComplaintForm() {
  const emptyForm = {
    id: "",
    emp_id: "",
    branch_id: "",
    complaint_type: "Emp vs Emp",
    second_employee_id: "",
    complaint_id: "",
    other_person_name: "",
    suspected_type: "Employee",
    suspected_employee: "",
    remark: "",
    incident_datetime: "",
    incident_place: "",
    status: "Pending",
    complaint_raise_by: "",
  };

  const [employees, setEmployees] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");

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

  const formAllowed = editMode ? canEdit : canAdd;

  useEffect(() => {
    fetchEmployees();
    fetchComplaints();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);

      const response = await fetch(`${API_BASE_URL}/get_employee`);
      const data = await response.json();

      let employeeList = [];

      if (Array.isArray(data)) employeeList = data;
      else if (Array.isArray(data.data)) employeeList = data.data;
      else if (Array.isArray(data.result)) employeeList = data.result;

      setEmployees(employeeList);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/emp_complaints`);
      const data = await response.json();
      setComplaints(data.data || data.result || []);
    } catch {
      toast.error("Failed to load complaints");
    }
  };

  const getEmployeeId = (emp) =>
    String(emp?.employee_id || emp?.emp_id || emp?.id || "");

  const getEmployeeName = (emp) =>
    emp?.full_name || emp?.employee_name || emp?.name || "";

  const getEmployeeBranch = (emp) =>
    emp?.work_location || emp?.branch || emp?.branch_name || "";

  const selectedEmployeeData = employees.find(
    (emp) => getEmployeeId(emp) === formData.emp_id
  );

  const branchName =
    formData.branch_id || getEmployeeBranch(selectedEmployeeData);

  const filteredComplaints = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return complaints;

    return complaints.filter((item) =>
      [
        item.id,
        item.complaint_id,
        item.emp_id,
        item.emp_name,
        item.branch_id,
        item.complaint_type,
        item.complaint_between,
        item.suspected_employee,
        item.incident_datetime,
        item.incident_place,
        item.status,
        item.complaint_raise_by,
        item.remark,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [complaints, search]);

  const handleEmployeeSelect = (e) => {
    if (!canAdd) {
      toast.error("You do not have add permission");
      return;
    }

    const selectedEmpId = e.target.value;

    const selectedEmployee = employees.find(
      (emp) => getEmployeeId(emp) === selectedEmpId
    );

    setFormData((prev) => ({
      ...prev,
      emp_id: selectedEmpId,
      suspected_type: "Employee",
      branch_id: getEmployeeBranch(selectedEmployee),
      second_employee_id: "",
      suspected_employee: "",
    }));
  };

  const handleChange = (e) => {
    if (!formAllowed) {
      toast.error(editMode ? "You do not have edit permission" : "You do not have add permission");
      return;
    }

    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "complaint_type") {
        return {
          ...prev,
          complaint_type: value,
          second_employee_id: "",
          other_person_name: "",
          suspected_employee: "",
          suspected_type: "Employee",
        };
      }

      if (name === "second_employee_id") {
        return {
          ...prev,
          second_employee_id: value,
          suspected_employee: "",
        };
      }

      if (name === "suspected_type") {
        return {
          ...prev,
          suspected_type: value,
          suspected_employee: value === "Other" ? "Other" : "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const secondEmployeeOptions = employees.filter((emp) => {
    const empId = getEmployeeId(emp);
    const empBranch = getEmployeeBranch(emp);

    if (!formData.emp_id) return false;

    return (
      empId !== formData.emp_id &&
      String(empBranch).trim() === String(branchName).trim()
    );
  });

  let suspectedEmployeeOptions = [];

  if (formData.complaint_type === "Emp vs Emp") {
    suspectedEmployeeOptions = employees.filter((emp) => {
      const empId = getEmployeeId(emp);
      return empId === formData.emp_id || empId === formData.second_employee_id;
    });
  } else {
    suspectedEmployeeOptions = employees.filter(
      (emp) => getEmployeeId(emp) === formData.emp_id
    );
  }

  const resetForm = () => {
    setEditMode(false);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canAdd) {
      toast.error("You do not have add permission");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        branch_id: branchName,
        complaint_between:
          formData.complaint_type === "Emp vs Emp"
            ? formData.second_employee_id
            : formData.other_person_name,
      };

      const response = await fetch(`${API_BASE_URL}/emp_complaints_post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success || data.status) {
        toast.success("Complaint added successfully");
        resetForm();
        fetchComplaints();
      } else {
        toast.error(data.message || "Failed to submit complaint");
      }
    } catch {
      toast.error("API Error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) {
      toast.error("You do not have edit permission");
      return;
    }

    setEditMode(true);

    const complaintType = item.complaint_type || "Emp vs Emp";

    setFormData({
      id: item.id || "",
      complaint_id: item.complaint_id || "",
      emp_id: item.emp_id || "",
      branch_id: item.branch_id || "",
      complaint_type: complaintType,
      second_employee_id:
        complaintType === "Emp vs Emp" ? item.complaint_between || "" : "",
      other_person_name:
        complaintType === "Emp vs Other" ? item.complaint_between || "" : "",
      suspected_type: item.suspected_type || "Employee",
      suspected_employee: item.suspected_employee || "",
      remark: item.remark || "",
      incident_datetime: item.incident_datetime || "",
      incident_place: item.incident_place || "",
      status: item.status || "Pending",
      complaint_raise_by: item.complaint_raise_by || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!canEdit) {
      toast.error("You do not have edit permission");
      return;
    }

    const updateId = formData.id || "";
    const complaintId = formData.complaint_id || "";

    if (!updateId && !complaintId) {
      toast.error("Complaint ID missing");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id: updateId,
        complaint_id: complaintId,
        status: formData.status,
        remark: formData.remark,
        incident_datetime: formData.incident_datetime,
        incident_place: formData.incident_place,
        complaint_raise_by: formData.complaint_raise_by,
      };

      const response = await fetch(`${API_BASE_URL}/emp_complaints_update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid API Response:", text);
        toast.error("Invalid API response. Check PHP file path or PHP error.");
        return;
      }

      if (data.success || data.status) {
        toast.success(data.message || "Complaint updated successfully");
        resetForm();
        fetchComplaints();
      } else {
        toast.error(data.message || data.error || "Update failed");
        console.error("Update failed:", data);
      }
    } catch (error) {
      console.error("Update API Error:", error);
      toast.error("Update API Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      toast.error("You do not have delete permission");
      return;
    }

    if (!window.confirm("Delete this complaint?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/emp_complaints_delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });

      const data = await response.json();

      if (data.success || data.status) {
        toast.success("Complaint deleted successfully");
        fetchComplaints();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("Delete API Error");
    }
  };

  const inputStyle =
    "w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500";

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

      <div className="flex-1 w-full lg:ml-72 p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="relative bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-[32px] p-4 overflow-hidden shadow-2xl mb-6">
          <div className="absolute -top-20 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="pl-4">
              <div className="flex gap-10">
                <h1 className="text-4xl font-black text-white">
                  Complaint Management
                </h1>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold mt-1">
                  <ShieldAlert size={18} />
                  Employee Complaint System
                </div>
              </div>
              <p className="text-rose-100 mt-3 text-lg">
                Submit, track and update disciplinary complaints
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl px-6 py-5 text-center">
                <Users className="mx-auto text-white" size={28} />
                <div className="text-white text-2xl font-bold mt-2">
                  {employees.length}
                </div>
                <div className="text-rose-100 text-sm">Employees</div>
              </div>

              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl px-6 py-5 text-center">
                <AlertTriangle className="mx-auto text-white" size={28} />
                <div className="text-white text-2xl font-bold mt-2">
                  {complaints.length}
                </div>
                <div className="text-rose-100 text-sm">Complaints</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-white/40">
            <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">
                  {editMode ? "Update Complaint" : "Complaint Form"}
                </h2>
                <p className="text-sm text-slate-300">
                  {formAllowed
                    ? editMode
                      ? "Only status and complaint details update"
                      : "Submit new incident complaint"
                    : editMode
                      ? "View Only Permission - Edit Not Allowed"
                      : "View Only Permission - Add Not Allowed"}
                </p>
              </div>

              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white text-rose-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
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
                    <User size={18} />
                    Employee
                  </label>

                  <select
                    name="emp_id"
                    value={formData.emp_id}
                    onChange={handleEmployeeSelect}
                    className={inputStyle}
                    required
                    disabled={editMode || !canAdd}
                  >
                    <option value="">
                      {loadingEmployees ? "Loading..." : "Select Employee"}
                    </option>

                    {employees.map((emp, index) => (
                      <option key={index} value={getEmployeeId(emp)}>
                        {getEmployeeId(emp)} - {getEmployeeName(emp)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    <Building2 size={18} />
                    Branch
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={branchName || ""}
                    className={`${inputStyle} bg-slate-200 cursor-not-allowed`}
                  />
                </div>

                <div>
                  <label className="label">
                    <Users size={18} />
                    Complaint Type
                  </label>

                  <select
                    name="complaint_type"
                    value={formData.complaint_type}
                    onChange={handleChange}
                    className={inputStyle}
                    disabled={editMode || !canAdd}
                  >
                    <option value="Emp vs Emp">Emp vs Emp</option>
                    <option value="Emp vs Other">Emp vs Other</option>
                  </select>
                </div>

                {formData.complaint_type === "Emp vs Emp" ? (
                  <>
                    <div>
                      <label className="label">
                        <Users size={18} />
                        Complaint Between
                      </label>

                      <select
                        name="second_employee_id"
                        value={formData.second_employee_id}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                        disabled={editMode || !canAdd}
                      >
                        <option value="">Select Second Employee</option>

                        {secondEmployeeOptions.map((emp, index) => (
                          <option key={index} value={getEmployeeId(emp)}>
                            {getEmployeeId(emp)} - {getEmployeeName(emp)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <AlertTriangle size={18} />
                        Suspected Employee
                      </label>

                      <select
                        name="suspected_employee"
                        value={formData.suspected_employee}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                        disabled={editMode || !canAdd}
                      >
                        <option value="">Select Suspected Employee</option>

                        {suspectedEmployeeOptions.map((emp) => (
                          <option key={getEmployeeId(emp)} value={getEmployeeId(emp)}>
                            {getEmployeeId(emp)} - {getEmployeeName(emp)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="label">
                        <Users size={18} />
                        Other Person Name
                      </label>

                      <input
                        type="text"
                        name="other_person_name"
                        value={formData.other_person_name}
                        onChange={handleChange}
                        placeholder="Enter Other Person Name"
                        className={inputStyle}
                        required
                        readOnly={editMode || !canAdd}
                      />
                    </div>

                    <div>
                      <label className="label">
                        <AlertTriangle size={18} />
                        Suspected Type
                      </label>

                      <select
                        name="suspected_type"
                        value={formData.suspected_type}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                        disabled={editMode || !canAdd}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {formData.suspected_type === "Employee" ? (
                      <div>
                        <label className="label">
                          <AlertTriangle size={18} />
                          Suspected Employee
                        </label>

                        <select
                          name="suspected_employee"
                          value={formData.suspected_employee}
                          onChange={handleChange}
                          className={inputStyle}
                          required
                          disabled={editMode || !canAdd}
                        >
                          <option value="">Select Suspected Employee</option>

                          {employees
                            .filter((emp) => getEmployeeId(emp) === formData.emp_id)
                            .map((emp) => (
                              <option key={getEmployeeId(emp)} value={getEmployeeId(emp)}>
                                {getEmployeeId(emp)} - {getEmployeeName(emp)}
                              </option>
                            ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="label">
                          <AlertTriangle size={18} />
                          Suspected Other
                        </label>

                        <input
                          type="text"
                          name="suspected_employee"
                          value={formData.suspected_employee}
                          onChange={handleChange}
                          placeholder="Other"
                          className={inputStyle}
                          required
                          readOnly={editMode || !canAdd}
                        />
                      </div>
                    )}
                  </>
                )}

                <Input
                  label="Incident Date & Time"
                  icon={<CalendarDays size={18} />}
                  type="datetime-local"
                  name="incident_datetime"
                  value={formData.incident_datetime}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Incident Place"
                  icon={<MapPin size={18} />}
                  type="text"
                  name="incident_place"
                  value={formData.incident_place}
                  onChange={handleChange}
                  placeholder="Incident Place"
                  readOnly={!formAllowed}
                  required
                  inputStyle={inputStyle}
                />

                <Input
                  label="Complaint Raise By"
                  icon={<ClipboardPen size={18} />}
                  type="text"
                  name="complaint_raise_by"
                  value={formData.complaint_raise_by}
                  onChange={handleChange}
                  placeholder="Raised By"
                  readOnly={!formAllowed}
                  required
                  inputStyle={inputStyle}
                />

                <div>
                  <label className="label">
                    <ClipboardPen size={18} />
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                    disabled={!formAllowed}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Remark</label>

                  <textarea
                    name="remark"
                    rows="4"
                    value={formData.remark}
                    onChange={handleChange}
                    placeholder="Enter Remark"
                    className={inputStyle}
                    required
                    readOnly={!formAllowed}
                  />
                </div>
              </div>

              {formAllowed ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 hover:scale-[1.01] active:scale-[0.99] text-white py-4 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 disabled:opacity-60 flex justify-center gap-2 items-center"
                >
                  <Send size={18} />
                  {loading
                    ? editMode
                      ? "Updating..."
                      : "Submitting..."
                    : editMode
                      ? "Update Complaint"
                      : "Submit Complaint"}
                </button>
              ) : (
                <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-700 py-4 rounded-2xl text-center font-black">
                  {editMode
                    ? "View Only Permission - Edit Not Allowed"
                    : "View Only Permission - Add Not Allowed"}
                </div>
              )}
            </form>
          </div>

          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-white/40">
            <div className="bg-slate-900 text-white p-5">
              <h2 className="text-xl font-black">Complaint List</h2>
              <p className="text-sm text-slate-300">
                Search, view and update complaints
              </p>

              <div className="relative mt-4">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee, status, place..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[780px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-rose-50 text-slate-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Incident</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">
                        No complaint data found
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-b text-center hover:bg-rose-50/60"
                      >
                        <td className="p-3">
                          <div className="font-black text-slate-800">
                            {item.emp_id || "-"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.emp_name || item.employee_name || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-pink-100 text-pink-700">
                            {item.complaint_type || "-"}
                          </span>
                          <div className="text-xs text-slate-500 mt-1">
                            {item.complaint_between || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <div>{item.incident_datetime || "-"}</div>
                          <div className="text-xs text-slate-500">
                            {item.incident_place || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black ${item.status === "Accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : item.status === "Closed"
                                  ? "bg-slate-200 text-slate-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                          >
                            {item.status || "Pending"}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex gap-2 justify-center">
                            {canEdit ? (
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                              >
                                <Edit size={16} />
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
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                              >
                                <Trash2 size={16} />
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
            gap: 8px;
            margin-bottom: 8px;
            font-weight: 800;
            color: #334155;
          }

          input:read-only,
          textarea:read-only,
          select:disabled {
            background: #f1f5f9;
            color: #64748b;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
}

function Input({
  label,
  icon,
  inputStyle,
  ...props
}) {
  return (
    <div>
      <label className="label">
        {icon}
        {label}
      </label>
      <input {...props} className={inputStyle} />
    </div>
  );
}