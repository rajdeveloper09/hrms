import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import { Toaster } from "react-hot-toast";

const API = "https://hrms-apis-ezda.onrender.com";
const CURRENT_PATH = "/add-advance";

export default function EmployeeAdvanceForm() {
  const emptyForm = {
    id: "",
    advance_id: "",
    emp_id: "",
    emp_name: "",
    current_salary: "",
    salary_balance: "",
    advance_amount: "",
    advance_type: "",
    order_by: "",
    remark: "",
    status: "Pending",
    approve_by: "",
    signature_document: null,
  };

  const [employees, setEmployees] = useState([]);
  const [advanceList, setAdvanceList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    fetchEmployees();
    fetchAdvanceList();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/get_employee`);
      setEmployees(res.data.data || []);
    } catch (error) {
      console.log("Employee API Error:", error);
    }
  };

  const fetchAdvanceList = async () => {
    try {
      const res = await axios.get(`${API}/emp_advance_salary`);
      setAdvanceList(res.data.data || []);
    } catch (error) {
      console.log("Advance API Error:", error);
    }
  };

  const filteredAdvanceList = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return advanceList;

    return advanceList.filter((item) =>
      [
        item.advance_id,
        item.emp_id,
        item.emp_name,
        item.employee_name,
        item.full_name,
        item.advance_amount,
        item.advance_type,
        item.order_by,
        item.approve_by,
        item.status,
        item.remark,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [advanceList, search]);

  const getAcceptedAdvanceTotal = (empId) => {
    return advanceList
      .filter((item) => item.emp_id === empId && item.status === "Accepted")
      .reduce((sum, item) => sum + Number(item.advance_amount || 0), 0);
  };

  const handleEmployeeChange = (e) => {
    if (!canAdd && !editMode) {
      return alert("You do not have add permission");
    }

    const empId = e.target.value;
    const emp = employees.find((item) => item.employee_id === empId);

    if (!emp) {
      setForm(emptyForm);
      return;
    }

    const salary = Number(emp.basic_salary || 0) + Number(emp.allowances || 0);
    const usedAdvance = getAcceptedAdvanceTotal(emp.employee_id);
    const balance = salary - usedAdvance;

    setForm({
      ...emptyForm,
      emp_id: emp.employee_id,
      emp_name: emp.full_name || emp.emp_name || emp.employee_name || "",
      current_salary: salary,
      salary_balance: balance,
      status: "Pending",
    });
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (!editMode && !canAdd) {
      return alert("You do not have add permission");
    }

    if (editMode && !canEdit) {
      return alert("You do not have edit permission");
    }

    if (name === "advance_amount") {
      const amount = Number(value || 0);
      const balance = Number(form.salary_balance || 0);

      if (amount > balance) {
        alert("Advance amount salary balance se jyada nahi ho sakta");
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const generateAdvanceLetterHTML = (data) => {
    return `
      <html>
      <head>
        <title>Advance Salary Letter</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111827; }
          .box { border: 2px solid #111827; padding: 30px; border-radius: 12px; }
          h1 { text-align: center; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          td { padding: 10px; border: 1px solid #d1d5db; }
          .signatures { display: flex; justify-content: space-between; margin-top: 80px; }
          .sign { width: 40%; text-align: center; border-top: 1px solid #111827; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Advance Salary Request</h1>
          <table>
            <tr><td><b>Advance ID</b></td><td>${data.advance_id || "-"}</td></tr>
            <tr><td><b>Employee ID</b></td><td>${data.emp_id || "-"}</td></tr>
            <tr><td><b>Employee Name</b></td><td>${data.emp_name || "-"}</td></tr>
            <tr><td><b>Current Salary</b></td><td>${formatMoney(data.current_salary)}</td></tr>
            <tr><td><b>Salary Balance</b></td><td>${formatMoney(data.salary_balance)}</td></tr>
            <tr><td><b>Advance Amount</b></td><td>${formatMoney(data.advance_amount)}</td></tr>
            <tr><td><b>Date</b></td><td>${data.created_at ? new Date(data.created_at).toLocaleDateString("en-GB") : "-"}</td></tr>
            <tr><td><b>Advance Type</b></td><td>${data.advance_type || "-"}</td></tr>
            <tr><td><b>Order By</b></td><td>${data.order_by || "-"}</td></tr>
            <tr><td><b>Status</b></td><td>${data.status || "Pending"}</td></tr>
            <tr><td><b>Remark</b></td><td>${data.remark || "-"}</td></tr>
          </table>

          <p style="margin-top:30px;">
            I confirm that I have requested the above advance salary amount.
          </p>

          <div class="signatures">
            <div class="sign">Employee Signature</div>
            <div class="sign">Authorize Person Signature</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const printAdvanceLetter = (data) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked hai. Browser me popup allow karo.");
      return;
    }

    printWindow.document.write(generateAdvanceLetterHTML(data));
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  const downloadAdvanceLetter = (data) => {
    const html = generateAdvanceLetterHTML(data);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.advance_id || "advance_salary_letter"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const createAdvance = async (e) => {
    e.preventDefault();

    if (!canAdd) return alert("You do not have add permission");

    if (!form.emp_id) return alert("Select employee");
    if (!form.advance_amount) return alert("Advance amount required");
    if (!form.advance_type) return alert("Advance type required");
    if (!form.order_by) return alert("Order by required");

    if (Number(form.advance_amount) > Number(form.salary_balance)) {
      return alert("Advance amount salary balance se jyada nahi ho sakta");
    }

    try {
      const res = await axios.post(`${API}/emp_advance_salary_post`, form);

      if (res.data.status) {
        const printData = {
          ...form,
          advance_id: res.data.advance_id,
          status: "Pending",
        };

        alert(res.data.message);
        printAdvanceLetter(printData);
        setForm(emptyForm);
        fetchAdvanceList();
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "API not working");
    }
  };

  const updateAdvance = async (e) => {
    e.preventDefault();

    if (!canEdit) return alert("You do not have edit permission");

    if (!form.id) return alert("Select record first");
    if (!form.approve_by) return alert("Approve by required");
    if (!form.order_by) return alert("Order by required");
    if (!form.status) return alert("Status required");

    try {
      const formData = new FormData();

      formData.append("id", form.id);
      formData.append("approve_by", form.approve_by);
      formData.append("order_by", form.order_by);
      formData.append("created_at", form.created_at || "");
      formData.append("remark", form.remark || "");
      formData.append("status", form.status);

      if (form.signature_document) {
        formData.append("signature_document", form.signature_document);
      }

      const res = await axios.post(`${API}/emp_advance_salary_update`, formData);

      if (res.data.status) {
        alert(res.data.message);
        setForm(emptyForm);
        setEditMode(false);
        fetchAdvanceList();
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "API not working");
    }
  };

  const deleteAdvance = async (item) => {
    if (!canDelete) return alert("You do not have delete permission");

    if (!window.confirm(`Delete ${item.advance_id}?`)) return;

    try {
      const res = await axios.post(`${API}/emp_advance_salary_delete`, {
        id: item.id,
      });

      if (res.data.status) {
        alert(res.data.message);
        fetchAdvanceList();
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Delete API not working");
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) return alert("You do not have edit permission");

    setEditMode(true);

    setForm({
      id: item.id,
      advance_id: item.advance_id,
      emp_id: item.emp_id,
      emp_name: item.emp_name,
      current_salary: item.current_salary,
      salary_balance: item.salary_balance,
      advance_amount: item.advance_amount,
      advance_type: item.advance_type,
      order_by: item.order_by || "",
      remark: item.remark || "",
      status: item.status || "Pending",
      approve_by: item.approve_by || "",
      signature_document: null,
      created_at: item.created_at || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setForm(emptyForm);
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

  const isFormAllowed = !editMode ? canAdd : canEdit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-6 text-white shadow-xl mb-6">
            <h1 className="text-3xl font-black">Employee Advance Salary</h1>
            <p className="text-blue-100 mt-1">
              Create, approve, print and manage advance salary requests
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="p-5 border-b bg-blue-50">
                <h2 className="text-xl font-black text-slate-800">
                  {!editMode ? "Create Advance" : "Approve / Update Advance"}
                </h2>
                <p className="text-sm text-slate-500">
                  {isFormAllowed
                    ? "Fill advance salary details carefully"
                    : !editMode
                    ? "View Only Permission - Create Not Allowed"
                    : "View Only Permission - Update Not Allowed"}
                </p>
              </div>

              <form
                onSubmit={!editMode ? createAdvance : updateAdvance}
                className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {!editMode ? (
                  <>
                    <div>
                      <label className="label">Employee</label>
                      <select
                        value={form.emp_id}
                        onChange={handleEmployeeChange}
                        required
                        disabled={!canAdd}
                        className="input"
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.employee_id} - {emp.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input label="Employee Name" value={form.emp_name} readOnly />
                    <Input label="Current Salary" value={form.current_salary} readOnly />
                    <Input label="Salary Balance" value={form.salary_balance} readOnly />

                    <Input
                      label="Advance Amount"
                      type="number"
                      name="advance_amount"
                      value={form.advance_amount}
                      onChange={handleChange}
                      readOnly={!canAdd}
                      required
                    />

                    <div>
                      <label className="label">Advance Type</label>
                      <select
                        name="advance_type"
                        value={form.advance_type}
                        onChange={handleChange}
                        required
                        disabled={!canAdd}
                        className="input"
                      >
                        <option value="">Select Advance Type</option>
                        {/* <option value="Bulk amount">Bulk amount</option> */}
                        <option value="Salary Advance">Salary Advance</option>
                      </select>
                    </div>

                    <Input
                      label="Order By"
                      name="order_by"
                      value={form.order_by}
                      onChange={handleChange}
                      readOnly={!canAdd}
                      required
                    />

                    <Input label="Status" value="Pending" readOnly />
                  </>
                ) : (
                  <>
                    <Input label="Advance ID" value={form.advance_id} readOnly />
                    <Input label="Employee ID" value={form.emp_id} readOnly />
                    <Input label="Employee Name" value={form.emp_name} readOnly />
                    <Input label="Advance Amount" value={form.advance_amount} readOnly />
                    <Input label="Advance Type" value={form.advance_type} readOnly />

                    <Input
                      label="Approve By"
                      name="approve_by"
                      value={form.approve_by}
                      onChange={handleChange}
                      readOnly={!canEdit}
                      required
                    />

                    <Input
                      label="Order By"
                      name="order_by"
                      value={form.order_by}
                      onChange={handleChange}
                      readOnly={!canEdit}
                      required
                    />

                    <div>
                      <label className="label">Status</label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        required
                        disabled={!canEdit}
                        className="input"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Upload Signed Document</label>
                      <input
                        type="file"
                        name="signature_document"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={handleChange}
                        disabled={!canEdit}
                        className="input"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <label className="label">Remark</label>
                  <textarea
                    name="remark"
                    value={form.remark}
                    onChange={handleChange}
                    readOnly={!isFormAllowed}
                    className="input h-24"
                    placeholder="Enter remark"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  {isFormAllowed ? (
                    <button className="flex-1 bg-gradient-to-r from-indigo-700 to-cyan-600 text-white py-3 rounded-2xl font-black shadow-lg">
                      {!editMode ? "Create Advance & Print" : "Update Advance"}
                    </button>
                  ) : (
                    <div className="flex-1 bg-yellow-50 text-yellow-700 border border-yellow-200 py-3 rounded-2xl font-black text-center">
                      {!editMode
                        ? "View Only Permission - Add Not Allowed"
                        : "View Only Permission - Edit Not Allowed"}
                    </div>
                  )}

                  {editMode && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-slate-600 text-white px-8 py-3 rounded-2xl font-black"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="p-5 bg-slate-900 text-white">
                <h2 className="text-xl font-black">Advance History</h2>
                <p className="text-sm text-slate-300">
                  Search employee advance salary records
                </p>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by employee name, ID, amount, status..."
                  className="mt-4 w-full px-4 py-3 rounded-2xl text-slate-800 outline-none"
                />
              </div>

              <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50 text-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Advance</th>
                      <th className="p-3">Balance</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAdvanceList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No advance salary data found
                        </td>
                      </tr>
                    ) : (
                      filteredAdvanceList.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b text-center hover:bg-blue-50/50"
                        >
                          <td className="p-3 font-black">{item.advance_id}</td>

                          <td className="p-3">
                            <div className="font-black text-slate-800">
                              {item.emp_id}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.emp_name ||
                                item.employee_name ||
                                item.full_name ||
                                "-"}
                            </div>
                          </td>

                          <td className="p-3 font-black text-emerald-600">
                            {formatMoney(item.advance_amount)}
                          </td>

                          <td className="p-3 font-bold text-blue-700">
                            {formatMoney(item.salary_balance)}
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black ${
                                item.status === "Accepted"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : item.status === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td className="p-3">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {item.status === "Pending" && canEdit && (
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="bg-amber-500 text-white px-3 py-2 rounded-xl font-bold"
                                >
                                  Edit
                                </button>
                              )}

                              {item.status === "Pending" && !canEdit && (
                                <span className="text-xs font-black text-slate-400">
                                  View Only
                                </span>
                              )}

                              <button
                                onClick={() => printAdvanceLetter(item)}
                                className="bg-blue-600 text-white px-3 py-2 rounded-xl font-bold"
                              >
                                Print
                              </button>

                              <button
                                onClick={() => downloadAdvanceLetter(item)}
                                className="bg-emerald-600 text-white px-3 py-2 rounded-xl font-bold"
                              >
                                Download
                              </button>

                              {item.signature_document && (
                                <a
                                  href={`${API}/${item.signature_document}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="bg-slate-700 text-white px-3 py-2 rounded-xl font-bold"
                                >
                                  View
                                </a>
                              )}

                              {canDelete && (
                                <button
                                  onClick={() => deleteAdvance(item)}
                                  className="bg-red-600 text-white px-3 py-2 rounded-xl font-bold"
                                >
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
      </div>

      <style>{`
        .label {
          display:block;
          font-size:13px;
          font-weight:800;
          color:#334155;
          margin-bottom:8px;
        }

        .input {
          width:100%;
          padding:12px 14px;
          border-radius:16px;
          border:1px solid #dbeafe;
          background:#ffffff;
          outline:none;
          font-weight:700;
          color:#1e293b;
        }

        .input:focus {
          border-color:#2563eb;
          box-shadow:0 0 0 4px rgba(37,99,235,0.12);
        }

        .input:read-only,
        .input:disabled {
          background:#f8fafc;
          color:#475569;
          cursor:not-allowed;
        }
      `}</style>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}