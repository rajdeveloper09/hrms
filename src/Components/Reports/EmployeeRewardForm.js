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
  Image,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SideNav from "../SideNav";

const API = "https://ojmee.in/employee";
const CURRENT_PATH = "/add-reward";

const EMPLOYEE_API = `${API}/get_employee`;
const REWARD_GET_API = `${API}/emp_rewards`;
const REWARD_POST_API = `${API}/emp_rewards_post`;
const REWARD_UPDATE_API = `${API}/emp_rewards_update`;
const REWARD_DELETE_API = `${API}/emp_rewards_delete`;

export default function EmployeeRewardForm() {
  const emptyForm = {
    id: "",
    reward_id: "",
    emp_id: "",
    emp_name: "",
    current_salary: "",
    reward_type: "Fixed",
    fixed_amount: "",
    percentage_value: "",
    total_reward_amount: "",
    reward_date: "",
    reward_month: "",
    order_by: "",
    remark: "",
    status: "Pending",
  };

  const [employees, setEmployees] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardImage, setRewardImage] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
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

  const formAllowed = editMode ? canEdit : canAdd;

  useEffect(() => {
    fetchEmployees();
    fetchRewards();
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

  const fetchRewards = async () => {
    try {
      const res = await fetch(REWARD_GET_API);
      const json = await res.json();
      setRewards(json.data || []);
    } catch {
      toast.error("Rewards list fetch failed");
    }
  };

  const filteredRewards = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rewards;

    return rewards.filter((item) =>
      [
        item.reward_id,
        item.emp_id,
        item.emp_name,
        item.employee_name,
        item.full_name,
        item.reward_type,
        item.fixed_amount,
        item.percentage_value,
        item.total_reward_amount,
        item.reward_date,
        item.reward_month,
        item.order_by,
        item.status,
        item.remark,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [rewards, search]);

  const calculateTotal = (type, salary, fixedAmount, percentage) => {
    const sal = Number(salary || 0);
    const fixed = Number(fixedAmount || 0);
    const percent = Number(percentage || 0);

    if (type === "Fixed") return fixed;
    if (type === "Percentage") return (sal * percent) / 100;
    return 0;
  };

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  const handleEmployeeSelect = (empId) => {
    if (!canAdd) return toast.error("You do not have add permission");

    const emp = employees.find(
      (e) =>
        String(e.employee_id) === String(empId) ||
        String(e.emp_id) === String(empId) ||
        String(e.id) === String(empId)
    );

    const empName = emp?.full_name || emp?.employee_name || emp?.name || "";

    const salary =
      Number(emp?.gross_salary || 0) ||
      Number(emp?.salary || 0) ||
      Number(emp?.monthly_salary || 0) ||
      Number(emp?.basic_salary || 0) + Number(emp?.allowances || 0);

    setForm((prev) => ({
      ...prev,
      emp_id: empId,
      emp_name: empName,
      current_salary: salary,
      total_reward_amount: calculateTotal(
        prev.reward_type,
        salary,
        prev.fixed_amount,
        prev.percentage_value
      ),
    }));
  };

  const handleChange = (e) => {
    if (!editMode && !canAdd) return toast.error("You do not have add permission");
    if (editMode && !canEdit) return toast.error("You do not have edit permission");

    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "reward_type") {
        updated.fixed_amount = "";
        updated.percentage_value = "";
        updated.total_reward_amount = "";
      }

      if (
        name === "fixed_amount" ||
        name === "percentage_value" ||
        name === "reward_type"
      ) {
        updated.total_reward_amount = calculateTotal(
          updated.reward_type,
          updated.current_salary,
          updated.fixed_amount,
          updated.percentage_value
        );
      }

      if (name === "reward_date" && value) {
        const date = new Date(value);
        updated.reward_month = date.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        });
      }

      return updated;
    });
  };

  const handleFileChange = (e) => {
    if (!formAllowed) {
      toast.error(editMode ? "You do not have edit permission" : "You do not have add permission");
      return;
    }

    setRewardImage(e.target.files[0]);
  };

  const resetForm = () => {
    setRewardImage(null);
    setForm(emptyForm);
    setEditMode(false);
  };

  const validateForm = () => {
    if (!form.emp_id || !form.reward_type || !form.reward_date || !form.total_reward_amount) {
      return "Employee, Reward Type, Date and Amount required";
    }

    if (form.reward_type === "Fixed" && !form.fixed_amount) {
      return "Fixed amount required";
    }

    if (form.reward_type === "Percentage" && !form.percentage_value) {
      return "Percentage required";
    }

    return "";
  };

  const createFormData = () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key] || "");
    });

    formData.append(
      "fixed_amount",
      form.reward_type === "Fixed" ? form.fixed_amount : 0
    );

    formData.append(
      "percentage_value",
      form.reward_type === "Percentage" ? form.percentage_value : 0
    );

    if (rewardImage) {
      formData.append("reward_image", rewardImage);
    }

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canAdd) return toast.error("You do not have add permission");

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      const res = await fetch(REWARD_POST_API, {
        method: "POST",
        body: createFormData(),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Reward saved successfully");
        resetForm();
        fetchRewards();
      } else {
        toast.error(json.message || "Reward save failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) return toast.error("You do not have edit permission");

    setEditMode(true);
    setRewardImage(null);

    setForm({
      id: item.id || "",
      reward_id: item.reward_id || "",
      emp_id: item.emp_id || "",
      emp_name: item.emp_name || item.employee_name || item.full_name || "",
      current_salary: item.current_salary || "",
      reward_type: item.reward_type || "Fixed",
      fixed_amount: item.fixed_amount || "",
      percentage_value: item.percentage_value || "",
      total_reward_amount: item.total_reward_amount || "",
      reward_date: item.reward_date || "",
      reward_month: item.reward_month || "",
      order_by: item.order_by || "",
      remark: item.remark || "",
      status: item.status || "Pending",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!canEdit) return toast.error("You do not have edit permission");
    if (!form.id) return toast.error("Reward ID missing");

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      const res = await fetch(REWARD_UPDATE_API, {
        method: "POST",
        body: createFormData(),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Reward updated successfully");
        resetForm();
        fetchRewards();
      } else {
        toast.error(json.message || "Reward update failed");
      }
    } catch {
      toast.error("Update server error");
    }
  };

  const handleDelete = async (item) => {
    if (!canDelete) return toast.error("You do not have delete permission");

    if (!window.confirm("Delete this reward?")) return;

    try {
      const res = await fetch(REWARD_DELETE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });

      const json = await res.json();

      if (json.success || json.status) {
        toast.success("Reward deleted successfully");
        fetchRewards();
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
          <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 p-4 text-white shadow-2xl mb-6">
            <div className="relative z-10 flex items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                  <Gift size={40} />
                </div>

                <div>
                  <h1 className="text-3xl font-black">Employee Rewards</h1>
                  <p className="text-emerald-100 mt-2">
                    Create and manage reward records
                  </p>
                </div>
              </div>

              <div className="hidden xl:grid grid-cols-2 gap-4">
                <StatCard label="Employees" value={employees.length} />
                <StatCard label="Rewards" value={rewards.length} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="bg-white/90 backdrop-blur-xl rounded-[34px] border border-white shadow-2xl overflow-hidden">
              <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black">
                    {editMode ? "Update Reward" : "Create Reward"}
                  </h2>
                  <p className="text-sm text-slate-300">
                    {formAllowed
                      ? "Fill reward details carefully"
                      : editMode
                        ? "View Only Permission - Edit Not Allowed"
                        : "View Only Permission - Add Not Allowed"}
                  </p>
                </div>

                {editMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-white text-emerald-700 px-4 py-2 rounded-xl font-black flex items-center gap-2"
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
                  <Field label="Employee" icon={<User size={16} />}>
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
                  </Field>

                  <Field label="Current Salary" icon={<IndianRupee size={16} />}>
                    <input
                      value={formatMoney(form.current_salary)}
                      readOnly
                      className="input read"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Field label="Reward Type" icon={<Gift size={16} />}>
                    <select
                      name="reward_type"
                      value={form.reward_type}
                      onChange={handleChange}
                      className="input"
                      disabled={!formAllowed}
                    >
                      <option value="Fixed">Amount Fixed</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                  </Field>

                  {form.reward_type === "Fixed" ? (
                    <Field label="Fixed Amount" icon={<IndianRupee size={16} />}>
                      <input
                        type="number"
                        name="fixed_amount"
                        value={form.fixed_amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        className="input"
                        readOnly={!formAllowed}
                        required
                      />
                    </Field>
                  ) : (
                    <Field label="Percentage" icon={<Percent size={16} />}>
                      <input
                        type="number"
                        name="percentage_value"
                        value={form.percentage_value}
                        onChange={handleChange}
                        placeholder="Enter %"
                        className="input"
                        readOnly={!formAllowed}
                        required
                      />
                    </Field>
                  )}

                  <Field label="Total Amount" icon={<IndianRupee size={16} />}>
                    <input
                      value={formatMoney(form.total_reward_amount)}
                      readOnly
                      className="input read font-bold text-emerald-700"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Reward Date" icon={<CalendarDays size={16} />}>
                    <input
                      type="date"
                      name="reward_date"
                      value={form.reward_date}
                      onChange={handleChange}
                      className="input"
                      readOnly={!formAllowed}
                      required
                    />
                  </Field>

                  <Field label="Reward Month" icon={<CalendarDays size={16} />}>
                    <input
                      name="reward_month"
                      value={form.reward_month}
                      readOnly
                      className="input read"
                    />
                  </Field>

                  <Field label="Order By" icon={<ClipboardPen size={16} />}>
                    <input
                      name="order_by"
                      value={form.order_by}
                      onChange={handleChange}
                      placeholder="Order by"
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
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </Field>

                  <Field label="Upload Image" icon={<Upload size={16} />}>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      className="input"
                      disabled={!formAllowed}
                    />
                  </Field>
                </div>

                <Field label="Remark" icon={<ClipboardPen size={16} />}>
                  <textarea
                    name="remark"
                    value={form.remark}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Write reward remark..."
                    className="input resize-none"
                    readOnly={!formAllowed}
                  />
                </Field>

                {formAllowed ? (
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl"
                  >
                    <Send size={20} />
                    {editMode ? "Update Reward" : "Submit Reward"}
                  </button>
                ) : (
                  <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-700 px-10 py-4 rounded-2xl font-black text-center">
                    {editMode
                      ? "View Only Permission - Edit Not Allowed"
                      : "View Only Permission - Add Not Allowed"}
                  </div>
                )}
              </form>
            </div>

            <div className="bg-white rounded-[34px] border border-white shadow-2xl overflow-hidden">
              <div className="p-5 bg-slate-900 text-white">
                <h2 className="text-xl font-black">Reward History</h2>
                <p className="text-sm text-slate-300">
                  Search and view employee rewards
                </p>

                <div className="relative mt-4">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employee, type, date, amount..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[780px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-emerald-50 text-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Reward</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Image</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRewards.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No reward data found
                        </td>
                      </tr>
                    ) : (
                      filteredRewards.map((item, index) => (
                        <tr
                          key={item.id || index}
                          className="border-b text-center hover:bg-emerald-50/60"
                        >
                          <td className="p-3">
                            <div className="font-black text-slate-800">
                              {item.emp_id || "-"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.emp_name ||
                                item.employee_name ||
                                item.full_name ||
                                "-"}
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-700">
                              {item.reward_type || "-"}
                            </span>
                            <div className="text-xs text-slate-500 mt-1">
                              {item.reward_type === "Percentage"
                                ? `${item.percentage_value || 0}%`
                                : "Fixed"}
                            </div>
                          </td>

                          <td className="p-3">
                            <div>{item.reward_date || "-"}</div>
                            <div className="text-xs text-slate-500">
                              {item.reward_month || "-"}
                            </div>
                          </td>

                          <td className="p-3 font-black text-emerald-600">
                            {formatMoney(item.total_reward_amount)}
                          </td>

                          <td className="p-3">
                            {item.reward_image ? (
                              <a
                                href={`${API}/${item.reward_image}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 font-bold underline"
                              >
                                <Image size={15} />
                                View
                              </a>
                            ) : (
                              "-"
                            )}
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
              border: 1px solid #dbe4ee;
              border-radius: 16px;
              padding: 13px 15px;
              outline: none;
              font-size: 14px;
              background: white;
              transition: all 0.25s ease;
            }

            .input:focus {
              border-color: #10b981;
              box-shadow: 0 0 0 4px rgba(16,185,129,0.15);
            }

            .input:read-only,
            .input:disabled,
            textarea:read-only {
              background: #f8fafc;
              color: #475569;
              cursor: not-allowed;
            }

            .read {
              background: #f8fafc;
              color: #475569;
            }
          `}</style>
        </div>
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

function StatCard({ label, value }) {
  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl px-6 py-4 text-white shadow-xl min-w-[150px]">
      <p className="text-sm text-emerald-100 font-bold">{label}</p>
      <h2 className="text-2xl font-black mt-1">{value}</h2>
    </div>
  );
}