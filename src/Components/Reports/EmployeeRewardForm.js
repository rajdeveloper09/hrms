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
    <div className="min-h-screen bg-slate-100 p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <Gift size={34} />
            <div>
              <h1 className="text-2xl font-bold">Employee Rewards</h1>
              <p className="text-sm text-emerald-100">
                Fixed amount or percentage based reward
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="label">
                <User size={16} /> Employee
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
                    emp.full_name || emp.employee_name || emp.name || "";

                  return (
                    <option key={index} value={id}>
                      {id} - {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="label">
                <IndianRupee size={16} /> Current Salary
              </label>

              <input
                value={form.current_salary}
                readOnly
                className="input bg-slate-100"
              />
            </div>

            <div>
              <label className="label">Reward Type</label>

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

          {form.reward_type === "Fixed" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">
                  <IndianRupee size={16} /> Fixed Amount
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

              <div>
                <label className="label">
                  <IndianRupee size={16} /> Total Amount
                </label>

                <input
                  value={form.total_reward_amount}
                  readOnly
                  className="input bg-slate-100"
                />
              </div>
            </div>
          )}

          {form.reward_type === "Percentage" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">
                  <Percent size={16} /> Percentage
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

              <div>
                <label className="label">
                  <IndianRupee size={16} /> Total Percentage Amount
                </label>

                <input
                  value={form.total_reward_amount}
                  readOnly
                  className="input bg-slate-100"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="label">
                <CalendarDays size={16} /> Date
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

            <div>
              <label className="label">Month</label>

              <input
                name="reward_month"
                value={form.reward_month}
                onChange={handleChange}
                placeholder="Month"
                className="input"
              />
            </div>

            <div>
              <label className="label">
                <ClipboardPen size={16} /> Order By
              </label>

              <input
                name="order_by"
                value={form.order_by}
                onChange={handleChange}
                placeholder="Order by"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">
              <Upload size={16} /> Image Upload
            </label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => setRewardImage(e.target.files[0])}
              className="input"
            />
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
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all"
            >
              <Send size={18} />
              Submit Reward
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }

        .input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 12px 14px;
          outline: none;
          font-size: 14px;
          background: white;
        }

        .input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }
      `}</style>
    </div>
  );
}