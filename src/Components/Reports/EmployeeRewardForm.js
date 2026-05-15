import React, { useEffect, useState } from "react";
import {
  User,
  IndianRupee,
  Percent,
  CalendarDays,
  ClipboardPen,
  Upload,
  Send,
  Gift,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SideNav from "../SideNav";

const EMPLOYEE_API = "https://ojmee.in/employee/get_employee";
const REWARD_POST_API = "https://ojmee.in/employee/emp_rewards_post";

export default function EmployeeRewardForm() {
  const [employees, setEmployees] = useState([]);
  const [rewardImage, setRewardImage] = useState(null);

  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(EMPLOYEE_API);
      const json = await res.json();
      setEmployees(json.data || json || []);
    } catch (error) {
      toast.error("Employee data fetch failed");
    }
  };

  const calculateTotal = (type, salary, fixedAmount, percentage) => {
    const sal = Number(salary || 0);
    const fixed = Number(fixedAmount || 0);
    const percent = Number(percentage || 0);

    if (type === "Fixed") {
      return fixed;
    }

    if (type === "Percentage") {
      return (sal * percent) / 100;
    }

    return 0;
  };

  const handleEmployeeSelect = (empId) => {
    const emp = employees.find(
      (e) =>
        String(e.employee_id) === String(empId) ||
        String(e.emp_id) === String(empId) ||
        String(e.id) === String(empId)
    );

    const empName =
      emp?.full_name ||
      emp?.employee_name ||
      emp?.name ||
      "";

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
      const updated = {
        ...prev,
        [name]: value,
      };

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

    setForm({
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
    });
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
    formData.append("fixed_amount", form.reward_type === "Fixed" ? form.fixed_amount : 0);
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
      } else {
        toast.error(json.message || "Reward save failed");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">

      <Toaster />
      <SideNav />

      <div className="flex-1 ml-72 p-4 overflow-y-auto min-h-screen">

        <div className="mx-auto space-y-8">

          {/* HERO HEADER */}
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-8 shadow-[0_20px_60px_rgba(16,185,129,0.25)]">

            <div className="absolute -top-20 -right-16 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

              <div className="flex items-center gap-5">

                <div className="w-24 h-24 rounded-[28px] bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                  <Gift size={46} className="text-white" />
                </div>

                <div>
                  <span className="inline-flex px-5 py-2 rounded-full bg-white/20 text-white text-sm font-bold tracking-wide">
                    HR Reward Management
                  </span>

                  <h1 className="text-4xl font-black text-white tracking-tight">
                    Employee Rewards
                  </h1>

                  <p className="text-emerald-100 text-lg mt-3 max-w-2xl">
                    Fixed amount or percentage based reward system with automatic calculation
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl px-7 py-5 text-white shadow-2xl">
                  <p className="text-sm text-emerald-100 font-semibold">
                    Employees
                  </p>

                  <h2 className="text-4xl font-black mt-1">
                    {employees.length}
                  </h2>
                </div>

                <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl px-7 py-5 text-white shadow-2xl">
                  <p className="text-sm text-emerald-100 font-semibold">
                    Reward Type
                  </p>

                  <h2 className="text-2xl font-black mt-2">
                    {form.reward_type}
                  </h2>
                </div>

              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white backdrop-blur-xl rounded-[36px] border border-white shadow-[0_10px_50px_rgba(15,23,42,0.08)] overflow-hidden">

            <form onSubmit={handleSubmit} className="p-4">

              {/* ROW 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                <div className="field-card">
                  <label className="label">
                    <User size={16} />
                    Employee
                  </label>

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
                        emp.full_name ||
                        emp.employee_name ||
                        emp.name ||
                        "";

                      return (
                        <option key={index} value={id}>
                          {id} - {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="field-card">
                  <label className="label">
                    <IndianRupee size={16} />
                    Current Salary
                  </label>

                  <input
                    value={form.current_salary}
                    readOnly
                    className="input bg-slate-100"
                  />
                </div>

                <div className="field-card">
                  <label className="label">
                    Reward Type
                  </label>

                  <select
                    name="reward_type"
                    value={form.reward_type}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="Fixed">Amount Fixed</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>

              </div>

              {/* ROW 2 */}
              {form.reward_type === "Fixed" ? (

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                  <div className="field-card">
                    <label className="label">
                      <IndianRupee size={16} />
                      Fixed Amount
                    </label>

                    <input
                      type="number"
                      name="fixed_amount"
                      value={form.fixed_amount}
                      onChange={handleChange}
                      placeholder="Enter fixed amount"
                      className="input"
                      required
                    />
                  </div>

                  <div className="field-card">
                    <label className="label">
                      <IndianRupee size={16} />
                      Total Amount
                    </label>

                    <input
                      value={form.total_reward_amount}
                      readOnly
                      className="input bg-slate-100"
                    />
                  </div>

                  <div className="field-card"></div>

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                  <div className="field-card">
                    <label className="label">
                      <Percent size={16} />
                      Percentage
                    </label>

                    <input
                      type="number"
                      name="percentage_value"
                      value={form.percentage_value}
                      onChange={handleChange}
                      placeholder="Enter percentage"
                      className="input"
                      required
                    />
                  </div>

                  <div className="field-card">
                    <label className="label">
                      <IndianRupee size={16} />
                      Total Percentage Amount
                    </label>

                    <input
                      value={form.total_reward_amount}
                      readOnly
                      className="input bg-slate-100"
                    />
                  </div>

                  <div className="field-card"></div>

                </div>

              )}

              {/* ROW 3 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

                <div className="field-card">
                  <label className="label">
                    <CalendarDays size={16} />
                    Date
                  </label>

                  <input
                    type="date"
                    name="reward_date"
                    value={form.reward_date}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div className="field-card">
                  <label className="label">
                    Month
                  </label>

                  <input
                    name="reward_month"
                    value={form.reward_month}
                    onChange={handleChange}
                    placeholder="Month"
                    className="input"
                  />
                </div>

                <div className="field-card">
                  <label className="label">
                    <ClipboardPen size={16} />
                    Order By
                  </label>

                  <input
                    name="order_by"
                    value={form.order_by}
                    onChange={handleChange}
                    placeholder="Order by"
                    className="input"
                  />
                </div>
                {/* FILE */}
                <div className="field-card">
                  <label className="label">
                    <Upload size={16} />
                    Upload Reward Image
                  </label>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => setRewardImage(e.target.files[0])}
                    className="input"
                  />
                </div>

              </div>



              {/* REMARK */}
              <div className="field-card">
                <label className="label">
                  <ClipboardPen size={16} />
                  Remark
                </label>

                <textarea
                  name="remark"
                  value={form.remark}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write reward remark..."
                  className="input resize-none"
                />
              </div>

              {/* BUTTON */}
              <div className="flex justify-end pt-3">

                <button
                  type="submit"
                  className="group relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:scale-[1.02] active:scale-[0.98] text-white px-10 py-4 rounded-2xl font-black shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all duration-300"
                >

                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition"></span>

                  <Send size={20} className="relative z-10" />

                  <span className="relative z-10">
                    Submit Reward
                  </span>

                </button>

              </div>

            </form>
          </div>
        </div>

        <style>{`
      .field-card {
        background: rgba(255,255,255,0.7);
        border: 1px solid rgba(255,255,255,0.8);
        padding: 18px;
        border-radius: 24px;
        backdrop-filter: blur(10px);
      }

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
        border: 1px solid #dbe4ee;
        border-radius: 18px;
        padding: 14px 16px;
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
        transform: translateY(-1px);
      }
    `}</style>

      </div>
    </div>
  );
}