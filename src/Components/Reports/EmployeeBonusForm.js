import React, { useState } from "react";

export default function EmployeeBonusForm() {
  const [formData, setFormData] = useState({
    emp_id: "",
    amount: "",
    bonus_type: "Performance Bonus",
    remark: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL =
    "https://ojmee.in/employee/emp_bonus_post";

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
        setMessage("✅ Bonus Added Successfully");

        setFormData({
          emp_id: "",
          amount: "",
          bonus_type: "Performance Bonus",
          remark: "",
        });
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
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Employee Bonus Form
          </h1>

          <p className="text-slate-500 mt-2">
            Add employee bonus details
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-5 bg-slate-100 border rounded-2xl p-4 font-medium text-slate-700">
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
            <label className="block mb-2 font-semibold">
              Employee ID
            </label>

            <input
              type="text"
              name="emp_id"
              value={formData.emp_id}
              onChange={handleChange}
              placeholder="Enter Employee ID"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Bonus Amount */}
          <div>
            <label className="block mb-2 font-semibold">
              Bonus Amount
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter Bonus Amount"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Bonus Type */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">
              Bonus Type
            </label>

            <select
              name="bonus_type"
              value={formData.bonus_type}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Performance Bonus">
                Performance Bonus
              </option>

              <option value="Festival Bonus">
                Festival Bonus
              </option>

              <option value="Yearly Bonus">
                Yearly Bonus
              </option>

              <option value="Attendance Bonus">
                Attendance Bonus
              </option>

              <option value="Referral Bonus">
                Referral Bonus
              </option>

              <option value="Special Bonus">
                Special Bonus
              </option>
            </select>
          </div>

          {/* Remark */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">
              Remark
            </label>

            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows="4"
              placeholder="Enter Bonus Remark"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preview Card */}
          <div className="md:col-span-2">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-sm text-slate-500 mb-2">
                Bonus Preview
              </p>

              <h2 className="text-3xl font-bold text-green-600">
                ₹
                {Number(
                  formData.amount || 0
                ).toLocaleString("en-IN")}
              </h2>

              <p className="text-slate-600 mt-2">
                {formData.bonus_type}
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition-all"
            >
              {loading
                ? "Submitting..."
                : "Submit Bonus"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}