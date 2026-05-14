import React, { useState } from "react";

export default function EmployeeMeetingForm() {
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_designation: "",
    meeting_for: "All",
    selected_employees: [],
    meeting_date: "",
    meeting_month: "",
    meeting_place: "",
    remark: "",
  });

  const [employeeInput, setEmployeeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL =
    "https://ojmee.in/employee/emp_meetings_post";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addEmployee = () => {
    if (!employeeInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      selected_employees: [
        ...prev.selected_employees,
        employeeInput.trim(),
      ],
    }));

    setEmployeeInput("");
  };

  const removeEmployee = (index) => {
    const updated = formData.selected_employees.filter(
      (_, i) => i !== index
    );

    setFormData({
      ...formData,
      selected_employees: updated,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status) {
        setMessage("✅ Meeting Added Successfully");

        setFormData({
          emp_id: "",
          emp_designation: "",
          meeting_for: "All",
          selected_employees: [],
          meeting_date: "",
          meeting_month: "",
          meeting_place: "",
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
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Employee Meeting Form
        </h1>

        {message && (
          <div className="mb-5 p-4 bg-slate-100 border rounded-2xl text-slate-700 font-medium">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Employee ID */}
          <div>
            <label className="font-semibold mb-2 block">
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

          {/* Designation */}
          <div>
            <label className="font-semibold mb-2 block">
              Designation
            </label>
            <input
              name="emp_designation"
              value={formData.emp_designation}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
              placeholder="Enter Designation"
            />
          </div>

          {/* Meeting For */}
          <div>
            <label className="font-semibold mb-2 block">
              Meeting For
            </label>
            <select
              name="meeting_for"
              value={formData.meeting_for}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
            >
              <option value="All">All Employees</option>
              <option value="Selected">Selected Employees</option>
            </select>
          </div>

          {/* Selected Employees Input */}
          {formData.meeting_for === "Selected" && (
            <div>
              <label className="font-semibold mb-2 block">
                Add Employee ID
              </label>

              <div className="flex gap-2">
                <input
                  value={employeeInput}
                  onChange={(e) =>
                    setEmployeeInput(e.target.value)
                  }
                  className="w-full border p-3 rounded-2xl"
                  placeholder="Enter Employee ID"
                />

                <button
                  type="button"
                  onClick={addEmployee}
                  className="bg-blue-600 text-white px-4 rounded-2xl"
                >
                  Add
                </button>
              </div>

              {/* List */}
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.selected_employees.map(
                  (emp, index) => (
                    <div
                      key={index}
                      className="bg-slate-200 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{emp}</span>
                      <button
                        type="button"
                        onClick={() =>
                          removeEmployee(index)
                        }
                        className="text-red-600 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Meeting Date */}
          <div>
            <label className="font-semibold mb-2 block">
              Meeting Date
            </label>
            <input
              type="date"
              name="meeting_date"
              value={formData.meeting_date}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
            />
          </div>

          {/* Meeting Month */}
          <div>
            <label className="font-semibold mb-2 block">
              Meeting Month
            </label>
            <input
              type="month"
              name="meeting_month"
              value={formData.meeting_month}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
            />
          </div>

          {/* Meeting Place */}
          <div>
            <label className="font-semibold mb-2 block">
              Meeting Place
            </label>
            <input
              name="meeting_place"
              value={formData.meeting_place}
              onChange={handleChange}
              className="w-full border p-3 rounded-2xl"
              placeholder="Enter Place"
            />
          </div>

          {/* Remark */}
          <div className="md:col-span-2">
            <label className="font-semibold mb-2 block">
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

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
            >
              {loading
                ? "Submitting..."
                : "Submit Meeting"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}