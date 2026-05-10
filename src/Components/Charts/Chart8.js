import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const data = [
  {
    meeting_id: 123456,
    title: "Managers",
    designation: "Manager",
    date: "15-05-2026",
    time: "12 PM",
    emp_count: 12,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
  {
    meeting_id: 123457,
    title: "Team Leaders",
    designation: "TL",
    date: "18-05-2026",
    time: "12 PM",
    emp_count: 18,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
  {
    meeting_id: 123458,
    title: "Supervisors",
    designation: "Supervisor",
    date: "21-05-2026",
    time: "12 PM",
    emp_count: 22,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
  {
    meeting_id: 123459,
    title: "Staffs",
    designation: "Staff",
    date: "25-05-2026",
    time: "12 PM",
    emp_count: 15,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
  {
    meeting_id: 123410,
    title: "Guards",
    designation: "Guard",
    date: "28-05-2026",
    time: "12 PM",
    emp_count: 10,
    place: "Head Office",
    meeting_attend_by: "Area Manager",
  },
];

// Sort by date
const sortedData = [...data].sort((a, b) => {
  const [d1, m1, y1] = a.date.split("-");
  const [d2, m2, y2] = b.date.split("-");

  return (
    new Date(`${y1}-${m1}-${d1}`) -
    new Date(`${y2}-${m2}-${d2}`)
  );
});

// Graph styles
const graphStyles = [
  {
    color: "bg-gradient-to-t from-pink-400 to-rose-500",
    height: "100%",
  },
  {
    color: "bg-gradient-to-t from-pink-300 to-rose-400",
    height: "80%",
  },
  {
    color: "bg-gradient-to-t from-pink-200 to-rose-300",
    height: "60%",
  },
  {
    color: "bg-gradient-to-t from-pink-100 to-rose-200",
    height: "40%",
  },
  {
    color: "bg-gradient-to-t from-pink-100 to-rose-100",
    height: "25%",
  },
];

export default function Chart8() {

  // Next Meeting
  const nextMeeting = sortedData[0];

  // Date split
  const [day, month, year] =
    nextMeeting.date.split("-");

  // Time split
  const [time, modifier] =
    nextMeeting.time.split(" ");

  let hours = parseInt(time);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  // Final Meeting Date
  const meetingDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    hours,
    0,
    0
  );

  // Countdown State
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown Effect
  useEffect(() => {

    const interval = setInterval(() => {

      const now = new Date().getTime();

      const distance =
        meetingDate.getTime() - now;

      if (distance <= 0) {

        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        clearInterval(interval);
        return;
      }

      const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (distance %
          (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (distance %
          (1000 * 60 * 60)) /
        (1000 * 60)
      );

      const seconds = Math.floor(
        (distance %
          (1000 * 60)) / 1000
      );

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
      });

    }, 1000);

    return () => clearInterval(interval);

  }, [meetingDate]);

  return (

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-md p-4"
    >

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">

        <div>

          <h3 className="font-bold text-gray-800 text-xl">
            Meeting
          </h3>

          <div className="flex items-center gap-2">

            <p className="text-sm text-gray-400 mt-1">
              Employee Upcoming Meeting
            </p>

          </div>

        </div>

        <select
          className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option>All Branch</option>
          <option>Delhi</option>
          <option>Mumbai</option>
          <option>Bangalore</option>
        </select>

      </div>

      {/* Countdown Card */}
      <div className="mb-4 bg-black rounded-2xl p-4 text-white shadow-md">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm opacity-90">
              Next Meeting
            </p>

            <h3 className="text-lg font-bold mt-1">
              {nextMeeting.title}
            </h3>

            <p className="text-xs mt-1 opacity-90">
              {nextMeeting.date} • {nextMeeting.time}
            </p>

          </div>

          {/* Countdown */}
          <div className="flex gap-2 flex-wrap justify-end">

            {[
              {
                value: countdown.days,
                label: "Days",
              },
              {
                value: countdown.hours,
                label: "Hrs",
              },
              {
                value: countdown.minutes,
                label: "Min",
              },
              {
                value: countdown.seconds,
                label: "Sec",
              },
            ].map((item, index) => (

              <motion.div
                key={index}
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
                className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 text-center min-w-[30px]"
              >

                <h2 className="text-[12px] font-bold leading-none">
                  {item.value}
                </h2>

                <p className="text-[10px] mt-1 uppercase tracking-wide">
                  {item.label}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </div>

      {/* Graph Area */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#fafafa]">

        <div className="grid grid-cols-5">

          {sortedData.slice(0, 5).map((item, index) => (

            <div
              key={item.meeting_id}
              className="border-r last:border-r-0 border-gray-200 flex flex-col justify-between"
            >

              {/* Top */}
              <div className="p-3 text-center">

                <p className="text-[11px] text-gray-400 leading-4 mb-3">
                  {item.designation}
                </p>

                <h3 className="text-[12px] font-bold text-gray-900 mb-2">

                  {
                    new Date(
                      item.date
                        .split("-")
                        .reverse()
                        .join("-")
                    )
                      .toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      )
                      .replace(" ", "-")
                  }

                </h3>

                <p className="text-xs text-rose-600 mb-3">
                  {item.emp_count} People
                </p>

              </div>

              {/* Graph */}
              <div className="h-60 flex items-end">

                <motion.div

                  key={index}
                  animate={{
                    height:
                      graphStyles[index].height
                  }}
                  initial={{ height: 0, opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.3
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12
                  }}
                  className={`w-full rounded-t-[22px] ${graphStyles[index].color}`}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </motion.div>
  );
}