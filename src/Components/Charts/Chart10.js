import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  AlertTriangle,
  ShieldAlert,
  Clock3,
  TrendingUp,
} from "lucide-react";

export default function Chart10() {
  // Graph data
  const data = [
    { name: "Jan", value: 200 },
    { name: "Feb", value: 500 },
    { name: "Mar", value: 1700 },
    { name: "Apr", value: 1500 },
    { name: "May", value: 2200 },
    { name: "Jun", value: 2100 },
    { name: "Jul", value: 3000 },
    { name: "Aug", value: 2800 },
    { name: "Sep", value: 4200 },
    { name: "Oct", value: 4000 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[35px] shadow-2xl overflow-hidden border border-slate-200">

        {/* TOP GRAPH */}
        <div className="h-[320px] p-4 relative">

          {/* Recommendation Badge */}
          <div className="absolute top-5 right-5 z-10 bg-green-100 text-green-700 px-4 py-2 rounded-2xl shadow-md border border-green-200">
            <div className="text-xs font-medium">
              Recommendation
            </div>

            <div className="flex items-center gap-2 mt-1">
              <TrendingUp size={18} />
              <span className="font-bold text-lg">
                ₹2500 (8%)
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis hide />

              <YAxis
                ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={5}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-3 gap-3 px-4 pb-5">

          {/* Complaint */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-3 text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="text-red-500" size={20} />
            </div>

            <div className="text-xs text-slate-500">
              Complaint
            </div>

            <div className="text-2xl font-bold text-red-600 mt-1">
              5
            </div>
          </div>

          {/* Penalty */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 text-center">
            <div className="flex justify-center mb-2">
              <ShieldAlert className="text-orange-500" size={20} />
            </div>

            <div className="text-xs text-slate-500">
              Penalty
            </div>

            <div className="text-2xl font-bold text-orange-600 mt-1">
              3
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-3 text-center">
            <div className="flex justify-center mb-2">
              <Clock3 className="text-violet-500" size={20} />
            </div>

            <div className="text-xs text-slate-500">
              Attendance
            </div>

            <div className="text-lg font-bold text-violet-600 mt-1">
              15 Min
            </div>

            <div className="text-[10px] text-slate-400">
              Avg Late
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-2 border-t border-slate-200">

          {/* Last Increment */}
          <div className="p-5 border-r border-slate-200">
            <div className="text-sm text-slate-500">
              Last Increment
            </div>

            <div className="mt-3 text-3xl font-bold text-slate-800">
              ₹2000
            </div>

            <div className="mt-1 inline-flex bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
              10%
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-5">
            <div className="text-sm text-slate-500">
              Recommendation
            </div>

            <div className="mt-3 text-3xl font-bold text-green-600">
              ₹2500
            </div>

            <div className="mt-1 inline-flex bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
              8%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}