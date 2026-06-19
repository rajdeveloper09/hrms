import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  MapPin,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function Chart9() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [complaints, setComplaints] = useState([]);


  const cleanId = (value) => String(value || "").trim();

  const getEmpName = (employeeMap, empId) => {
    const emp = employeeMap[cleanId(empId)];
    return emp?.full_name || empId || "-";
  };

  const getAvatar = (name, bg = "f43f5e") =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=${bg}&color=fff`;

const fetchData = useCallback(async () => {
    try {
      const [complaintRes, employeeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/emp_complaints`),
        fetch(`${API_BASE_URL}/get_employee`),
      ]);

      const complaintJson = await complaintRes.json();
      const employeeJson = await employeeRes.json();

      const complaintList =
        complaintJson.status === true && Array.isArray(complaintJson.data)
          ? complaintJson.data
          : [];

      const employeeList =
        employeeJson.status === true && Array.isArray(employeeJson.data)
          ? employeeJson.data
          : [];

      const employeeMap = {};

      employeeList.forEach((emp) => {
        employeeMap[cleanId(emp.employee_id)] = emp;
      });

      const formattedData = complaintList.map((item) => {
        const isEmpVsEmp = item.complaint_type === "Emp vs Emp";
        const firstEmpId = cleanId(item.emp_id);
        const secondEmpId = cleanId(item.second_employee_id || item.complaint_between);
        const suspectedId = cleanId(item.suspected_employee);

        let leftName = "-";
        let leftId = "-";
        let leftType = "Suspected EM";

        let rightName = "-";
        let rightId = "-";
        let rightType = isEmpVsEmp ? "Employee" : "Other";

        if (isEmpVsEmp) {
          if (suspectedId === firstEmpId) {
            leftId = firstEmpId;
            leftName = getEmpName(employeeMap, firstEmpId);

            rightId = secondEmpId;
            rightName = getEmpName(employeeMap, secondEmpId);
          } else if (suspectedId === secondEmpId) {
            leftId = secondEmpId;
            leftName = getEmpName(employeeMap, secondEmpId);

            rightId = firstEmpId;
            rightName = getEmpName(employeeMap, firstEmpId);
          } else {
            leftId = suspectedId || firstEmpId;
            leftName = getEmpName(employeeMap, leftId);

            rightId = secondEmpId || firstEmpId;
            rightName = getEmpName(employeeMap, rightId);
          }
        } else {
          const otherName =
            item.other_person_name || item.complaint_between || "Other";

          if (suspectedId === firstEmpId) {
            leftId = firstEmpId;
            leftName = getEmpName(employeeMap, firstEmpId);

            rightId = "Other";
            rightName = otherName;
            rightType = "Other";
          } else if (suspectedId === "Other" || suspectedId === otherName) {
            leftId = "Other";
            leftName = otherName;
            leftType = "Suspected Other";

            rightId = firstEmpId;
            rightName = getEmpName(employeeMap, firstEmpId);
            rightType = "Employee";
          } else {
            leftId = suspectedId || "Other";
            leftName =
              suspectedId === "Other"
                ? otherName
                : getEmpName(employeeMap, suspectedId);

            rightId = firstEmpId;
            rightName = getEmpName(employeeMap, firstEmpId);
            rightType = "Employee";
          }
        }

        return {
          complaint_id: item.complaint_id || "-",
          emp_id: item.emp_id || "-",
          branch_id: item.branch_id || "-",

          suspected_em: leftName,
          suspected_emp_id: leftId,
          suspected_type: leftType,
          suspected_photo: getAvatar(leftName, "f43f5e"),

          against_type: rightType,
          against_name: rightName,
          against_emp_id: rightId,
          against_photo: getAvatar(rightName, "fb923c"),

          relation: isEmpVsEmp ? "Employee & Employee" : "Employee & Other",

          remark: item.remark || "-",
          incident_date: item.incident_datetime || "-",
          incident_place: item.incident_place || "-",
          status: item.status || "Pending",
          raise_by: item.complaint_raise_by || "-",
        };
      });

      setComplaints(formattedData);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Complaint API Error:", error);
      setComplaints([]);
    }
  });

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
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-gray-800 text-xl">
            Staff Complaints
          </h3>

          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400 mt-1">
              Staff Wise Complaints
            </p>

            <button className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg shadow-sm transition mt-1">
              More
            </button>
          </div>
        </div>

        <div className="items-center gap-2">
          <select className="text-sm border border-pink-200 rounded-xl px-4 py-2 bg-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
            <option>All Branch</option>
            <option>Delhi</option>
            <option>Mumbai</option>
            <option>Bangalore</option>
          </select>
        </div>
      </div>

      {!item ? (
        <div className="text-center text-gray-400 py-10">
          No complaints found
        </div>
      ) : (
        <div className="w-full">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.complaint_id}
                initial={{ opacity: 0, x: 120 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -120 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <div className="bg-black p-3 text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">
                          Branch ID : {item.branch_id}
                        </h3>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
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

                      <p className="text-xs mt-1 opacity-90">
                        Complaint ID : {item.complaint_id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-4">
                  <div className="bg-gradient-to-r from-gray-50 to-red-50 border border-gray-100 rounded-3xl p-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 text-center">
                        <img
                          src={item.suspected_photo}
                          alt=""
                          className="w-8 h-8 rounded-2xl object-cover mx-auto border-2 border-red-200"
                        />

                        <p className="text-sm text-gray-800 mt-1">
                          {item.suspected_em}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {item.suspected_emp_id}
                        </p>

                        <span className="inline-block mt-2 bg-rose-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-medium">
                          {item.suspected_type}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-t from-pink-400 to-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                          VS
                        </div>

                        <p className="text-[10px] text-gray-400 mt-2 text-center">
                          {item.relation}
                        </p>
                      </div>

                      <div className="flex-1 text-center">
                        <img
                          src={item.against_photo}
                          alt=""
                          className="w-8 h-8 rounded-2xl object-cover mx-auto border-2 border-orange-200"
                        />

                        <p className="text-sm text-gray-800 mt-1">
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

                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-red-500 mt-0.5" />

                      <div>
                        <p className="text-[11px] text-red-400">Remark</p>

                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {item.remark}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-rose-200 p-2 rounded-xl">
                      <CalendarDays size={15} className="text-red-600" />
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

                  <div className="flex items-center gap-3">
                    <div className="bg-rose-100 p-2 rounded-xl">
                      <MapPin size={15} className="text-red-600" />
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

                  <div className="border-t border-gray-100 pt-1 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] text-gray-400">
                        Complaint Raise By :{" "}
                        <span className="font-semibold text-gray-800">
                          {item.raise_by}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-2">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium shadow-md ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700"
              }`}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {complaints.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === i ? "w-6 bg-pink-400" : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextCard}
              disabled={currentIndex === complaints.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium shadow-md ${
                currentIndex === complaints.length - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-400 to-rose-500 text-white"
              }`}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}