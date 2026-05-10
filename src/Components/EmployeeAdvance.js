import React from "react";

export default function EmployeeAdvance() {

  const advanceData = [
    {
      advance_id: "ADV1001",
      emp_id: "EMP101",
      emp_id: "EMP101",
      amount: 15000,
      adv_type: "Salary Advance",
      pdf_status: "Generated",
      document: "Uploaded",
      remark: "Medical Emergency",
      status: "Accepted",
    },
    {
      advance_id: "ADV1002",
      emp_id: "EMP102",
      amount: 25000,
      adv_type: "Bulk Amount",
      pdf_status: "Pending",
      document: "Not Uploaded",
      remark: "Family Function",
      status: "Pending",
    },
    {
      advance_id: "ADV1003",
      emp_id: "EMP103",
      amount: 10000,
      adv_type: "Salary Advance",
      pdf_status: "Generated",
      document: "Uploaded",
      remark: "Personal Work",
      status: "Denied",
    },
  ];

  return (

    <div className="grid grid-cols-1 gap-6 mb-6">

      <div className="bg-white rounded-2xl shadow-md p-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">

          <div>

            <h2 className="text-xl font-bold text-gray-800">
              Employee Advance
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Employee Advance Salary Management
            </p>

          </div>

          <button
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm shadow-md transition"
          >
            Create Advance
          </button>

        </div>

        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-6 gap-4 bg-pink-50 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-600 mb-3">

          <div>Emp Id</div>

          <div>Adv Amount</div>

          <div>PDF & Print</div>

          <div>Upload Doc</div>

          <div>Remark</div>

          <div>Status</div>

        </div>

        {/* Data */}
        <div className="space-y-3">

          {advanceData.map((item, index) => (

            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-gray-50 hover:bg-pink-50 transition rounded-2xl p-4 items-center"
            >

              {/* Emp ID */}
              <div>

                <p className="text-xs text-gray-400 md:hidden mb-1">
                  Emp Id
                </p>

                <p className="font-semibold text-gray-700">
                  {item.emp_id}
                </p>

              </div>

              {/* Amount */}
              <div>

                <p className="text-xs text-gray-400 md:hidden mb-1">
                  Adv Amount
                </p>

                <p className="font-bold text-pink-600">
                  ₹{item.amount.toLocaleString("en-IN")}
                </p>

              </div>

              {/* PDF */}
              <div>

                <p className="text-xs text-gray-400 md:hidden mb-1">
                  PDF & Print
                </p>

                <button
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    item.pdf_status === "Generated"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.pdf_status}
                </button>

              </div>

              {/* Upload */}
              <div>

                <p className="text-xs text-gray-400 md:hidden mb-1">
                  Upload Document
                </p>

                <button
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    item.document === "Uploaded"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.document}
                </button>

              </div>

              {/* Remark */}
              <div>

                <p className="text-xs text-gray-400 md:hidden mb-1">
                  Remark
                </p>

                <p className="text-gray-600 text-sm">
                  {item.remark}
                </p>

              </div>

              {/* Status */}
              <div>

                <p className="text-xs text-gray-400 md:hidden mb-1">
                  Branch Status
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "Accepted"
                      ? "bg-green-100 text-green-600"
                      : item.status === "Denied"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}