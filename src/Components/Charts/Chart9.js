import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  MapPin,
  CalendarDays,
  User,
  Building2,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const complaints = [
  {
    complaint_id: "CMP10245",
    emp_id: "EMP221",
    branch_id: "BR014",
    suspected_em: "Rohit Sharma",
    relation: "Employee & Employee",
    remark: "Misbehavior during office hours",
    incident_date: "12 May 2026 • 11:30 AM",
    incident_place: "Head Office - Floor 2",
    status: "Pending",
    raise_by: "Ankit Verma",
    photo:
      "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    complaint_id: "CMP10246",
    emp_id: "EMP198",
    branch_id: "BR011",
    suspected_em: "Rahul Singh",
    relation: "Employee & Other",
    remark: "Argument with visitor",
    incident_date: "14 May 2026 • 04:20 PM",
    incident_place: "Reception Area",
    status: "Investigating",
    raise_by: "Neha Sharma",
    photo:
      "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    complaint_id: "CMP10247",
    emp_id: "EMP310",
    branch_id: "BR009",
    suspected_em: "Amit Kumar",
    relation: "Employee & Employee",
    remark: "Violation of office policy",
    incident_date: "15 May 2026 • 02:10 PM",
    incident_place: "Warehouse",
    status: "Resolved",
    raise_by: "Vikas Mishra",
    photo:
      "https://randomuser.me/api/portraits/men/61.jpg",
  },
];

export default function Chart9() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    if (currentIndex < complaints.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const item = complaints[currentIndex];

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6 flex justify-center items-center">
      <div className="w-full max-w-[450px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-5 text-white shadow-xl mb-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">
                AI Complaint Monitoring
              </p>

              <h2 className="text-2xl font-bold mt-1">
                Suspected EM Complaints
              </h2>

              <p className="text-xs mt-2 text-white/80">
                Swipe complaint records with animation
              </p>
            </div>

            <div className="bg-white/20 p-3 rounded-2xl">
              <ShieldAlert size={28} />
            </div>
          </div>
        </motion.div>

        {/* Single Sliding Card */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.complaint_id}
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -120 }}
              transition={{
                duration: 0.4,
              }}
              className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden"
            >
              {/* Top */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-white">
                <div className="flex items-center gap-4">
                  <img
                    src={item.photo}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">
                        {item.suspected_em}
                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium
                        ${
                          item.status === "Resolved"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : item.status === "Pending"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mt-1">
                      Complaint ID : {item.complaint_id}
                    </p>

                    <p className="text-xs text-orange-300 mt-2">
                      {item.relation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-4">
                {/* Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-[11px] text-gray-400">
                      Employee ID
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <User
                        size={14}
                        className="text-red-500"
                      />

                      <p className="text-sm font-semibold text-gray-800">
                        {item.emp_id}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-[11px] text-gray-400">
                      Branch ID
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <Building2
                        size={14}
                        className="text-orange-500"
                      />

                      <p className="text-sm font-semibold text-gray-800">
                        {item.branch_id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remark */}
                <div className="bg-red-50 border border-red-100 rounded-2xl p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      size={16}
                      className="text-red-500 mt-0.5"
                    />

                    <div>
                      <p className="text-[11px] text-red-400">
                        Remark
                      </p>

                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {item.remark}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-xl">
                    <CalendarDays
                      size={15}
                      className="text-orange-600"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-400">
                      Incident Date & Time
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {item.incident_date}
                    </p>
                  </div>
                </div>

                {/* Place */}
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-xl">
                    <MapPin
                      size={15}
                      className="text-red-600"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-400">
                      Incident Place
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {item.incident_place}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-gray-400">
                      Complaint Raise By
                    </p>

                    <p className="text-sm font-semibold text-gray-800">
                      {item.raise_by}
                    </p>
                  </div>

                  <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm px-4 py-2 rounded-xl font-medium shadow-md">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium shadow-md
            ${
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700"
            }`}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {complaints.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300
                ${
                  currentIndex === i
                    ? "w-6 bg-red-500"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextCard}
            disabled={currentIndex === complaints.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium shadow-md
            ${
              currentIndex === complaints.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 to-orange-500 text-white"
            }`}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}