import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ojmee.in/employee";

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

  const getAcceptedAdvanceTotal = (empId) => {
    return advanceList
      .filter((item) => item.emp_id === empId && item.status === "Accepted")
      .reduce((sum, item) => sum + Number(item.advance_amount || 0), 0);
  };

  const handleEmployeeChange = (e) => {
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
      emp_name: emp.full_name,
      current_salary: salary,
      salary_balance: balance,
      status: "Pending",
    });
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

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

  const generateAdvanceLetterHTML = (data) => {
    return `
      <html>
      <head>
        <title>Advance Salary Letter</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #111827;
          }
          .box {
            border: 2px solid #111827;
            padding: 30px;
            border-radius: 12px;
          }
          h1 {
            text-align: center;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          td {
            padding: 10px;
            border: 1px solid #d1d5db;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 80px;
          }
          .sign {
            width: 40%;
            text-align: center;
            border-top: 1px solid #111827;
            padding-top: 10px;
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Advance Salary Request</h1>

          <table>
            <tr><td><b>Advance ID</b></td><td>${data.advance_id || "-"}</td></tr>
            <tr><td><b>Employee ID</b></td><td>${data.emp_id || "-"}</td></tr>
            <tr><td><b>Employee Name</b></td><td>${data.emp_name || "-"}</td></tr>
            <tr><td><b>Current Salary</b></td><td>₹${Number(data.current_salary || 0).toLocaleString("en-IN")}</td></tr>
            <tr><td><b>Salary Balance</b></td><td>₹${Number(data.salary_balance || 0).toLocaleString("en-IN")}</td></tr>
            <tr><td><b>Advance Amount</b></td><td>₹${Number(data.advance_amount || 0).toLocaleString("en-IN")}</td></tr>
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
      console.log("Create Error:", error);
      alert(error.response?.data?.message || error.message || "API not working");
    }
  };

  const updateAdvance = async (e) => {
    e.preventDefault();

    if (!form.id) return alert("Select record first");
    if (!form.approve_by) return alert("Approve by required");
    if (!form.order_by) return alert("Order by required");
    if (!form.status) return alert("Status required");

    try {
      const formData = new FormData();

      formData.append("id", form.id);
      formData.append("approve_by", form.approve_by);
      formData.append("order_by", form.order_by);
      formData.append("remark", form.remark);
      formData.append("status", form.status);

      if (form.signature_document) {
        formData.append("signature_document", form.signature_document);
      }

      const res = await axios.post(
        `${API}/emp_advance_salary_update`,
        formData
      );

      if (res.data.status) {
        alert(res.data.message);
        setForm(emptyForm);
        setEditMode(false);
        fetchAdvanceList();
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
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setForm(emptyForm);
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Employee Advance Salary
      </h1>

      {!editMode ? (
        <form
          onSubmit={createAdvance}
          className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
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
          <Input label="Current Salary" value={form.current_salary} readOnly />
          <Input label="Salary Balance" value={form.salary_balance} readOnly />

          <Input
            label="Advance Amount"
            type="number"
            name="advance_amount"
            value={form.advance_amount}
            onChange={handleChange}
            required
          />

          <div>
            <label className="label">Advance Type</label>
            <select
              name="advance_type"
              value={form.advance_type}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Select Advance Type</option>
              <option value="Bulk amount">Bulk amount</option>
              <option value="Salary Advance">Salary Advance</option>
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

          <div className="md:col-span-3">
            <label className="label">Remark</label>
            <textarea
              name="remark"
              value={form.remark}
              onChange={handleChange}
              className="input h-24"
              placeholder="Enter remark"
            />
          </div>

          <button className="md:col-span-3 bg-blue-600 text-white py-3 rounded-xl font-semibold">
            Create Advance & Print
          </button>
        </form>
      ) : (
        <form
          onSubmit={updateAdvance}
          className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
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

          <div className="md:col-span-3">
            <label className="label">Remark</label>
            <textarea
              name="remark"
              value={form.remark}
              onChange={handleChange}
              className="input h-24"
            />
          </div>

          <div className="md:col-span-3 flex gap-3">
            <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold">
              Update Advance
            </button>

            <button
              type="button"
              onClick={cancelEdit}
              className="bg-slate-500 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3">Advance ID</th>
              <th className="p-3">Emp ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Salary</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Advance</th>
              <th className="p-3">Type</th>
              <th className="p-3">Order By</th>
              <th className="p-3">Approve By</th>
              <th className="p-3">Status</th>
              <th className="p-3">Document</th>
              <th className="p-3">Remark</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {advanceList.length === 0 ? (
              <tr>
                <td colSpan="13" className="p-5 text-center text-slate-500">
                  No advance salary data found
                </td>
              </tr>
            ) : (
              advanceList.map((item) => (
                <tr key={item.id} className="border-b text-center">
                  <td className="p-3 font-semibold">{item.advance_id}</td>
                  <td className="p-3">{item.emp_id}</td>
                  <td className="p-3">{item.emp_name}</td>
                  <td className="p-3">
                    ₹{Number(item.current_salary || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    ₹{Number(item.salary_balance || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 font-bold text-green-600">
                    ₹{Number(item.advance_amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">{item.advance_type}</td>
                  <td className="p-3">{item.order_by}</td>
                  <td className="p-3">{item.approve_by || "-"}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">
                    {item.signature_document ? (
                      <a
                        href={`${API}/${item.signature_document}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3">{item.remark || "-"}</td>

                  <td className="p-3">
                    {item.status === "Pending" && (
                      <div className="flex flex-wrap gap-2 justify-center">

                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-amber-500 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => printAdvanceLetter(item)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                          Print
                        </button>

                        <button
                          onClick={() => downloadAdvanceLetter(item)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                          Download
                        </button>

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