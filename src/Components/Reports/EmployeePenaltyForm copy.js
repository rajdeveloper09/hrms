import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  FileText,
  IndianRupee,
  User,
  Building2,
  CalendarDays,
  ClipboardPen,
  Send,
  Search,
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
  const [allComplaints, setAllComplaints] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [search, setSearch] = useState("");

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

      setAllComplaints(complaintList);

      const penalizedComplaintIds = penaltyList
        .filter((p) => p.penalty_type === "Complaint")
        .map((p) => String(p.complaint_id));

      const filtered = complaintList.filter((item) => {
        const suspected = String(item.suspected_employee || "").trim().toLowerCase();
        const status = String(item.status || "").trim().toLowerCase();
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

  const filteredComplaintList = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allComplaints;

    return allComplaints.filter((item) =>
      [
        item.complaint_id,
        item.emp_id,
        item.emp_name,
        item.branch_id,
        item.complaint_type,
        item.complaint_between,
        item.suspected_employee,
        item.status,
        item.incident_place,
        item.complaint_raise_by,
        item.remark,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [allComplaints, search]);

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
      penalty_date: "",
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

  const handleComplaintRowClick = (item) => {
    const status = String(item.status || "").toLowerCase();

    if (status !== "completed") {
      toast.error("Only completed complaint can be selected for penalty");
      return;
    }

    const suspected = String(item.suspected_employee || "").trim().toLowerCase();

    if (!suspected || suspected === "other") {
      toast.error("Suspected employee not valid");
      return;
    }

    handleComplaintSelect(item.complaint_id);
    setPenaltyType("Complaint");
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
      toast.error("Server error");
    }
  };

  const noCompletedComplaint = penaltyType === "Complaint" && complaints.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster position="top-right" />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-4 overflow-y-auto min-h-screen">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 p-6 shadow-2xl mb-6">
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

            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Complaints" value={allComplaints.length} />
              <StatCard title="Available" value={complaints.length} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* LEFT FORM */}
          <div className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-5">
              <h2 className="text-xl font-black">Penalty Information</h2>
              <p className="text-sm text-slate-300">
                Fill employee penalty details carefully
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Penalty Type" icon={<AlertTriangle size={16} />}>
                  <select
                    value={penaltyType}
                    onChange={(e) => handlePenaltyTypeChange(e.target.value)}
                    className="input"
                  >
                    <option value="Complaint">Already Complaint</option>
                    <option value="New">New Penalty</option>
                  </select>
                </Field>

                {penaltyType === "Complaint" && !noCompletedComplaint && (
                  <Field label="Complaint Number" icon={<FileText size={16} />}>
                    <select
                      value={selectedComplaint}
                      onChange={(e) => handleComplaintSelect(e.target.value)}
                      className="input"
                      required
                    >
                      <option value="">Select completed complaint</option>

                      {complaints.map((item) => (
                        <option key={item.complaint_id} value={item.complaint_id}>
                          CMP-{item.complaint_id} / {item.suspected_employee}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                <Field label="Employee" icon={<User size={16} />}>
                  {penaltyType === "Complaint" ? (
                    <input
                      value={`${form.emp_id} ${form.emp_name ? "- " + form.emp_name : ""}`}
                      readOnly
                      className="input read"
                    />
                  ) : (
                    <select
                      value={form.emp_id}
                      onChange={(e) => handleEmployeeSelect(e.target.value)}
                      className="input"
                    >
                      <option value="">Select employee</option>

                      {employees.map((emp, index) => {
                        const id = emp.employee_id || emp.emp_id || emp.id;
                        const name = emp.full_name || emp.employee_name || emp.name || "";

                        return (
                          <option key={index} value={id}>
                            {id} - {name}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </Field>

                <Field label="Branch" icon={<Building2 size={16} />}>
                  <input value={form.branch_id} readOnly className="input read" />
                </Field>

                <Field label="Penalty Date" icon={<CalendarDays size={16} />}>
                  <input
                    type="date"
                    name="penalty_date"
                    value={form.penalty_date}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </Field>

                <Field label="Penalty Amount" icon={<IndianRupee size={16} />}>
                  <input
                    type="number"
                    name="penalty_amount"
                    value={form.penalty_amount}
                    onChange={handleChange}
                    placeholder="Enter penalty amount"
                    className="input"
                    required
                  />
                </Field>

                <Field label="Reported By" icon={<ClipboardPen size={16} />}>
                  <input
                    name="reported_by"
                    value={form.reported_by}
                    onChange={handleChange}
                    placeholder="Reported by"
                    className="input"
                  />
                </Field>

                <Field label="Status" icon={<ClipboardPen size={16} />}>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </Field>
              </div>

              <Field label="Remark" icon={<FileText size={16} />}>
                <textarea
                  name="remark"
                  value={form.remark}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write detailed remark..."
                  className="input resize-none"
                />
              </Field>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-500 hover:scale-[1.01] active:scale-[0.98] text-white px-10 py-4 rounded-2xl font-black shadow-2xl transition-all duration-300"
              >
                <Send size={19} />
                Submit Penalty
              </button>
            </form>
          </div>

          {/* RIGHT COMPLAINT LIST */}
          <div className="bg-white rounded-[32px] border border-white shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-5">
              <h2 className="text-xl font-black">Complaint List</h2>
              <p className="text-sm text-slate-300">
                Click completed complaint to create penalty
              </p>

              <div className="relative mt-4">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search complaint, employee, status..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[780px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-red-50 text-slate-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Complaint</th>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Suspected</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaintList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500">
                        No complaint data found
                      </td>
                    </tr>
                  ) : (
                    filteredComplaintList.map((item, index) => (
                      <tr
                        key={item.id || index}
                        onClick={() => handleComplaintRowClick(item)}
                        className="border-b text-center hover:bg-red-50/60 cursor-pointer"
                      >
                        <td className="p-3">
                          <div className="font-black text-slate-800">
                            CMP-{item.complaint_id || item.id || "-"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.complaint_type || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-bold">{item.emp_id || "-"}</div>
                          <div className="text-xs text-slate-500">
                            {item.emp_name || item.employee_name || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-rose-600">
                            {item.suspected_employee || "-"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.incident_place || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black ${
                              String(item.status || "").toLowerCase() === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : String(item.status || "").toLowerCase() === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.status || "Pending"}
                          </span>
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
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 14px 16px;
            outline: none;
            font-size: 14px;
            background: white;
            transition: all 0.25s ease;
          }

          .input:hover {
            border-color: #fda4af;
          }

          .input:focus {
            border-color: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
          }

          .read {
            background: #f8fafc;
            color: #64748b;
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

function StatCard({ title, value }) {
  return (
    <div className="bg-white/15 border border-white/20 backdrop-blur-xl rounded-3xl px-6 py-4 shadow-lg text-white min-w-[150px]">
      <div className="text-white/80 text-sm font-medium">{title}</div>
      <div className="text-white text-3xl font-black">{value}</div>
    </div>
  );
}