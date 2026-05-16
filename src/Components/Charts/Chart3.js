import React from 'react'
import { useState } from "react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
 LineChart, Line, CartesianGrid
} from "recharts";

export default function Chart3() {

  const complaintComparisonData = [
    { month: "Jan", Delhi: 40, Mumbai: 35, Bangalore: 30 },
    { month: "Feb", Delhi: 55, Mumbai: 45, Bangalore: 50 },
    { month: "Mar", Delhi: 30, Mumbai: 25, Bangalore: 40 },
    { month: "Apr", Delhi: 70, Mumbai: 60, Bangalore: 65 },
    { month: "May", Delhi: 50, Mumbai: 55, Bangalore: 60 },
    { month: "Jun", Delhi: 50, Mumbai: 45, Bangalore: 50 },
  ];
  
  const [selectedBranch, setSelectedBranch] = useState("All");
  const branches = ["Delhi", "Mumbai", "Bangalore"];
  const branchTotals = branches.map((b) => ({
    name: b,
    total: complaintComparisonData.reduce((acc, item) => acc + item[b], 0),
  }));

  return (
     <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">
                Employee Transfer
              </h3>
              <select
                className="text-xs border border-gray-300 rounded-lg px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="All">All Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={complaintComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                {(selectedBranch === "All" || selectedBranch === "Delhi") && (
                  <Line type="monotone" dataKey="Delhi" stroke="#3b82f6" strokeWidth={2} />
                )}
                {(selectedBranch === "All" || selectedBranch === "Mumbai") && (
                  <Line type="monotone" dataKey="Mumbai" stroke="#10b981" strokeWidth={2} />
                )}
                {(selectedBranch === "All" || selectedBranch === "Bangalore") && (
                  <Line type="monotone" dataKey="Bangalore" stroke="#f59e0b" strokeWidth={2} />
                )}
              </LineChart>
            </ResponsiveContainer>

            {/* Bottom Branch Summary */}
            <div className="mt-4 overflow-x-auto whitespace-nowrap flex gap-4">
              {branchTotals.map((b) => (
                <div
                  key={b.name}
                  className="min-w-[auto] bg-gray-50 rounded-xl p-3 shadow-sm"
                >
                  <p className="text-sm text-gray-600">{b.name}-{b.total}</p>
                </div>
              ))}
            </div>
          </div>
  )
}