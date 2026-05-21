import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import {
  Search,
  Send,
  ArrowRightLeft,
  User,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API = "https://ojmee.in/employee";
const CURRENT_PATH = "/add-transfer";

export default function EmployeeTransferForm() {
  const emptyForm = {
    id: "",
    transfer_id: "",
    emp_id: "",
    emp_name: "",
    branch_id: "",
    branch_name: "",
    new_branch_id: "",
    start_date: "",
    end_date: "",
    difference_day: "Working",
    department: "",
    new_department: "",
    designation: "",
    new_designation: "",
    transfer_by: "",
    remark: "",
  };

  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newDesignations, setNewDesignations] = useState([]);
  const [transferList, setTransferList] = useState([]);
  const [form, setForm] = useState(emptyForm);
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
    fetchBranches();
    fetchDepartments();
    fetchTransfers();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/get_employee`);
      setEmployees(res.data.data || []);
    } catch (error) {
      console.log("Employee API Error:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API}/branches`);
      setBranches(res.data.data || []);
    } catch (error) {
      console.log("Branches API Error:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API}/departments`);
      setDepartments(res.data.data || []);
    } catch (error) {
      console.log("Departments API Error:", error);
    }
  };

  const fetchTransfers = async () => {
    try {
      const res = await axios.get(`${API}/emp_transfer_branch`);
      setTransferList(res.data.data || []);
    } catch (error) {
      console.log("Transfer API Error:", error);
    }
  };

  const filteredTransferList = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return transferList;

    return transferList.filter((item) =>
      [
        item.transfer_id,
        item.emp_id,
        item.emp_name,
        item.branch_id,
        item.branch_name,
        item.new_branch_id,
        item.start_date,
        item.end_date,
        item.difference_day,
        item.department,
        item.new_department,
        item.designation,
        item.new_designation,
        item.transfer_by,
        item.remark,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [transferList, search]);

  const calculateDifference = (startDate, endDate) => {
    if (!endDate) return "Working";

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) return "Invalid Date";

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return `${diffDays} Days`;
  };

  const handleEmployeeChange = (e) => {
    if (!canAdd) {
      toast.error("You do not have add permission");
      return;
    }

    const empId = e.target.value;
    const emp = employees.find((item) => item.employee_id === empId);

    if (!emp) {
      setForm(emptyForm);
      return;
    }

    setForm({
      ...emptyForm,
      emp_id: emp.employee_id,
      emp_name: emp.full_name || emp.employee_name || emp.name || "",
      branch_id: emp.work_location || emp.branch_id || "",
      branch_name: emp.work_location || emp.branch_name || emp.branch_id || "",
      start_date: emp.joining_date || "",
      department: emp.department || "",
      designation: emp.designation || "",
      difference_day: "Working",
    });
  };

  const handleNewDepartmentChange = (e) => {
    if (!formAllowed) {
      toast.error(editMode ? "You do not have edit permission" : "You do not have add permission");
      return;
    }

    const deptName = e.target.value;
    const selectedDept = departments.find((dept) => dept.name === deptName);

    setNewDesignations(selectedDept?.designations || []);

    setForm((prev) => ({
      ...prev,
      new_department: deptName,
      new_designation: "",
    }));
  };

  const handleChange = (e) => {
    if (!formAllowed) {
      toast.error(editMode ? "You do not have edit permission" : "You do not have add permission");
      return;
    }

    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "end_date") {
        updated.difference_day = calculateDifference(updated.start_date, value);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editMode && !canAdd) {
      toast.error("You do not have add permission");
      return;
    }

    if (editMode && !canEdit) {
      toast.error("You do not have edit permission");
      return;
    }

    if (!form.emp_id) return toast.error("Select employee");
    if (!form.new_branch_id) return toast.error("New branch required");
    if (!form.new_department) return toast.error("New department required");
    if (!form.new_designation) return toast.error("New designation required");
    if (!form.transfer_by) return toast.error("Transfer by required");

    try {
      const url = editMode
        ? `${API}/emp_transfer_branch_update`
        : `${API}/emp_transfer_branch_post`;

      const res = await axios.post(url, form);

      if (res.data.status || res.data.success) {
        toast.success(res.data.message || "Transfer saved successfully");
        setForm(emptyForm);
        setEditMode(false);
        setNewDesignations([]);
        fetchTransfers();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "API not working");
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) {
      toast.error("You do not have edit permission");
      return;
    }

    const selectedDept = departments.find(
      (dept) => dept.name === item.new_department
    );

    setNewDesignations(selectedDept?.designations || []);
    setEditMode(true);

    setForm({
      id: item.id,
      transfer_id: item.transfer_id || "",
      emp_id: item.emp_id || "",
      emp_name: item.emp_name || "",
      branch_id: item.branch_id || "",
      branch_name: item.branch_name || "",
      new_branch_id: item.new_branch_id || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      difference_day: item.difference_day || "Working",
      department: item.department || "",
      new_department: item.new_department || "",
      designation: item.designation || "",
      new_designation: item.new_designation || "",
      transfer_by: item.transfer_by || "",
      remark: item.remark || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      toast.error("You do not have delete permission");
      return;
    }

    if (!window.confirm("Delete this transfer record?")) return;

    try {
      const res = await axios.post(`${API}/emp_transfer_branch_delete`, {
        id: item.id,
      });

      if (res.data.status || res.data.success) {
        toast.success(res.data.message || "Transfer deleted successfully");
        fetchTransfers();
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Delete API not working");
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setForm(emptyForm);
    setNewDesignations([]);
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
          <div className="rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-700 to-sky-600 p-6 text-white shadow-xl mb-6">
            <h1 className="text-3xl font-black">Employee Transfer</h1>
            <p className="text-indigo-100 mt-1">
              Manage employee branch, department and designation transfer
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">
              <div className="p-5 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <ArrowRightLeft size={22} />
                    {editMode ? "Update Transfer" : "Transfer Form"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {formAllowed
                      ? "Fill employee transfer details carefully"
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
                onSubmit={handleSubmit}
                className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {!editMode ? (
                  <div>
                    <label className="label">
                      <User size={16} /> Employee
                    </label>
                    <select
                      value={form.emp_id}
                      onChange={handleEmployeeChange}
                      disabled={!canAdd}
                      required
                      className="input"
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.employee_id} - {emp.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Input label="Employee ID" value={form.emp_id} readOnly />
                )}

                <Input label="Employee Name" value={form.emp_name} readOnly />
                <Input label="Current Branch ID" value={form.branch_id} readOnly />
                <Input label="Current Branch Name" value={form.branch_name} readOnly />

                <div>
                  <label className="label">New Branch ID</label>
                  <select
                    name="new_branch_id"
                    value={form.new_branch_id}
                    onChange={handleChange}
                    required
                    disabled={!formAllowed}
                    className="input"
                  >
                    <option value="">Select New Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.branch_id} value={branch.branch_id}>
                        {branch.branch_name} - {branch.branch_id}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Current Branch Joining Date"
                  type="date"
                  value={form.start_date}
                  readOnly
                />

                <Input
                  label="New Branch Start Date"
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                />

                <Input label="Difference Day" value={form.difference_day} readOnly />
                <Input label="Current Department" value={form.department} readOnly />

                <div>
                  <label className="label">New Department</label>
                  <select
                    name="new_department"
                    value={form.new_department}
                    onChange={handleNewDepartmentChange}
                    required
                    disabled={!formAllowed}
                    className="input"
                  >
                    <option value="">Select New Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input label="Current Designation" value={form.designation} readOnly />

                <div>
                  <label className="label">New Designation</label>
                  <select
                    name="new_designation"
                    value={form.new_designation}
                    onChange={handleChange}
                    required
                    disabled={!formAllowed}
                    className="input"
                  >
                    <option value="">Select New Designation</option>
                    {newDesignations.map((des) => (
                      <option key={des.id} value={des.name}>
                        {des.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Transfer By"
                  name="transfer_by"
                  value={form.transfer_by}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  required
                />

                <div className="md:col-span-2">
                  <label className="label">Remark</label>
                  <textarea
                    name="remark"
                    value={form.remark}
                    onChange={handleChange}
                    className="input h-24 resize-none"
                    placeholder="Enter remark"
                    readOnly={!formAllowed}
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  {formAllowed ? (
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-700 to-sky-600 hover:from-violet-800 hover:to-sky-700 text-white py-3 rounded-2xl font-black shadow-lg">
                      <Send size={18} />
                      {editMode ? "Update Transfer" : "Submit Transfer"}
                    </button>
                  ) : (
                    <div className="flex-1 bg-yellow-50 border border-yellow-200 text-yellow-700 py-3 rounded-2xl font-black text-center">
                      {editMode
                        ? "View Only Permission - Edit Not Allowed"
                        : "View Only Permission - Add Not Allowed"}
                    </div>
                  )}

                  {editMode && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-black"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">
              <div className="p-5 bg-slate-900 text-white">
                <h2 className="text-xl font-black">Transfer History</h2>
                <p className="text-sm text-slate-300">
                  Search and manage employee transfer records
                </p>

                <div className="relative mt-4">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by employee, branch, department..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[780px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-50 text-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Designation</th>
                      <th className="p-3">Days</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransferList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No transfer data found
                        </td>
                      </tr>
                    ) : (
                      filteredTransferList.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b text-center hover:bg-indigo-50/60"
                        >
                          <td className="p-3">
                            <div className="font-black text-slate-800">
                              {item.emp_id}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.emp_name}
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="text-xs text-slate-500">
                              Old: {item.branch_name || item.branch_id}
                            </div>
                            <div className="font-bold text-indigo-700">
                              New: {item.new_branch_id || "-"}
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="text-xs text-slate-500">
                              Old: {item.department || "-"}
                            </div>
                            <div className="font-bold text-indigo-700">
                              New: {item.new_department || "-"}
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="text-xs text-slate-500">
                              Old: {item.designation || "-"}
                            </div>
                            <div className="font-bold text-indigo-700">
                              New: {item.new_designation || "-"}
                            </div>
                          </td>

                          <td className="p-3">
                            <div>{item.start_date || "-"}</div>
                            <div className="text-xs text-slate-500">
                              {item.end_date || "Working"}
                            </div>
                            <div className="font-bold text-emerald-600">
                              {item.difference_day || "Working"}
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="flex gap-2 justify-center">
                              {canEdit ? (
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
              border-color: #4f46e5;
              box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
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

function Input({ label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}