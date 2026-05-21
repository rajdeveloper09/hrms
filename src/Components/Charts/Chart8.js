import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../config/api";

const graphStyles = [
  { color: "bg-gradient-to-t from-pink-400 to-rose-500", height: "100%" },
  { color: "bg-gradient-to-t from-pink-300 to-rose-400", height: "80%" },
  { color: "bg-gradient-to-t from-pink-200 to-rose-300", height: "60%" },
  { color: "bg-gradient-to-t from-pink-100 to-rose-200", height: "40%" },
  { color: "bg-gradient-to-t from-pink-100 to-rose-100", height: "25%" },
];

export default function Chart8() {
  const [meetings, setMeetings] = useState([]);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/emp_meetings`);
      const json = await res.json();

      const list =
        json.success === true && Array.isArray(json.data) ? json.data : [];

      const formatted = list.map((item) => {
        const empCount = item.employee_ids
          ? item.employee_ids.split(",").filter(Boolean).length
          : 0;

        return {
          meeting_id: item.meeting_id || item.id,
          title: item.designation || "Meeting",
          designation: item.designation || "-",
          date: item.meeting_date || "",
          time: item.meeting_time || "",
          emp_count: empCount,
          place: item.place || "-",
          meeting_attend_by: item.meeting_attend_by || "-",
          remark: item.remark || "-",
          status: item.status || "0",
        };
      });

      setMeetings(formatted);
    } catch (error) {
      console.error("Meeting API Error:", error);
      setMeetings([]);
    }
  };

  const sortedData = useMemo(() => {
    const now = new Date();

    return [...meetings]
      .filter((item) => {
        if (!item.date || !item.time) return false;

        const meetingDateTime = new Date(`${item.date}T${item.time}`);

        if (isNaN(meetingDateTime.getTime())) return false;

        return meetingDateTime >= now;
      })
      .sort((a, b) => {
        return (
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
        );
      });
  }, [meetings]);

  const nextMeeting = sortedData[0];

  useEffect(() => {
    if (!nextMeeting) {
      setCountdown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    const meetingDate = new Date(`${nextMeeting.date}T${nextMeeting.time}`);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = meetingDate.getTime() - now;

      if (distance <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        clearInterval(interval);
        fetchMeetings();
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextMeeting]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-md p-4"
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-gray-800 text-xl">Meeting</h3>

          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400 mt-1">
              Employee Upcoming Meeting
            </p>
          </div>
        </div>

        <select className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
          <option>All Branch</option>
          <option>Delhi</option>
          <option>Mumbai</option>
          <option>Bangalore</option>
        </select>
      </div>

      {!nextMeeting ? (
        <div className="text-center text-gray-400 py-10">
          No upcoming meeting found
        </div>
      ) : (
        <>
          <div className="mb-4 bg-black rounded-2xl p-4 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Next Meeting</p>

                <h3 className="text-lg font-bold mt-1">
                  {nextMeeting.title}
                </h3>

                <p className="text-xs mt-1 opacity-90">
                  {nextMeeting.date} • {nextMeeting.time}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap justify-end">
                {[
                  { value: countdown.days, label: "Days" },
                  { value: countdown.hours, label: "Hrs" },
                  { value: countdown.minutes, label: "Min" },
                  { value: countdown.seconds, label: "Sec" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.12,
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

          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <div className="grid grid-cols-5">
              {sortedData.slice(0, 5).map((item, index) => (
                <div
                  key={item.meeting_id}
                  className="border-r last:border-r-0 border-gray-200 flex flex-col justify-between"
                >
                  <div className="p-3 text-center">
                    <p className="text-[11px] text-gray-400 leading-4 mb-3">
                      {item.designation}
                    </p>

                    <h3 className="text-[12px] font-bold text-gray-900 mb-2">
                      {new Date(item.date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })
                        .replace(" ", "-")}
                    </h3>

                    <p className="text-xs text-rose-600 mb-3">
                      {item.emp_count} People
                    </p>
                  </div>

                  <div className="h-60 flex items-end">
                    <motion.div
                      key={index}
                      animate={{
                        height: graphStyles[index]?.height || "25%",
                      }}
                      initial={{ height: 0, opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.12,
                      }}
                      className={`w-full rounded-t-[22px] ${
                        graphStyles[index]?.color ||
                        "bg-gradient-to-t from-pink-100 to-rose-100"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}