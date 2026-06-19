import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../config/api";

export default function Chart2() {
    const [branch, setBranch] = useState("All");
    const [post, setPost] = useState("All");
    const [month, setMonth] = useState("All");

    const [payrollData, setPayrollData] = useState([]);

    const getMonthName = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleString("en-US", { month: "long" });
    };

    const cleanId = (value) => {
        return String(value || "").trim().toUpperCase();
    };


    const fetchPenaltyData = useCallback(async () => {
        try {
            const [penaltyRes, employeeRes] = await Promise.all([
                fetch(`${API_BASE_URL}/emp_penalties`),
                fetch(`${API_BASE_URL}/get_employee`)
            ]);

            const penaltyJson = await penaltyRes.json();
            const employeeJson = await employeeRes.json();

            const employees =
                (employeeJson.success === true || employeeJson.status === true) &&
                    Array.isArray(employeeJson.data)
                    ? employeeJson.data
                    : [];

            const employeeMap = {};

            employees.forEach((emp) => {
                const employeeId = cleanId(emp.employee_id);
                if (employeeId) {
                    employeeMap[employeeId] = emp;
                }
            });

            if (penaltyJson.success === true && Array.isArray(penaltyJson.data)) {
                const formattedData = penaltyJson.data.map((item) => {
                    const empId = cleanId(item.emp_id);
                    const emp = employeeMap[empId] || {};

                    return {
                        empId: item.emp_id || "",
                        name: item.emp_name || emp.full_name || "",
                        branch: item.branch_id || emp.work_location || "",
                        post: emp.designation || item.designation || "No Designation",
                        month: getMonthName(item.penalty_date || item.created_at),
                        salary: Number(emp.basic_salary || 0),
                        penalty: Number(item.penalty_amount || 0),
                        status: item.status || "Pending"
                    };
                });

                setPayrollData(formattedData);
            }
        } catch (error) {
            console.error("Penalty API Error:", error);
        }
    });

    useEffect(() => {
        fetchPenaltyData();
    }, [fetchPenaltyData]);

    // const branchOptions = useMemo(() => {
    //     return [...new Set(payrollData.map((emp) => emp.branch).filter(Boolean))];
    // }, [payrollData]);

    const postOptions = useMemo(() => {
        return [...new Set(payrollData.map((emp) => emp.post).filter(Boolean))];
    }, [payrollData]);

    const monthOptions = useMemo(() => {
        return [...new Set(payrollData.map((emp) => emp.month).filter(Boolean))];
    }, [payrollData]);

    const filteredData = useMemo(() => {
        return payrollData
            .filter((emp) => {
                const branchMatch = branch === "All" || emp.branch === branch;
                const postMatch = post === "All" || emp.post === post;
                const monthMatch = month === "All" || emp.month === month;

                return branchMatch && postMatch && monthMatch;
            })
            .sort((a, b) => b.penalty - a.penalty);
    }, [branch, post, month, payrollData]);

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-5 flex flex-col overflow-hidden">

            <div className="flex items-center justify-between mb-5">

                <div>
                    <h3 className="font-bold text-gray-800 text-xl">
                        Penalty
                    </h3>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400 mt-1">
                            Employees Penalty
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">

                    <select
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                        className="text-xs border rounded-xl px-3 py-2 bg-pink-50"
                    >
                        <option value="All">All Post</option>
                        {postOptions.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="text-xs border rounded-xl px-3 py-2 bg-pink-50"
                    >
                        <option value="All">All Month</option>
                        {monthOptions.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            <div className="space-y-2 pr-1 flex-1">

                {filteredData.slice(0, 5).map((emp, index) => (

                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{
                            once: true,
                            amount: 0.3
                        }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.12
                        }}
                        className="group flex justify-between items-center bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-fuchsia-100 transition-all duration-300 p-2 rounded-2xl border border-pink-100 shadow-sm"
                    >

                        <div className="flex items-center gap-3">

                            <motion.div
                                initial={{
                                    scale: 0
                                }}
                                animate={{
                                    scale: 1
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.15
                                }}
                                className="w-11 h-11 rounded-2xl bg-gradient-to-t from-pink-400 to-rose-500 flex items-center justify-center text-sm font-bold text-white shadow-md"
                            >
                                {emp.name ? emp.name[0] : "?"}
                            </motion.div>

                            <div>

                                <p className="text-sm font-semibold text-gray-800 group-hover:text-pink-600 transition">
                                    {emp.name}
                                </p>

                                <div className="flex items-center gap-2 mt-1">

                                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>

                                    <p className="text-xs text-gray-500">
                                        {emp.branch} - {emp.empId}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="text-right">

                            <motion.p
                                initial={{
                                    opacity: 0,
                                    scale: 0.8
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.2
                                }}
                                className="text-base font-bold text-gray-800"
                            >
                                ₹{emp.penalty.toLocaleString()}
                            </motion.p>

                            <span
                                className={`inline-block mt-1 text-[11px] px-3 py-1 rounded-full font-medium shadow-sm ${emp.status === "Panelty"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-red-100 text-red-500"
                                    }`}
                            >
                                {emp.post}
                            </span>

                        </div>

                    </motion.div>

                ))}

            </div>

        </div>
    );
}