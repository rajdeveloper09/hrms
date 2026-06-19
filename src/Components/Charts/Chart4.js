import React, { useEffect, useMemo, useState } from "react";
import {
    Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { motion } from "framer-motion";
import {API_BASE_URL} from "../../config/api";

export default function Chart4() {
    

    const COLORS = ["#ec4899", "#3b82f6", "#22c55e", "#f97316", "#a855f7"];

    const [selectedBranchRole, setSelectedBranchRole] = useState("All");
    const [roleDataByBranch, setRoleDataByBranch] = useState({});
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/get_employee`);
            const json = await res.json();

            if (json.status === true && Array.isArray(json.data)) {
                const grouped = {};

                json.data.forEach((emp) => {
                    const branch = emp.work_location || "Unknown";
                    const designation = emp.designation || "Unknown";

                    if (!grouped[branch]) grouped[branch] = {};

                    grouped[branch][designation] =
                        (grouped[branch][designation] || 0) + 1;
                });

                const finalData = {};

                Object.keys(grouped).forEach((branch) => {
                    finalData[branch] = Object.keys(grouped[branch]).map((key) => ({
                        name: key,
                        value: grouped[branch][key],
                    }));
                });

                setRoleDataByBranch(finalData);
                setBranches(Object.keys(finalData));
            }
        } catch (error) {
            console.error("Employee API fetch error:", error);
        }
    };

   const getAllBranchRoleData = useCallback(() => {
        const result = {};

        Object.values(roleDataByBranch).forEach((branch) => {
            branch.forEach((item) => {
                result[item.name] = (result[item.name] || 0) + item.value;
            });
        });

        return Object.keys(result).map((key) => ({
            name: key,
            value: result[key],
        }));
    });

    useMemo(() => {
   return getAllBranchRoleData();
}, [getAllBranchRoleData]);

    const roleData = useMemo(() => {
        const data =
            selectedBranchRole === "All"
                ? getAllBranchRoleData()
                : roleDataByBranch[selectedBranchRole] || [];

        return [...data].sort((a, b) => b.value - a.value);
    }, [selectedBranchRole, roleDataByBranch]);

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">

            <div className="flex items-center justify-between gap-3 mb-5">
                <div>

                    <h3 className="font-bold text-gray-800 text-xl">
                        Staff Distribution
                    </h3>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400 mt-1">
                            Employee Wise Post
                        </p>

                        <button
                            className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg shadow-sm transition mt-1"
                        >
                            More
                        </button>
                    </div>

                </div>

                <div className="items-center gap-2">

                    <select
                        value={selectedBranchRole}
                        onChange={(e) => setSelectedBranchRole(e.target.value)}
                        className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        <option value="All">All Branch</option>
                        {branches.map((branch) => (
                            <option key={branch} value={branch}>
                                {branch}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-5">

                <div className="w-full md:w-1/2">

                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>

                            <Pie
                                data={roleData}
                                dataKey="value"
                                outerRadius={82}
                                innerRadius={60}
                                paddingAngle={-20}
                                cornerRadius={10}
                            >
                                {roleData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />

                        </PieChart>
                    </ResponsiveContainer>

                </div>

                <div className="w-full md:w-1/2">

                    <div className="space-y-2 max-h-[360px]">

                        {roleData.slice(0, 7).map((r, i) => (

                            <motion.div
                                key={i}
                                className="flex justify-between items-center bg-gray-50 p-2 rounded-xl"
                                initial={{
                                    opacity: 0,
                                    y: 40
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: i * 0.15
                                }}
                                whileHover={{
                                    scale: 1.02
                                }}
                            >

                                <div className="flex items-center gap-2">

                                    <motion.span
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                COLORS[i % COLORS.length],
                                        }}
                                        initial={{
                                            scale: 0
                                        }}
                                        animate={{
                                            scale: 1
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: i * 0.2
                                        }}
                                    />

                                    <p className="text-sm text-gray-700">
                                        {r.name}
                                    </p>

                                </div>

                                <motion.p
                                    className="font-bold text-gray-800"
                                    initial={{
                                        opacity: 0
                                    }}
                                    animate={{
                                        opacity: 1
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.2
                                    }}
                                >
                                    {r.value}
                                </motion.p>

                            </motion.div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    )
}