import React, { useMemo, useState } from "react";

const EmployeeTabsSection = ({
  attendanceData = [],
  salaryData = [],
  bonusData = [],
  penaltyData = [],
  rewardsData = [],
}) => {

  const [activeTab, setActiveTab] = useState("Attendance");

  const [filterType, setFilterType] = useState("date");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  /* -------------------------------- */
  /* GET TAB DATA */
  /* -------------------------------- */

  const tabData = useMemo(() => {

    return {
      Attendance: attendanceData,
      Salary: salaryData,
      Bonus: bonusData,
      Penalty: penaltyData,
      Rewards: rewardsData,
    };

  }, [
    attendanceData,
    salaryData,
    bonusData,
    penaltyData,
    rewardsData,
  ]);

  /* -------------------------------- */
  /* FILTER FUNCTION */
  /* -------------------------------- */

  const getActiveData = () => {

    let data = tabData[activeTab] || [];

    if (filterType === "date" && selectedDate) {

      data = data.filter((item) => item.date === selectedDate);

    }

    if (filterType === "month" && selectedMonth) {

      data = data.filter((item) =>
        item.date?.startsWith(selectedMonth)
      );

    }

    if (filterType === "year" && selectedYear) {

      data = data.filter((item) =>
        item.date?.startsWith(selectedYear)
      );

    }

    return data;

  };

  /* -------------------------------- */
  /* TABLE HEADERS */
  /* -------------------------------- */

  const renderTableHeader = () => {

    switch (activeTab) {

      case "Attendance":
        return (
          <tr>
            <th className="text-left px-4 py-3 border-b">Date</th>
            <th className="text-left px-4 py-3 border-b">In Time</th>
            <th className="text-left px-4 py-3 border-b">Out Time</th>
            <th className="text-left px-4 py-3 border-b">Hours</th>
            <th className="text-left px-4 py-3 border-b">Late / OT</th>
          </tr>
        );

      case "Salary":
        return (
          <tr>
            <th className="text-left px-4 py-3 border-b">Date</th>
            <th className="text-left px-4 py-3 border-b">Amount</th>
            <th className="text-left px-4 py-3 border-b">Type</th>
            <th className="text-left px-4 py-3 border-b">Status</th>
          </tr>
        );

      default:
        return (
          <tr>
            <th className="text-left px-4 py-3 border-b">Date</th>
            <th className="text-left px-4 py-3 border-b">Amount</th>
            <th className="text-left px-4 py-3 border-b">Reason</th>
          </tr>
        );

    }

  };

  /* -------------------------------- */
  /* TABLE BODY */
  /* -------------------------------- */

  const renderTableBody = () => {

    const data = getActiveData();

    if (data.length === 0) {

      return (
        <tr>
          <td
            colSpan="5"
            className="text-center py-10 text-slate-500"
          >
            No {activeTab} Data Found
          </td>
        </tr>
      );

    }

    return data.map((item, index) => {

      if (activeTab === "Attendance") {

        return (
          <tr
            key={index}
            className="hover:bg-slate-50"
          >
            <td className="px-4 py-4 border-b">
              {item.date}
            </td>

            <td className="px-4 py-4 border-b">
              {item.inTime}
            </td>

            <td className="px-4 py-4 border-b">
              {item.outTime}
            </td>

            <td className="px-4 py-4 border-b">
              {item.totalHours}
            </td>

            <td className="px-4 py-4 border-b">
              {item.late}
            </td>
          </tr>
        );

      }

      if (activeTab === "Salary") {

        return (
          <tr
            key={index}
            className="hover:bg-slate-50"
          >
            <td className="px-4 py-4 border-b">
              {item.date}
            </td>

            <td className="px-4 py-4 border-b">
              {item.amount}
            </td>

            <td className="px-4 py-4 border-b">
              {item.type}
            </td>

            <td className="px-4 py-4 border-b">
              {item.status}
            </td>
          </tr>
        );

      }

      return (
        <tr
          key={index}
          className="hover:bg-slate-50"
        >
          <td className="px-4 py-4 border-b">
            {item.date}
          </td>

          <td className="px-4 py-4 border-b">
            {item.amount}
          </td>

          <td className="px-4 py-4 border-b">
            {item.reason}
          </td>
        </tr>
      );

    });

  };

  return (

    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden flex flex-col">

      {/* TABS */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">

        {[
          "Attendance",
          "Salary",
          "Bonus",
          "Penalty",
          "Rewards",
          "Complaint",
          "Increment",
          "Assest",
          "Overtime",
          "Meeting",
        ].map((tab, index) => (

          <button
            key={index}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-r border-slate-200 transition-all duration-300 ${activeTab === tab
              ? "bg-blue-500 text-white"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            {tab}
          </button>

        ))}

      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center justify-between p-4 border-b bg-white">

        <div className="flex gap-2 flex-wrap">

          <button
            onClick={() => setFilterType("date")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterType === "date"
              ? "bg-blue-500 text-white"
              : "bg-slate-100 text-slate-700"
              }`}
          >
            Single Date
          </button>

          <button
            onClick={() => setFilterType("month")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterType === "month"
              ? "bg-blue-500 text-white"
              : "bg-slate-100 text-slate-700"
              }`}
          >
            Month Wise
          </button>

          <button
            onClick={() => setFilterType("year")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterType === "year"
              ? "bg-blue-500 text-white"
              : "bg-slate-100 text-slate-700"
              }`}
          >
            Year Wise
          </button>

        </div>

        {/* FILTER INPUT */}
        <div>

          {filterType === "date" && (

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />

          )}

          {filterType === "month" && (

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />

          )}

          {filterType === "year" && (

            <input
              type="number"
              placeholder="Enter Year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-36"
            />

          )}

        </div>

      </div>

      {/* TAB HEADING */}
      <div className="px-4 py-3 bg-slate-100 border-b">

        <h2 className="text-lg font-bold text-slate-700">
          {activeTab}
        </h2>

      </div>

      {/* TABLE */}
      <div className="overflow-auto">

        <table className="w-full text-sm">

          <thead className="bg-slate-100">
            {renderTableHeader()}
          </thead>

          <tbody>
            {renderTableBody()}
          </tbody>

        </table>

      </div>

    </div>

  );

};

export default EmployeeTabsSection;