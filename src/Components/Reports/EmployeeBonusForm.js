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
const BONUS_POST_API = "https://ojmee.in/employee/emp_bonus_post";

export default function EmployeeBonusForm() {
  const [employees, setEmployees] = useState([]);
  const [bonusImage, setBonusImage] = useState(null);

  const [form, setForm] = useState({
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
  });

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

  const calculateTotal = (type, salary, amount, percentage) => {
    const sal = Number(salary || 0);
    const amt = Number(amount || 0);
    const per = Number(percentage || 0);

    if (type === "Amount") return amt;
    if (type === "Percentage") return (sal * per) / 100;

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

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

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
    setBonusImage(null);

    setForm({
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
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.emp_id) {
      toast.error("Employee is required");
      return;
    }

    if (form.bonus_type === "Fixed" && !form.fixed_bonus_name) {
      toast.error("Fixed bonus name is required");
      return;
    }

    if (form.bonus_type === "Custom" && !form.custom_bonus_name) {
      toast.error("Custom bonus name is required");
      return;
    }

    if (form.calculation_type === "Amount" && !form.fixed_amount) {
      toast.error("Fixed amount is required");
      return;
    }

    if (form.calculation_type === "Percentage" && !form.percentage_value) {
      toast.error("Percentage is required");
      return;
    }

    if (!form.bonus_date || !form.allowed_by) {
      toast.error("Date and Allowed By are required");
      return;
    }

    const formData = new FormData();

    formData.append("emp_id", form.emp_id);
    formData.append("emp_name", form.emp_name);
    formData.append("current_salary", form.current_salary);

    formData.append("bonus_type", form.bonus_type);
    formData.append("fixed_bonus_name", form.fixed_bonus_name);
    formData.append("custom_bonus_name", form.custom_bonus_name);

    formData.append("calculation_type", form.calculation_type);
    formData.append(
      "fixed_amount",
      form.calculation_type === "Amount" ? form.fixed_amount : 0
    );
    formData.append(
      "percentage_value",
      form.calculation_type === "Percentage" ? form.percentage_value : 0
    );
    formData.append("total_bonus_amount", form.total_bonus_amount);

    formData.append("bonus_date", form.bonus_date);
    formData.append("bonus_month", form.bonus_month);
    formData.append("allowed_by", form.allowed_by);
    formData.append("remark", form.remark);
    formData.append("status", form.status);

    if (bonusImage) {
      formData.append("bonus_image", bonusImage);
    }

    try {
      const res = await fetch(BONUS_POST_API, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Bonus saved successfully");
        resetForm();
      } else {
        toast.error(json.message || "Bonus save failed");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <Gift size={34} />
            <div>
              <h1 className="text-2xl font-bold">Employee Bonus</h1>
              <p className="text-sm text-purple-100">
                Fixed or custom bonus with amount or percentage
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
              <label className="label">Bonus Type</label>

              <select
                name="bonus_type"
                value={form.bonus_type}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="Fixed">Fixed</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
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
              >
                {fixedBonusOptions.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="label">Custom Bonus Name</label>

              <input
                name="custom_bonus_name"
                value={form.custom_bonus_name}
                onChange={handleChange}
                placeholder="Enter custom bonus name"
                className="input"
                required
              />
            </div>
          )}

          <div>
            <label className="label">Calculation Type</label>

            <select
              name="calculation_type"
              value={form.calculation_type}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="Amount">Fixed Amount</option>
              <option value="Percentage">Percentage</option>
            </select>
          </div>

          {form.calculation_type === "Amount" ? (
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
                  <IndianRupee size={16} /> Total Bonus Amount
                </label>

                <input
                  value={form.total_bonus_amount}
                  readOnly
                  className="input bg-slate-100"
                />
              </div>
            </div>
          ) : (
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
                  value={form.total_bonus_amount}
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
                name="bonus_date"
                value={form.bonus_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Month</label>

              <input
                value={form.bonus_month}
                readOnly
                className="input bg-slate-100"
              />
            </div>

            <div>
              <label className="label">
                <ClipboardPen size={16} /> Allowed By
              </label>

              <input
                name="allowed_by"
                value={form.allowed_by}
                onChange={handleChange}
                placeholder="Allowed by"
                className="input"
                required
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
              onChange={(e) => setBonusImage(e.target.files[0])}
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
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all"
            >
              <Send size={18} />
              Submit Bonus
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
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.15);
        }
      `}</style>
    </div>
  );
}