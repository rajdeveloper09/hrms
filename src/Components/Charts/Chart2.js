import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";


export default function Chart2() {

    const [branch, setBranch] = useState("All");
    const [post, setPost] = useState("All");
    const [month, setMonth] = useState("All");

    const payrollData = [
        {
            name: "Aman Kumar",
            branch: "Moti Nagar - BKD14",
            post: "Manager",
            month: "May",
            salary: 45000,
            penalty: 2000,
            status: "Panelty"
        },
        {
            name: "Ravi Sharma",
            branch: "Mundka - BKD25",
            post: "Cashier",
            month: "May",
            salary: 25000,
            penalty: 5000,
            status: "Panelty"
        },
        {
            name: "Neha Singh",
            branch: "Nangloi BKD14",
            post: "Accountant",
            month: "April",
            salary: 35000,
            penalty: 1000,
            status: "Panelty"
        },
        {
            name: "Neha Singh",
            branch: "Sultanpuri - BKD13",
            post: "Accountant",
            month: "April",
            salary: 35000,
            penalty: 1000,
            status: "Panelty"
        },
        {
            name: "Ravi Sharma",
            branch: "Mundka - BKD25",
            post: "Cashier",
            month: "May",
            salary: 25000,
            penalty: 5000,
            status: "Panelty"
        },
        {
            name: "Neha Singh",
            branch: "Nangloi BKD14",
            post: "Accountant",
            month: "April",
            salary: 35000,
            penalty: 1000,
            status: "Panelty"
        },
        {
            name: "Neha Singh",
            branch: "Sultanpuri - BKD13",
            post: "Accountant",
            month: "April",
            salary: 35000,
            penalty: 1000,
            status: "Panelty"
        }
    ];

    const filteredData = useMemo(() => {
        return payrollData
            .filter((emp) => {
                const branchMatch = branch === "All" || emp.branch === branch;
                const postMatch = post === "All" || emp.post === post;
                const monthMatch = month === "All" || emp.month === month;

                return branchMatch && postMatch && monthMatch;
            })
            .sort((a, b) => b.penalty - a.penalty);
    }, [branch, post, month]);

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-5 flex flex-col overflow-hidden">

            {/* Header */}
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

                    {/* Post */}
                    <select
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                        className="text-xs border rounded-xl px-3 py-2 bg-pink-50"
                    >
                        <option value="All">All Post</option>
                        <option value="Manager">Manager</option>
                        <option value="Cashier">Cashier</option>
                        <option value="Accountant">Accountant</option>
                    </select>

                    {/* Month */}
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="text-xs border rounded-xl px-3 py-2 bg-pink-50"
                    >
                        <option value="All">All Month</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                    </select>

                </div>

            </div>

            {/* Employee List */}
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

                        {/* Left */}
                        <div className="flex items-center gap-3">

                            {/* Avatar */}
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
                                {emp.name[0]}
                            </motion.div>

                            {/* Info */}
                            <div>

                                <p className="text-sm font-semibold text-gray-800 group-hover:text-pink-600 transition">
                                    {emp.name}
                                </p>

                                <div className="flex items-center gap-2 mt-1">

                                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>

                                    <p className="text-xs text-gray-500">
                                        {emp.branch}
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Right */}
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