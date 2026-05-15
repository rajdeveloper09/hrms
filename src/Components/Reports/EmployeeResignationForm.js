import React, { useEffect, useState } from "react";
import {
  User,
  Building2,
  CalendarDays,
  FileText,
  ClipboardPen,
  Send,
  Upload,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const EMPLOYEE_API = "https://ojmee.in/employee/get_employee";
const RESIGNATION_GET_API = "https://ojmee.in/employee/emp_resignation";
const RESIGNATION_POST_API = "https://ojmee.in/employee/emp_resignation_post";

export default function EmployeeResignationForm() {
  const [employees, setEmployees] = useState([]);
  const [resignations, setResignations] = useState([]);
  const [letterFile, setLetterFile] = useState(null);

  const [form, setForm] = useState({
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
  });

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
    } catch (error) {
      toast.error("Employee data fetch failed");
    }
  };

  const fetchResignations = async () => {
    try {
      const res = await fetch(RESIGNATION_GET_API);
      const json = await res.json();
      setResignations(json.data || []);
    } catch (error) {
      toast.error("Resignation data fetch failed");
    }
  };

  const resignedEmpIds = resignations.map((item) => String(item.emp_id));

  const activeEmployees = employees.filter((emp) => {
    const empId = String(emp.employee_id || emp.emp_id || emp.id || "");
    return !resignedEmpIds.includes(empId);
  });

  const calculateDays = (joiningDate, startDate) => {
    if (!joiningDate || !startDate) return "";

    const join = new Date(joiningDate);
    const start = new Date(startDate);

    if (isNaN(join.getTime()) || isNaN(start.getTime())) return "";

    const diffTime = start - join;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 ? diffDays : 0;
  };

  const handleEmployeeSelect = (empId) => {
    const emp = activeEmployees.find(
      (e) =>
        String(e.employee_id) === String(empId) ||
        String(e.emp_id) === String(empId) ||
        String(e.id) === String(empId)
    );

    const joiningDate =
      emp?.joining_date ||
      emp?.join_date ||
      emp?.date_of_joining ||
      "";

    const branchId =
      emp?.branch_id ||
      emp?.branch_code ||
      emp?.branch ||
      emp?.work_location ||
      "";

    const branchName =
      emp?.branch_name ||
      emp?.branch ||
      emp?.work_location ||
      branchId ||
      "";

    const empName =
      emp?.full_name ||
      emp?.employee_name ||
      emp?.name ||
      "";

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
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "start_date") {
        updated.total_working_days = calculateDays(
          updated.joining_date,
          value
        );
      }

      return updated;
    });
  };

  const resetForm = () => {
    setLetterFile(null);

    setForm({
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
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.emp_id || !form.branch_id || !form.start_date) {
      toast.error("Employee, Branch and Start Date required");
      return;
    }

    const alreadyResigned = resignations.some(
      (item) => String(item.emp_id) === String(form.emp_id)
    );

    if (alreadyResigned) {
      toast.error("This employee resignation already exists");
      return;
    }

    const formData = new FormData();

    formData.append("emp_id", form.emp_id);
    formData.append("emp_name", form.emp_name);
    formData.append("branch_id", form.branch_id);
    formData.append("branch_name", form.branch_name);
    formData.append("joining_date", form.joining_date);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);
    formData.append("total_working_days", form.total_working_days);
    formData.append("reason", form.reason);
    formData.append("accepted_by", form.accepted_by);
    formData.append("remark", form.remark);
    formData.append("status", form.status);

    if (letterFile) {
      formData.append("resignation_letter", letterFile);
    }

    try {
      const res = await fetch(RESIGNATION_POST_API, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Resignation saved successfully");
        resetForm();
        fetchResignations();
      } else {
        toast.error(json.message || "Resignation save failed");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-500 p-6 text-white">
          <h1 className="text-2xl font-bold">Employee Resignation</h1>
          <p className="text-sm text-orange-100">
            Manage employee resignation details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">
                <User size={16} /> Employee ID & Name
              </label>

              <select
                value={form.emp_id}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className="input"
                required
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

              {activeEmployees.length === 0 && (
                <p className="text-sm text-red-600 mt-2">
                  No employee available. All employees already resigned.
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <Building2 size={16} /> Branch ID & Name
              </label>

              <input
                value={
                  form.branch_id
                    ? `${form.branch_id} - ${form.branch_name}`
                    : ""
                }
                readOnly
                className="input bg-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="label">
                <CalendarDays size={16} /> Joining Date
              </label>

              <input
                type="date"
                name="joining_date"
                value={form.joining_date}
                readOnly
                className="input bg-slate-100"
              />
            </div>

            <div>
              <label className="label">
                <CalendarDays size={16} /> Start Date
              </label>

              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">
                <CalendarDays size={16} /> End Date
              </label>

              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">
                <CalendarDays size={16} /> Day Difference
              </label>

              <input
                value={
                  form.total_working_days !== ""
                    ? `${form.total_working_days} Days`
                    : ""
                }
                readOnly
                className="input bg-slate-100"
              />
            </div>

            <div>
              <label className="label">
                <ClipboardPen size={16} /> Accepted By
              </label>

              <input
                name="accepted_by"
                value={form.accepted_by}
                onChange={handleChange}
                placeholder="Accepted by"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">
              <FileText size={16} /> Reason
            </label>

            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows="4"
              placeholder="Enter resignation reason"
              className="input resize-none"
            />
          </div>

          <div>
            <label className="label">
              <Upload size={16} /> Upload Resignation Letter
            </label>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => setLetterFile(e.target.files[0])}
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
              rows="3"
              placeholder="Enter remark"
              className="input resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={activeEmployees.length === 0}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all"
            >
              <Send size={18} />
              Submit Resignation
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
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
        }
      `}</style>
    </div>
  );
}