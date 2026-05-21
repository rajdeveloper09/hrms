import React, { useEffect, useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../config/api";

export default function Chart1() {
    const [attendanceList, setAttendanceList] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("All");

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [attendanceRes, employeeRes, branchRes] = await Promise.all([
                fetch(`${API_BASE_URL}/emp_attendance`),
                fetch(`${API_BASE_URL}/get_employee`),
                fetch(`${API_BASE_URL}/branches`),
            ]);

            const attendanceJson = await attendanceRes.json();
            const employeeJson = await employeeRes.json();
            const branchJson = await branchRes.json();

            setAttendanceList(
                Array.isArray(attendanceJson.data)
                    ? attendanceJson.data
                    : Array.isArray(attendanceJson)
                    ? attendanceJson
                    : []
            );

            setEmployees(
                employeeJson.status === true && Array.isArray(employeeJson.data)
                    ? employeeJson.data
                    : []
            );

            setBranches(
                branchJson.status === true && Array.isArray(branchJson.data)
                    ? branchJson.data
                    : []
            );
        } catch (error) {
            console.error("Attendance API Error:", error);
            setAttendanceList([]);
            setEmployees([]);
            setBranches([]);
        }
    };

    const timeToMinutes = (time) => {
        if (!time) return 0;
        const parts = String(time).split(":");
        const h = Number(parts[0] || 0);
        const m = Number(parts[1] || 0);
        return h * 60 + m;
    };

    const minutesToHourText = (minutes) => {
        if (!minutes || minutes <= 0) return "0h 0m";
        const h = Math.floor(minutes / 60);
        const m = Math.round(minutes % 60);
        return `${h}h ${m}m`;
    };

    const employeeMap = useMemo(() => {
        const map = {};
        employees.forEach((emp) => {
            map[String(emp.employee_id || "").trim()] = emp;
        });
        return map;
    }, [employees]);

    const branchOptions = useMemo(() => {
        const employeeBranchIds = new Set(
            employees
                .map((emp) => String(emp.work_location || "").trim())
                .filter(Boolean)
        );

        return branches.filter((branch) =>
            employeeBranchIds.has(String(branch.branch_id || "").trim())
        );
    }, [branches, employees]);

    const selectedBranchEmployees = useMemo(() => {
        if (selectedBranch === "All") return employees;

        return employees.filter(
            (emp) => String(emp.work_location || "").trim() === selectedBranch
        );
    }, [employees, selectedBranch]);

    const selectedEmployeeIds = useMemo(() => {
        return new Set(
            selectedBranchEmployees.map((emp) =>
                String(emp.employee_id || "").trim()
            )
        );
    }, [selectedBranchEmployees]);

    const attendanceData = useMemo(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const result = {
            Mon: { name: "Mon", present: 0, late: 0, late_minutes: 0 },
            Tue: { name: "Tue", present: 0, late: 0, late_minutes: 0 },
            Wed: { name: "Wed", present: 0, late: 0, late_minutes: 0 },
            Thu: { name: "Thu", present: 0, late: 0, late_minutes: 0 },
            Fri: { name: "Fri", present: 0, late: 0, late_minutes: 0 },
            Sat: { name: "Sat", present: 0, late: 0, late_minutes: 0 },
            Sun: { name: "Sun", present: 0, late: 0, late_minutes: 0 },
        };

        attendanceList.forEach((item) => {
            const empId = String(item.employee_id || "").trim();

            if (selectedBranch !== "All" && !selectedEmployeeIds.has(empId)) {
                return;
            }

            const emp = employeeMap[empId] || {};
            const date = new Date(item.date);

            if (isNaN(date.getTime())) return;

            const dayName = days[date.getDay()];
            const punches = Array.isArray(item.punches) ? item.punches : [];

            const inPunch = punches.find(
                (p) => Number(p.status) === 0 || p.status_text === "IN"
            );

            if (inPunch) {
                result[dayName].present += 1;

                const shiftMin = timeToMinutes(emp.shift_time);
                const punchMin = timeToMinutes(inPunch.time);

                if (shiftMin && punchMin && punchMin > shiftMin) {
                    result[dayName].late += 1;
                    result[dayName].late_minutes += punchMin - shiftMin;
                }
            }
        });

        return [
            result.Mon,
            result.Tue,
            result.Wed,
            result.Thu,
            result.Fri,
            result.Sat,
            result.Sun,
        ];
    }, [
        attendanceList,
        employeeMap,
        selectedBranch,
        selectedEmployeeIds,
    ]);

    const weeklyStats = useMemo(() => {
        const totalPresent = attendanceData.reduce(
            (sum, item) => sum + item.present,
            0
        );

        const totalLate = attendanceData.reduce(
            (sum, item) => sum + item.late,
            0
        );

        const totalLateMinutes = attendanceData.reduce(
            (sum, item) => sum + item.late_minutes,
            0
        );

        const lateAvgMinutes =
            totalLate > 0 ? totalLateMinutes / totalLate : 0;

        return {
            totalPresent,
            totalLate,
            lateAvgTimeText: minutesToHourText(lateAvgMinutes),
        };
    }, [attendanceData]);

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 40
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                duration: 0.6
            }}
            className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-pink-100"
        >

            <div className="flex justify-between items-center mb-5">

                <div>

                    <h3 className="font-bold text-gray-800 text-xl">
                        Employee Attendance
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                        Weekly employee report
                    </p>

                </div>

                <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                    <option value="All">All Branch</option>

                    {branchOptions.map((branch) => (
                        <option
                            key={branch.branch_id}
                            value={branch.branch_id}
                        >
                            {branch.branch_name}
                        </option>
                    ))}
                </select>

            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-pink-50 rounded-2xl p-3 text-center">
                    <p className="text-xs text-gray-500">Present</p>
                    <h4 className="text-lg font-black text-pink-600">
                        {weeklyStats.totalPresent}
                    </h4>
                </div>

                <div className="bg-purple-50 rounded-2xl p-3 text-center">
                    <p className="text-xs text-gray-500">Late</p>
                    <h4 className="text-lg font-black text-purple-600">
                        {weeklyStats.totalLate}
                    </h4>
                </div>

                <div className="bg-orange-50 rounded-2xl p-3 text-center">
                    <p className="text-xs text-gray-500">Late Avg Time</p>
                    <h4 className="text-lg font-black text-orange-600">
                        {weeklyStats.lateAvgTimeText}
                    </h4>
                </div>
            </div>

            <div className="h-[290px]">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart
                        data={attendanceData}
                        barGap={1}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f3f4f6"
                        />

                        <XAxis
                            dataKey="name"
                            tick={{
                                fill: "#6b7280",
                                fontSize: 14,
                                fontWeight: 600
                            }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis hide />

                        <Tooltip
                            cursor={{
                                fill: "#fdf2f8"
                            }}
                            contentStyle={{
                                borderRadius: "16px",
                                border: "none",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)",
                                backgroundColor: "#fff",
                            }}
                        />

                        <Bar
                            dataKey="present"
                            fill="#ec4899"
                            radius={[12, 12, 0, 0]}
                            animationDuration={1200}
                        />

                        <Bar
                            dataKey="late"
                            fill="#a855f7"
                            radius={[12, 12, 0, 0]}
                            animationDuration={1500}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            <div className="flex justify-center gap-8 mt-6 flex-wrap">

                <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-xl">

                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>

                    <span className="text-sm font-medium text-gray-700">
                        Present
                    </span>

                </div>

                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl">

                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>

                    <span className="text-sm font-medium text-gray-700">
                        Late
                    </span>

                </div>

            </div>

        </motion.div>
    );
}