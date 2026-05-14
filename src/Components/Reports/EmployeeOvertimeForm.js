import React, { useState, useEffect } from "react";

export default function EmployeeOvertimeForm() {
  const [formData, setFormData] = useState({
    emp_id: "",
    overtime: "True",
    overtime_type: "1x",
    overtime_minutes: "",
    gross_salary: "",
    remark: "",
  });

  const [calculatedOT, setCalculatedOT] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL =
    "https://ojmee.in/employee/emp_overtime_post";

  // Frontend preview calculation (same logic as PHP)
  useEffect(() => {
    if (formData.overtime === "True") {
      const perMinute =
        Number(formData.gross_salary || 0) /
        30 /
        8 /
        60;

      const multiplier =
        formData.overtime_type === "2x" ? 2 : 1;

      const total =
        perMinute *
        Number(formData.overtime_minutes || 0) *
        multiplier;

      setCalculatedOT(total);
    } else {
      setCalculatedOT(0);
    }
  }, [
    formData.overtime,
    formData.overtime_type,
    formData.overtime_minutes,
    formData.gross_salary,
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        setMessage(
          `✅ Overtime Added Successfully | ₹${data.overtime_amount}`
        );

        setFormData({
          emp_id: "",
          overtime: "True",
          overtime_type: "1x",
          overtime_minutes: "",
          gross_salary: "",
          remark: "",
        });

        setCalculatedOT(0);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      console.log(error);
      setMessage("❌ API Error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-5">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6">

        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Employee Overtime Management
        </h1>

        {/* Message */}
        {message && (
          <div className="mb-5 p-4 bg-slate-100 border rounded-2xl text-slate-700 font-medium">
            {message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Employee ID */}
          <div>
            <label className="font-semibold block mb-2">
              Employee ID
            </label>
            <input
              name="emp_id"
              value={formData.emp_id}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
              placeholder="Enter Employee ID"
              required
            />
          </div>

          {/* Overtime */}
          <div>
            <label className="font-semibold block mb-2">
              Overtime
            </label>
            <select
              name="overtime"
              value={formData.overtime}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
            >
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          </div>

          {/* Overtime Type */}
          <div>
            <label className="font-semibold block mb-2">
              Overtime Type
            </label>
            <select
              name="overtime_type"
              value={formData.overtime_type}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
            >
              <option value="1x">1x</option>
              <option value="2x">2x</option>
            </select>
          </div>

          {/* Minutes */}
          <div>
            <label className="font-semibold block mb-2">
              Overtime Minutes
            </label>
            <input
              type="number"
              name="overtime_minutes"
              value={formData.overtime_minutes}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
              placeholder="Enter Minutes"
            />
          </div>

          {/* Gross Salary */}
          <div>
            <label className="font-semibold block mb-2">
              Gross Salary
            </label>
            <input
              type="number"
              name="gross_salary"
              value={formData.gross_salary}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
              placeholder="Enter Salary"
            />
          </div>

          {/* Remark */}
          <div className="md:col-span-2">
            <label className="font-semibold block mb-2">
              Remark
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows={4}
              className="w-full border p-3 rounded-2xl"
            />
          </div>

          {/* Preview */}
          <div className="md:col-span-2">
            <div className="bg-blue-50 border rounded-2xl p-5">
              <p className="text-sm text-slate-500">
                Overtime Preview Amount
              </p>

              <h2 className="text-3xl font-bold text-blue-600">
                ₹
                {Number(calculatedOT).toLocaleString("en-IN")}
              </h2>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
            >
              {loading ? "Submitting..." : "Submit Overtime"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}