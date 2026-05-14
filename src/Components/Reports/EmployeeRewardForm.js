import React, { useState, useEffect } from "react";

export default function EmployeeRewardForm() {
  const [formData, setFormData] = useState({
    emp_id: "",
    reward_type: "Fixed",
    amount: "",
    percentage: "",
    salary_type: "Monthly",
    base_salary: "",
    remark: "",
    start_date: "",
    end_date: "",
    reward_month: "",
  });

  const [finalReward, setFinalReward] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL =
    "https://ojmee.in/employee/emp_rewards_post";

  useEffect(() => {
    if (formData.reward_type === "Percentage") {
      const calculated =
        (Number(formData.base_salary || 0) *
          Number(formData.percentage || 0)) /
        100;

      setFinalReward(calculated);
    } else {
      setFinalReward(Number(formData.amount || 0));
    }
  }, [
    formData.reward_type,
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
          `✅ Reward Added Successfully | Final Reward ₹${data.final_reward_amount}`
        );

        setFormData({
          emp_id: "",
          reward_type: "Fixed",
          amount: "",
          percentage: "",
          salary_type: "Monthly",
          base_salary: "",
          remark: "",
          start_date: "",
          end_date: "",
          reward_month: "",
        });

        setFinalReward(0);
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
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Employee Reward Management
          </h1>

          <p className="text-slate-500 mt-2">
            Add employee rewards, incentives and bonuses
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

          {/* Reward Type */}
          <div>
            <label className="block mb-2 font-semibold">
              Reward Type
            </label>

            <select
              name="reward_type"
              value={formData.reward_type}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Fixed">Fixed</option>
              <option value="Percentage">
                Percentage
              </option>
            </select>
          </div>

          {/* Fixed Amount */}
          {formData.reward_type === "Fixed" && (
            <div>
              <label className="block mb-2 font-semibold">
                Reward Amount
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter Reward Amount"
                className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Percentage */}
          {formData.reward_type === "Percentage" && (
            <>
              <div>
                <label className="block mb-2 font-semibold">
                  Percentage %
                </label>

                <input
                  type="number"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleChange}
                  placeholder="Enter Percentage"
                  className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Base Salary
                </label>

                <input
                  type="number"
                  name="base_salary"
                  value={formData.base_salary}
                  onChange={handleChange}
                  placeholder="Enter Base Salary"
                  className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Salary Type */}
          <div>
            <label className="block mb-2 font-semibold">
              Salary Type
            </label>

            <select
              name="salary_type"
              value={formData.salary_type}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>

          {/* Reward Month */}
          <div>
            <label className="block mb-2 font-semibold">
              Reward Month
            </label>

            <input
              type="month"
              name="reward_month"
              value={formData.reward_month}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block mb-2 font-semibold">
              Start Date
            </label>

            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block mb-2 font-semibold">
              End Date
            </label>

            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              placeholder="Enter Reward Remark"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Final Reward Preview */}
          <div className="md:col-span-2">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-sm text-slate-500 mb-2">
                Final Reward Amount
              </p>

              <h2 className="text-3xl font-bold text-green-600">
                ₹{Number(finalReward).toLocaleString("en-IN")}
              </h2>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-all"
            >
              {loading
                ? "Submitting..."
                : "Submit Reward"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}