import React from "react";
import { motion } from "framer-motion";

const data = [
  {
    meeting_id: 123456,
    title: "Manager Meeting",
    designation: "Manager",
    date: "15-05-2026",
    time: "12 PM",
    emp_count: 12,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
  {
    meeting_id: 123457,
    title: "TL Meeting",
    designation: "Manager",
    date: "18-05-2026",
    time: "12 PM",
    emp_count: 18,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
  {
    meeting_id: 123458,
    title: "Supervisor Meeting",
    designation: "Manager",
    date: "21-05-2026",
    time: "12 PM",
    emp_count: 22,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
  {
    meeting_id: 123459,
    title: "Staff Meeting",
    designation: "Manager",
    date: "25-05-2026",
    time: "12 PM",
    emp_count: 15,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
  {
    meeting_id: 123410,
    title: "Guard Meeting",
    designation: "Manager",
    date: "28-05-2026",
    time: "12 PM",
    emp_count: 10,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
];

// Date sorting
const sortedData = [...data].sort((a, b) => {
  const [d1, m1, y1] = a.date.split("-");
  const [d2, m2, y2] = b.date.split("-");

  return (
    new Date(`${y1}-${m1}-${d1}`) -
    new Date(`${y2}-${m2}-${d2}`)
  );
});

// Color + height logic
const graphStyles = [
  {
    color: "bg-emerald-700",
    height: "h-40",
  },
  {
    color: "bg-emerald-500",
    height: "h-32",
  },
  {
    color: "bg-emerald-400",
    height: "h-24",
  },
  {
    color: "bg-emerald-300",
    height: "h-16",
  },
  {
    color: "bg-emerald-200",
    height: "h-10",
  },
];

export default function Chart8() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[430px] bg-white rounded-3xl border border-gray-200 shadow-lg p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-semibold text-gray-900">
            Employee Upcoming Meeting
          </h2>

          <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Graph Area */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#fafafa]">
          <div className="grid grid-cols-5">
            {sortedData.map((item, index) => (
              <div
                key={item.meeting_id}
                className="border-r last:border-r-0 border-gray-200 flex flex-col justify-between"
              >
                {/* Content */}
                <div className="p-3">
                  <p className="text-[11px] text-gray-400 leading-4 mb-2">
                    {item.title}
                  </p>

                  <h3 className="text-[15px] font-bold text-gray-900">
                    {item.date}
                  </h3>

                  <p className="text-xs text-emerald-600 mt-1">
                    {item.emp_count} Employees
                  </p>
                </div>

                {/* Animated Bar */}
                <div className="h-44 flex items-end px-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.15,
                      ease: "easeOut",
                    }}
                    className={`w-full rounded-t-[22px] ${graphStyles[index].height} ${graphStyles[index].color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <p>Nearest Meeting Highlighted</p>
          <p className="text-emerald-700 font-semibold">
            Next: {sortedData[0].title}
          </p>
        </div>
      </motion.div>
    </div>
  );
}