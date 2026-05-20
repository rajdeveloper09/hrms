import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  Briefcase,
  Clock3,
  IndianRupee,
  Download,
  Eye,
  X,
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
  const [selectedImage, setSelectedImage] = useState(null);

  const [empAttendance, setEmpAttendance] =
    useState([]);

  const [salaryData, setSalaryData] =
    useState([]);

  console.log("salary data" + salaryData)

  const [bonusData, setBonusData] =
    useState([]);

  const [penaltyData, setPenaltyData] =
    useState([]);

  const [rewardsData, setRewardsData] =
    useState([]);

  const [empComplaint, setEmpComplaint] =
    useState([]);

  const [empEsicPfData, setEmpEsicPfData] =
    useState([]);

  const [empIncrement, setEmpIncrement] =
    useState([]);

  const [empOvertime, setEmpOvertime] =
    useState([]);

  const [empMeeting, setEmpMeeting] =
    useState([]);

  const [empResignation, setEmpResignation] =
    useState([]);

  const [empAssest, setEmpAssest] =
    useState([]);

  const [empList, setEmployeeNew] =
    useState([]);

  useEffect(() => {

    const fetchData = async (
      url,
      setter,
      label
    ) => {

      try {

        const res = await fetch(url);

        const response =
          await res.json();

        console.log(
          `${label} Response:`,
          response
        );

        const data =
          response?.data ||
          response?.result ||
          response ||
          [];

        setter(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.log(
          `${label} Error:`,
          err
        );

        setter([]);

      }

    };

    /* =========================================
        ALL API CALLS
    ========================================= */

    fetchData(
      `${API_BASE_URL}/emp_attendance`,
      setEmpAttendance,
      "Attendance"
    );

    fetchData(
      `${API_BASE_URL}/emp_month_salary`,
      setSalaryData,
      "Salary"
    );

    fetchData(
      `${API_BASE_URL}/emp_bonus`,
      setBonusData,
      "Bonus"
    );

    fetchData(
      `${API_BASE_URL}/emp_penalties`,
      setPenaltyData,
      "Penalty"
    );

    fetchData(
      `${API_BASE_URL}/emp_rewards`,
      setRewardsData,
      "Rewards"
    );

    fetchData(
      `${API_BASE_URL}/emp_complaints`,
      setEmpComplaint,
      "Complaint"
    );

    fetchData(
      `${API_BASE_URL}/emp_increments`,
      setEmpIncrement,
      "Increment"
    );
    fetchData(
      `${API_BASE_URL}/emp_esicpf`,
      setEmpEsicPfData,
      "Increment"
    );



    fetchData(
      `${API_BASE_URL}/emp_overtime`,
      setEmpOvertime,
      "Overtime"
    );

    fetchData(
      `${API_BASE_URL}/emp_meetings`,
      setEmpMeeting,
      "Meeting"
    );

    fetchData(
      `${API_BASE_URL}/emp_resignation`,
      setEmpResignation,
      "Resignation"
    );

    fetchData(
      `${API_BASE_URL}/get_office_asset_history`,
      setEmpAssest,
      "Assest"
    );

    fetchData(
      `${API_BASE_URL}/get_employee`,
      setEmployeeNew,
      "Assest"
    );

  }, []);



  // EMPLOYEE FETCH
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

  // NO EMPLOYEE
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
    },
    {
      title: "Total Rewards",
      value: `₹${Number(employee.basic_salary || 0).toLocaleString(
        "en-IN"
      )}`,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "Total Bonus",
      value: `₹${Number(employee.basic_salary || 0).toLocaleString(
        "en-IN"
      )}`,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "Total Penalty",
      value: `₹${Number(employee.basic_salary || 0).toLocaleString(
        "en-IN"
      )}`,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "OT Amount",
      value: `₹${Number(employee.basic_salary || 0).toLocaleString(
        "en-IN"
      )}`,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "PF Amount",
      value: `₹${Number(employee.basic_salary || 0).toLocaleString(
        "en-IN"
      )}`,
      icon: <IndianRupee size={22} />,
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

      <div className="flex-1 xl:ml-72 p-4 md:p-6 overflow-y-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-5 mb-6 border border-rose-100"
        >
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition-all duration-300"
              >
                <ArrowLeft className="text-rose-600" />
              </button>

              <div className="flex gap-4 flex-wrap">
                <div className="bg-white border border-rose-100 shadow-sm rounded-2xl px-4 py-2">
                  <p className="text-[14px] text-slate-400 uppercase tracking-wide">
                    Employee ID :
                    <span className="text-[14px] font-bold text-slate-700 ml-2 capitalize">
                      {employee.employee_id}
                    </span>
                  </p>
                </div>

                <div className="bg-white border border-rose-100 shadow-sm rounded-2xl px-4 py-2">
                  <p className="text-[14px] text-slate-400 uppercase tracking-wide">
                    Working Branch :
                    <span className="text-[14px] font-bold text-slate-700 ml-2 capitalize">
                      {employee.work_location}
                    </span>
                  </p>
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
              <div className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white">
                <div>
                  {employee.user_photo ? (
                    <img
                      src={getImageUrl(employee.user_photo)}
                      alt="Employee"
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center">
                      <ImageIcon size={40} />
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-3xl font-bold capitalize">
                    {employee.full_name}
                  </h2>

                  <p className="mt-2 text-rose-100">
                    {employee.designation}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-5 space-y-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
              {stats.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-black rounded-3xl p-4 shadow-xl text-white"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-medium">
                      {item.title}
                    </h3>

                    {item.icon}
                  </div>

                  <h2 className="text-[22px] font-bold mt-2 break-words">
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

        {/* DETAILS SECTION */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* LEFT */}

          <div className="col-span-12 xl:col-span-8">
            <EmployeeTabsSection
              attendanceData={empAttendance}
              salaryData={salaryData}
              bonusData={bonusData}
              penaltyData={penaltyData}
              rewardsData={rewardsData}
              complaintData={empComplaint}
              incrementData={empIncrement}
              overtimeData={empOvertime}
              esicPfData={empEsicPfData}
              meetingData={empMeeting}
              resignationData={empResignation}
              assestData={empAssest}
              employeeData={empList}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-6 col-span-12 xl:col-span-4">
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

              <div className="p-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
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
                    className="bg-rose-50 rounded-2xl p-3 border border-rose-100"
                  >
                    <p className="text-sm text-rose-500">{item[0]}</p>

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
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5">
                <h2 className="text-2xl font-bold text-white">
                  Document Details
                </h2>
              </div>

              <div className="p-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {[
                  ["Aadhaar", employee.aadhaar],
                  ["PAN", employee.pan],
                  ["Salary Type", employee.salary_type],
                  ["Salary Mode", employee.salary_mode],
                  ["Monthly Leaves", employee.monthly_leaves],
                  ["Yearly Leaves", employee.yearly_leaves],
                  ["Assets", employee.assets],
                  ["Working Hrs", employee.working_hours],
                  ["Interview By", employee.interview_by],
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-pink-50 rounded-2xl p-3 border border-pink-100"
                  >
                    <p className="text-sm text-pink-500">{item[0]}</p>

                    <h3 className="font-semibold text-slate-800 mt-1 break-words capitalize">
                      {item[1] || "-"}
                    </h3>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
        {/* DOCUMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100 mt-6"
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Employee Documents
                </h2>

                <p className="text-rose-50 text-sm mt-1">
                  All uploaded employee verification files
                </p>
              </div>

              <div className="bg-white/20 px-4 py-2 rounded-2xl text-white text-sm font-semibold">
                {documents.length} Documents
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center justify-between gap-4 bg-rose-50 border border-rose-100 rounded-2xl p-3 hover:shadow-md"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => {
                      if (doc.file) {
                        setSelectedImage({
                          url: getImageUrl(doc.file),
                          title: doc.title,
                        });
                      }
                    }}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-rose-100 flex items-center justify-center cursor-pointer"
                  >
                    {doc.file ? (
                      <img
                        src={getImageUrl(doc.file)}
                        alt={doc.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-rose-300 text-sm">
                        No File
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {doc.title}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Employee document
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 flex-wrap">
                  {doc.file && (
                    <button
                      onClick={() =>
                        setSelectedImage({
                          url: getImageUrl(doc.file),
                          title: doc.title,
                        })
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  )}

                  {doc.file ? (
                    <a
                      href={getImageUrl(doc.file)}
                      target="_blank"
                      download={`${employee.employee_id}_${doc.title}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-400 text-sm"
                    >
                      Unavailable
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* IMAGE POPUP */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full"
              >
                {/* TOP */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-rose-50">
                  <h2 className="text-lg font-bold text-slate-800">
                    {selectedImage.title}
                  </h2>

                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-10 h-10 rounded-xl bg-rose-100 hover:bg-rose-200 flex items-center justify-center"
                  >
                    <X size={20} className="text-rose-600" />
                  </button>
                </div>

                {/* IMAGE */}
                <div className="p-6 flex items-center justify-center max-h-[80vh] overflow-auto">
                  <img
                    src={selectedImage.url}
                    alt="Preview"
                    className="max-w-full max-h-[70vh] object-contain rounded-2xl"
                  />
                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 border-t bg-rose-50 flex justify-end">
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    download={`${employee.employee_id}_${selectedImage.title}`}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    <Download size={16} />
                    Download File
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}