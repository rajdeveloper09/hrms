import React from "react";
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

export default function Chart1() {

    const attendanceData = [
        { name: "Mon", present: 70, late: 25, leave: 5 },
        { name: "Tue", present: 77, late: 20, leave: 3 },
        { name: "Wed", present: 70, late: 20, leave: 10 },
        { name: "Thu", present: 90, late: 5, leave: 5 },
        { name: "Fri", present: 88, late: 7, leave: 5 },
        { name: "Sat", present: 88, late: 7, leave: 5 },
        { name: "Sun", present: 88, late: 7, leave: 5 },
    ];

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

            {/* Header */}
            <div className="flex justify-between items-center mb-5">

                <div>

                    <h3 className="font-bold text-gray-800 text-xl">
                        Employee Attendance
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                        Weekly employee report
                    </p>

                </div>

                {/* Dropdown */}
                <select
                    className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                    <option>All Branch</option>
                    <option>Delhi</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Hyderabad</option>
                </select>

            </div>

            {/* Chart */}
            <div className="h-[260px]">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart
                        data={attendanceData}
                        barGap={5}
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
                                fontSize: 12,
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

                        {/* Present */}
                        <Bar
                            dataKey="present"
                            fill="#ec4899"
                            radius={[12, 12, 0, 0]}
                            animationDuration={1200}
                        />

                        {/* Late */}
                        <Bar
                            dataKey="late"
                            fill="#a855f7"
                            radius={[12, 12, 0, 0]}
                            animationDuration={1500}
                        />

                        {/* Leave */}
                        <Bar
                            dataKey="leave"
                            fill="#fb7185"
                            radius={[12, 12, 0, 0]}
                            animationDuration={1800}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* Legend */}
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

                <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl">

                    <span className="w-3 h-3 rounded-full bg-rose-400"></span>

                    <span className="text-sm font-medium text-gray-700">
                        Leave
                    </span>

                </div>

            </div>

        </motion.div>
    );
}