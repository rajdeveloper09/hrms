import React from "react";
import { motion } from "framer-motion";

export default function Chart6() {

    const trafficData = [

        {
            name: "Total Bonus",
            value: 201524,
            color: "bg-rose-200",
        },
        {
            name: "Total Increment",
            value: 136254,
            color: "bg-rose-50",
        },
        {
            name: "Total Reward",
            value: 465825,
            color: "bg-pink-200",
        },
        {
            name: "Total Penalty",
            value: 123654,
            color: "bg-pink-100",
        },
        {
            name: "Total Salary",
            value: 11212500,
            color: "bg-rose-300",
        },

    ];
    // Sorted Data (High to Low)
    const sortedTrafficData = [...trafficData].sort(
        (a, b) => b.value - a.value
    );

    // Total Sum (same rahega)
    const totalValue = sortedTrafficData.reduce(
        (acc, item) => acc + item.value,
        0
    );

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">

            <div className="flex items-center justify-between gap-3 mb-5">

                <div>

                    <h3 className="font-bold text-gray-800 text-xl">
                        Salary Report
                    </h3>

                    <div className="flex items-center gap-2">

                        <p className="text-sm text-gray-400 mt-1">
                            Employee Salary Brackup
                        </p>
{/* 
                        <button
                            className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg shadow-sm transition"
                        >
                            View More
                        </button> */}

                    </div>

                </div>

                <div className="items-center gap-2">

                    <select
                        className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        <option>Select Month</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                    </select>

                </div>

            </div>

            {/* Animated Top Progress */}
            <div className="flex overflow-hidden rounded-2xl h-[25px] mb-10 bg-gray-100">

                {sortedTrafficData.map((item, index) => {

                    // ✅ Convert to %
                    const percentage =
                        (item.value / totalValue) * 100;

                    return (

                        <motion.div
                            key={index}
                            className={`${item.color} h-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{
                                duration: 1,
                                delay: index * 0.2,
                                ease: "easeOut"
                            }}
                        />

                    );
                })}

            </div>

            {/* Animated List */}
            <div className="space-y-4">

                {sortedTrafficData.map((item, index) => {

                    // ✅ Percentage
                    const percentage =
                        ((item.value / totalValue) * 100).toFixed(1);

                    return (

                        <motion.div
                            key={index}
                            className="flex items-center justify-between"
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.15
                            }}
                        >

                            {/* Left */}
                            <div className="flex items-center gap-4">

                                <motion.div
                                    className={`w-6 h-6 rounded-lg ${item.color}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.2
                                    }}
                                />

                                <div>

                                    <p className="text-[15px] text-gray-700 font-medium">
                                        {item.name}
                                    </p>

                                    {/* ✅ Percentage */}
                                    <p className="text-xs text-gray-400">
                                        {percentage}%
                                    </p>

                                </div>

                            </div>

                            {/* Right */}
                            <motion.p
                                className="text-[16px] font-bold text-black"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.2
                                }}
                            >
                                ₹{item.value.toLocaleString("en-IN")}
                            </motion.p>

                        </motion.div>

                    );
                })}

            </div>

        </div>
    );
}