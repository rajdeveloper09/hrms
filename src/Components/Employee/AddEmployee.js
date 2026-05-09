import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../SideNav";
import { API_BASE_URL } from "../../config/api";
import toast from "react-hot-toast";

function CustomSelect({
  name,
  options,
  onChange,
  placeholder,
  value
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const ref = useRef();

  useEffect(() => {
    const selectedItem = options?.find(
      (opt) => opt.value === value
    );

    if (selectedItem) {
      setSelected(selectedItem.label);
    }
  }, [value, options]);

  const handleSelect = (item) => {
    setSelected(item.label);
    setOpen(false);

    onChange({
      target: {
        name,
        value: item.value,
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="input cursor-pointer bg-white flex justify-between items-center"
      >
        <span className={selected ? "text-black" : "text-gray-400"}>
          {selected || placeholder}
        </span>

        <svg
          className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-auto">
          {options?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-pink-100 cursor-pointer"
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AddEmployee() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);

  const totalSteps = 5;

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [employee, setEmployee] = useState({
    employee_id: "",
    employee_name: ""
  });

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    father_name: "",
    mother_name: "",
    mobile: "",
    emergency_person: "",
    emergency_number: "",
    email: "",
    gender: "",
    marital_status: "",
    spouse: "",
    children: "",
    dob: "",
    department: "",
    designation: "",
    reporting_person: "",
    refer_name: "",
    refer_contact: "",
    joining_date: "",
    employment_type: "",
    working_hours: "",
    monthly_leaves: "",
    yearly_leaves: "",
    work_location: "",
    basic_salary: "",
    allowances: "",
    bank_account: "",
    ifsc: "",
    salary_type: "",
    aadhaar: "",
    pan: "",
    address: "",
    pin: "",
    status: "",
    role: "",
    advance_payment: "",
    penalty: "",
    rewards: "",
    complaint: "",
    assets: "",
    interview_by: "",
    ot_allow: "",
    shift_time: "",
    salary_mode: ""
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_org_structure`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setDepartments(data.data);
        }
      });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/emp_attendance`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setEmployees(data.data);
        }
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;

    const selected = employees.find(
      (emp) => emp.employee_id === empId
    );

    setForm({
      ...form,
      employee_id: empId,
      full_name: selected?.employee_name || ""
    });

    if (selected) {
      setEmployee(selected);
    }
  };

  const handleDepartmentChange = (e) => {
    const deptId = String(e.target.value);

    const selectedDept = departments.find(
      (d) => String(d.id) === deptId
    );

    setForm((prev) => ({
      ...prev,
      department: deptId,
      designation: ""
    }));

    setDesignations(
      selectedDept ? selectedDept.designations : []
    );
  };

  // VALIDATION
  const validateStep = () => {

    // STEP 1
    if (step === 1) {
      if (
        !form.employee_id ||
        !form.full_name ||
        !form.mobile ||
        !form.email ||
        !form.gender ||
        !form.aadhaar ||
        !form.pan ||
        !form.address ||
        !form.pin
      ) {
        toast.error("Fill All Personal Details");
        return false;
      }
    }

    // STEP 2
    if (step === 2) {
      if (
        !form.father_name ||
        !form.mother_name ||
        !form.marital_status ||
        !form.spouse ||
        !form.children ||
        !form.emergency_person ||
        !form.emergency_number
      ) {
        toast.error("Fill All Family Details");
        return false;
      }
    }

    // STEP 3
    if (step === 3) {
      if (
        !form.department ||
        !form.designation ||
        !form.reporting_person ||
        !form.joining_date ||
        !form.employment_type ||
        !form.working_hours ||
        !form.monthly_leaves ||
        !form.yearly_leaves ||
        !form.work_location ||
        !form.shift_time ||
        !form.ot_allow ||
        !form.refer_name ||
        !form.refer_contact
      ) {
        toast.error("Fill All Professional Details");
        return false;
      }
    }

    // STEP 4
    if (step === 4) {
      if (
        !form.basic_salary ||
        !form.allowances ||
        !form.bank_account ||
        !form.ifsc ||
        !form.salary_type ||
        !form.salary_mode ||
        !form.advance_payment ||
        !form.penalty ||
        !form.rewards
      ) {
        toast.error("Fill All Salary Details");
        return false;
      }
    }

    // STEP 5
    if (step === 5) {
      if (
        !form.status ||
        !form.role ||
        !form.assets ||
        !form.interview_by ||
        !form.complaint
      ) {
        toast.error("Fill All Other Details");
        return false;
      }
    }

    return true;
  };

  // NEXT
  const nextStep = () => {
    if (!validateStep()) return;

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  // PREVIOUS
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/add_employee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (data.status || data.success || res.ok) {

        toast.success("Employee Added Successfully");

        navigate("/employee-list");

      } else {
        toast.error(data.message);
      }

    } catch (err) {

      toast.error("Server Error");

    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">

      <SideNav />

      <div className="flex-1 p-6 ml-72 overflow-y-auto">

        {/* TOP */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Add Employee
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-6 py-2 rounded-full"
          >
            Back
          </button>

        </div>

        {/* STEP BAR */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">

          <div className="flex items-center justify-between">

            {[
              "Personal",
              "Family",
              "Professional",
              "Salary",
              "Other"
            ].map((label, index) => (

              <div
                key={index}
                className="flex items-center flex-1"
              >

                {/* CIRCLE */}
                <div className="flex flex-col items-center relative z-10">

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step >= index + 1
                        ? "bg-pink-500"
                        : "bg-gray-300"
                      }`}
                  >
                    {index + 1}
                  </div>

                  <span className="text-sm mt-2">
                    {label}
                  </span>

                </div>

                {/* LINE */}
                {index < totalSteps - 1 && (
                  <div
                    className={`flex-1 mx-2 border-t-[2px] border-dotted ${step > index + 1
                        ? "border-pink-500"
                        : "border-gray-300"
                      }`}
                  ></div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-8"
        >

          {/* STEP 1 */}
          {step === 1 && (
            <div>

              <h2 className="font-bold text-lg text-pink-600 mb-5">
                Personal Details
              </h2>

              <div className="grid grid-cols-3 gap-4">

                <CustomSelect
                  name="employee_id"
                  value={form.employee_id}
                  placeholder="Select Employee"
                  options={employees.map((emp) => ({
                    label:
                      emp.employee_id +
                      " - " +
                      emp.employee_name,
                    value: emp.employee_id
                  }))}
                  onChange={handleEmployeeChange}
                />

                <input
                  value={employee.employee_name || ""}
                  readOnly
                  className="input"
                  placeholder="Full Name"
                />

                <input
                  name="mobile"
                  placeholder="Mobile"
                  className="input"
                  onChange={handleChange}
                />

                <input
                  name="email"
                  placeholder="Email"
                  className="input"
                  onChange={handleChange}
                />

                <CustomSelect
                  name="gender"
                  value={form.gender}
                  placeholder="Gender"
                  options={[
                    {
                      label: "Male",
                      value: "Male"
                    },
                    {
                      label: "Female",
                      value: "Female"
                    }
                  ]}
                  onChange={handleChange}
                />

                <input
                  name="aadhaar"
                  placeholder="Aadhaar"
                  className="input"
                  onChange={handleChange}
                />

                <input
                  name="pan"
                  placeholder="PAN"
                  className="input"
                  onChange={handleChange}
                />

                <textarea
                  name="address"
                  placeholder="Address"
                  className="input col-span-3"
                  onChange={handleChange}
                />

                <input
                  name="pin"
                  placeholder="PIN"
                  className="input"
                  onChange={handleChange}
                />

              </div>

            </div>
          )}

          {/* ================= FAMILY ================= */}
          {step === 2 && (
            <div>
              <h2 className="font-bold text-lg text-pink-600 mb-3">Family Details</h2>
              <div className="grid grid-cols-3 gap-4">

                <input name="father_name" placeholder="Father Name" onChange={handleChange} className="input" required />
                <input name="mother_name" placeholder="Mother Name" onChange={handleChange} className="input" required />

                <CustomSelect name="marital_status" placeholder="Marital Status" options={["Single", "Married"]} onChange={handleChange} required />

                <input name="spouse" placeholder="Spouse" onChange={handleChange} className="input" required />
                <input name="children" placeholder="Children" onChange={handleChange} className="input" required />

                <input name="emergency_person" placeholder="Emergency Person" onChange={handleChange} className="input" required />
                <input name="emergency_number" placeholder="Emergency Number" onChange={handleChange} className="input" required />

              </div>
            </div>
          )}

          {/* ================= PROFESSIONAL ================= */}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-lg text-pink-600 mb-3">Professional Details</h2>
              <div className="grid grid-cols-3 gap-4">

                <CustomSelect
                  name="department"
                  value={form.department}
                  placeholder="Select Department"
                  options={departments.map(dep => ({
                    label: dep.name,
                    value: String(dep.id)   // 🔥 IMPORTANT
                  }))}
                  onChange={handleDepartmentChange}
                  required
                />
                <CustomSelect
                  name="designation"
                  value={form.designation}
                  placeholder="Select Designation"
                  options={designations.map(des => ({
                    label: des.name,
                    value: String(des.id)
                  }))}
                  onChange={handleChange}
                  required
                />
                <input name="reporting_person" placeholder="Reporting Person" onChange={handleChange} className="input" required />

                <input name="joining_date" type="date" onChange={handleChange} className="input" required />

                <CustomSelect
                  name="employment_type"
                  placeholder="Employment Type"
                  options={[
                    { label: "Full-time", value: "Full-time" },
                    { label: "Part-time", value: "Part-time" }
                  ]}
                  onChange={handleChange}
                  required
                />


                <input name="working_hours" placeholder="Working Hours" onChange={handleChange} className="input" required />
                <input name="monthly_leaves" placeholder="Monthly Leaves" onChange={handleChange} className="input" required />
                <input name="yearly_leaves" placeholder="Yearly Leaves" onChange={handleChange} className="input" required />

                <input name="work_location" placeholder="Work Location" onChange={handleChange} className="input" required />
                <input name="shift_time" placeholder="Shift Time" onChange={handleChange} className="input" required />

                <CustomSelect name="ot_allow" placeholder="OT Allow" options={["1x", "2x"]} onChange={handleChange} required />

                <input name="refer_name" placeholder="Refer Name" onChange={handleChange} className="input" required />
                <input name="refer_contact" placeholder="Refer Contact" onChange={handleChange} className="input" required />

              </div>
            </div>
          )}

          {/* ================= SALARY ================= */}
          {step === 4 && (
            <div>
              <h2 className="font-bold text-lg text-pink-600 mb-3">Salary Details</h2>
              <div className="grid grid-cols-3 gap-4">

                <input name="basic_salary" placeholder="Basic Salary" onChange={handleChange} className="input" required />
                <input name="allowances" placeholder="Allowances" onChange={handleChange} className="input" required />

                <input name="bank_account" placeholder="Bank Account" onChange={handleChange} className="input" required />
                <input name="ifsc" placeholder="IFSC" onChange={handleChange} className="input" required />

                <CustomSelect
                  name="salary_type"
                  placeholder="Salary Type"
                  options={[
                    { label: "Bank Transfer", value: "Bank Transfer" },
                    { label: "Cash", value: "Cash" }
                  ]}
                  onChange={handleChange}
                  required
                />


                <CustomSelect
                  name="salary_mode"
                  placeholder="Salary Mode"
                  options={[
                    { label: "Fixed", value: "Fixed" },
                    { label: "Non-Fixed", value: "Non-Fixed" }
                  ]}
                  onChange={handleChange}
                  required
                />

                <input name="advance_payment" placeholder="Advance" onChange={handleChange} className="input" required />
                <input name="penalty" placeholder="Penalty" onChange={handleChange} className="input" required />
                <input name="rewards" placeholder="Rewards" onChange={handleChange} className="input" required />

              </div>
            </div>
          )}

          {/* ================= OTHER ================= */}
          {step === 5 && (
            <div>
              <h2 className="font-bold text-lg text-pink-600 mb-3">Other Details</h2>
              <div className="grid grid-cols-3 gap-4">

                <CustomSelect
                  name="status"
                  placeholder="Status"
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" }
                  ]}
                  onChange={handleChange}
                  required
                />


                <CustomSelect
                  name="role"
                  placeholder="Role"
                  options={[
                    { label: "View", value: "view" },
                    { label: "Author", value: "author" },
                    { label: "Admin", value: "admin" }
                  ]}
                  onChange={handleChange}
                  required
                />


                <input name="assets" placeholder="Assets" onChange={handleChange} className="input" required />
                <input name="interview_by" placeholder="Interview By" onChange={handleChange} className="input" required />

                <textarea name="complaint" placeholder="Complaint" onChange={handleChange} className="input col-span-3" required />

              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-between pt-6">

            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-400 text-white rounded-xl"
              >
                Previous
              </button>
            )}

            {step < totalSteps && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl"
              >
                Next
              </button>
            )}

            {step === totalSteps && (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto w-[200px] bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-xl"
              >
                {loading ? "Saving..." : "Submit"}
              </button>
            )}

          </div>

        </form>

      </div>
    </div>
  );
}