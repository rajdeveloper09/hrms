import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Chart7() {

    const [filter, setFilter] = useState("This Week");
    const [sort, setSort] = useState("desc");

    const rewardData = [
        { emp: "Amit Kumar", emp_id: "BV25", branch: "BKD21", post: "Manager", lastSalary: 10000, increment: 2500 },
        { emp: "Prashant Chauhan", emp_id: "HO129", branch: "HO", post: "Developer", lastSalary: 10000, increment: 1500 },
        { emp: "Rahul Rana", emp_id: "HO110", branch: "HO", post: "Cashier", lastSalary: 10000, increment: 1800 },
        { emp: "Kaushal Kumar", emp_id: "MN12", branch: "MN", post: "TL", lastSalary: 10000, increment: 2000 },
    ];

    // sort data
    const sortedData = [...rewardData].sort((a, b) =>
        sort === "desc" ? b.increment - a.increment : a.increment - b.increment
    );

    const maxValue = Math.max(...rewardData.map((i) => i.increment));

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">

                <div>

                    <h3 className="font-bold text-gray-800 text-xl">
                        Increment
                    </h3>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400 mt-1">
                            Employee Increment
                        </p>

                        <button
                            className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg shadow-sm transition"
                        >
                            More
                        </button>
                    </div>

                </div>
                <div className="flex items-center gap-2">

                    {/* Filter */}
                    <select
                        increment={filter}
                        onChange={(e) => setFilter(e.target.increment)}
                        className="text-xs border rounded-xl px-3 py-2 bg-pink-50"
                    >
                        <option>All Month</option>
                        <option>April</option>
                        <option>May</option>
                    </select>

                    {/* Sort Button */}
                    <button
                        onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
                        className="p-2 bg-pink-100 rounded-lg hover:bg-pink-200"
                    >
                        ⇅
                    </button>

                </div>

            </div>

            {/* List */}
            <div className="space-y-3 max-h-[320px] pr-1">

                {sortedData.slice(0,4).map((item, index) => {

                    const percent = (item.increment / maxValue) * 100;
                    const getBarColor = (index) => {
                        if (index === 0) return "from-green-500 to-green-300"; // 🥇 Top
                        if (index === 1) return "from-green-400 to-lime-300";   // 🥈 Second
                        if (index === 2) return "from-lime-400 to-yellow-300";  // 🥉 Third
                        return "from-pink-300 to-rose-300";                     // Others
                    };

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-pink-50 p-3 rounded-2xl border border-pink-100"
                        >

                            {/* Top row */}
                            <div className="flex justify-between items-center mb-2">

                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-black mt-1">
                                        {item.emp} - {item.emp_id}
                                    </p>

                                    <button
                                        className="text-xs bg-pink-200 border border-pink-300 hover:bg-pink-600 text-pink-500 px-3 py-1 rounded-lg shadow-sm transition"
                                    >
                                        {item.post}
                                    </button>
                                </div>

                                <p className="font-bold text-gray-800">
                                    ₹{item.increment.toLocaleString("en-IN")}
                                </p>

                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">

                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 0.6 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${getBarColor(index)}`}
                                />

                            </div>

                        </motion.div>
                    );
                })}

            </div>

        </div>
    );
}