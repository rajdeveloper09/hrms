import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ojmee.in/employee";

export default function EmployeeTransferForm() {
  const emptyForm = {
    id: "",
    transfer_id: "",
    emp_id: "",
    emp_name: "",
    branch_id: "",
    branch_name: "",
    new_branch_id: "",
    start_date: "",
    end_date: "",
    difference_day: "Working",
    department: "",
    new_department: "",
    designation: "",
    new_designation: "",
    transfer_by: "",
    remark: "",
  };

  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newDesignations, setNewDesignations] = useState([]);
  const [transferList, setTransferList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchBranches();
    fetchDepartments();
    fetchTransfers();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/get_employee`);
      setEmployees(res.data.data || []);
    } catch (error) {
      console.log("Employee API Error:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API}/branches`);
      setBranches(res.data.data || []);
    } catch (error) {
      console.log("Branches API Error:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API}/departments`);
      setDepartments(res.data.data || []);
    } catch (error) {
      console.log("Departments API Error:", error);
    }
  };

  const fetchTransfers = async () => {
    try {
      const res = await axios.get(`${API}/emp_transfer_branch`);
      setTransferList(res.data.data || []);
    } catch (error) {
      console.log("Transfer API Error:", error);
    }
  };

  const calculateDifference = (startDate, endDate) => {
    if (!endDate) return "Working";

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) return "Invalid Date";

    const diffDays =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return `${diffDays} Days`;
  };

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
      emp_name: emp.full_name,
      branch_id: emp.work_location || "",
      branch_name: emp.work_location || "",
      start_date: emp.joining_date || "",
      department: emp.department || "",
      designation: emp.designation || "",
      difference_day: "Working",
    });
  };

  const handleNewDepartmentChange = (e) => {
    const deptName = e.target.value;

    const selectedDept = departments.find(
      (dept) => dept.name === deptName
    );

    setNewDesignations(selectedDept?.designations || []);

    setForm((prev) => ({
      ...prev,
      new_department: deptName,
      new_designation: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "end_date") {
        updated.difference_day = calculateDifference(
          updated.start_date,
          value
        );
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.emp_id) return alert("Select employee");
    if (!form.new_branch_id) return alert("New branch required");
    if (!form.new_department) return alert("New department required");
    if (!form.new_designation) return alert("New designation required");
    if (!form.transfer_by) return alert("Transfer by required");

    try {
      const url = editMode
        ? `${API}/emp_transfer_branch_update`
        : `${API}/emp_transfer_branch_post`;

      const res = await axios.post(url, form);

      if (res.data.status) {
        alert(res.data.message);
        setForm(emptyForm);
        setEditMode(false);
        setNewDesignations([]);
        fetchTransfers();
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Submit Error:", error);
      alert(error.response?.data?.message || error.message || "API not working");
    }
  };

  const handleEdit = (item) => {
    const selectedDept = departments.find(
      (dept) => dept.name === item.new_department
    );

    setNewDesignations(selectedDept?.designations || []);

    setEditMode(true);

    setForm({
      id: item.id,
      transfer_id: item.transfer_id,
      emp_id: item.emp_id,
      emp_name: item.emp_name,
      branch_id: item.branch_id,
      branch_name: item.branch_name,
      new_branch_id: item.new_branch_id || "",
      start_date: item.start_date,
      end_date: item.end_date || "",
      difference_day: item.difference_day || "Working",
      department: item.department,
      new_department: item.new_department || "",
      designation: item.designation,
      new_designation: item.new_designation || "",
      transfer_by: item.transfer_by,
      remark: item.remark || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setForm(emptyForm);
    setNewDesignations([]);
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Employee Transfer Form
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div>
          <label className="label">Employee</label>
          <select
            value={form.emp_id}
            onChange={handleEmployeeChange}
            disabled={editMode}
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
        <Input label="Current Branch ID" value={form.branch_id} readOnly />
        <Input label="Current Branch Name" value={form.branch_name} readOnly />

        <div>
          <label className="label">New Branch ID</label>
          <select
            name="new_branch_id"
            value={form.new_branch_id}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Select New Branch</option>
            {branches.map((branch) => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.branch_name} - {branch.branch_id}
              </option>
            ))}
          </select>
        </div>

        <Input label="Current Branch Joining Date" type="date" value={form.start_date} readOnly />

        <Input
          label="New Branch Start Date"
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
        />

        <Input label="Difference Day" value={form.difference_day} readOnly />

        <Input label="Current Department" value={form.department} readOnly />

        <div>
          <label className="label">New Department</label>
          <select
            name="new_department"
            value={form.new_department}
            onChange={handleNewDepartmentChange}
            required
            className="input"
          >
            <option value="">Select New Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <Input label="Current Designation" value={form.designation} readOnly />

        <div>
          <label className="label">New Designation</label>
          <select
            name="new_designation"
            value={form.new_designation}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Select New Designation</option>
            {newDesignations.map((des) => (
              <option key={des.id} value={des.name}>
                {des.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Transfer By"
          name="transfer_by"
          value={form.transfer_by}
          onChange={handleChange}
          required
        />

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

        <div className="md:col-span-3 flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
            {editMode ? "Update Transfer" : "Submit Transfer"}
          </button>

          {editMode && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-slate-500 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3">Transfer ID</th>
              <th className="p-3">Emp ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Old Branch</th>
              <th className="p-3">New Branch</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Days</th>
              <th className="p-3">Old Department</th>
              <th className="p-3">New Department</th>
              <th className="p-3">Old Designation</th>
              <th className="p-3">New Designation</th>
              <th className="p-3">Transfer By</th>
              <th className="p-3">Remark</th>
              {/* <th className="p-3">Action</th> */}
            </tr>
          </thead>

          <tbody>
            {transferList.length === 0 ? (
              <tr>
                <td colSpan="15" className="p-5 text-center text-slate-500">
                  No transfer data found
                </td>
              </tr>
            ) : (
              transferList.map((item) => (
                <tr key={item.id} className="border-b text-center">
                  <td className="p-3 font-semibold">{item.transfer_id}</td>
                  <td className="p-3">{item.emp_id}</td>
                  <td className="p-3">{item.emp_name}</td>
                  <td className="p-3">{item.branch_name || item.branch_id}</td>
                  <td className="p-3">{item.new_branch_id || "-"}</td>
                  <td className="p-3">{item.start_date}</td>
                  <td className="p-3">{item.end_date || "Working"}</td>
                  <td className="p-3">{item.difference_day || "Working"}</td>
                  <td className="p-3">{item.department}</td>
                  <td className="p-3">{item.new_department || "-"}</td>
                  <td className="p-3">{item.designation}</td>
                  <td className="p-3">{item.new_designation || "-"}</td>
                  <td className="p-3">{item.transfer_by}</td>
                  <td className="p-3">{item.remark || "-"}</td>
                  {/* <td className="p-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-amber-500 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>
                  </td> */}
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