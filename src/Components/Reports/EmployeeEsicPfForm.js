import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import { Toaster } from "react-hot-toast";

const API = "https://ojmee.in/employee";
const CURRENT_PATH = "/add-EsicPf";

export default function EmployeeESICPFForm() {
  const emptyForm = {
    id: "",
    esicpf_id: "",
    emp_id: "",
    emp_name: "",
    branch_id: "",
    work_location: "",
    department: "",
    designation: "",
    current_salary: "",
    basic_salary: "",
    allowances: "",

    esic_applicable: "No",
    esic_number: "",
    esic_deduct_salary: "",
    esic_employee_percent: "0.75",
    esic_employer_percent: "3.25",
    esic_employee_amount: "0",
    esic_employer_amount: "0",

    pf_applicable: "No",
    pf_number: "",
    uan_number: "",
    pf_deduct_salary: "",
    pf_type: "Single Side Employee",
    pf_employee_percent: "12",
    pf_employer_percent: "0",
    pf_employee_amount: "0",
    pf_employer_amount: "0",
    total_pf_amount: "0",

    total_deduction_employee: "0",
    total_company_contribution: "0",

    effective_date: "",
    order_by: "",
    status: "Active",
    remark: "",
  };

  const [employees, setEmployees] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role") || "view";
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  const pagePermission =
    role === "superAdmin"
      ? { can_view: 1, can_add: 1, can_edit: 1, can_delete: 1 }
      : permissions.find((p) => p.route_path === CURRENT_PATH) || {};

  const canView =
    role === "superAdmin" || Number(pagePermission.can_view) === 1;
  const canAdd =
    role === "superAdmin" || Number(pagePermission.can_add) === 1;
  const canEdit =
    role === "superAdmin" || Number(pagePermission.can_edit) === 1;
  const canDelete =
    role === "superAdmin" || Number(pagePermission.can_delete) === 1;

  useEffect(() => {
    fetchEmployees();
    fetchList();
  }, [form]);

  useEffect(() => {
    calculateAmounts(form);
  }, [
    form.current_salary,
    form.basic_salary,
    form.esic_deduct_salary,
    form.pf_deduct_salary,
    form.esic_applicable,
    form.pf_applicable,
    form.pf_type,
    form.esic_employee_percent,
    form.esic_employer_percent,
  ]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/get_employee`);
      setEmployees(res.data.data || []);
    } catch (error) {
      console.log("Employee API Error:", error);
    }
  };

  const fetchList = async () => {
    try {
      const res = await axios.get(`${API}/emp_esicpf`);
      setList(res.data.data || []);
    } catch (error) {
      console.log("ESIC PF API Error:", error);
    }
  };

  const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const calculateAmounts = (data) => {
    const currentSalary = Number(data.current_salary || 0);
    const esicSalary = Number(data.esic_deduct_salary || currentSalary || 0);
    const pfSalary = Number(
      data.pf_deduct_salary || data.basic_salary || currentSalary || 0
    );

    let esicEmployeeAmount = 0;
    let esicEmployerAmount = 0;
    let pfEmployeePercent = 0;
    let pfEmployerPercent = 0;
    let pfEmployeeAmount = 0;
    let pfEmployerAmount = 0;

    if (data.esic_applicable === "Yes") {
      esicEmployeeAmount =
        (esicSalary * Number(data.esic_employee_percent || 0)) / 100;
      esicEmployerAmount =
        (esicSalary * Number(data.esic_employer_percent || 0)) / 100;
    }

    if (data.pf_applicable === "Yes") {
      if (data.pf_type === "Both Side Employee") {
        pfEmployeePercent = 24;
        pfEmployerPercent = 0;
        pfEmployeeAmount = (pfSalary * 24) / 100;
      } else if (data.pf_type === "Employee + Employer") {
        pfEmployeePercent = 12;
        pfEmployerPercent = 12;
        pfEmployeeAmount = (pfSalary * 12) / 100;
        pfEmployerAmount = (pfSalary * 12) / 100;
      } else {
        pfEmployeePercent = 12;
        pfEmployerPercent = 0;
        pfEmployeeAmount = (pfSalary * 12) / 100;
      }
    }

    setForm((prev) => ({
      ...prev,
      pf_employee_percent: pfEmployeePercent,
      pf_employer_percent: pfEmployerPercent,
      esic_employee_amount: Math.round(esicEmployeeAmount),
      esic_employer_amount: Math.round(esicEmployerAmount),
      pf_employee_amount: Math.round(pfEmployeeAmount),
      pf_employer_amount: Math.round(pfEmployerAmount),
      total_pf_amount: Math.round(pfEmployeeAmount + pfEmployerAmount),
      total_deduction_employee: Math.round(
        esicEmployeeAmount + pfEmployeeAmount
      ),
      total_company_contribution: Math.round(
        esicEmployerAmount + pfEmployerAmount
      ),
    }));
  };

  const handleEmployeeChange = (e) => {
    if (!canAdd) return alert("You do not have add permission");

    const empId = e.target.value;
    const emp = employees.find((item) => item.employee_id === empId);

    if (!emp) {
      setForm(emptyForm);
      return;
    }

    const basic = Number(emp.basic_salary || 0);
    const allowance = Number(emp.allowances || 0);
    const salary = basic + allowance;

    setForm({
      ...emptyForm,
      emp_id: emp.employee_id || "",
      emp_name: emp.full_name || emp.emp_name || emp.employee_name || "",
      branch_id: emp.branch_id || emp.work_location || "",
      work_location: emp.work_location || emp.branch_id || "",
      department: emp.department || "",
      designation: emp.designation || "",
      current_salary: salary || emp.current_salary || emp.salary || "",
      basic_salary: basic || emp.basic_salary || "",
      allowances: allowance || emp.allowances || "",
      esic_deduct_salary: salary || emp.current_salary || emp.salary || "",
      pf_deduct_salary: basic || emp.basic_salary || "",
      status: "Active",
    });
  };

  const handleChange = (e) => {
    if (!editMode && !canAdd) return alert("You do not have add permission");
    if (editMode && !canEdit) return alert("You do not have edit permission");

    const { name, value } = e.target;

    setForm((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "esic_applicable" && value === "No") {
        updated.esic_number = "";
        updated.esic_deduct_salary = "";
      }

      if (name === "pf_applicable" && value === "No") {
        updated.pf_number = "";
        updated.uan_number = "";
        updated.pf_deduct_salary = "";
        updated.pf_type = "Single Side Employee";
      }

      return updated;
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!editMode && !canAdd) return alert("You do not have add permission");
    if (editMode && !canEdit) return alert("You do not have edit permission");

    if (!form.emp_id) return alert("Employee required");
    if (!form.effective_date) return alert("Effective date required");
    if (!form.order_by) return alert("Order by required");

    if (form.esic_applicable === "Yes") {
      if (!form.esic_number) return alert("ESIC number required");
      if (!form.esic_deduct_salary) return alert("ESIC deduct amount required");
    }

    if (form.pf_applicable === "Yes") {
      if (!form.pf_number) return alert("PF number required");
      if (!form.pf_deduct_salary) return alert("PF deduct amount required");
    }

    if (form.esic_applicable === "No" && form.pf_applicable === "No") {
      return alert("ESIC ya PF me se kam se kam ek select karo");
    }

    try {
      const url = editMode
        ? `${API}/emp_esicpf_update`
        : `${API}/emp_esicpf_post`;

      const res = await axios.post(url, form);

      if (res.data.status || res.data.success) {
        alert(res.data.message || "Saved successfully");
        setForm(emptyForm);
        setEditMode(false);
        fetchList();
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "API not working");
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) return alert("You do not have edit permission");

    setEditMode(true);

    setForm({
      ...emptyForm,
      ...item,
      id: item.id || "",
      esicpf_id: item.esicpf_id || "",
      emp_id: item.emp_id || "",
      emp_name: item.emp_name || "",
      esic_applicable: item.esic_applicable || "No",
      esic_number: item.esic_number || "",
      esic_deduct_salary: item.esic_deduct_salary || item.current_salary || "",
      esic_employee_percent: item.esic_employee_percent || "0.75",
      esic_employer_percent: item.esic_employer_percent || "3.25",
      pf_applicable: item.pf_applicable || "No",
      pf_number: item.pf_number || "",
      uan_number: item.uan_number || "",
      pf_deduct_salary: item.pf_deduct_salary || item.basic_salary || "",
      pf_type: item.pf_type || "Single Side Employee",
      effective_date: item.effective_date || "",
      order_by: item.order_by || "",
      status: item.status || "Active",
      remark: item.remark || "",
      branch_id: item.branch_id || item.work_location || "",
      work_location: item.work_location || item.branch_id || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    if (!canDelete) return alert("You do not have delete permission");

    if (!window.confirm(`Delete ${item.esicpf_id || item.id}?`)) return;

    try {
      const res = await axios.post(`${API}/emp_esicpf_delete`, {
        id: item.id,
      });

      if (res.data.status || res.data.success) {
        alert(res.data.message || "Deleted successfully");
        fetchList();
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Delete API not working");
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setForm(emptyForm);
  };

  const filteredList = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return list;

    return list.filter((item) =>
      [
        item.esicpf_id,
        item.emp_id,
        item.emp_name,
        item.esic_number,
        item.pf_number,
        item.uan_number,
        item.status,
        item.order_by,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [list, search]);

  const usedEmployeeIds = useMemo(() => {
    return list
      .filter((item) => item.status === "Active")
      .map((item) => String(item.emp_id));
  }, [list]);

  const availableEmployees = useMemo(() => {
    return employees.filter(
      (emp) => !usedEmployeeIds.includes(String(emp.employee_id))
    );
  }, [employees, usedEmployeeIds]);

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

  const formAllowed = editMode ? canEdit : canAdd;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 p-6 text-white shadow-xl">
            <h1 className="text-3xl font-black">Employee ESIC & PF Form</h1>
            <p className="text-blue-100 mt-1">
              ESIC/PF deduction amount, employee deduction and company contribution
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="p-5 border-b bg-blue-50">
                <h2 className="text-xl font-black text-slate-800">
                  {editMode ? "Edit / Update ESIC PF" : "Create ESIC PF"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {formAllowed
                    ? "Fill ESIC/PF details carefully"
                    : editMode
                    ? "View Only Permission - Edit Not Allowed"
                    : "View Only Permission - Add Not Allowed"}
                </p>
              </div>

              <form
                onSubmit={submitForm}
                className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {!editMode ? (
                  <div>
                    <label className="label">Employee</label>
                    <select
                      value={form.emp_id}
                      onChange={handleEmployeeChange}
                      required
                      className="input"
                      disabled={!canAdd}
                    >
                      <option value="">Select Employee</option>
                      {availableEmployees.map((emp) => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.employee_id} -{" "}
                          {emp.full_name || emp.emp_name || emp.employee_name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Input label="Employee ID" value={form.emp_id} readOnly />
                )}

                <Input label="Employee Name" value={form.emp_name} readOnly />
                <Input label="Branch ID / Work Location" value={form.work_location || form.branch_id} readOnly />
                <Input label="Department" value={form.department} readOnly />
                <Input label="Designation" value={form.designation} readOnly />
                <Input label="Current Salary" value={form.current_salary} readOnly />
                <Input label="Basic Salary" value={form.basic_salary} readOnly />
                <Input label="Allowances" value={form.allowances} readOnly />

                <SectionTitle title="ESIC Section" />

                <SelectInput
                  label="ESIC Applicable"
                  name="esic_applicable"
                  value={form.esic_applicable}
                  onChange={handleChange}
                  options={["No", "Yes"]}
                  disabled={!formAllowed}
                />

                {form.esic_applicable === "Yes" && (
                  <>
                    <Input label="ESIC Number" name="esic_number" value={form.esic_number} onChange={handleChange} readOnly={!formAllowed} required />
                    <Input label="ESIC Deduct On Amount" name="esic_deduct_salary" type="number" value={form.esic_deduct_salary} onChange={handleChange} readOnly={!formAllowed} required />
                    <Input label="ESIC Employee %" name="esic_employee_percent" value={form.esic_employee_percent} onChange={handleChange} type="number" readOnly={!formAllowed} />
                    <Input label="ESIC Employer %" name="esic_employer_percent" value={form.esic_employer_percent} onChange={handleChange} type="number" readOnly={!formAllowed} />
                    <Input label="ESIC Employee Amount" value={money(form.esic_employee_amount)} readOnly />
                    <Input label="ESIC Employer Amount" value={money(form.esic_employer_amount)} readOnly />
                  </>
                )}

                <SectionTitle title="PF Section" />

                <SelectInput
                  label="PF Applicable"
                  name="pf_applicable"
                  value={form.pf_applicable}
                  onChange={handleChange}
                  options={["No", "Yes"]}
                  disabled={!formAllowed}
                />

                {form.pf_applicable === "Yes" && (
                  <>
                    <Input label="PF Number" name="pf_number" value={form.pf_number} onChange={handleChange} readOnly={!formAllowed} required />
                    <Input label="UAN Number" name="uan_number" value={form.uan_number} onChange={handleChange} readOnly={!formAllowed} />
                    <Input label="PF Deduct On Amount" name="pf_deduct_salary" type="number" value={form.pf_deduct_salary} onChange={handleChange} readOnly={!formAllowed} required />

                    <div>
                      <label className="label">PF Deduction Type</label>
                      <select
                        name="pf_type"
                        value={form.pf_type}
                        onChange={handleChange}
                        className="input"
                        disabled={!formAllowed}
                      >
                        <option value="Single Side Employee">Single Side Employee - 12%</option>
                        <option value="Both Side Employee">Both Side Employee - 12% + 12% = 24%</option>
                        <option value="Employee + Employer">Employee 12% + Employer 12%</option>
                      </select>
                    </div>

                    <Input label="PF Employee %" value={`${form.pf_employee_percent}%`} readOnly />
                    <Input label="PF Employer %" value={`${form.pf_employer_percent}%`} readOnly />
                    <Input label="PF Employee Amount" value={money(form.pf_employee_amount)} readOnly />
                    <Input label="PF Employer Amount" value={money(form.pf_employer_amount)} readOnly />
                    <Input label="Total PF Amount" value={money(form.total_pf_amount)} readOnly />
                  </>
                )}

                <SectionTitle title="Final Deduction Summary" />

                <Input label="Employee Total Deduction" value={money(form.total_deduction_employee)} readOnly />
                <Input label="Company Contribution" value={money(form.total_company_contribution)} readOnly />

                <Input label="Effective Date" name="effective_date" type="date" value={form.effective_date} onChange={handleChange} readOnly={!formAllowed} required />
                <Input label="Order By" name="order_by" value={form.order_by} onChange={handleChange} readOnly={!formAllowed} required />

                <SelectInput
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={["Active", "Inactive"]}
                  disabled={!formAllowed}
                />

                <div className="md:col-span-2">
                  <label className="label">Remark</label>
                  <textarea
                    name="remark"
                    value={form.remark}
                    onChange={handleChange}
                    className="input h-24"
                    readOnly={!formAllowed}
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  {formAllowed ? (
                    <button className="flex-1 bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-3 rounded-2xl font-black shadow-lg">
                      {editMode ? "Update ESIC PF" : "Create ESIC PF"}
                    </button>
                  ) : (
                    <div className="flex-1 bg-yellow-50 text-yellow-700 border border-yellow-200 py-3 rounded-2xl font-black text-center">
                      {editMode
                        ? "View Only Permission - Edit Not Allowed"
                        : "View Only Permission - Add Not Allowed"}
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
                <h2 className="text-xl font-black">ESIC PF History</h2>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by employee name, ID, PF, ESIC..."
                  className="mt-4 w-full px-4 py-3 rounded-2xl text-slate-800 outline-none"
                />
              </div>

              <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50 text-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Employee</th>
                      <th className="p-3">ESIC On</th>
                      <th className="p-3">PF On</th>
                      <th className="p-3">Deduction</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-500">
                          No ESIC PF data found
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b text-center hover:bg-blue-50/50"
                        >
                          <td className="p-3 font-black">{item.esicpf_id || item.id}</td>

                          <td className="p-3">
                            <div className="font-black text-slate-800">{item.emp_id}</div>
                            <div className="text-xs text-slate-500">{item.emp_name || "-"}</div>
                          </td>

                          <td className="p-3">{money(item.esic_deduct_salary)}</td>
                          <td className="p-3">{money(item.pf_deduct_salary)}</td>

                          <td className="p-3 font-black text-red-600">
                            {money(item.total_deduction_employee)}
                          </td>

                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${item.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                              {item.status}
                            </span>
                          </td>

                          <td className="p-3">
                            <div className="flex gap-2 justify-center">
                              {canEdit ? (
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="bg-amber-500 text-white px-3 py-2 rounded-xl font-bold"
                                >
                                  Edit
                                </button>
                              ) : (
                                <span className="text-xs font-black text-slate-400">
                                  View Only
                                </span>
                              )}

                              {canDelete && (
                                <button
                                  onClick={() => handleDelete(item)}
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
        .input:disabled,
        textarea:read-only {
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

function SelectInput({ label, name, value, onChange, options, disabled }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="input"
        disabled={disabled}
      >
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="md:col-span-2 mt-3">
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 px-4 py-3">
        <h3 className="text-base font-black text-blue-800">{title}</h3>
      </div>
    </div>
  );
}