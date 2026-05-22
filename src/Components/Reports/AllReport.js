import { useEffect, useState } from "react";

import SideNav from "../SideNav";
import EmployeeTabsSection from "../Employee/EmployeeTabsSection";
import { API_BASE_URL } from "../../config/api";
import { Toaster } from "react-hot-toast";
export default function AllReport() {


    const [empAttendance, setEmpAttendance] =
        useState([]);

    const [salaryData, setSalaryData] =
        useState([]);

    console.log("salary data" + salaryData)

    const [bonusData, setBonusData] =
        useState([]);

    const [penaltyData, setPenaltyData] =
        useState([]);

    const [rewardsData, setRewardsData] =
        useState([]);

    const [empComplaint, setEmpComplaint] =
        useState([]);

    const [empIncrement, setEmpIncrement] =
        useState([]);

    const [empEsicPfData, setEmpEsicPfData] =
        useState([]);


    const [empOvertime, setEmpOvertime] =
        useState([]);

    const [empMeeting, setEmpMeeting] =
        useState([]);

    const [empResignation, setEmpResignation] =
        useState([]);

    const [empAssest, setEmpAssest] =
        useState([]);

    const [empList, setEmployeeNew] =
        useState([]);


    useEffect(() => {

        const fetchData = async (
            url,
            setter,
            label
        ) => {

            try {

                const res = await fetch(url);

                const response =
                    await res.json();

                console.log(
                    `${label} Response:`,
                    response
                );

                const data =
                    response?.data ||
                    response?.result ||
                    response ||
                    [];

                setter(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.log(
                    `${label} Error:`,
                    err
                );

                setter([]);

            }

        };

        /* =========================================
            ALL API CALLS
        ========================================= */

        fetchData(
            `${API_BASE_URL}/emp_attendance`,
            setEmpAttendance,
            "Attendance"
        );

        fetchData(
            `${API_BASE_URL}/emp_month_salary`,
            setSalaryData,
            "Salary"
        );

        fetchData(
            `${API_BASE_URL}/emp_bonus`,
            setBonusData,
            "Bonus"
        );

        fetchData(
            `${API_BASE_URL}/emp_penalties`,
            setPenaltyData,
            "Penalty"
        );

        fetchData(
            `${API_BASE_URL}/emp_rewards`,
            setRewardsData,
            "Rewards"
        );

        fetchData(
            `${API_BASE_URL}/emp_complaints`,
            setEmpComplaint,
            "Complaint"
        );

        fetchData(
            `${API_BASE_URL}/emp_increments`,
            setEmpIncrement,
            "Increment"
        );

        fetchData(
            `${API_BASE_URL}/emp_esicpf`,
            setEmpEsicPfData,
            "Increment"
        );

        fetchData(
            `${API_BASE_URL}/emp_overtime`,
            setEmpOvertime,
            "Overtime"
        );

        fetchData(
            `${API_BASE_URL}/emp_meetings`,
            setEmpMeeting,
            "Meeting"
        );

        fetchData(
            `${API_BASE_URL}/emp_resignation`,
            setEmpResignation,
            "Resignation"
        );

        fetchData(
            `${API_BASE_URL}/get_office_asset_history`,
            setEmpAssest,
            "Assest"
        );
        fetchData(
            `${API_BASE_URL}/get_employee`,
            setEmployeeNew,
            "Assest"
        );

    }, []);


    return (

        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex">
            <Toaster />
            <SideNav />

            <div className="flex-1 xl:ml-72 p-4 md:p-6 overflow-y-auto">

                <EmployeeTabsSection
                    attendanceData={empAttendance}
                    salaryData={salaryData}
                    bonusData={bonusData}
                    penaltyData={penaltyData}
                    rewardsData={rewardsData}
                    complaintData={empComplaint}
                    incrementData={empIncrement}
                    overtimeData={empOvertime}
                    esicPfData={empEsicPfData}
                    meetingData={empMeeting}
                    resignationData={empResignation}
                    assestData={empAssest}
                    employeeData={empList}
                />

            </div>

        </div>

    );

}