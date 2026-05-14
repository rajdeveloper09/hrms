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

  // SEARCH
  const [searchTerm, setSearchTerm] = useState("");

  console.log("Attendance Props:", attendanceData);

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
  /* GET ACTIVE DATA */
  /* -------------------------------- */

  const getActiveData = () => {

    let data = [...(tabData[activeTab] || [])];

    /* SEARCH */

    if (searchTerm.trim()) {

      data = data.filter((item) => {

        const empId =
          item.employee_id?.toLowerCase() || "";

        const empName =
          item.employee_name?.toLowerCase() || "";

        return (
          empId.includes(searchTerm.toLowerCase()) ||
          empName.includes(searchTerm.toLowerCase())
        );

      });

    }

    /* SINGLE DATE */

    if (filterType === "date" && selectedDate) {

      data = data.filter(
        (item) => item.date === selectedDate
      );

    }

    /* MONTH */

    if (filterType === "month" && selectedMonth) {

      data = data.filter((item) => {

        const itemMonth = item.date?.slice(0, 7);

        return itemMonth === selectedMonth;

      });

    }

    /* YEAR */

    if (filterType === "year" && selectedYear) {

      data = data.filter((item) => {

        const itemYear = item.date?.slice(0, 4);

        return itemYear === selectedYear;

      });

    }

    /* SORT LATEST DATE + TIME FIRST */

    data.sort((a, b) => {

      const inPunchA =
        a.punches?.find((p) => p.status === 0);

      const inPunchB =
        b.punches?.find((p) => p.status === 0);

      const timeA =
        inPunchA?.time || "00:00:00";

      const timeB =
        inPunchB?.time || "00:00:00";

      const fullA = new Date(
        `${a.date} ${timeA}`
      );

      const fullB = new Date(
        `${b.date} ${timeB}`
      );

      return fullB - fullA;

    });

    return data;

  };

  const activeData = getActiveData();

  /* -------------------------------- */
  /* SINGLE EMPLOYEE CHECK */
  /* -------------------------------- */

  const uniqueEmployees = [
    ...new Set(
      activeData.map(
        (item) => item.employee_id
      )
    ),
  ];

  const isSingleEmployee =
    !searchTerm.trim() &&
    uniqueEmployees.length === 1;

  /* -------------------------------- */
  /* TABLE HEADERS */
  /* -------------------------------- */

  const renderTableHeader = () => {

    switch (activeTab) {

      case "Attendance":
        return (
          <tr>

            {/* SHOW ONLY MULTIPLE EMPLOYEE */}
            {!isSingleEmployee && (
              <>
                <th className="text-left px-4 py-3 border-b">
                  Employee ID
                </th>

                <th className="text-left px-4 py-3 border-b">
                  Employee Name
                </th>
              </>
            )}

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

            <th className="text-left px-4 py-3 border-b">
              In Time
            </th>

            <th className="text-left px-4 py-3 border-b">
              Out Time
            </th>

            <th className="text-left px-4 py-3 border-b">
              Hours
            </th>

            <th className="text-left px-4 py-3 border-b">
              Late / OT
            </th>

          </tr>
        );

      case "Salary":
        return (
          <tr>
            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

            <th className="text-left px-4 py-3 border-b">
              Amount
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>
          </tr>
        );

      default:
        return (
          <tr>
            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

            <th className="text-left px-4 py-3 border-b">
              Amount
            </th>

            <th className="text-left px-4 py-3 border-b">
              Reason
            </th>
          </tr>
        );

    }

  };

  /* -------------------------------- */
  /* EXPORT CSV */
  /* -------------------------------- */

  const exportToCSV = () => {

    const data = activeData;

    if (data.length === 0) {

      alert("No data found");

      return;

    }

    /* -------------------------------- */
    /* CUSTOM HEADERS */
    /* -------------------------------- */

    const headers = [
      "Employee ID",
      "Employee Name",
      "Date",
      "In Time",
      "Out Time",
      "Working Hours",
      "Late / OT",
    ];

    const csvRows = [];

    // HEADER ROW
    csvRows.push(headers.join(","));

    /* -------------------------------- */
    /* DATA ROWS */
    /* -------------------------------- */

    data.forEach((item) => {

      const inPunch =
        item.punches?.find(
          (p) => p.status === 0
        );

      const outPunch =
        item.punches?.find(
          (p) => p.status === 1
        );

      /* WORKING HOURS */

      let workingHours = "-";

      if (inPunch?.time && outPunch?.time) {

        const inTime = new Date(
          `2000-01-01 ${inPunch.time}`
        );

        const outTime = new Date(
          `2000-01-01 ${outPunch.time}`
        );

        const diffMs = outTime - inTime;

        const hours = Math.floor(
          diffMs / (1000 * 60 * 60)
        );

        const minutes = Math.floor(
          (diffMs % (1000 * 60 * 60)) /
          (1000 * 60)
        );

        workingHours =
          `${hours}h ${minutes}m`;

      }

      /* LATE / OT */

      let lateOt = "-";

      if (inPunch?.time) {

        const officeTime = new Date(
          `2000-01-01 09:30:00`
        );

        const empInTime = new Date(
          `2000-01-01 ${inPunch.time}`
        );

        if (empInTime > officeTime) {

          const diff =
            (empInTime - officeTime) /
            (1000 * 60);

          lateOt =
            `Late ${Math.floor(diff)} min`;

        } else {

          lateOt = "On Time";

        }

      }

      /* ROW */

      const row = [

        item.employee_id || "",

        item.employee_name || "",

        item.date || "",

        inPunch?.time || "-",

        outPunch?.time || "-",

        workingHours,

        lateOt,

      ];

      csvRows.push(
        row.map((val) => `"${val}"`).join(",")
      );

    });

    /* -------------------------------- */
    /* CREATE CSV */
    /* -------------------------------- */

    const csvData = csvRows.join("\n");

    const blob = new Blob(
      [csvData],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download =
      `${activeTab}_Report.csv`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

  };

  /* -------------------------------- */
  /* CLEAR FILTER */
  /* -------------------------------- */

  const clearFilters = () => {

    setSelectedDate("");
    setSelectedMonth("");
    setSelectedYear("");
    setSearchTerm("");

  };

  /* -------------------------------- */
  /* TABLE BODY */
  /* -------------------------------- */

  const renderTableBody = () => {

    const data = activeData;

    if (data.length === 0) {

      return (
        <tr>
          <td
            colSpan="10"
            className="text-center py-10 text-slate-500"
          >
            No {activeTab} Data Found
          </td>
        </tr>
      );

    }

    return data.map((item, index) => {

      /* ATTENDANCE */

      if (activeTab === "Attendance") {

        const inPunch =
          item.punches?.find(
            (p) => p.status === 0
          );

        const outPunch =
          item.punches?.find(
            (p) => p.status === 1
          );

        let workingHours = "-";

        if (inPunch?.time && outPunch?.time) {

          const inTime = new Date(
            `2000-01-01 ${inPunch.time}`
          );

          const outTime = new Date(
            `2000-01-01 ${outPunch.time}`
          );

          const diffMs = outTime - inTime;

          const hours = Math.floor(
            diffMs / (1000 * 60 * 60)
          );

          const minutes = Math.floor(
            (diffMs % (1000 * 60 * 60)) /
            (1000 * 60)
          );

          workingHours =
            `${hours}h ${minutes}m`;

        }

        let lateOt = "-";

        if (inPunch?.time) {

          const officeTime = new Date(
            `2000-01-01 09:30:00`
          );

          const empInTime = new Date(
            `2000-01-01 ${inPunch.time}`
          );

          if (empInTime > officeTime) {

            const diff =
              (empInTime - officeTime) /
              (1000 * 60);

            lateOt =
              `Late ${Math.floor(diff)} min`;

          } else {

            lateOt = "On Time";

          }

        }

        return (

          <tr
            key={index}
            className="hover:bg-slate-50 transition-all"
          >

            {/* SHOW ONLY MULTIPLE EMPLOYEE */}
            {!isSingleEmployee && (
              <>
                <td className="px-4 py-4 border-b font-medium">
                  {item.employee_id}
                </td>

                <td className="px-4 py-4 border-b font-medium">
                  {item.employee_name}
                </td>
              </>
            )}

            <td className="px-4 py-4 border-b font-medium">
              {item.date}
            </td>

            <td className="px-4 py-4 border-b text-emerald-600 font-semibold">
              {inPunch?.time || "-"}
            </td>

            <td className="px-4 py-4 border-b text-rose-600 font-semibold">
              {outPunch?.time || "-"}
            </td>

            <td className="px-4 py-4 border-b">
              {workingHours}
            </td>

            <td className="px-4 py-4 border-b">
              {lateOt}
            </td>

          </tr>

        );

      }

      /* SALARY */

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

      /* OTHER */

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
      <div className="bg-white border-b border-slate-200 p-3">

        <div className="flex flex-wrap gap-2">

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
"Resignation"
          ].map((tab, index) => (

            <button
              key={index}
              onClick={() => setActiveTab(tab)}
              className={`
          relative px-4 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-300 border
          ${activeTab === tab
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }
        `}
            >

              {/* ACTIVE ANIMATION */}
              {activeTab === tab && (
                <span className="absolute inset-0 rounded-xl bg-white/10 animate-pulse"></span>
              )}

              <span className="relative z-10">
                {tab}
              </span>

            </button>

          ))}

        </div>

      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 items-center justify-between p-4 border-b bg-white">

        <div className="flex gap-3 flex-wrap items-center">

          {/* SEARCH */}
          {!isSingleEmployee && (
            <>
              <input
                type="text"
                placeholder="Search Employee ID / Name"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-64"
              />
            </>
          )}


          {/* FILTER TYPE */}
          <select
            value={filterType}
            onChange={(e) => {

              setFilterType(e.target.value);

              setSelectedDate("");
              setSelectedMonth("");
              setSelectedYear("");

            }}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >

            <option value="date">
              Single Date
            </option>

            <option value="month">
              Month Wise
            </option>

            <option value="year">
              Year Wise
            </option>

          </select>

          {/* DATE */}
          {filterType === "date" && (

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />

          )}

          {/* MONTH */}
          {filterType === "month" && (

            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >

              <option value="">
                Select Month
              </option>

              <option value="2026-01">January</option>
              <option value="2026-02">February</option>
              <option value="2026-03">March</option>
              <option value="2026-04">April</option>
              <option value="2026-05">May</option>
              <option value="2026-06">June</option>
              <option value="2026-07">July</option>
              <option value="2026-08">August</option>
              <option value="2026-09">September</option>
              <option value="2026-10">October</option>
              <option value="2026-11">November</option>
              <option value="2026-12">December</option>

            </select>

          )}

          {/* YEAR */}
          {filterType === "year" && (

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >

              <option value="">
                Select Year
              </option>

              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>

            </select>

          )}

        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">

          <button
            onClick={clearFilters}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Clear Filter
          </button>

          <button
            onClick={exportToCSV}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Export Excel
          </button>

        </div>

      </div>

      {!isSingleEmployee ? (

        <div className="overflow-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-100 sticky top-0 z-10">
              {renderTableHeader()}
            </thead>

            <tbody>
              {renderTableBody()}
            </tbody>

          </table>

        </div>

      ) : (

        <div className="overflow-auto h-[640px]">

          <table className="w-full text-sm">

            <thead className="bg-slate-100 sticky top-0 z-10">
              {renderTableHeader()}
            </thead>

            <tbody>
              {renderTableBody()}
            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};

export default EmployeeTabsSection;