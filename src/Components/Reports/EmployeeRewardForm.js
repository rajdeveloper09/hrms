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
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SideNav from "../SideNav";

const EMPLOYEE_API = "https://ojmee.in/employee/get_employee";
const REWARD_GET_API = "https://ojmee.in/employee/emp_rewards";
const REWARD_POST_API = "https://ojmee.in/employee/emp_rewards_post";

export default function EmployeeRewardForm() {
  const emptyForm = {
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

  const resetForm = () => {
    setRewardImage(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.emp_id ||
      !form.reward_type ||
      !form.reward_date ||
      !form.total_reward_amount
    ) {
      toast.error("Employee, Reward Type, Date and Amount required");
      return;
    }

    const formData = new FormData();

    formData.append("emp_id", form.emp_id);
    formData.append("emp_name", form.emp_name);
    formData.append("current_salary", form.current_salary);
    formData.append("reward_type", form.reward_type);
    formData.append(
      "fixed_amount",
      form.reward_type === "Fixed" ? form.fixed_amount : 0
    );
    formData.append(
      "percentage_value",
      form.reward_type === "Percentage" ? form.percentage_value : 0
    );
    formData.append("total_reward_amount", form.total_reward_amount);
    formData.append("reward_date", form.reward_date);
    formData.append("reward_month", form.reward_month);
    formData.append("order_by", form.order_by);
    formData.append("remark", form.remark);
    formData.append("status", form.status);

    if (rewardImage) {
      formData.append("reward_image", rewardImage);
    }

    try {
      const res = await fetch(REWARD_POST_API, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 ml-72 p-5 overflow-y-auto min-h-screen">
        <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 p-7 text-white shadow-2xl mb-6">
          <div className="absolute -top-24 -right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                <Gift size={40} />
              </div>

              <div>
                <h1 className="text-4xl font-black">Employee Rewards</h1>
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
          {/* LEFT FORM */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[34px] border border-white shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-900 text-white">
              <h2 className="text-xl font-black">Create Reward</h2>
              <p className="text-sm text-slate-300">
                Fill reward details carefully
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Employee" icon={<User size={16} />}>
                  <select
                    value={form.emp_id}
                    onChange={(e) => handleEmployeeSelect(e.target.value)}
                    className="input"
                    required
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
                  />
                </Field>

                <Field label="Upload Image" icon={<Upload size={16} />}>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => setRewardImage(e.target.files[0])}
                    className="input"
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
                />
              </Field>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:scale-[1.01] active:scale-[0.98] text-white px-10 py-4 rounded-2xl font-black shadow-xl transition-all"
              >
                <Send size={20} />
                Submit Reward
              </button>
            </form>
          </div>

          {/* RIGHT LIST */}
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
                  </tr>
                </thead>

                <tbody>
                  {filteredRewards.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">
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
                              href={`https://ojmee.in/employee/${item.reward_image}`}
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

          .input:hover {
            border-color: #14b8a6;
          }

          .input:focus {
            border-color: #10b981;
            box-shadow: 0 0 0 4px rgba(16,185,129,0.15);
          }

          .read {
            background: #f8fafc;
            color: #475569;
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

function StatCard({ label, value }) {
  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl px-6 py-4 text-white shadow-xl min-w-[150px]">
      <p className="text-sm text-emerald-100 font-bold">{label}</p>
      <h2 className="text-2xl font-black mt-1">{value}</h2>
    </div>
  );
}