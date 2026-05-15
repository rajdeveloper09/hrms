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
import SideNav from "../SideNav";

const COMPLAINT_API = "https://ojmee.in/employee/emp_complaints";
const EMPLOYEE_API = "https://ojmee.in/employee/get_employee";
const PENALTY_GET_API = "https://ojmee.in/employee/emp_penalties";
const PENALTY_API = "https://ojmee.in/employee/emp_penalties_post";


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
    penalty_date: "",
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
      const [complaintRes, penaltyRes] = await Promise.all([
        fetch(COMPLAINT_API),
        fetch(PENALTY_GET_API),
      ]);

      const complaintJson = await complaintRes.json();
      const penaltyJson = await penaltyRes.json();

      const complaintList = Array.isArray(complaintJson)
        ? complaintJson
        : complaintJson.data || [];

      const penaltyList = Array.isArray(penaltyJson)
        ? penaltyJson
        : penaltyJson.data || [];


      const penalizedComplaintIds = penaltyList
        .filter((p) => p.penalty_type === "Complaint")
        .map((p) => String(p.complaint_id));

      const filtered = complaintList.filter((item) => {
        const suspected = String(item.suspected_employee || "")
          .trim()
          .toLowerCase();

        const status = String(item.status || "")
          .trim()
          .toLowerCase();

        const complaintId = String(item.complaint_id);

        return (
          suspected !== "" &&
          suspected !== "other" &&
          status === "completed" &&
          !penalizedComplaintIds.includes(complaintId)
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
      penalty_date: "",
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
      branch_id:
        emp?.branch_id ||
        emp?.branch ||
        emp?.branch_name ||
        emp?.work_location ||
        "",
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

    if (penaltyType === "Complaint" && !form.complaint_id) {
      toast.error("Please select complaint");
      return;
    }

    const payload = {
      penalty_type: penaltyType,
      complaint_id: penaltyType === "Complaint" ? form.complaint_id : "",
      emp_id: form.emp_id,
      emp_name: form.emp_name,
      branch_id: form.branch_id,
      penalty_date: form.penalty_date,
      complaint_date: penaltyType === "Complaint" ? form.complaint_date : "",
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
        resetForm();
        await fetchComplaints();
      } else {
        toast.error(json.message || "Penalty save failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };


  const noCompletedComplaint =
    penaltyType === "Complaint" && complaints.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">

      <Toaster />

      <SideNav />
      <div className="flex-1 p-4 ml-72 overflow-y-auto bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 min-h-screen">

        <div className="mx-auto">

          {/* TOP HEADER */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 p-8 shadow-2xl mb-8">

            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex items-center justify-between flex-wrap gap-5">

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
                  <AlertTriangle size={38} className="text-white" />
                </div>

                <div>
                  <h1 className="text-4xl font-black text-white tracking-tight">
                    Employee Penalty
                  </h1>

                  <p className="text-red-100 mt-2 text-lg">
                    Complaint reference penalty or new manual penalty
                  </p>
                </div>
              </div>

              <div className="bg-white/15 border border-white/20 backdrop-blur-xl rounded-3xl px-6 py-4 shadow-lg">

                <div className="text-white text-sm font-medium">
                  HR Discipline Panel
                </div>

                <div className="text-white text-3xl font-black">
                  {complaints.length}
                </div>

                <div className="text-red-100 text-sm">
                  Active Complaints
                </div>

              </div>

            </div>
          </div>

          {/* FORM CARD */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[32px] border border-white shadow-2xl overflow-hidden">

            <form onSubmit={handleSubmit} className="p-8 space-y-8">

              {/* SECTION TITLE */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">

                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Penalty Information
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Fill employee penalty details carefully
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-2xl text-sm font-semibold border border-red-100">
                  <AlertTriangle size={16} />
                  HR Monitoring
                </div>

              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Penalty Type */}
                <div className="group">
                  <label className="label">
                    <AlertTriangle size={16} />
                    Penalty Type
                  </label>

                  <select
                    value={penaltyType}
                    onChange={(e) => handlePenaltyTypeChange(e.target.value)}
                    className="input"
                  >
                    <option value="Complaint">Already Complaint</option>
                    <option value="New">New Penalty</option>
                  </select>
                </div>

                {/* Complaint */}
                {penaltyType === "Complaint" && !noCompletedComplaint && (
                  <div className="group">
                    <label className="label">
                      <FileText size={16} />
                      Complaint Number
                    </label>

                    <select
                      value={selectedComplaint}
                      onChange={(e) => handleComplaintSelect(e.target.value)}
                      className="input"
                      required
                    >
                      <option value="">Select completed complaint</option>

                      {complaints.map((item) => (
                        <option
                          key={item.complaint_id}
                          value={item.complaint_id}
                        >
                          CMP-{item.complaint_id} / {item.suspected_employee}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Employee */}
                <div>
                  <label className="label">
                    <User size={16} />
                    Employee
                  </label>

                  {penaltyType === "Complaint" ? (
                    <input
                      value={`${form.emp_id} ${form.emp_name ? "- " + form.emp_name : ""}`}
                      readOnly
                      className="input bg-slate-100"
                    />
                  ) : (
                    <select
                      value={form.emp_id}
                      onChange={(e) => handleEmployeeSelect(e.target.value)}
                      className="input"
                    >
                      <option value="">Select employee</option>

                      {employees.map((emp, index) => {
                        const id =
                          emp.employee_id || emp.emp_id || emp.id;

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
                  )}
                </div>

                {/* Branch */}
                <div>
                  <label className="label">
                    <Building2 size={16} />
                    Branch
                  </label>

                  <input
                    value={form.branch_id}
                    readOnly
                    className="input bg-slate-100 cursor-not-allowed"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="label">
                    <CalendarDays size={16} />
                    Penalty Date
                  </label>

                  <input
                    type="date"
                    name="penalty_date"
                    value={form.penalty_date}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="label">
                    <IndianRupee size={16} />
                    Penalty Amount
                  </label>

                  <input
                    type="number"
                    name="penalty_amount"
                    value={form.penalty_amount}
                    onChange={handleChange}
                    placeholder="Enter penalty amount"
                    className="input"
                  />
                </div>

                {/* Reported By */}
                <div>
                  <label className="label">
                    <ClipboardPen size={16} />
                    Reported By
                  </label>

                  <input
                    name="reported_by"
                    value={form.reported_by}
                    onChange={handleChange}
                    placeholder="Reported by"
                    className="input"
                  />
                </div>

              </div>

              {/* REMARK */}
              <div>
                <label className="label">
                  <FileText size={16} />
                  Remark
                </label>

                <textarea
                  name="remark"
                  value={form.remark}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write detailed remark..."
                  className="input resize-none"
                />
              </div>

              {/* BUTTON */}
              <div className="flex justify-end pt-3">

                <button
                  type="submit"
                  className="group relative overflow-hidden flex items-center gap-3 bg-gradient-to-r from-red-600 to-rose-500 hover:scale-[1.02] active:scale-[0.98] text-white px-10 py-4 rounded-2xl font-bold shadow-2xl transition-all duration-300"
                >

                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition"></div>

                  <Send size={19} className="relative z-10" />

                  <span className="relative z-10">
                    Submit Penalty
                  </span>

                </button>

              </div>

            </form>
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
      border-color: #fda4af;
    }

    .input:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
      transform: translateY(-1px);
    }
  `}</style>

      </div>
    </div>
  );
}