import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../config/api";

export default function Chart5() {
    const [selectedBranch, setSelectedBranch] = useState("All");
    const [complaints, setComplaints] = useState([]);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [complaintRes, branchRes] = await Promise.all([
                fetch(`${API_BASE_URL}/emp_complaints`),
                fetch(`${API_BASE_URL}/branches`),
            ]);

            const complaintJson = await complaintRes.json();
            const branchJson = await branchRes.json();

            setComplaints(
                complaintJson.status === true && Array.isArray(complaintJson.data)
                    ? complaintJson.data
                    : []
            );

            setBranches(
                branchJson.status === true && Array.isArray(branchJson.data)
                    ? branchJson.data
                    : []
            );
        } catch (error) {
            console.error("Complaint API Error:", error);
            setComplaints([]);
            setBranches([]);
        }
    };

    const branchMap = useMemo(() => {
        const map = {};

        branches.forEach((branch) => {
            map[String(branch.branch_id || "").trim()] =
                branch.branch_name || branch.branch_id;
        });

        return map;
    }, [branches]);

    const branchOptions = useMemo(() => {
        return [
            ...new Set(
                complaints
                    .map((item) => String(item.branch_id || "").trim())
                    .filter(Boolean)
            ),
        ];
    }, [complaints]);

    const complaintData = useMemo(() => {
        const result = {};

        complaints.forEach((item) => {
            const branchId = String(item.branch_id || "").trim();

            if (!branchId) return;

            if (selectedBranch !== "All" && branchId !== selectedBranch) {
                return;
            }

            result[branchId] = (result[branchId] || 0) + 1;
        });

        return Object.keys(result).map((branchId) => ({
            branch: branchMap[branchId] || branchId,
            branch_id: branchId,
            complaints: result[branchId],
        }));
    }, [complaints, selectedBranch, branchMap]);

    const sortedData = useMemo(() => {
        return [...complaintData].sort(
            (a, b) => b.complaints - a.complaints
        );
    }, [complaintData]);

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

            <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                    <h3 className="font-bold text-gray-800 text-xl">
                        Branch Complaints
                    </h3>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400 mt-1">
                            Branch Wise Complaints
                        </p>

                        <button className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg shadow-sm transition mt-1">
                            More
                        </button>
                    </div>
                </div>

                <div className="items-center gap-2">
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        <option value="All">All Branch</option>

                        {branchOptions.map((branchId) => (
                            <option key={branchId} value={branchId}>
                                {branchMap[branchId] || branchId}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-4 max-h-[350px]">

                {sortedData.slice(0, 6).map((item, index) => (
                    <motion.div
                        key={item.branch_id}
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
                        className="flex items-center justify-between"
                    >

                        <div className="flex items-center gap-3">
                            <motion.div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] ${
                                    colors[index % colors.length]
                                }`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.2
                                }}
                            >
                                ↗
                            </motion.div>

                            <p className="text-[15px] text-gray-700 font-medium">
                                {item.branch}
                            </p>
                        </div>

                        <motion.div
                            className={`${
                                colors[index % colors.length]
                            } px-4 py-2 rounded-xl min-w-[120px] text-center`}
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