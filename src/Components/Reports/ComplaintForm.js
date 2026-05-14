import React, { useState } from "react";

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    emp_id: "",
    branch_id: "",
    suspected_employee: "",
    complaint_between: "",
    full_details: "",
    remark: "",
    incident_datetime: "",
    incident_place: "",
    status: "Pending",
    complaint_raise_by: "",
    complaint_history: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL =
    "https://ojmee.in/employee/emp_complaints_post";

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
        setMessage("✅ Complaint Added Successfully");

        setFormData({
          emp_id: "",
          branch_id: "",
          suspected_employee: "",
          complaint_between: "",
          full_details: "",
          remark: "",
          incident_datetime: "",
          incident_place: "",
          status: "Pending",
          complaint_raise_by: "",
          complaint_history: "",
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
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-6">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Employee Complaint Form
          </h1>
          <p className="text-slate-500 mt-2">
            Submit employee complaints and incidents
          </p>
        </div>

        {message && (
          <div className="mb-5 p-4 rounded-2xl bg-slate-100 border text-slate-700 font-medium">
            {message}
          </div>
        )}

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

          {/* Branch ID */}
          <div>
            <label className="block mb-2 font-semibold">
              Branch ID
            </label>

            <input
              type="text"
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              placeholder="Enter Branch ID"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Suspected Employee */}
          <div>
            <label className="block mb-2 font-semibold">
              Suspected Employee
            </label>

            <input
              type="text"
              name="suspected_employee"
              value={formData.suspected_employee}
              onChange={handleChange}
              placeholder="Employee Name / ID"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Complaint Between */}
          <div>
            <label className="block mb-2 font-semibold">
              Complaint Between
            </label>

            <input
              type="text"
              name="complaint_between"
              value={formData.complaint_between}
              onChange={handleChange}
              placeholder="Complaint Between"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Incident Date Time */}
          <div>
            <label className="block mb-2 font-semibold">
              Incident Date & Time
            </label>

            <input
              type="datetime-local"
              name="incident_datetime"
              value={formData.incident_datetime}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Incident Place */}
          <div>
            <label className="block mb-2 font-semibold">
              Incident Place
            </label>

            <input
              type="text"
              name="incident_place"
              value={formData.incident_place}
              onChange={handleChange}
              placeholder="Incident Place"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 font-semibold">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Raised By */}
          <div>
            <label className="block mb-2 font-semibold">
              Complaint Raise By
            </label>

            <input
              type="text"
              name="complaint_raise_by"
              value={formData.complaint_raise_by}
              onChange={handleChange}
              placeholder="Complaint Raise By"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Full Details */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">
              Full Details
            </label>

            <textarea
              name="full_details"
              value={formData.full_details}
              onChange={handleChange}
              rows="5"
              placeholder="Write Complaint Details..."
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
              rows="3"
              placeholder="Enter Remark"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Complaint History */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">
              Complaint History
            </label>

            <textarea
              name="complaint_history"
              value={formData.complaint_history}
              onChange={handleChange}
              rows="3"
              placeholder="Previous Complaint History"
              className="w-full border border-slate-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition-all"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}