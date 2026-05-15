import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  FileText,
  IndianRupee,
  User,
  Building2,
  CalendarDays,
  ClipboardPen,
  Send,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const COMPLAINT_API = "https://ojmee.in/employee/emp_complaints";
const EMPLOYEE_API = "https://ojmee.in/employee/get_employee";
const PENALTY_API = "https://ojmee.in/employee/emp_complaints_post";

export default function EmployeePenaltyForm() {
  const [penaltyType, setPenaltyType] = useState("Complaint");
  const [complaints, setComplaints] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");

  const [form, setForm] = useState({
    complaint_id: "",
    emp_id: "",
    emp_name: "",
    branch_id: "",
    complaint_date: "",
    penalty_amount: "",
    remark: "",
    reported_by: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchComplaints();
    fetchEmployees();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(COMPLAINT_API);
      const json = await res.json();

      const list = Array.isArray(json) ? json : json.data || [];

      const filtered = list.filter((item) => {
        const suspected = String(item.suspected_employee || "")
          .trim()
          .toLowerCase();

        const status = String(item.status || "")
          .trim()
          .toLowerCase();

        return (
          suspected !== "" &&
          suspected !== "other" &&
          status === "completed"
        );
      });

      setComplaints(filtered);
    } catch (error) {
      toast.error("Complaint data fetch failed");
    }
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
    setSelectedComplaint("");

    setForm({
      complaint_id: "",
      emp_id: "",
      emp_name: "",
      branch_id: "",
      complaint_date: "",
      penalty_amount: "",
      remark: "",
      reported_by: "",
      status: "Pending",
    });
  };

  const handlePenaltyTypeChange = (value) => {
    setPenaltyType(value);
    resetForm();
  };

  const handleComplaintSelect = (complaintId) => {
    setSelectedComplaint(complaintId);

    const complaint = complaints.find(
      (item) => String(item.complaint_id) === String(complaintId)
    );

    if (!complaint) return;

    const penaltyEmpId = complaint.suspected_employee;
    const empName = getEmployeeName(penaltyEmpId);

    setForm({
      complaint_id: complaint.complaint_id,
      emp_id: penaltyEmpId || "",
      emp_name: empName,
      branch_id: complaint.branch_id || "",
      complaint_date: complaint.created_at || "",
      penalty_amount: "",
      remark: complaint.remark || complaint.full_details || "",
      reported_by: complaint.complaint_raise_by || "",
      status: "Pending",
    });
  };

  const handleEmployeeSelect = (empId) => {
    const emp = employees.find(
      (e) =>
        String(e.employee_id) === String(empId) ||
        String(e.emp_id) === String(empId) ||
        String(e.id) === String(empId)
    );

    setForm({
      ...form,
      emp_id: empId,
      emp_name: emp?.full_name || emp?.employee_name || emp?.name || "",
      branch_id: emp?.branch_id || emp?.branch || "",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.emp_id || !form.branch_id || !form.penalty_amount) {
      toast.error("Employee, Branch and Penalty Amount required");
      return;
    }

    const payload = {
      penalty_type: penaltyType,
      complaint_id: penaltyType === "Complaint" ? form.complaint_id : null,
      emp_id: form.emp_id,
      emp_name: form.emp_name,
      branch_id: form.branch_id,
      complaint_date: penaltyType === "Complaint" ? form.complaint_date : null,
      penalty_amount: form.penalty_amount,
      remark: form.remark,
      reported_by: form.reported_by,
      status: form.status,
    };

    try {
      const res = await fetch(PENALTY_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Penalty saved successfully");
        handlePenaltyTypeChange("Complaint");
      } else {
        toast.error(json.message || "Penalty save failed");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const noCompletedComplaint =
    penaltyType === "Complaint" && complaints.length === 0;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-rose-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle size={34} />
            <div>
              <h1 className="text-2xl font-bold">Employee Penalty</h1>
              <p className="text-sm text-red-100">
                Complaint reference penalty or new manual penalty
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Penalty Type</label>
              <select
                value={penaltyType}
                onChange={(e) => handlePenaltyTypeChange(e.target.value)}
                className="input"
              >
                <option value="Complaint">Already Complaint</option>
                <option value="New">New Penalty</option>
              </select>
            </div>

            {penaltyType === "Complaint" && !noCompletedComplaint && (
              <div>
                <label className="label">Complaint Number</label>

                <select
                  value={selectedComplaint}
                  onChange={(e) => handleComplaintSelect(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select completed complaint</option>

                  {complaints.map((item) => (
                    <option key={item.complaint_id} value={item.complaint_id}>
                      CMP-{item.complaint_id} / {item.suspected_employee} /{" "}
                      {item.branch_id}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {noCompletedComplaint ? (
            <div className="w-full border border-red-200 bg-red-50 text-red-600 rounded-xl px-4 py-4 text-sm font-semibold">
              No Completed Complaint Found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="label">
                    <User size={16} /> Employee
                  </label>

                  {penaltyType === "Complaint" ? (
                    <input
                      value={`${form.emp_id} ${
                        form.emp_name ? "- " + form.emp_name : ""
                      }`}
                      readOnly
                      className="input bg-slate-100"
                    />
                  ) : (
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
                  )}
                </div>

                <div>
                  <label className="label">
                    <Building2 size={16} /> Branch ID
                  </label>

                  <input
                    name="branch_id"
                    value={form.branch_id}
                    onChange={handleChange}
                    readOnly={penaltyType === "Complaint"}
                    className={`input ${
                      penaltyType === "Complaint" ? "bg-slate-100" : ""
                    }`}
                    required
                  />
                </div>

                {penaltyType === "Complaint" && (
                  <div>
                    <label className="label">
                      <CalendarDays size={16} /> Complaint Date
                    </label>

                    <input
                      value={form.complaint_date}
                      readOnly
                      className="input bg-slate-100"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="label">
                    <IndianRupee size={16} /> Penalty Amount
                  </label>

                  <input
                    type="number"
                    name="penalty_amount"
                    value={form.penalty_amount}
                    onChange={handleChange}
                    placeholder="Enter penalty amount"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <ClipboardPen size={16} /> Reported By
                  </label>

                  <input
                    name="reported_by"
                    value={form.reported_by}
                    onChange={handleChange}
                    placeholder="Reported by"
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
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">
                  <FileText size={16} /> Remark
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
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all"
                >
                  <Send size={18} />
                  Submit Penalty
                </button>
              </div>
            </>
          )}
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
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }
      `}</style>
    </div>
  );
}