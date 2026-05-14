import React, { useMemo, useState } from "react";

const EmployeeTabsSection = ({
  attendanceData = [],
  salaryData = [],
  bonusData = [],
  penaltyData = [],
  rewardsData = [],
  complaintData = [],
  incrementData = [],
  overtimeData = [],
  meetingData = [],
  resignationData = [],
  assestData = [],
}) => {

  const [activeTab, setActiveTab] =
    useState("Attendance");

  const [filterType, setFilterType] =
    useState("date");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [selectedYear, setSelectedYear] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  /* =========================================
      ALL TAB DATA
  ========================================= */

  const tabData = useMemo(() => {

    return {

      Attendance: attendanceData || [],
      Salary: salaryData || [],
      Bonus: bonusData || [],
      Penalty: penaltyData || [],
      Rewards: rewardsData || [],
      Complaint: complaintData || [],
      Increment: incrementData || [],
      Overtime: overtimeData || [],
      Meeting: meetingData || [],
      Resignation: resignationData || [],
      Assest: assestData || [],

    };

  }, [
    attendanceData,
    salaryData,
    bonusData,
    penaltyData,
    rewardsData,
    complaintData,
    incrementData,
    overtimeData,
    meetingData,
    resignationData,
    assestData,
  ]);

  /* =========================================
      GET ACTIVE DATA
  ========================================= */

  const getActiveData = () => {

    let data = [...(tabData[activeTab] || [])];

    /* SEARCH */

    if (searchTerm.trim()) {

      data = data.filter((item) => {

        const empId =
          (
            item.employee_id ||
            item.emp_id ||
            ""
          ).toLowerCase();

        const empName =
          (
            item.employee_name ||
            item.full_name ||
            item.name ||
            ""
          ).toLowerCase();

        return (
          empId.includes(
            searchTerm.toLowerCase()
          ) ||
          empName.includes(
            searchTerm.toLowerCase()
          )
        );

      });

    }

    /* DATE FILTER */

    if (
      filterType === "date" &&
      selectedDate
    ) {

      data = data.filter((item) => {

        const itemDate =
          item.date ||
          item.created_at?.slice(0, 10);

        return itemDate === selectedDate;

      });

    }

    /* MONTH FILTER */

    if (
      filterType === "month" &&
      selectedMonth
    ) {

      data = data.filter((item) => {

        const itemDate =
          item.date ||
          item.created_at?.slice(0, 10);

        return (
          itemDate?.slice(0, 7) ===
          selectedMonth
        );

      });

    }

    /* YEAR FILTER */

    if (
      filterType === "year" &&
      selectedYear
    ) {

      data = data.filter((item) => {

        const itemDate =
          item.date ||
          item.created_at?.slice(0, 10);

        return (
          itemDate?.slice(0, 4) ===
          selectedYear
        );

      });

    }

    /* SORT */

    data.sort((a, b) => {

      const dateA = new Date(
        a.date ||
        a.created_at ||
        "2000-01-01"
      );

      const dateB = new Date(
        b.date ||
        b.created_at ||
        "2000-01-01"
      );

      return dateB - dateA;

    });

    return data;

  };

  const activeData = getActiveData();

  /* =========================================
     SINGLE / MULTIPLE EMPLOYEE CHECK
 ========================================= */

  /* =========================================
     SINGLE / MULTIPLE EMPLOYEE CHECK
  ========================================= */

  // ORIGINAL DATA OF CURRENT TAB
  const originalTabData =
    tabData[activeTab] || [];

  // UNIQUE EMPLOYEE IDS
  const uniqueEmployees = [
    ...new Set(
      originalTabData
        .map((item) =>
          String(
            item.employee_id ||
            item.emp_id ||
            ""
          ).trim()
        )
        .filter(Boolean)
    ),
  ];

  // TRUE IF ONLY 1 EMPLOYEE
  const isSingleEmployee =
    uniqueEmployees.length <= 1;

  /* =========================================
      CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {

    setSelectedDate("");
    setSelectedMonth("");
    setSelectedYear("");
    setSearchTerm("");

  };

  /* =========================================
      EXPORT CSV
  ========================================= */

  const exportToCSV = () => {

    if (activeData.length === 0) {

      alert("No Data Found");
      return;

    }

    const headers = Object.keys(
      activeData[0]
    );

    const rows = activeData.map((row) =>
      headers.map((field) => {

        const value = row[field];

        return `"${value ?? ""}"`;

      }).join(",")
    );

    const csvContent = [
      headers.join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${activeTab}_Report.csv`;

    link.click();

  };

  /* =========================================
      TABLE HEADERS
  ========================================= */

  const renderTableHeader = () => {

    switch (activeTab) {

      case "Attendance":

        return (
          <tr>

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

      case "Complaint":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );

      case "Salary":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );
      case "Bonus":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );

      case "Penalty":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );
      case "Rewards":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );
      case "Increment":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );
      case "Assest":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );
      case "Overtime":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );
      case "Meeting":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );
      case "Resignation":

        return (
          <tr>

            <th className="text-left px-4 py-3 border-b">
              Employee
            </th>

            <th className="text-left px-4 py-3 border-b">
              Suspected
            </th>

            <th className="text-left px-4 py-3 border-b">
              Type
            </th>

            <th className="text-left px-4 py-3 border-b">
              Status
            </th>

            <th className="text-left px-4 py-3 border-b">
              Date
            </th>

          </tr>
        );

      default:

        return (
          <tr>

            {Object.keys(
              activeData[0] || {}
            ).map((key, index) => (

              <th
                key={index}
                className="text-left px-4 py-3 border-b capitalize"
              >
                {key.replaceAll("_", " ")}
              </th>

            ))}

          </tr>
        );

    }

  };

  /* =========================================
      TABLE BODY
  ========================================= */

  const renderTableBody = () => {

    if (activeData.length === 0) {

      return (

        <tr>

          <td
            colSpan="20"
            className="text-center py-10 text-slate-500"
          >

            No {activeTab} Data Found

          </td>

        </tr>

      );

    }

    return activeData.map(
      (item, index) => {

        /* =====================================
            ATTENDANCE
        ===================================== */

        if (
          activeTab === "Attendance"
        ) {

          const inPunch =
            item.punches?.find(
              (p) => p.status === 0
            );

          const outPunch =
            item.punches?.find(
              (p) => p.status === 1
            );

          let workingHours = "-";

          if (
            inPunch?.time &&
            outPunch?.time
          ) {

            const inTime = new Date(
              `2000-01-01 ${inPunch.time}`
            );

            const outTime = new Date(
              `2000-01-01 ${outPunch.time}`
            );

            const diffMs =
              outTime - inTime;

            const hours = Math.floor(
              diffMs /
              (1000 * 60 * 60)
            );

            const minutes = Math.floor(
              (
                diffMs %
                (1000 * 60 * 60)
              ) /
              (1000 * 60)
            );

            workingHours =
              `${hours}h ${minutes}m`;

          }

          let lateOt = "-";

          if (inPunch?.time) {

            const officeTime =
              new Date(
                `2000-01-01 09:30:00`
              );

            const empInTime =
              new Date(
                `2000-01-01 ${inPunch.time}`
              );

            if (
              empInTime > officeTime
            ) {

              const diff =
                (
                  empInTime -
                  officeTime
                ) /
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
              className="hover:bg-slate-50"
            >
              {!isSingleEmployee && (
                <>
                  <td className="px-4 py-4 border-b">
                    {item.employee_id}
                  </td>

                  <td className="px-4 py-4 border-b">
                    {item.employee_name}
                  </td>
                </>
              )}

              <td className="px-4 py-4 border-b">
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

        /* =====================================
            COMPLAINT
        ===================================== */

        if (
          activeTab === "Complaint"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {
                  item.suspected_employee
                }
              </td>

              <td className="px-4 py-4 border-b">
                {
                  item.complaint_between
                }
              </td>

              <td className="px-4 py-4 border-b">
                {item.status}
              </td>

              <td className="px-4 py-4 border-b">
                {
                  item.incident_datetime
                }
              </td>

            </tr>

          );

        }


        if (
          activeTab === "Salary"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
               {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

            </tr>

          );

        }


        if (
          activeTab === "Bonus"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
               {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
               {item.emp_id}
              </td>

            </tr>

          );

        }

        if (
          activeTab === "Penalty"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
               {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
               {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
               {item.emp_id}
              </td>

            </tr>

          );

        }

        if (
          activeTab === "Rewards"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

            </tr>

          );

        }
        if (
          activeTab === "Increment"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
               {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

            </tr>

          );

        }
        if (
          activeTab === "Assest"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.asset_name}
              </td>

              <td className="px-4 py-4 border-b">
                 {item.asset_number}
              </td>

              <td className="px-4 py-4 border-b">
                 {item.no_of_assets}
              </td>

              <td className="px-4 py-4 border-b">
                 {item.start_date}
              </td>

            </tr>

          );

        }

        if (
          activeTab === "Overtime"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                {item.overtime_id}
              </td>

              <td className="px-4 py-4 border-b">
               {item.overtime_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.overtime_id}
              </td>

              <td className="px-4 py-4 border-b">
               {item.overtime_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.overtime_id}
              </td>

            </tr>

          );

        }

        if (
          activeTab === "Meeting"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b">
                {item.emp_id}
              </td>

            </tr>

          );

        }

        if (
          activeTab === "Resignation"
        ) {

          return (

            <tr
              key={index}
              className="hover:bg-slate-50"
            >

              <td className="px-4 py-4 border-b">
                Resignation
              </td>

              <td className="px-4 py-4 border-b">
                Resignation
              </td>

              <td className="px-4 py-4 border-b">
                Resignation
              </td>

              <td className="px-4 py-4 border-b">
                Resignation
              </td>

              <td className="px-4 py-4 border-b">
                Resignation
              </td>

            </tr>

          );

        }



        /* =====================================
            DEFAULT
        ===================================== */

        return (

          <tr
            key={index}
            className="hover:bg-slate-50"
          >

            {Object.keys(item).map(
              (key, idx) => (

                <td
                  key={idx}
                  className="px-4 py-4 border-b"
                >
                  {String(item[key] ?? "-")}
                </td>

              )
            )}

          </tr>

        );

      }
    );

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
            "Resignation",
          ].map((tab, index) => (

            <button
              key={index}
              onClick={() =>
                setActiveTab(tab)
              }
              className={`
                relative px-4 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-300 border
                ${activeTab === tab
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }
              `}
            >

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


          {/* SEARCH BAR */}

          {!isSingleEmployee && (
            <input
              type="text"
              placeholder="Search Employee ID / Name"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-64"
            />
          )}

          <select
            value={filterType}
            onChange={(e) => {

              setFilterType(
                e.target.value
              );

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

          {filterType === "date" && (

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />

          )}

          {filterType === "month" && (

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />

          )}

          {filterType === "year" && (

            <input
              type="number"
              placeholder="2026"
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  e.target.value
                )
              }
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-32"
            />

          )}

        </div>

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

      {/* TABLE */}


      {/* TABLE */}

      <div
        className={`overflow-auto h-[640px]`}>

        <table className="w-full text-sm">

          <thead className="bg-slate-100 sticky top-0 z-10">

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