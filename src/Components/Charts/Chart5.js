import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Chart5() {

    const [filter, setFilter] = useState("Today");

    // Complaint Data
    const complaintData = [
        {
            branch: "Nangloi - BKD 14",
            complaints: 245,
        },
        {
            branch: "Budh Vihar - BKD 12",
            complaints: 210,
        },
        {
            branch: "Vikas Nagar - BKD 31",
            complaints: 180,
        },
        {
            branch: "Sultanpuri - BKD 18",
            complaints: 150,
        },
        {
            branch: "Pooth Kalan - BKD 10",
            complaints: 120,
        },
        {
            branch: "Mundka - BKD 15",
            complaints: 90,
        },
    ];

    // High to Low
    const sortedData = [...complaintData].sort(
        (a, b) => b.complaints - a.complaints
    );

    // Dark to Light Colors
    const colors = [
        "bg-pink-600",
        "bg-pink-500",
        "bg-fuchsia-500",
        "bg-purple-400",
        "bg-pink-300",
        "bg-rose-200",
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">

            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-5">
                <div>

                    <h3 className="font-bold text-gray-800 text-xl">
                        Complaints
                    </h3>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400 mt-1">
                            Branch Wise Complaints
                        </p>

                        <button
                            className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg shadow-sm transition"
                        >
                            More
                        </button>
                    </div>

                </div>

                <div className="items-center gap-2">

                    <select
                        className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        <option>All Branch</option>
                        <option>Delhi</option>
                        <option>Mumbai</option>
                        <option>Bangalore</option>
                    </select>


                </div>

            </div>


            {/* Complaint List */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto">

                {sortedData.slice(0, 6).map((item, index) => (

                    <motion.div
                        key={index}
                        className="flex items-center justify-between"
                        initial={{
                            opacity: 0,
                            x: -40
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.15
                        }}
                    >

                        {/* Left */}
                        <div className="flex items-center gap-3">

                            {/* Animated Circle */}
                            <motion.div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] ${colors[index]}`}
                                initial={{
                                    scale: 0
                                }}
                                animate={{
                                    scale: 1
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.2
                                }}
                            >
                                ↗
                            </motion.div>

                            {/* Branch */}
                            <p className="text-[15px] text-gray-700 font-medium">
                                {item.branch}
                            </p>

                        </div>

                        {/* Animated Count */}
                        <motion.div
                            className={`${colors[index]} px-4 py-2 rounded-xl min-w-[120px] text-center`}
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
                        >
                            <p className="font-bold text-white">
                                {item.complaints}
                            </p>
                        </motion.div>

                    </motion.div>

                ))}

            </div>

        </div>
    );
}