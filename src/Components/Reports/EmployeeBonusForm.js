import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  IndianRupee,
  Percent,
  CalendarDays,
  ClipboardPen,
  Upload,
  Send,
  Gift,
  Search,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SideNav from "../SideNav";

const API = "https://ojmee.in/employee";
const EMPLOYEE_API = `${API}/get_employee`;
const BONUS_GET_API = `${API}/emp_bonus`;
const BONUS_POST_API = `${API}/emp_bonus_post`;
const BONUS_UPDATE_API = `${API}/emp_bonus_update`;
const BONUS_DELETE_API = `${API}/emp_bonus_delete`;

const CURRENT_PATH = "/add-bonus";

export default function EmployeeBonusForm() {
  const emptyForm = {
    id: "",
    emp_id: "",
    emp_name: "",
    current_salary: "",
    bonus_type: "Fixed",
    fixed_bonus_name: "Monthly",
    custom_bonus_name: "",
    calculation_type: "Amount",
    fixed_amount: "",
    percentage_value: "",
    total_bonus_amount: "",
    bonus_date: "",
    bonus_month: "",
    allowed_by: "",
    remark: "",
    status: "Pending",
  };

  const [employees, setEmployees] = useState([]);
  const [bonusList, setBonusList] = useState([]);
  const [bonusImage, setBonusImage] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

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

  const fixedBonusOptions = [
    "Monthly",
    "Half-Yearly",
    "Yearly",
    "Diwali",
    "Holi",
    "Other Indian Festival",
  ];

  useEffect(() => {
    fetchEmployees();
    fetchBonusList();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(EMPLOYEE_API);
      const json = await res.json();
      setEmployees(json.data || json || []);
    } catch {
      toast.error("Employee data fetch failed");
    }
  };

  const fetchBonusList = async () => {
    try {
      const res = await fetch(BONUS_GET_API);
      const json = await res.json();
      setBonusList(json.data || json.result || []);
    } catch {
      toast.error("Bonus list fetch failed");
    }
  };

  const filteredBonusList = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return bonusList;

    return bonusList.filter((item) =>
      [
        item.id,
        item.emp_id,
        item.emp_name,
        item.bonus_type,
        item.fixed_bonus_name,
        item.custom_bonus_name,
        item.calculation_type,
        item.total_bonus_amount,
        item.bonus_date,
        item.bonus_month,
        item.allowed_by,
        item.status,
        item.remark,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [bonusList, search]);

  const calculateTotal = (type, salary, amount, percentage) => {
    const sal = Number(salary || 0);
    const amt = Number(amount || 0);
    const per = Number(percentage || 0);

    if (type === "Amount") return amt;
    if (type === "Percentage") return (sal * per) / 100;
    return 0;
  };

  const handleEmployeeSelect = (empId) => {
    if (!editMode && !canAdd) return toast.error("You do not have add permission");

    const emp = employees.find(
      (e) =>
        String(e.employee_id) === String(empId) ||
        String(e.emp_id) === String(empId) ||
        String(e.id) === String(empId)
    );

    const empName = emp?.full_name || emp?.employee_name || emp?.name || "";
    const salary =
      emp?.gross_salary ||
      emp?.salary ||
      emp?.monthly_salary ||
      emp?.basic_salary ||
      0;

    setForm((prev) => ({
      ...prev,
      emp_id: empId,
      emp_name: empName,
      current_salary: salary,
      total_bonus_amount: calculateTotal(
        prev.calculation_type,
        salary,
        prev.fixed_amount,
        prev.percentage_value
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!editMode && !canAdd) return toast.error("You do not have add permission");
    if (editMode && !canEdit) return toast.error("You do not have edit permission");

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "bonus_type") {
        updated.fixed_bonus_name = value === "Fixed" ? "Monthly" : "";
        updated.custom_bonus_name = "";
      }

      if (name === "calculation_type") {
        updated.fixed_amount = "";
        updated.percentage_value = "";
        updated.total_bonus_amount = "";
      }

      if (
        name === "fixed_amount" ||
        name === "percentage_value" ||
        name === "calculation_type"
      ) {
        updated.total_bonus_amount = calculateTotal(
          updated.calculation_type,
          updated.current_salary,
          updated.fixed_amount,
          updated.percentage_value
        );
      }

      if (name === "bonus_date" && value) {
        const date = new Date(value);
        updated.bonus_month = date.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        });
      }

      return updated;
    });
  };

  const resetForm = () => {
    setEditMode(false);
    setBonusImage(null);
    setForm(emptyForm);
  };

  const validateForm = () => {
    if (!form.emp_id) return "Employee is required";
    if (form.bonus_type === "Fixed" && !form.fixed_bonus_name)
      return "Fixed bonus name is required";
    if (form.bonus_type === "Custom" && !form.custom_bonus_name)
      return "Custom bonus name is required";
    if (form.calculation_type === "Amount" && !form.fixed_amount)
      return "Fixed amount is required";
    if (form.calculation_type === "Percentage" && !form.percentage_value)
      return "Percentage is required";
    if (!form.bonus_date || !form.allowed_by)
      return "Date and Allowed By are required";
    return "";
  };

  const createFormData = () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key] || "");
    });

    formData.append(
      "fixed_amount",
      form.calculation_type === "Amount" ? form.fixed_amount : 0
    );

    formData.append(
      "percentage_value",
      form.calculation_type === "Percentage" ? form.percentage_value : 0
    );

    if (bonusImage) {
      formData.append("bonus_image", bonusImage);
    }

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canAdd) return toast.error("You do not have add permission");

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const res = await fetch(BONUS_POST_API, {
        method: "POST",
        body: createFormData(),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Bonus saved successfully");
        resetForm();
        fetchBonusList();
      } else {
        toast.error(json.message || "Bonus save failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) return toast.error("You do not have edit permission");

    setEditMode(true);

    setForm({
      id: item.id || "",
      emp_id: item.emp_id || "",
      emp_name: item.emp_name || "",
      current_salary: item.current_salary || "",
      bonus_type: item.bonus_type || "Fixed",
      fixed_bonus_name: item.fixed_bonus_name || "Monthly",
      custom_bonus_name: item.custom_bonus_name || "",
      calculation_type: item.calculation_type || "Amount",
      fixed_amount: item.fixed_amount || "",
      percentage_value: item.percentage_value || "",
      total_bonus_amount: item.total_bonus_amount || "",
      bonus_date: item.bonus_date || "",
      bonus_month: item.bonus_month || "",
      allowed_by: item.allowed_by || "",
      remark: item.remark || "",
      status: item.status || "Pending",
    });

    setBonusImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!canEdit) return toast.error("You do not have edit permission");
    if (!form.id) return toast.error("Bonus ID missing");

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const res = await fetch(BONUS_UPDATE_API, {
        method: "POST",
        body: createFormData(),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Bonus updated successfully");
        resetForm();
        fetchBonusList();
      } else {
        toast.error(json.message || "Bonus update failed");
      }
    } catch {
      toast.error("Update server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!canDelete) return toast.error("You do not have delete permission");

    if (!window.confirm("Delete this bonus?")) return;

    try {
      const res = await fetch(BONUS_DELETE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Bonus deleted successfully");
        fetchBonusList();
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-100 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
          <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 p-4 shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                  <Gift size={40} className="text-white" />
                </div>

                <div>
                  <h1 className="text-3xl font-black text-white">
                    Employee Bonus
                  </h1>
                  <p className="text-purple-100 mt-2 text-lg">
                    Fixed or custom bonus with amount or percentage
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TopBox title="Employees" value={employees.length} />
                <TopBox title="Bonuses" value={bonusList.length} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="bg-white/90 backdrop-blur-xl rounded-[34px] border border-white shadow-2xl overflow-hidden">
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    {editMode ? "Update Bonus" : "Create Bonus"}
                  </h2>
                  <p className="text-sm text-slate-300">
                    {formAllowed
                      ? "Fill bonus details"
                      : editMode
                      ? "View Only Permission - Edit Not Allowed"
                      : "View Only Permission - Add Not Allowed"}
                  </p>
                </div>

                {editMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-white text-purple-700 px-4 py-2 rounded-xl font-black flex items-center gap-2"
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
                  <div>
                    <label className="label">
                      <User size={16} /> Employee
                    </label>

                    <select
                      value={form.emp_id}
                      onChange={(e) => handleEmployeeSelect(e.target.value)}
                      className="input"
                      required
                      disabled={editMode || !canAdd}
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
                  </div>

                  <Input label="Current Salary" icon={<IndianRupee size={16} />} value={form.current_salary} readOnly />

                  <div>
                    <label className="label">Bonus Type</label>
                    <select
                      name="bonus_type"
                      value={form.bonus_type}
                      onChange={handleChange}
                      className="input"
                      required
                      disabled={!formAllowed}
                    >
                      <option value="Fixed">Fixed</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  {form.bonus_type === "Fixed" ? (
                    <div>
                      <label className="label">Fixed Bonus Name</label>
                      <select
                        name="fixed_bonus_name"
                        value={form.fixed_bonus_name}
                        onChange={handleChange}
                        className="input"
                        required
                        disabled={!formAllowed}
                      >
                        {fixedBonusOptions.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <Input
                      label="Custom Bonus Name"
                      name="custom_bonus_name"
                      value={form.custom_bonus_name}
                      onChange={handleChange}
                      readOnly={!formAllowed}
                      required
                    />
                  )}

                  <div>
                    <label className="label">Calculation Type</label>
                    <select
                      name="calculation_type"
                      value={form.calculation_type}
                      onChange={handleChange}
                      className="input"
                      required
                      disabled={!formAllowed}
                    >
                      <option value="Amount">Fixed Amount</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                  </div>

                  {form.calculation_type === "Amount" ? (
                    <Input
                      label="Fixed Amount"
                      icon={<IndianRupee size={16} />}
                      type="number"
                      name="fixed_amount"
                      value={form.fixed_amount}
                      onChange={handleChange}
                      readOnly={!formAllowed}
                      required
                    />
                  ) : (
                    <Input
                      label="Percentage"
                      icon={<Percent size={16} />}
                      type="number"
                      name="percentage_value"
                      value={form.percentage_value}
                      onChange={handleChange}
                      readOnly={!formAllowed}
                      required
                    />
                  )}

                  <Input
                    label="Total Bonus Amount"
                    icon={<IndianRupee size={16} />}
                    value={form.total_bonus_amount}
                    readOnly
                  />

                  <Input
                    label="Date"
                    icon={<CalendarDays size={16} />}
                    type="date"
                    name="bonus_date"
                    value={form.bonus_date}
                    onChange={handleChange}
                    readOnly={!formAllowed}
                    required
                  />

                  <Input label="Month" value={form.bonus_month} readOnly />

                  <Input
                    label="Allowed By"
                    icon={<ClipboardPen size={16} />}
                    name="allowed_by"
                    value={form.allowed_by}
                    onChange={handleChange}
                    readOnly={!formAllowed}
                    required
                  />

                  <div>
                    <label className="label">
                      <Upload size={16} /> Image Upload
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => {
                        if (!formAllowed) {
                          toast.error(
                            editMode
                              ? "You do not have edit permission"
                              : "You do not have add permission"
                          );
                          return;
                        }
                        setBonusImage(e.target.files[0]);
                      }}
                      disabled={!formAllowed}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="input"
                      disabled={!formAllowed}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
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
                    readOnly={!formAllowed}
                  />
                </div>

                <div className="flex justify-end">
                  {formAllowed ? (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-60"
                    >
                      <Send size={18} />
                      {loading
                        ? editMode
                          ? "Updating..."
                          : "Submitting..."
                        : editMode
                        ? "Update Bonus"
                        : "Submit Bonus"}
                    </button>
                  ) : (
                    <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-7 py-3 rounded-xl font-black">
                      {editMode
                        ? "View Only Permission - Edit Not Allowed"
                        : "View Only Permission - Add Not Allowed"}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-[34px] border border-white shadow-2xl overflow-hidden">
              <div className="bg-slate-900 text-white p-5">
                <h2 className="text-xl font-black">Bonus List</h2>
                <div className="relative mt-4">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bonus..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-purple-50 text-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Bonus</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Month</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBonusList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No bonus data found
                        </td>
                      </tr>
                    ) : (
                      filteredBonusList.map((item) => (
                        <tr key={item.id} className="border-b text-center hover:bg-purple-50/50">
                          <td className="p-3">
                            <div className="font-black">{item.emp_id}</div>
                            <div className="text-xs text-slate-500">{item.emp_name}</div>
                          </td>

                          <td className="p-3">
                            <div className="font-bold">
                              {item.bonus_type === "Custom"
                                ? item.custom_bonus_name
                                : item.fixed_bonus_name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.calculation_type}
                            </div>
                          </td>

                          <td className="p-3 font-black text-emerald-600">
                            ₹{Number(item.total_bonus_amount || 0).toLocaleString("en-IN")}
                          </td>

                          <td className="p-3">{item.bonus_month || "-"}</td>

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
                                  className="bg-amber-500 text-white px-3 py-2 rounded-xl font-bold flex items-center gap-2"
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
                                  className="bg-red-600 text-white px-3 py-2 rounded-xl font-bold flex items-center gap-2"
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
        </div>

        <style>{`
          .label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 700;
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
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          }

          .input:hover {
            border-color: #d946ef;
          }

          .input:focus {
            border-color: #9333ea;
            box-shadow:0 0 0 4px rgba(147,51,234,0.15);
          }

          .input:read-only,
          .input:disabled,
          textarea:read-only {
            background:#f8fafc;
            color:#64748b;
            cursor:not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
}

function TopBox({ title, value }) {
  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl px-6 py-4 text-white shadow-xl">
      <p className="text-sm text-purple-100">{title}</p>
      <h2 className="text-3xl font-black">{value}</h2>
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