import React, { useState, useEffect } from "react";

export default function EmployeeIncrementForm() {
  const [formData, setFormData] = useState({
    emp_id: "",
    increment_type: "Fixed",
    amount: "",
    percentage: "",
    salary_type: "Monthly",
    base_salary: "",
    last_increment_1: "",
    last_increment_2: "",
    last_increment_3: "",
    remark: "",
    start_month: "",
    start_year: "",
  });

  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL =
    "https://ojmee.in/employee/emp_increments_post";

  // auto calculate increment
  useEffect(() => {
    if (formData.increment_type === "Percentage") {
      const calc =
        (Number(formData.base_salary || 0) *
          Number(formData.percentage || 0)) /
        100;

      setFinalAmount(calc);
    } else {
      setFinalAmount(Number(formData.amount || 0));
    }
  }, [
    formData.increment_type,
    formData.amount,
    formData.percentage,
    formData.base_salary,
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
          `✅ Increment Added Successfully | ₹${data.final_increment_amount}`
        );

        setFormData({
          emp_id: "",
          increment_type: "Fixed",
          amount: "",
          percentage: "",
          salary_type: "Monthly",
          base_salary: "",
          last_increment_1: "",
          last_increment_2: "",
          last_increment_3: "",
          remark: "",
          start_month: "",
          start_year: "",
        });

        setFinalAmount(0);
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
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Employee Increment Management
          </h1>
          <p className="text-slate-500 mt-2">
            Add salary increments with history tracking
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-5 p-4 bg-slate-100 border rounded-2xl font-medium text-slate-700">
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
              className="w-full border rounded-2xl p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Employee ID"
              required
            />
          </div>

          {/* Increment Type */}
          <div>
            <label className="font-semibold block mb-2">
              Increment Type
            </label>
            <select
              name="increment_type"
              value={formData.increment_type}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
            >
              <option value="Fixed">Fixed</option>
              <option value="Percentage">
                Percentage
              </option>
            </select>
          </div>

          {/* Amount */}
          {formData.increment_type === "Fixed" && (
            <div>
              <label className="font-semibold block mb-2">
                Amount
              </label>
              <input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border rounded-2xl p-3"
                placeholder="Enter Amount"
              />
            </div>
          )}

          {/* Percentage + Base Salary */}
          {formData.increment_type === "Percentage" && (
            <>
              <div>
                <label className="font-semibold block mb-2">
                  Percentage
                </label>
                <input
                  name="percentage"
                  type="number"
                  value={formData.percentage}
                  onChange={handleChange}
                  className="w-full border rounded-2xl p-3"
                />
              </div>

              <div>
                <label className="font-semibold block mb-2">
                  Base Salary
                </label>
                <input
                  name="base_salary"
                  type="number"
                  value={formData.base_salary}
                  onChange={handleChange}
                  className="w-full border rounded-2xl p-3"
                />
              </div>
            </>
          )}

          {/* Salary Type */}
          <div>
            <label className="font-semibold block mb-2">
              Salary Type
            </label>
            <select
              name="salary_type"
              value={formData.salary_type}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>

          {/* Start Month */}
          <div>
            <label className="font-semibold block mb-2">
              Start Month
            </label>
            <input
              name="start_month"
              value={formData.start_month}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="e.g. January"
            />
          </div>

          {/* Start Year */}
          <div>
            <label className="font-semibold block mb-2">
              Start Year
            </label>
            <input
              name="start_year"
              value={formData.start_year}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="e.g. 2026"
            />
          </div>

          {/* Last Increment 1 */}
          <div>
            <label className="font-semibold block mb-2">
              Last Increment 1
            </label>
            <input
              name="last_increment_1"
              value={formData.last_increment_1}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
            />
          </div>

          {/* Last Increment 2 */}
          <div>
            <label className="font-semibold block mb-2">
              Last Increment 2
            </label>
            <input
              name="last_increment_2"
              value={formData.last_increment_2}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
            />
          </div>

          {/* Last Increment 3 */}
          <div>
            <label className="font-semibold block mb-2">
              Last Increment 3
            </label>
            <input
              name="last_increment_3"
              value={formData.last_increment_3}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
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
              className="w-full border rounded-2xl p-3"
            />
          </div>

          {/* Preview */}
          <div className="md:col-span-2">
            <div className="bg-blue-50 border rounded-2xl p-5">
              <p className="text-sm text-slate-500">
                Final Increment Amount
              </p>
              <h2 className="text-3xl font-bold text-blue-600">
                ₹{Number(finalAmount).toLocaleString("en-IN")}
              </h2>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
            >
              {loading
                ? "Submitting..."
                : "Submit Increment"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}