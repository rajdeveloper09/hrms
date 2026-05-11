import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  CreditCard,
  Clock3,
  BadgeIndianRupee,
  CalendarDays,
} from "lucide-react";

export default function Chart6() {

  // Salary Type Cards
  const salaryCards = [
    {
      title: "Online Salary",
      amount: "₹85,41,230",
      icon: <Wallet size={18} />,
      bg: "from-green-50 to-green-100",
      iconBg: "bg-green-500",
    },
    {
      title: "Cheque Salary",
      amount: "₹12,75,600",
      icon: <CreditCard size={18} />,
      bg: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      title: "Hold Salary",
      amount: "₹3,42,150",
      icon: <Clock3 size={18} />,
      bg: "from-yellow-50 to-yellow-100",
      iconBg: "bg-yellow-500",
    },
    {
      title: "Cash Salary",
      amount: "₹2,53,400",
      icon: <BadgeIndianRupee size={18} />,
      bg: "from-pink-50 to-pink-100",
      iconBg: "bg-pink-500",
    },
  ];

  // Salary Breakdown Data
  const trafficData = [
    {
      name: "Employee Bonus",
      value: 201524,
      color: "bg-gradient-to-t from-pink-100 to-rose-100",
    },
    {
      name: "Employee Increment",
      value: 136254,
      color: "bg-gradient-to-t from-pink-100 to-rose-200",
    },
    {
      name: "Employee Reward",
      value: 465825,
      color: "bg-gradient-to-t from-pink-200 to-rose-300",
    },
    {
      name: "Employee Penalty",
      value: 123654,
      color: "bg-gradient-to-t from-pink-300 to-rose-400",
    },
    {
      name: "Employee Net Salary",
      value: 11212500,
      color: "bg-gradient-to-t from-pink-400 to-rose-500",
    },
  ];

  // Sort High To Low
  const sortedTrafficData = [...trafficData].sort(
    (a, b) => a.value - b.value
  );

  // Total
  const totalValue = sortedTrafficData.reduce(
    (acc, item) => acc + item.value,
    0
  );

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <div>

          <h3 className="font-bold text-gray-800 text-xl">
            Salary Report
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            Employee Salary Backup
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

      {/* Salary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mt-1">

        {salaryCards.map((card, index) => (

          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.15
            }}
            className={`bg-gradient-to-br ${card.bg} rounded-3xl p-2 border border-white shadow-md hover:scale-[1.03] transition-all duration-300 flex flex-col items-center justify-center text-center`}
          >

            <div
              className={`w-9 h-9 rounded-2xl ${card.iconBg} text-white flex items-center justify-center shadow-lg`}
            >
              {card.icon}
            </div>

            <h3 className="text-[10px] items-center text-slate-800 mt-1">
              {card.title}
            </h3>

            <p className="text-[12px] items-center font-bold mt-1 text-slate-900">
              {card.amount}
            </p>

          </motion.div>

        ))}

      </div>

      {/* Animated Progress */}
      <div className="flex overflow-hidden rounded-2xl h-[24px] mt-5 mb-5 bg-pink-100">

        {sortedTrafficData.map((item, index) => {

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

      {/* Salary Breakdown */}
      <div className="space-y-7">

        {sortedTrafficData.map((item, index) => {

          const percentage =
            ((item.value / totalValue) * 100).toFixed(1);

          return (

            <motion.div
              key={index}
              className="flex items-center justify-between gap-2"
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
                  className={`w-8 h-8 rounded-2xl ${item.color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.2
                  }}
                />

                <div>

                  <h3 className="text-[14px] font-semibold text-slate-800">
                    {item.name} - <span className="text-[11px] text-gray-500">{percentage}%</span>
                  </h3>
                </div>

              </div>

              {/* Right */}
              <motion.h2
                className="text-[16px] font-bold text-slate-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2
                }}
              >
                ₹{item.value.toLocaleString("en-IN")}
              </motion.h2>

            </motion.div>

          );

        })}

      </div>

    </div>
  );
}