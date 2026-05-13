import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  Briefcase,
  Clock3,
  Wallet,
  IndianRupee,
  Image as ImageIcon,
} from "lucide-react";

import SideNav from "../SideNav";
import { API_BASE_URL } from "../../config/api";
import { Chart10 } from "../Charts/Chart10";
import EmployeeTabsSection from "./EmployeeTabsSection";
export default function EmployeeProfile() {

  const { employee_id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  // TOP STATE
  const [activeTab, setActiveTab] = useState("Attendance");

  const [filterType, setFilterType] = useState("date");
  const attendanceData = [
    {
      date: "2026-05-13",
      inTime: "09:00 AM",
      outTime: "06:00 PM",
      totalHours: "9h",
      late: "10 Min",
    },
  ];

  const salaryData = [
    {
      date: "2026-05-01",
      amount: "₹25,000",
      type: "Bank Transfer",
      status: "Paid",
    },
  ];

  const bonusData = [
    {
      date: "2026-05-10",
      amount: "₹2,000",
      reason: "Performance Bonus",
    },
  ];

  const penaltyData = [
    {
      date: "2026-05-08",
      amount: "₹500",
      reason: "Late Coming",
    },
  ];

  const rewardsData = [
    {
      date: "2026-05-11",
      amount: "₹1,000",
      reason: "Best Employee",
    },
  ];
  useEffect(() => {

    fetch(
      `${API_BASE_URL}/get_employee_by_id?employee_id=${employee_id}`
    )
      .then((res) => res.json())
      .then((data) => {

        if (data.status && data.data.length > 0) {
          setEmployee(data.data[0]);
        }

        setLoading(false);

      })
      .catch((err) => {

        console.log(err);
        setLoading(false);

      });

  }, [employee_id]);

  // IMAGE URL
  const getImageUrl = (path) => {

    if (!path) return "";

    if (path.startsWith("http")) {
      return path;
    }

    return `${API_BASE_URL}/${path}`;
  };

  // LOADING
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-rose-50">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-lg font-semibold text-rose-700">
            Loading Employee...
          </p>

        </div>

      </div>

    );
  }

  // NO DATA
  if (!employee) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-rose-50">

        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center border border-rose-100">

          <h2 className="text-3xl font-bold text-rose-500">
            Employee Not Found
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            Go Back
          </button>

        </div>

      </div>

    );
  }

  // STATS
  const stats = [
    {
      title: "Total Salary",
      value: `₹${(
        Number(employee.basic_salary || 0) +
        Number(employee.allowances || 0)
      ).toLocaleString("en-IN")}`,
      icon: <IndianRupee size={22} />,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Working Hours",
      value: `${employee.working_hours || 0} Hr`,
      icon: <Clock3 size={22} />,
      color: "from-rose-400 to-red-400",
    },
    {
      title: "Allow Leaves",
      value: `${employee.monthly_leaves || 0} Hr`,
      icon: <Clock3 size={22} />,
      color: "from-rose-400 to-red-400",
    },
    {
      title: "Total Bonous",
      value: `${employee.working_hours || 0} Hr`,
      icon: <Clock3 size={22} />,
      color: "from-rose-400 to-red-400",
    },
    {
      title: "Total Panelty",
      value: `${employee.working_hours || 0} Hr`,
      icon: <Clock3 size={22} />,
      color: "from-rose-400 to-red-400",
    },
    {
      title: "Total Rewards",
      value: `${employee.working_hours || 0} Hr`,
      icon: <Clock3 size={22} />,
      color: "from-rose-400 to-red-400",
    },
  ];

  // DOCUMENTS
  const documents = [
    {
      title: "Resume",
      file: employee.user_resume,
    },
    {
      title: "KYE Form",
      file: employee.kye_form,
    },
    {
      title: "Family Photo",
      file: employee.user_family_photo,
    },
    {
      title: "Aadhar With Family",
      file: employee.aadhar_with_family,
    },
    {
      title: "PAN Card",
      file: employee.pan_card,
    },
    {
      title: "PCC",
      file: employee.pcc,
    },
    {
      title: "Bank Proof",
      file: employee.bank_proff,
    },
  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex">

      <SideNav />

      <div className="flex-1 ml-72 p-6 overflow-y-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-5 mb-6 border border-rose-100"
        >

          <div className="flex justify-between items-center flex-wrap gap-4">

            <div className="flex items-center gap-4">

              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition-all duration-300"
              >
                <ArrowLeft className="text-rose-600" />
              </button>

              <div className="flex gap-5">

                <div className="flex items-center gap-3 flex-wrap">

                  <h1 className="text-4xl font-extrabold text-black">
                    {employee.full_name}
                  </h1>
                </div>

                <div className="flex gap-4 flex-wrap mt-2">
                  <div className="bg-white border border-rose-100 shadow-sm rounded-2xl px-4 py-2">
                    <p className="text-[14px] text-slate-400 uppercase tracking-wide">
                      Employee ID : <spam className="text-[14px] font-bold text-slate-700 mt-3 capitalize">{employee.employee_id}</spam>
                    </p>
                  </div>

                  <div className="bg-white border border-rose-100 shadow-sm rounded-2xl px-4 py-2">
                    <p className="text-[14px] text-slate-400 uppercase tracking-wide">
                      Working Branch : <spam className="text-[14px] font-bold text-slate-700 mt-3 capitalize">{employee.work_location}</spam>
                    </p>
                  </div>
                </div>

              </div>

            </div>

            <button
              className={`px-5 py-2 rounded-xl font-semibold ${employee.status === "Active"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
                }`}
            >
              {employee.status}
            </button>

          </div>

        </motion.div>

        {/* PROFILE */}
        <div className="grid grid-cols-12 gap-6 mb-6">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-12 xl:col-span-4"
          >

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100">

              {/* TOP */}
              <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 p-6 text-white text-center">

                {
                  employee.user_photo ? (

                    <img
                      src={getImageUrl(employee.user_photo)}
                      alt="Employee"
                      className="w-28 h-28 rounded-full object-cover border-4 border-white mx-auto shadow-lg"
                    />

                  ) : (

                    <div className="w-28 h-28 rounded-full bg-white/20 mx-auto flex items-center justify-center">
                      <ImageIcon size={40} />
                    </div>

                  )
                }

                <h2 className="text-3xl font-bold mt-4 capitalize">
                  {employee.full_name}
                </h2>

                <p className="mt-2 text-rose-100">
                  {employee.designation}
                </p>

              </div>

              {/* DETAILS */}
              <div className="p-5 space-y-6">

                <div className="flex items-center gap-3">
                  <Phone className="text-rose-500" size={20} />

                  <span className="text-slate-700">
                    +91-{employee.mobile}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-rose-500" size={20} />

                  <span className="text-slate-700 break-all">
                    {employee.email}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-rose-500 mt-1" size={20} />

                  <span className="text-slate-700 capitalize">
                    {employee.address}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="text-rose-500" size={20} />

                  <span className="text-slate-700">
                    {employee.department}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="text-rose-500" size={20} />

                  <span className="text-slate-700">
                    {employee.employment_type}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 className="text-rose-500" size={20} />

                  <span className="text-slate-700">
                    {employee.shift_time}
                  </span>
                </div>

              </div>

            </div>

          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-12 xl:col-span-8"
          >

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5">

              {stats.map((item, index) => (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-gradient-to-r ${item.color} rounded-3xl p-6 shadow-xl text-white`}
                >

                  <div className="flex items-center justify-between">

                    <h3 className="text-[14px] font-medium">
                      {item.title}
                    </h3>

                    {item.icon}

                  </div>

                  <h2 className="text-[18px] font-bold mt-8 break-words">
                    {item.value}
                  </h2>

                </motion.div>

              ))}

            </div>

            {/* CHART */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              <Chart10 />
            </motion.div>

          </motion.div>

        </div>

        <div className="min-h-screen bg-slate-100 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[90vh]">
            {/* Left Content */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex items-center justify-center">
              {/* DETAILS */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

                {/* PERSONAL DETAILS */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100"
                >

                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5">

                    <h2 className="text-2xl font-bold text-white">
                      Personal Details
                    </h2>

                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

                    {[
                      ["Gender", employee.gender],
                      ["Father Name", employee.father_name],
                      ["Mother Name", employee.mother_name],
                      ["Marital Status", employee.marital_status],
                      ["Spouse", employee.spouse],
                      ["Children", employee.children],
                      ["DOB", employee.dob],
                      ["Joining Date", employee.joining_date],
                      ["Reporting Person", employee.reporting_person],
                      ["Work Location", employee.work_location],
                    ].map((item, index) => (

                      <div
                        key={index}
                        className="bg-rose-50 rounded-2xl p-4 border border-rose-100"
                      >

                        <p className="text-sm text-rose-500">
                          {item[0]}
                        </p>

                        <h3 className="font-semibold text-slate-800 mt-1 capitalize break-words">
                          {item[1] || "-"}
                        </h3>

                      </div>

                    ))}

                  </div>

                </motion.div>

                {/* DOCUMENT DETAILS */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100"
                >

                  <div className="bg-gradient-to-r from-pink-500 to-fuchsia-500 p-5">

                    <h2 className="text-2xl font-bold text-white">
                      Document Details
                    </h2>

                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

                    {[
                      ["Aadhaar", employee.aadhaar],
                      ["PAN", employee.pan],
                      ["Salary Type", employee.salary_type],
                      ["Salary Mode", employee.salary_mode],
                      ["Monthly Leaves", employee.monthly_leaves],
                      ["Yearly Leaves", employee.yearly_leaves],
                      ["Assets", employee.assets],
                      ["Interview By", employee.interview_by],
                    ].map((item, index) => (

                      <div
                        key={index}
                        className="bg-pink-50 rounded-2xl p-4 border border-pink-100"
                      >

                        <p className="text-sm text-pink-500">
                          {item[0]}
                        </p>

                        <h3 className="font-semibold text-slate-800 mt-1 break-words capitalize">
                          {item[1] || "-"}
                        </h3>

                      </div>

                    ))}

                  </div>

                </motion.div>

              </div>
            </div>


            <EmployeeTabsSection
              attendanceData={attendanceData}
              salaryData={salaryData}
              bonusData={bonusData}
              penaltyData={penaltyData}
              rewardsData={rewardsData}
            />
          </div>

          {/* DOCUMENT IMAGES */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100 mb-6"
          >

            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 p-5">

              <h2 className="text-2xl font-bold text-white">
                Employee Documents
              </h2>

            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

              {documents.map((doc, index) => (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="border border-rose-100 rounded-2xl overflow-hidden bg-white shadow-md"
                >

                  <div className="h-52 bg-white flex items-center justify-center overflow-hidden">

                    {
                      doc.file ? (

                        <img
                          src={getImageUrl(doc.file)}
                          alt={doc.title}
                          className="max-h-full max-w-full object-contain"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-rose-300">
                          No File
                        </div>

                      )
                    }

                  </div>

                  <div className="p-3 border-t border-rose-100">

                    <h3 className="font-semibold text-slate-700 text-center">
                      {doc.title}
                    </h3>

                  </div>

                </motion.div>

              ))}

            </div>

          </motion.div>

        </div>

      </div>
    </div>

  );
}