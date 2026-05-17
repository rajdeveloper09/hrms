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
                <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
                  Employee ID
                </th>

                <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
                  Employee Name
                </th>
              </>
            )}

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Date
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              In Time
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Out Time
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Hours
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Late / OT
            </th>

          </tr>
        );

      case "Complaint":

        return (
          <tr>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Incident Date
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Emp 1st
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Complaint Type
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Emp 2nd/Other
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Suspected
            </th>
            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Complaint Raise
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Remark
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

          </tr>
        );

      case "Salary":

        return (
          <tr>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Employee
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Suspected
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Type
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Date
            </th>

          </tr>
        );
      case "Bonus":

        return (
          <tr>
            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Bonus Date
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Employee
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Bonus Type
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Bonus Name
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Bonus Amount
            </th>
            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Bonus Allowed
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Remark
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

          </tr>
        );

      case "Penalty":

        return (
          <tr>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Penalty Date
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Employee
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Branch
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Complaint ID
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Penalty Type
            </th>
            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Penalty Amount
            </th>
            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Remark
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

          </tr>
        );
      case "Rewards":

        return (
          <tr>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Reward Date
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Employee
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Current Salary
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Reward Amount
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Order By
            </th>
            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Remark
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

          </tr>
        );
      case "Increment":

        return (
          <tr>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Employee
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Suspected
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Type
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Date
            </th>

          </tr>
        );
      case "Assest":

        return (
          <tr>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Employee
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Suspected
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Type
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Date
            </th>

          </tr>
        );
      case "Overtime":

        return (
          <tr>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Employee
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Suspected
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Type
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Date
            </th>

          </tr>
        );
      case "Meeting":

        return (
          <tr>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Employee
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Suspected
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Type
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Date
            </th>

          </tr>
        );
      case "Resignation":

        return (
          <tr>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Employee
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Suspected
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Type
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
              Status
            </th>

            <th className="text-left px-4 py-4 border-b border-white/10 font-bold uppercase tracking-wide text-xs whitespace-nowrap">
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
            className="py-20 text-center"
          >

            <div className="flex flex-col items-center justify-center">

              <div className="text-6xl mb-4">
                📂
              </div>

              <h2 className="text-xl font-black text-slate-700 mb-2">
                No {activeTab} Data Found
              </h2>

              <p className="text-slate-400 text-sm">
                Data will appear here once available
              </p>

            </div>

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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >
              {!isSingleEmployee && (
                <>
                  <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                    {item.employee_id}
                  </td>

                  <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                    {item.employee_name}
                  </td>
                </>
              )}

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.date}
              </td>

              <td className="px-4 py-4 border-b text-emerald-600 font-semibold">
                {inPunch?.time || "-"}
              </td>

              <td className="px-4 py-4 border-b text-rose-600 font-semibold">
                {outPunch?.time || "-"}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {workingHours}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {new Date(item.incident_datetime).toLocaleDateString("en-GB")}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {
                  item.complaint_type
                }
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {
                  item.second_employee_id ? (
                    <>{item.second_employee_id}</>
                  ) : (
                    <>{item.other_person_name}</>
                  )
                }
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {
                  item.suspected_employee
                }
              </td>
              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {
                  item.complaint_raise_by
                }
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.remark}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {
                  item.status
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {new Date(item.bonus_date).toLocaleDateString("en-GB")}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id} - {item.emp_name}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.bonus_type}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {
                  item.fixed_bonus_name ? (
                    <>{item.fixed_bonus_name}</>
                  ) : (
                    <>{item.custom_bonus_name}</>
                  )
                }
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                ₹{Math.round(item.total_bonus_amount)}
              </td>
              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.allowed_by}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.remark}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.status}
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {new Date(item.penalty_date).toLocaleDateString("en-GB")}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id} - {item.emp_name}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.branch_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.complaint_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.penalty_type}
              </td>
              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                ₹{Math.round(item.penalty_amount)}
              </td>
              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.remark}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.status}
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {new Date(item.reward_date).toLocaleDateString("en-GB")}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id} - {item.emp_name}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                ₹{Math.round(item.current_salary)}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                ₹{Math.round(item.total_reward_amount)}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.order_by}
              </td>
              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.remark}
              </td>
              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.status}
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.asset_name}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.asset_number}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.no_of_assets}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.overtime_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.overtime_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.overtime_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.overtime_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                {item.emp_id}
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
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
              className="hover:bg-pink-50/60 transition-all duration-200"
            >

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                Resignation
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                Resignation
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                Resignation
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
                Resignation
              </td>

              <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap">
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
            className="hover:bg-pink-50/60 transition-all duration-200"
          >

            {Object.keys(item).map(
              (key, idx) => (

                <td
                  key={idx}
                  className="px-4 py-4 border-b border-slate-100 font-medium text-slate-700 whitespace-nowrap"
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
      <div className="relative border-b border-white/20 bg-gradient-to-r from-rose-600 to-pink-600 p-4">

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative flex flex-wrap gap-3">

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
              onClick={() => setActiveTab(tab)}
              className={`
          relative overflow-hidden px-5 py-3 rounded-2xl text-sm font-bold
          transition-all duration-300 border backdrop-blur-xl
          ${activeTab === tab
                  ? "bg-white text-slate-900 border-white shadow-2xl scale-105"
                  : "bg-white/10 text-white border-white/10 hover:bg-white/20 hover:scale-105"
                }
        `}
            >

              {activeTab === tab && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-200/30 to-blue-200/30 animate-pulse" />
              )}

              <span className="relative z-10">
                {tab}
              </span>

            </button>

          ))}

        </div>

      </div>

      {/* FILTER BAR */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 p-5">

        <div className="flex flex-wrap gap-4 items-center justify-between">

          <div className="flex flex-wrap gap-3 items-center">

            {!isSingleEmployee && (
              <input
                type="text"
                placeholder="Search Employee ID / Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-72 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
              />
            )}

            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSelectedDate("");
                setSelectedMonth("");
                setSelectedYear("");
              }}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm outline-none focus:border-pink-400"
            >
              <option value="date">Single Date</option>
              <option value="month">Month Wise</option>
              <option value="year">Year Wise</option>
            </select>

            {filterType === "date" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm shadow-sm outline-none"
              />
            )}

            {filterType === "month" && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm shadow-sm outline-none"
              />
            )}

            {filterType === "year" && (
              <input
                type="number"
                placeholder="2026"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-12 w-32 rounded-2xl border border-slate-200 bg-white px-4 text-sm shadow-sm outline-none"
              />
            )}

          </div>

          <div className="flex gap-3">

            <button
              onClick={clearFilters}
              className="h-12 px-5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold transition-all"
            >
              Clear Filter
            </button>

            <button
              onClick={exportToCSV}
              className="h-12 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-bold transition-all"
            >
              Export Excel
            </button>

          </div>

        </div>

      </div>

      {/* TABLE */}


      {/* TABLE */}

      <div className="overflow-auto h-[640px] bg-gradient-to-b from-white to-slate-50">

        <table className="w-full text-sm border-separate border-spacing-0">

          <thead className="sticky top-0 z-20 bg-black to-rose-900 text-white">

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