import { useEffect, useState } from 'react'
import SideNav from './SideNav'
import EmployeeTabsSection from './Employee/EmployeeTabsSection'

export default function AttendanceReport() {

    // ATTENDANCE
    const [empAttendance, setEmpAttendance] = useState([]);

    useEffect(() => {

        fetch("https://ojmee.in/employee/emp_attendance")
            .then((res) => res.json())
            .then((response) => {

                console.log("Full API Response:", response);

                // FULL DATA
                const attendanceArray = response?.data || [];

                console.log("All Attendance Data:", attendanceArray);

                // SET FULL DATA
                setEmpAttendance(attendanceArray);

            })
            .catch((err) => {

                console.log("Attendance Error:", err);

            });

    }, []);

    // STATIC DATA
    const salaryData = [
        {
            date: "2026-05-01",
            amount: "₹25,000",
            type: "Bank Transfer",
            status: "Paid",
        },
    ];

    const bonusData = [
        {
            date: "2026-05-10",
            amount: "₹2,000",
            reason: "Performance Bonus",
        },
    ];

    const penaltyData = [
        {
            date: "2026-05-08",
            amount: "₹500",
            reason: "Late Coming",
        },
    ];

    const rewardsData = [
        {
            date: "2026-05-11",
            amount: "₹1,000",
            reason: "Best Employee",
        },
    ];

    return (

        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex">

            <SideNav />

            <div className="flex-1 xl:ml-72 p-4 md:p-6 overflow-y-auto">

                <EmployeeTabsSection
                    attendanceData={empAttendance}
                    salaryData={salaryData}
                    bonusData={bonusData}
                    penaltyData={penaltyData}
                    rewardsData={rewardsData}
                />

            </div>

        </div>

    )

}