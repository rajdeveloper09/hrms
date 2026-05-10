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

// ADD THESE NEW FIELDS INSIDE complaints ARRAY

const complaints = [
  {
    complaint_id: "CMP10245",
    emp_id: "EMP221",
    branch_id: "BR014",

    // Main Suspected Employee
    suspected_em: "Rohit Sharma",
    suspected_emp_id: "EMP221",
    suspected_photo:
      "https://randomuser.me/api/portraits/men/32.jpg",

    // Against Employee
    against_type: "Employee",
    against_name: "Aman Verma",
    against_emp_id: "EMP410",
    against_photo:
      "https://randomuser.me/api/portraits/men/55.jpg",

    relation: "Employee & Employee",

    remark: "Misbehavior during office hours",

    incident_date: "12 May 2026 • 11:30 AM",

    incident_place: "Head Office - Floor 2",

    status: "Pending",

    raise_by: "Ajeet Verma",
  },

  {
    complaint_id: "CMP10246",
    emp_id: "EMP198",
    branch_id: "BR011",

    suspected_em: "Rahul Singh",
    suspected_emp_id: "EMP198",
    suspected_photo:
      "https://randomuser.me/api/portraits/men/45.jpg",

    // Against Other Person
    against_type: "Other",
    against_name: "Visitor Person",
    against_emp_id: "VIS908",
    against_photo:
      "https://randomuser.me/api/portraits/women/44.jpg",

    relation: "Employee & Other",

    remark: "Argument with visitor",

    incident_date: "14 May 2026 • 04:20 PM",

    incident_place: "Reception Area",

    status: "Investigating",

    raise_by: "Neha Sharma",
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
    <div className="bg-white rounded-2xl shadow-md p-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>

          <h3 className="font-bold text-gray-800 text-xl">
            Complaints
          </h3>

          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400 mt-1">
              Branch Wise Complaints
            </p>

            <button
              className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg shadow-sm transition"
            >
              More
            </button>
          </div>

        </div>

        <div className="items-center gap-2">

          <select
            className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option>All Branch</option>
            <option>Delhi</option>
            <option>Mumbai</option>
            <option>Bangalore</option>
          </select>


        </div>

      </div>
      <div className="min-h-screen p-6 flex justify-center items-center">
        <div className="w-full max-w-[450px]">

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
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden"
              >
                {/* Top */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-white">
                  <div className="flex items-center gap-4">

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">
                          Branch ID : {item.branch_id}
                        </h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium
                        ${item.status === "Resolved"
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
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-4">
                  {/* Employee vs Employee / Other */}
                  <div className="bg-gradient-to-r from-gray-50 to-red-50 border border-gray-100 rounded-3xl p-4">
                    <div className="flex items-center justify-between gap-3">

                      {/* Suspected Employee */}
                      <div className="flex-1 text-center">
                        <img
                          src={item.suspected_photo}
                          alt=""
                          className="w-16 h-16 rounded-2xl object-cover mx-auto border-2 border-red-200"
                        />

                        <p className="text-sm font-bold text-gray-800 mt-2">
                          {item.suspected_em}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.suspected_emp_id}
                        </p>

                        <span className="inline-block mt-2 bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-medium">
                          Suspected EM
                        </span>
                      </div>

                      {/* VS */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                          VS
                        </div>

                        <p className="text-[10px] text-gray-400 mt-2 text-center">
                          {item.relation}
                        </p>

                      </div>

                      {/* Against Person */}
                      <div className="flex-1 text-center">
                        <img
                          src={item.against_photo}
                          alt=""
                          className="w-16 h-16 rounded-2xl object-cover mx-auto border-2 border-orange-200"
                        />

                        <p className="text-sm font-bold text-gray-800 mt-2">
                          {item.against_name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.against_emp_id}
                        </p>

                        <span className="inline-block mt-2 bg-orange-100 text-orange-600 text-[10px] px-2 py-1 rounded-full font-medium">
                          {item.against_type}
                        </span>
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
            ${currentIndex === 0
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
                ${currentIndex === i
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
            ${currentIndex === complaints.length - 1
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
    </div>
  );
}