import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import SideNav from "../SideNav";

const API = "https://ojmee.in/employee";

export default function EmployeeExpensesForm() {
  const emptyForm = {
    id: "",
    expenses_id: "",
    emp_id: "",
    emp_name: "",
    expenses_amount: "",
    expenses_type: "",
    order_by: "",
    expenses_date: "",
    remark: "",
    status: "Pending",
    approve_by: "",
    signature_document: null,
  };

  const [employees, setEmployees] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchExpensesList();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/get_employee`);
      setEmployees(res.data.data || []);
    } catch (error) {
      console.log("Employee API Error:", error);
    }
  };

  const fetchExpensesList = async () => {
    try {
      const res = await axios.get(`${API}/emp_expenses`);
      setExpensesList(res.data.data || []);
    } catch (error) {
      console.log("Expenses API Error:", error);
    }
  };

  const filteredExpenses = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return expensesList;

    return expensesList.filter((item) => {
      const employeeName =
        item.emp_name || item.employee_name || item.full_name || "";

      return [
        item.expenses_id,
        item.emp_id,
        employeeName,
        item.expenses_amount,
        item.expenses_type,
        item.expenses_date,
        item.order_by,
        item.approve_by,
        item.status,
        item.remark,
      ]
        .map((value) => String(value || "").toLowerCase())
        .join(" ")
        .includes(q);
    });
  }, [expensesList, search]);

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    const emp = employees.find((item) => item.employee_id === empId);

    if (!emp) {
      setForm(emptyForm);
      return;
    }

    setForm({
      ...emptyForm,
      emp_id: emp.employee_id,
      emp_name: emp.full_name || emp.emp_name || emp.employee_name || "",
      status: "Pending",
    });
  };
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const generateExpensesLetterHTML = (data) => {
    return `
      <html>
      <head>
        <title>Employee Expenses Letter</title>
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
          <h1>Employee Expenses Request</h1>

          <table>
            <tr><td><b>Expenses ID</b></td><td>${data.expenses_id || "-"}</td></tr>
            <tr><td><b>Employee ID</b></td><td>${data.emp_id || "-"}</td></tr>
            <tr><td><b>Employee Name</b></td><td>${data.emp_name || "-"}</td></tr>
            <tr><td><b>Expenses Amount</b></td><td>₹${Number(data.expenses_amount || 0).toLocaleString("en-IN")}</td></tr>
            <tr><td><b>Expenses Date</b></td><td>${formatDate(data.expenses_date)}</td></tr>
            <tr><td><b>Expenses Type</b></td><td>${data.expenses_type || "-"}</td></tr>
            <tr><td><b>Order By</b></td><td>${data.order_by || "-"}</td></tr>
            <tr><td><b>Status</b></td><td>${data.status || "Pending"}</td></tr>
            <tr><td><b>Remark</b></td><td>${data.remark || "-"}</td></tr>
          </table>

          <p style="margin-top:30px;">
            I confirm that I have requested the above expenses amount.
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

  const printExpensesLetter = (data) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked hai. Browser popup allow karo.");
      return;
    }

    printWindow.document.write(generateExpensesLetterHTML(data));
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  const downloadExpensesLetter = (data) => {
    const html = generateExpensesLetterHTML(data);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.expenses_id || "employee_expenses_letter"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const createExpenses = async (e) => {
    e.preventDefault();

    if (!form.emp_id) return alert("Select employee");
    if (!form.expenses_amount) return alert("Expenses amount required");
    if (!form.expenses_type) return alert("Expenses type required");
    if (!form.expenses_date) return alert("Expenses date required");
    if (!form.order_by) return alert("Order by required");

    try {
      const formData = new FormData();

      formData.append("emp_id", form.emp_id);
      formData.append("emp_name", form.emp_name);
      formData.append("expenses_amount", form.expenses_amount);
      formData.append("expenses_type", form.expenses_type);
      formData.append("expenses_date", form.expenses_date);
      formData.append("order_by", form.order_by);
      formData.append("remark", form.remark);

      const res = await axios.post(`${API}/emp_expenses_post`, formData);

      if (res.data.status) {
        const printData = {
          ...form,
          expenses_id: res.data.expenses_id,
          status: "Pending",
        };

        alert(res.data.message);
        printExpensesLetter(printData);
        setForm(emptyForm);
        fetchExpensesList();
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "API not working");
    }
  };

  const updateExpenses = async (e) => {
    e.preventDefault();

    if (!form.id) return alert("Select record first");
    if (!form.approve_by) return alert("Approve by required");
    if (!form.order_by) return alert("Order by required");
    if (!form.expenses_date) return alert("Expenses date required");
    if (!form.status) return alert("Status required");

    try {
      const formData = new FormData();

      formData.append("id", form.id);
      formData.append("approve_by", form.approve_by);
      formData.append("order_by", form.order_by);
      formData.append("remark", form.remark);
      formData.append("status", form.status);
      formData.append("expenses_date", form.expenses_date);

      if (form.signature_document) {
        formData.append("signature_document", form.signature_document);
      }

      const res = await axios.post(`${API}/emp_expenses_post_update`, formData);

      if (res.data.status) {
        alert(res.data.message);
        setForm(emptyForm);
        setEditMode(false);
        fetchExpensesList();
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Update Error:", error);
      alert(error.response?.data?.message || error.message || "API not working");
    }
  };

  const handleEdit = (item) => {
    setEditMode(true);

    setForm({
      id: item.id,
      expenses_id: item.expenses_id,
      emp_id: item.emp_id,
      emp_name: item.emp_name,
      expenses_amount: item.expenses_amount,
      expenses_type: item.expenses_type,
      expenses_date: item.expenses_date,
      order_by: item.order_by || "",
      remark: item.remark || "",
      status: item.status || "Pending",
      approve_by: item.approve_by || "",
      signature_document: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 ml-72 p-4 overflow-y-auto min-h-screen">
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 p-6 text-white shadow-xl">
            <h1 className="text-3xl font-black">Employee Expenses</h1>
            <p className="text-rose-100 mt-1">
              Create, approve, print and manage employee expenses
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden">
              <div className="p-5 border-b bg-rose-50">
                <h2 className="text-xl font-black text-slate-800">
                  {!editMode ? "Create Expenses" : "Approve / Update Expenses"}
                </h2>
                <p className="text-sm text-slate-500">
                  Fill expenses details carefully
                </p>
              </div>

              <form
                onSubmit={!editMode ? createExpenses : updateExpenses}
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

                    <Input
                      label="Expenses Amount"
                      type="number"
                      name="expenses_amount"
                      value={form.expenses_amount}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Expenses Date"
                      type="date"
                      name="expenses_date"
                      value={form.expenses_date}
                      onChange={handleChange}
                      required
                    />

                    <div>
                      <label className="label">Expenses Type</label>
                      <select
                        name="expenses_type"
                        value={form.expenses_type}
                        onChange={handleChange}
                        required
                        className="input"
                      >
                        <option value="">Select Expenses Type</option>
                        <option value="Travel Expenses">Travel Expenses</option>
                        <option value="Food Expenses">Food Expenses</option>
                        <option value="Employee Welfare">Employee Welfare</option>
                        <option value="Other Expenses">Other Expenses</option>
                      </select>
                    </div>

                    <Input
                      label="Order By"
                      name="order_by"
                      value={form.order_by}
                      onChange={handleChange}
                      required
                    />

                    <Input label="Status" value="Pending" readOnly />
                  </>
                ) : (
                  <>
                    <Input label="Expenses ID" value={form.expenses_id} readOnly />
                    <Input label="Employee ID" value={form.emp_id} readOnly />
                    <Input label="Employee Name" value={form.emp_name} readOnly />
                    <Input label="Expenses Amount" value={form.expenses_amount} readOnly />
                    <Input label="Expenses Type" value={form.expenses_type} readOnly />

                    <Input
                      label="Expenses Date"
                      type="date"
                      name="expenses_date"
                      value={form.expenses_date}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Approve By"
                      name="approve_by"
                      value={form.approve_by}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Order By"
                      name="order_by"
                      value={form.order_by}
                      onChange={handleChange}
                      required
                    />

                    <div>
                      <label className="label">Status</label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        required
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
                    className="input h-24"
                    placeholder="Enter remark"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 rounded-2xl font-black shadow-lg">
                    {!editMode ? "Create Expenses & Print" : "Update Expenses"}
                  </button>

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

            <div className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden">
              <div className="p-5 bg-slate-900 text-white">
                <h2 className="text-xl font-black">Expenses History</h2>
                <p className="text-sm text-slate-300">
                  Search and manage employee expenses records
                </p>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by employee, amount, date, type, status..."
                  className="mt-4 w-full px-4 py-3 rounded-2xl text-slate-800 outline-none"
                />
              </div>

              <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-rose-50 text-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Expense Amount</th>
                      <th className="p-3">Expense Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No expenses data found
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map((item) => (
                        <tr key={item.id} className="border-b text-center hover:bg-rose-50/40">
                          <td className="p-3 font-black">{item.expenses_id}</td>

                          <td className="p-3">
                            <div className="font-black text-slate-800">
                              {item.emp_id}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.emp_name || item.employee_name || item.full_name || "-"}
                            </div>
                          </td>

                          <td className="p-3 font-black text-emerald-600">
                            ₹{Number(item.expenses_amount || 0).toLocaleString("en-IN")}
                          </td>

                          <td className="p-3">{formatDate(item.expenses_date)}</td>

                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black ${item.status === "Accepted"
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
                            {item.status === "Pending" && (
                              <div className="flex flex-wrap gap-2 justify-center">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="bg-amber-500 text-white px-3 py-2 rounded-xl font-bold"
                                >
                                  Edit
                                </button>


                                <button
                                  onClick={() => printExpensesLetter(item)}
                                  className="bg-blue-600 text-white px-3 py-2 rounded-xl font-bold"
                                >
                                  Print
                                </button>

                                <button
                                  onClick={() => downloadExpensesLetter(item)}
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

                              </div>
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
        </div>
      </div>
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