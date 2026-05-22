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
    } else {
      setSelected("");
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

  const [dutyHours, setDutyHours] = useState([]);
  const [monthlyLeaves, setMonthlyLeaves] = useState([]);
  const [yearlyLeaves, setYearlyLeaves] = useState([]);

  const [branches, setBranches] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [overtimeData, setOvertimeData] = useState([]);

  useEffect(() => {

    Promise.all([

      fetch(`${API_BASE_URL}/emp_duty_hours`)
        .then((res) => res.json()),

      fetch(`${API_BASE_URL}/emp_monthly_leaves`)
        .then((res) => res.json()),

      fetch(`${API_BASE_URL}/emp_yearly_leaves`)
        .then((res) => res.json()),

      fetch(`${API_BASE_URL}/branches`)
        .then((res) => res.json()),

      fetch(`${API_BASE_URL}/emp_shifts`)
        .then((res) => res.json()),

      fetch(`${API_BASE_URL}/emp_overtime`)
        .then((res) => res.json())

    ])

      .then(([
        dutyData,
        monthlyData,
        yearlyData,
        branchData,
        shiftData,
        overtimeRes
      ]) => {

        if (dutyData.status) {
          setDutyHours(dutyData.data);
        }

        if (monthlyData.status) {
          setMonthlyLeaves(monthlyData.data);
        }

        if (yearlyData.status) {
          setYearlyLeaves(yearlyData.data);
        }

        if (branchData.status) {
          setBranches(branchData.data);
        }

        if (shiftData.status) {
          setShifts(shiftData.data);
        }

        if (overtimeRes.status) {
          setOvertimeData(overtimeRes.data);
        }

      })

      .catch((err) => {
        console.log(err);
      });

  }, []);

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
    interview_by: "",
    shift_time: "",
    salary_mode: "",

    // FILES
    user_resume: null,
    kye_form: null,
    user_photo: null,
    user_family_photo: null,
    aadhar_with_family: null,
    pan_card: null,
    pcc: null,
    bank_proff: null
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/departments`)
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
          const uniqueEmployees = Array.from(
            new Map(
              data.data.map((emp) => [
                emp.employee_id,
                emp
              ])
            ).values()
          );

          setEmployees(uniqueEmployees);
        }
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
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

    const deptId = e.target.value;

    // id ke behalf par find
    const selectedDept = departments.find(
      (d) => String(d.id) === String(deptId)
    );

    setForm((prev) => ({
      ...prev,

      // form me department ka NAME save hoga
      department: selectedDept?.name || "",

      designation: ""
    }));

    // designation update
    setDesignations(
      selectedDept?.designations || []
    );
  };
  function FileUploadBox({
    label,
    name,
    file,
    onChange,
    required = false
  }) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">
          {label}
          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>

        <div className="relative border-2 border-dashed border-pink-300 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 hover:border-pink-500 transition-all duration-300 p-5">

          <input
            type="file"
            name={name}
            onChange={onChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center justify-center text-center">

            <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mb-3 text-2xl">
              📁
            </div>

            <p className="font-semibold text-gray-700">
              Choose File
            </p>

            <p className="text-sm text-gray-500 mt-1">
              PDF, JPG, PNG Allowed
            </p>

            {file && (
              <div className="mt-3 px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-medium break-all">
                {file.name}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // VALIDATION
  const validateStep = () => {

    // STEP 1
    if (step === 1) {

      // Employee ID
      if (!form.employee_id) {
        toast.error("Select Employee ID (Example: EMP001)");
        return false;
      }

      // Full Name
      if (!form.full_name) {
        toast.error("Employee Name Required (Example: Rahul Sharma)");
        return false;
      }

      // Mobile
      if (!form.mobile) {
        toast.error("Mobile Number Required (Example: 9876543210)");
        return false;
      }

      const mobileRegex = /^[6-9]\d{9}$/;

      if (!mobileRegex.test(form.mobile)) {
        toast.error("Invalid Mobile Number (Example: 9876543210)");
        return false;
      }

      // Email
      if (!form.email) {
        toast.error("Email Required (Example: demo@gmail.com)");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        toast.error("Invalid Email (Example: demo@gmail.com)");
        return false;
      }

      // Gender
      if (!form.gender) {
        toast.error("Select Gender");
        return false;
      }

      // Aadhaar
      if (!form.aadhaar) {
        toast.error("Aadhaar Required (12 Digits)");
        return false;
      }

      const aadhaarRegex = /^\d{12}$/;

      if (!aadhaarRegex.test(form.aadhaar)) {
        toast.error("Invalid Aadhaar (Example: 123412341234)");
        return false;
      }

      // PAN
      if (!form.pan) {
        toast.error("PAN Required (Example: ABCDE1234F)");
        return false;
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      if (!panRegex.test(form.pan.toUpperCase())) {
        toast.error("Invalid PAN (Example: ABCDE1234F)");
        return false;
      }

      // Address
      if (!form.address) {
        toast.error("Address Required");
        return false;
      }

      if (form.address.trim().length < 10) {
        toast.error("Address Too Short (Minimum 10 Characters)");
        return false;
      }

      // PIN
      if (!form.pin) {
        toast.error("PIN Code Required (Example: 110001)");
        return false;
      }

      const pinRegex = /^\d{6}$/;

      if (!pinRegex.test(form.pin)) {
        toast.error("Invalid PIN Code (Example: 110001)");
        return false;
      }
    }


    // STEP 2
    if (step === 2) {

      // Father Name
      if (!form.father_name) {
        toast.error("Father Name Required (Example: Ramesh Sharma)");
        return false;
      }

      if (form.father_name.trim().length < 3) {
        toast.error("Invalid Father Name");
        return false;
      }

      // Mother Name
      if (!form.mother_name) {
        toast.error("Mother Name Required (Example: Sunita Sharma)");
        return false;
      }

      if (form.mother_name.trim().length < 3) {
        toast.error("Invalid Mother Name");
        return false;
      }

      // Marital Status
      if (!form.marital_status) {
        toast.error("Select Marital Status");
        return false;
      }

      // Emergency Person
      if (!form.emergency_person) {
        toast.error("Emergency Person Required");
        return false;
      }

      if (form.emergency_person.trim().length < 3) {
        toast.error("Invalid Emergency Person Name");
        return false;
      }

      // Emergency Number
      if (!form.emergency_number) {
        toast.error("Emergency Number Required");
        return false;
      }

      const mobileRegex = /^[6-9]\d{9}$/;

      if (!mobileRegex.test(form.emergency_number)) {
        toast.error("Invalid Emergency Number (Example: 9876543210)");
        return false;
      }

      // Married
      if (form.marital_status === "Married") {

        if (!form.spouse) {
          toast.error("Spouse Name Required");
          return false;
        }

        if (form.spouse.trim().length < 3) {
          toast.error("Invalid Spouse Name");
          return false;
        }

        if (!form.children) {
          toast.error("Children Details Required");
          return false;
        }
      }

      // Single
      if (form.marital_status === "Single") {

        if (form.spouse) {
          toast.error("Single Person Cannot Have Spouse");
          return false;
        }

        if (form.children) {
          toast.error("Single Person Cannot Have Children");
          return false;
        }
      }
    }


    // STEP 3
    if (step === 3) {

      if (!form.department) {
        toast.error("Select Department");
        return false;
      }

      if (!form.designation) {
        toast.error("Select Designation");
        return false;
      }

      if (!form.reporting_person) {
        toast.error("Reporting Person Required");
        return false;
      }

      if (form.reporting_person.trim().length < 3) {
        toast.error("Invalid Reporting Person Name");
        return false;
      }

      if (!form.joining_date) {
        toast.error("Select Joining Date");
        return false;
      }

      const today = new Date();
      const joiningDate = new Date(form.joining_date);

      if (joiningDate > today) {
        toast.error("Joining Date Cannot Be Future Date");
        return false;
      }

      if (!form.employment_type) {
        toast.error("Select Employment Type");
        return false;
      }

      if (!form.working_hours) {
        toast.error("Select Working Hours");
        return false;
      }

      const workingHours = Number(form.working_hours);

      if (
        isNaN(workingHours) ||
        workingHours < 1 ||
        workingHours > 24
      ) {
        toast.error("Working Hours Must Be Between 1 To 24");
        return false;
      }

      if (!form.monthly_leaves) {
        toast.error("Select Monthly Leaves");
        return false;
      }

      const monthlyLeaves = Number(form.monthly_leaves);

      if (
        isNaN(monthlyLeaves) ||
        monthlyLeaves < 0 ||
        monthlyLeaves > 31
      ) {
        toast.error("Invalid Monthly Leaves");
        return false;
      }

      if (!form.yearly_leaves) {
        toast.error("Select Yearly Leaves");
        return false;
      }

      const yearlyLeaves = Number(form.yearly_leaves);

      if (
        isNaN(yearlyLeaves) ||
        yearlyLeaves < 0 ||
        yearlyLeaves > 365
      ) {
        toast.error("Invalid Yearly Leaves");
        return false;
      }

      if (!form.work_location) {
        toast.error("Select Work Location");
        return false;
      }

      if (form.work_location.trim().length < 3) {
        toast.error("Invalid Work Location");
        return false;
      }

      if (!form.shift_time) {
        toast.error("Select Shift Time");
        return false;
      }


      if (!form.refer_name) {
        toast.error("Reference Name Required");
        return false;
      }

      if (!form.refer_contact) {
        toast.error("Reference Contact Required");
        return false;
      }
    }


    // STEP 4
    if (step === 4) {

      if (!form.basic_salary) {
        toast.error("Basic Salary Required (Example: 15000)");
        return false;
      }

      const basicSalary = Number(form.basic_salary);

      if (
        isNaN(basicSalary) ||
        basicSalary < 1000
      ) {
        toast.error("Invalid Basic Salary");
        return false;
      }

      if (!form.allowances) {
        toast.error("Allowance Required (Example: 2000)");
        return false;
      }

      const allowances = Number(form.allowances);

      if (
        isNaN(allowances) ||
        allowances < 0
      ) {
        toast.error("Invalid Allowance Amount");
        return false;
      }

      if (!form.bank_account) {
        toast.error("Bank Account Required");
        return false;
      }

      const bankRegex = /^\d{9,18}$/;

      if (!bankRegex.test(form.bank_account)) {
        toast.error("Invalid Bank Account Number");
        return false;
      }

      if (!form.ifsc) {
        toast.error("IFSC Required (Example: SBIN0001234)");
        return false;
      }

      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

      if (!ifscRegex.test(form.ifsc.toUpperCase())) {
        toast.error("Invalid IFSC Code");
        return false;
      }

      if (!form.salary_type) {
        toast.error("Select Salary Type");
        return false;
      }

      if (!form.salary_mode) {
        toast.error("Select Salary Mode");
        return false;
      }

      // if (!form.advance_payment) {
      //   toast.error("Advance Payment Required");
      //   return false;
      // }

      // if (!form.penalty) {
      //   toast.error("Penalty Required");
      //   return false;
      // }

      // if (!form.rewards) {
      //   toast.error("Rewards Required");
      //   return false;
      // }
    }


    // STEP 5
    if (step === 5) {

      if (!form.status) {
        toast.error("Select Status");
        return false;
      }

      if (!form.role) {
        toast.error("Select Role");
        return false;
      }
      if (!form.interview_by) {
        toast.error("Interviewer Name Required");
        return false;
      }

      if (form.interview_by.trim().length < 3) {
        toast.error("Invalid Interviewer Name");
        return false;
      }
      if (!form.user_resume) {
        toast.error("Upload Resume");
        return false;
      }

      if (!form.kye_form) {
        toast.error("Upload KYE Form");
        return false;
      }

      if (!form.user_photo) {
        toast.error("Upload Employee Photo");
        return false;
      }

      if (!form.user_family_photo) {
        toast.error("Upload Family Photo");
        return false;
      }

      if (!form.aadhar_with_family) {
        toast.error("Upload Aadhaar File");
        return false;
      }

      if (!form.pan_card) {
        toast.error("Upload PAN Card");
        return false;
      }

      if (!form.pcc) {
        toast.error("Upload PCC");
        return false;
      }

      if (!form.bank_proff) {
        toast.error("Upload Bank Proof");
        return false;
      }

      // if (!form.complaint) {
      //   toast.error("Complaint Required");
      //   return false;
      // }

      // if (form.complaint.trim().length < 5) {
      //   toast.error("Complaint Must Be Minimum 5 Characters");
      //   return false;
      // }
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

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateStep()) return;

    setLoading(true);

    try {

      const formData = new FormData();

      Object.keys(form).forEach((key) => {

        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }

      });

      const res = await fetch(
        `${API_BASE_URL}/add_employee`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      if (data.status === "success") {

        toast.success(data.message);

        navigate("/employees-list");

      } else {

        toast.error(data.message || "Something Went Wrong");

      }

    } catch (err) {

      console.log(err);

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

          {/* ================= STEP 1 : PERSONAL DETAILS ================= */}
          {step === 1 && (
            <div>

              <h2 className="font-bold text-lg text-pink-600 mb-5">
                Personal Details
              </h2>

              <div className="grid grid-cols-3 gap-4">

                {/* Employee ID */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Employee ID <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="employee_id"
                    value={form.employee_id}
                    placeholder="Select Employee"
                    options={employees.map((emp) => ({
                      label: emp.employee_id + " - " + emp.employee_name,
                      value: emp.employee_id
                    }))}
                    onChange={handleEmployeeChange}
                  />
                </div>

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    value={employee.employee_name || ""}
                    readOnly
                    className="input"
                    placeholder="Full Name"
                    style={{ textTransform: "capitalize" }}
                  />
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="mobile"
                    placeholder="Mobile"
                    className="input"
                    value={form.mobile}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="email"
                    placeholder="Email"
                    className="input"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="gender"
                    value={form.gender}
                    placeholder="Gender"
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" }
                    ]}
                    onChange={handleChange}
                  />
                </div>

                {/* Aadhaar */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="aadhaar"
                    placeholder="Aadhaar"
                    className="input"
                    type="number"
                    inputMode="numeric"
                    maxLength={12}
                    value={form.aadhaar}
                    onChange={handleChange}
                  />
                </div>

                {/* PAN */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    PAN Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="pan"
                    placeholder="PAN"
                    className="input"
                    value={form.pan}
                    style={{ textTransform: "uppercase" }}
                    onChange={handleChange}
                  />
                </div>

                {/* DOB */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* PIN */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    PIN Code <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    inputMode="numeric"
                    maxLength={6}
                    name="pin"
                    placeholder="PIN"
                    className="input"
                    value={form.pin}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 6);

                      handleChange({
                        target: {
                          name: "pin",
                          value,
                        },
                      });
                    }}
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col gap-2 col-span-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="address"
                    placeholder="Address"
                    className="input"
                    style={{ textTransform: "capitalize" }}
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </div>
          )}

          {/* ================= STEP 2 : FAMILY DETAILS ================= */}
          {step === 2 && (
            <div>

              <h2 className="font-bold text-lg text-pink-600 mb-3">
                Family Details
              </h2>

              <div className="grid grid-cols-3 gap-4">

                {/* Father Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Father Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="father_name"
                    placeholder="Father Name"
                    style={{ textTransform: "capitalize" }}
                    value={form.father_name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* Mother Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Mother Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="mother_name"
                    placeholder="Mother Name"
                    style={{ textTransform: "capitalize" }}
                    value={form.mother_name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* Marital Status */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Marital Status <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="marital_status"
                    value={form.marital_status}
                    placeholder="Marital"
                    options={[
                      { label: "Single", value: "Single" },
                      { label: "Married", value: "Married" }
                    ]}
                    onChange={handleChange}
                  />
                </div>

                {/* Spouse */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Spouse Name
                  </label>

                  <input
                    name="spouse"
                    placeholder="Spouse"
                    style={{ textTransform: "capitalize" }}
                    value={form.spouse}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                {/* Children */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Children
                  </label>

                  <CustomSelect
                    name="children"
                    value={form.children}
                    placeholder="Select Children"
                    options={[
                      { label: "0", value: "0" },
                      { label: "1", value: "1" },
                      { label: "2", value: "2" }
                    ]}
                    onChange={handleChange}
                  />
                </div>

                {/* Emergency Person */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Emergency Person <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="emergency_person"
                    placeholder="Emergency Person"
                    style={{ textTransform: "capitalize" }}
                    value={form.emergency_person}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* Emergency Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Emergency Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="emergency_number"
                    placeholder="Emergency Number"
                    value={form.emergency_number}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

              </div>

            </div>
          )}

          {/* ================= PROFESSIONAL ================= */}
          {step === 3 && (
            <div>

              <h2 className="font-bold text-lg text-pink-600 mb-3">
                Professional Details
              </h2>

              <div className="grid grid-cols-3 gap-4">

                {/* Department */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="department"
                    value={departments.find(
                      (d) => d.name === form.department
                    )?.id || ""}
                    placeholder="Select Department"
                    options={departments.map((dep) => ({
                      label: dep.name,

                      // dropdown me id use hoga
                      value: dep.id
                    }))}
                    onChange={handleDepartmentChange}
                  />
                </div>

                {/* Designation */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Designation <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="designation"
                    value={form.designation}
                    placeholder="Select Designation"
                    options={designations.map((des) => ({
                      label: des.name,
                      value: des.name
                    }))}
                    onChange={handleChange}
                  />
                </div>

                {/* Work Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Work Location <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="work_location"
                    value={form.work_location}
                    placeholder="Select Branch"
                    options={branches.map((item) => ({
                      label: `${item.branch_name} - ${item.branch_id}`,
                      value: item.branch_id
                    }))}
                    onChange={handleChange}
                  />
                </div>

                {/* Reporting Person */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Reporting Person <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="reporting_person"
                    placeholder="Reporting Person"
                    style={{ textTransform: "capitalize" }}
                    value={form.reporting_person}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* Joining Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Joining Date <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="joining_date"
                    type="date"
                    value={form.joining_date}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* Employment Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Employment Type <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="employment_type"
                    placeholder="Employment Type"
                    options={[
                      { label: "Full-time", value: "Full-time" },
                      { label: "Part-time", value: "Part-time" }
                    ]}
                    value={form.employment_type}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Working Hours */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Working Hours <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="working_hours"
                    value={form.working_hours}
                    placeholder="Select Working Hours"
                    options={dutyHours.map((item) => ({
                      label: `${item.duty_hours} Hours`,
                      value: item.duty_hours
                    }))}
                    onChange={handleChange}
                  />
                </div>

                {/* Monthly Leaves */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Monthly Leaves <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="monthly_leaves"
                    value={form.monthly_leaves}
                    placeholder="Select Monthly Leaves"
                    options={monthlyLeaves.map((item) => ({
                      label: `${item.total_leaves} Leaves`,
                      value: item.total_leaves
                    }))}
                    onChange={handleChange}
                  />
                </div>

                {/* Yearly Leaves */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Yearly Leaves <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="yearly_leaves"
                    value={form.yearly_leaves}
                    placeholder="Select Yearly Leaves"
                    options={yearlyLeaves.map((item) => ({
                      label: `${item.total_leaves} Leaves`,
                      value: item.total_leaves
                    }))}
                    onChange={handleChange}
                  />
                </div>

                {/* Shift Time */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Shift Time <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="shift_time"
                    value={form.shift_time}
                    placeholder="Select Shift"
                    options={shifts.map((item) => ({
                      label: `${item.shift_name} - ${item.start_time}`,
                      value: item.start_time
                    }))}
                    onChange={handleChange}
                  />
                </div>

                {/* Refer Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Refer Name
                  </label>

                  <input
                    name="refer_name"
                    placeholder="Refer Name"
                    style={{ textTransform: "capitalize" }}
                    value={form.refer_name}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                {/* Refer Contact */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Refer Contact
                  </label>

                  <input
                    name="refer_contact"
                    placeholder="Refer Contact"
                    style={{ textTransform: "capitalize" }}
                    value={form.refer_contact}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

              </div>

            </div>
          )}

          {/* ================= SALARY ================= */}
          {step === 4 && (
            <div>

              <h2 className="font-bold text-lg text-pink-600 mb-3">
                Salary & Other Details
              </h2>

              <div className="grid grid-cols-3 gap-4">

                {/* Basic Salary */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Basic Salary <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="basic_salary"
                    placeholder="Basic Salary"
                    value={form.basic_salary}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* Allowances */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Allowances <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="allowances"
                    placeholder="Allowances"
                    value={form.allowances}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* Bank Account */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Bank Account <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="bank_account"
                    placeholder="Bank Account"
                    value={form.bank_account}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* IFSC */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="ifsc"
                    placeholder="IFSC"
                    style={{ textTransform: "uppercase" }}
                    value={form.ifsc}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                {/* Salary Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Salary Type <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="salary_type"
                    placeholder="Salary Type"
                    options={[
                      { label: "Online", value: "Online" },
                      { label: "Cheque", value: "Cheque" },
                      { label: "Cash", value: "Cash" },
                      { label: "Hold", value: "Hold" }
                    ]}
                    value={form.salary_type}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Salary Mode */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Salary Mode <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="salary_mode"
                    placeholder="Salary Mode"
                    options={[
                      { label: "Fixed", value: "Fixed" },
                      { label: "Non-Fixed", value: "Non-Fixed" }
                    ]}
                    value={form.salary_mode}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="status"
                    placeholder="Status"
                    options={[
                      { label: "Active", value: "Active" }
                    ]}
                    value={form.status}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Role */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>

                  <CustomSelect
                    name="role"
                    placeholder="Role"
                    options={[
                      { label: "View", value: "view" }
                    ]}
                    value={form.role}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Interview By */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Interview By
                  </label>

                  <input
                    name="interview_by"
                    placeholder="Interview By"
                    style={{ textTransform: "capitalize" }}
                    value={form.interview_by}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

              </div>

            </div>
          )}

          {/* ================= OTHER ================= */}
          {step === 5 && (
            <div>

              <h2 className="font-bold text-lg text-pink-600 mb-3">
                Other Details
              </h2>

              <div className="grid grid-cols-3 gap-4">

                <FileUploadBox
                  label="Upload Resume"
                  name="user_resume"
                  file={form.user_resume}
                  onChange={handleChange}
                  required
                />

                <FileUploadBox
                  label="Upload KYE Form"
                  name="kye_form"
                  file={form.kye_form}
                  onChange={handleChange}
                  required
                />

                <FileUploadBox
                  label="Upload Employee Photo"
                  name="user_photo"
                  file={form.user_photo}
                  onChange={handleChange}
                  required
                />

                <FileUploadBox
                  label="Upload Family Photo"
                  name="user_family_photo"
                  file={form.user_family_photo}
                  onChange={handleChange}
                  required
                />

                <FileUploadBox
                  label="Upload Aadhaar + Family Aadhaar"
                  name="aadhar_with_family"
                  file={form.aadhar_with_family}
                  onChange={handleChange}
                  required
                />

                <FileUploadBox
                  label="Upload PAN Card"
                  name="pan_card"
                  file={form.pan_card}
                  onChange={handleChange}
                  required
                />

                <FileUploadBox
                  label="Upload PCC"
                  name="pcc"
                  file={form.pcc}
                  onChange={handleChange}
                  required
                />

                <FileUploadBox
                  label="Upload Bank Proof"
                  name="bank_proff"
                  file={form.bank_proff}
                  onChange={handleChange}
                  required
                />

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

      </div >
    </div >
  );
}