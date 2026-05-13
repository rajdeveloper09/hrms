import React from "react";
import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

import {
  AlertTriangle,
  ShieldAlert,
  Clock3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export const Chart10 = () => {

  // LAST + RECOMMENDED
  const lastIncrement = 2000;

  // CHANGE THIS VALUE
  const recommendationAmount = 2500;

  // CHECK GROWTH
  const isGrowth =
    recommendationAmount >= lastIncrement;

  // GRAPH DATA
  const data = [
    { name: "Jan", value: 1200 },
    { name: "Feb", value: 1400 },
    { name: "Mar", value: 1600 },
    { name: "Apr", value: 1700 },
    { name: "May", value: 1900 },
    { name: "Jun", value: 2100 },
    { name: "Jul", value: 2200 },
    { name: "Aug", value: 2350 },
    { name: "Sep", value: 2450 },
    { name: "Oct", value: recommendationAmount },
  ];

  // PERFORMANCE %
  const growthPercent = Math.round(
    (
      (recommendationAmount - lastIncrement) /
      lastIncrement
    ) * 100
  );

  // CARD MOTION
  const cardMotion = {
    hidden: {
      opacity: 0,
      y: 60,
    },

    visible: (i) => ({
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.5,
        delay: i * 0.12,
      },
    }),
  };

  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 70,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.6,
      }}

      className="w-full bg-white rounded-[35px] shadow-2xl overflow-hidden border border-rose-100 mt-3"
    >

      <div className="grid grid-cols-12">

        {/* LEFT SIDE */}
        <div className="col-span-12 xl:col-span-4 p-4 border-r border-rose-100 flex flex-col">

          {/* TOP */}
          <div>

            {/* HEADING */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.5,
              }}

              className="flex items-center justify-between mb-4"
            >

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  Performance
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  AI Recommendation Analysis
                </p>

              </div>

              {/* PERFORMANCE BADGE */}
              <div
                className={`
                  px-3 py-2 rounded-2xl border shadow-sm
                  ${
                    isGrowth
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : "bg-rose-100 text-rose-700 border-rose-200"
                  }
                `}
              >

                <div className="flex items-center gap-2">

                  {isGrowth ? (
                    <TrendingUp size={18} />
                  ) : (
                    <TrendingDown size={18} />
                  )}

                  <span className="font-bold text-sm">
                    {growthPercent > 0 ? "+" : ""}
                    {growthPercent}%
                  </span>

                </div>

              </div>

            </motion.div>

            {/* INFO CARDS */}
            <div className="grid grid-cols-3 gap-3 mt-2">

              {/* COMPLAINT */}
              <motion.div
                custom={0}
                variants={cardMotion}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.05,
                }}

                className="bg-rose-50 border border-rose-100 rounded-2xl p-3 text-center shadow-sm"
              >

                <div className="flex justify-center mb-2">
                  <AlertTriangle
                    className="text-rose-500"
                    size={20}
                  />
                </div>

                <div className="text-xs text-slate-500">
                  Complaint
                </div>

                <div className="text-[14px] font-bold text-rose-600 mt-1">
                  5
                </div>

              </motion.div>

              {/* PENALTY */}
              <motion.div
                custom={1}
                variants={cardMotion}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.05,
                }}

                className="bg-pink-50 border border-pink-100 rounded-2xl p-3 text-center shadow-sm"
              >

                <div className="flex justify-center mb-2">
                  <ShieldAlert
                    className="text-pink-500"
                    size={20}
                  />
                </div>

                <div className="text-xs text-slate-500">
                  Penalty
                </div>

                <div className="text-[14px] font-bold text-pink-600 mt-1">
                  3
                </div>

              </motion.div>

              {/* ATTENDANCE */}
              <motion.div
                custom={2}
                variants={cardMotion}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.05,
                }}

                className="bg-red-50 border border-red-100 rounded-2xl p-3 text-center shadow-sm"
              >

                <div className="flex justify-center mb-2">
                  <Clock3
                    className="text-red-500"
                    size={20}
                  />
                </div>

                <div className="text-xs text-slate-500">
                  Attendance
                </div>

                <div className="text-[14px] font-bold text-red-600 mt-1">
                  15 Min
                </div>

                <div className="text-[10px] text-slate-400">
                  Avg Late
                </div>

              </motion.div>

            </div>

          </div>

          {/* BOTTOM */}
          <div className="grid grid-cols-2 gap-3 mt-5">

            {/* LAST INCREMENT */}
            <motion.div
              initial={{
                opacity: 0,
                y: 60,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.5,
                delay: 0.4,
              }}

              whileHover={{
                y: -5,
              }}

              className="bg-rose-50 rounded-2xl p-4 border border-rose-100 text-center shadow-sm"
            >

              <div className="text-[12px] text-slate-500">
                Last Increment
              </div>

              <div className="mt-2 text-3xl font-bold text-rose-700">
                ₹{lastIncrement}
              </div>

              <div className="mt-2 inline-flex bg-rose-100 text-rose-700 text-xs px-3 py-1 rounded-full">
                Current
              </div>

            </motion.div>

            {/* RECOMMENDATION */}
            <motion.div
              initial={{
                opacity: 0,
                y: 60,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.5,
                delay: 0.55,
              }}

              whileHover={{
                y: -5,
              }}

              className={`
                rounded-2xl p-4 border text-center shadow-sm
                ${
                  isGrowth
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-pink-50 border-pink-100"
                }
              `}
            >

              <div className="text-[12px] text-slate-500">
                Recommendation
              </div>

              <div
                className={`
                  mt-2 text-3xl font-bold
                  ${
                    isGrowth
                      ? "text-emerald-600"
                      : "text-pink-600"
                  }
                `}
              >
                ₹{recommendationAmount}
              </div>

              <div
                className={`
                  mt-2 inline-flex text-xs px-3 py-1 rounded-full
                  ${
                    isGrowth
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-pink-100 text-pink-700"
                  }
                `}
              >
                {growthPercent > 0 ? "+" : ""}
                {growthPercent}%
              </div>

            </motion.div>

          </div>

        </div>

        {/* RIGHT CHART */}
        <motion.div
          initial={{
            opacity: 0,
            x: 80,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            duration: 0.7,
          }}

          className="col-span-12 xl:col-span-8 p-6"
        >

          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Increment Growth
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Employee Performance Trend
              </p>

            </div>

            <div
              className={`
                border rounded-2xl px-4 py-2
                ${
                  isGrowth
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-rose-50 border-rose-100"
                }
              `}
            >

              <div className="text-xs text-slate-500">
                Recommended
              </div>

              <div
                className={`
                  text-lg font-bold
                  ${
                    isGrowth
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }
                `}
              >
                ₹{recommendationAmount}
              </div>

            </div>

          </div>

          {/* CHART */}
          <div className="h-[250px] w-full">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={data}>

                <defs>

                  {/* RED */}
                  <linearGradient
                    id="downGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#e11d48"
                      stopOpacity={0.45}
                    />

                    <stop
                      offset="95%"
                      stopColor="#e11d48"
                      stopOpacity={0.05}
                    />

                  </linearGradient>

                  {/* GREEN */}
                  <linearGradient
                    id="upGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#16a34a"
                      stopOpacity={0.45}
                    />

                    <stop
                      offset="95%"
                      stopColor="#16a34a"
                      stopOpacity={0.05}
                    />

                  </linearGradient>

                </defs>

                {/* REFERENCE */}
                <ReferenceLine
                  y={recommendationAmount}
                  stroke={
                    isGrowth
                      ? "#16a34a"
                      : "#ec4899"
                  }
                  strokeDasharray="6 6"
                  label={{
                    value: `Recommended ₹${recommendationAmount}`,
                    position: "insideTopRight",
                    fill: isGrowth
                      ? "#16a34a"
                      : "#db2777",
                    fontSize: 12,
                  }}
                />

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                {/* AREA */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={
                    isGrowth
                      ? "#16a34a"
                      : "#e11d48"
                  }
                  strokeWidth={5}
                  fill={
                    isGrowth
                      ? "url(#upGradient)"
                      : "url(#downGradient)"
                  }
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

      </div>

    </motion.div>
  );
};