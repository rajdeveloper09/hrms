import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { useRef } from "react";
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
  FileText,
} from "lucide-react";

import SideNav from "../SideNav";
import { API_BASE_URL } from "../../config/api";
import { Chart10 } from "../Charts/Chart10";
import EmployeeTabsSection from "./EmployeeTabsSection";

export default function EmployeeProfile() {



  const waitForImages = async (element) => {
    const images = Array.from(element.querySelectorAll("img"));

    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }

            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );
  };

  const idCardRef = useRef(null);

  const downloadIdCard = async () => {
    const card = idCardRef.current;
    if (!card) return;

    await waitForImages(card);

    const canvas = await html2canvas(card, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const link = document.createElement("a");
    link.download = `${employee.employee_id}_ID_Card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const [showKyc, setShowKyc] = useState(false);
  const kycRef = useRef(null);
  const downloadKycForm = async () => {
    const form = kycRef.current;
    if (!form) return;

    const canvas = await html2canvas(form, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const link = document.createElement("a");
    link.download = `${employee.employee_id}_KYC_Form.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

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

    if (path.startsWith("http")) return path;

    return `${API_BASE_URL}/${path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
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
      title: "Month Salary",
      value: `₹${(
        Number(employee.basic_salary || 0) +
        Number(employee.allowances || 0)
      ).toLocaleString("en-IN")}`,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "Total Bonus",
      value: <span>
        ₹{
          bonusData
            ?.filter(
              (item) =>
                item.emp_id === employee.employee_id &&
                item.status === "Accepted"
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.total_bonus_amount || 0),
              0
            )
            .toLocaleString("en-IN")
        }
      </span>,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "Total Rewards",
      value: <span>
        ₹{
          rewardsData
            ?.filter(
              (item) =>
                item.emp_id === employee.employee_id &&
                item.status === "Accepted"
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.total_reward_amount || 0),
              0
            )
            .toLocaleString("en-IN")
        }
      </span>,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "Total Penalty",
      value: <span>
        ₹{
          penaltyData
            ?.filter(
              (item) =>
                item.emp_id === employee.employee_id &&
                item.status === "Completed"
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.penalty_amount || 0),
              0
            )
            .toLocaleString("en-IN")
        }
      </span>,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "Total PF",
      value: <span>
        ₹{
          empEsicPfData
            ?.filter(
              (item) =>
                item.emp_id === employee.employee_id &&
                item.status === "Active"
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.pf_employee_amount || 0),
              0
            )
            .toLocaleString("en-IN")
        }
      </span>,
      icon: <IndianRupee size={22} />,
    },
    {
      title: "Total ESIC",
      value: <span>
        ₹{
          empEsicPfData
            ?.filter(
              (item) =>
                item.emp_id === employee.employee_id &&
                item.status === "Active"
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.esic_employee_amount || 0),
              0
            )
            .toLocaleString("en-IN")
        }
      </span>,
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
      {/* Download KYE */}
      <AnimatePresence>
        {showKyc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden"
            >
              <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center">
                <h2 className="text-xl font-black">KYC Form Preview</h2>

                <div className="flex gap-3">
                  <button
                    onClick={downloadKycForm}
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                  >
                    Download KYC
                  </button>

                  <button
                    onClick={() => setShowKyc(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-auto max-h-[88vh] bg-slate-200 p-4">
                <div
                  ref={kycRef}
                  className="bg-white mx-auto text-black"
                  style={{
                    width: "794px",
                    minHeight: "1123px",
                    padding: "18px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                  }}
                >
                  <div className="border-2 border-black">
                    <div className="grid grid-cols-12 border-b-2 border-black">
                      <div className="col-span-3 p-2 text-[11px] font-bold leading-tight">
                        OJMEE TECHNOLOGY (P) LIMITED <br />
                        C-9 T V K Industrial Estate <br />
                        Gurgaon - 600 032
                      </div>

                      <div className="col-span-6 text-center p-2">
                        <h1 className="text-2xl font-black">Know Your Customer (KYC) Form</h1>
                      </div>

                      <div className="col-span-3 p-2 text-right">
                        <div className="text-blue-600 text-xl font-black">OJMEECARD</div>
                        <div className="text-orange-500 text-xs font-black">DO MORE</div>
                      </div>
                    </div>

                    <div className="text-center text-[11px] font-bold border-b border-black py-1">
                      INSTRUCTIONS : Please fill the form in BLOCK LETTERS in English only.
                    </div>

                    <SectionTitle title="IDENTITY DETAILS" />

                    <div className="grid grid-cols-12 gap-2 p-3">
                      <div className="col-span-9 space-y-3">
                        <KycLine label="1. NAME OF THE APPLICANT" value={employee.full_name} />
                        <KycLine label="2. FATHER / MOTHER NAME" value={employee.father_name || employee.mother_name} />
                        <KycLine label="3. RESIDENTIAL ADDRESS" value={employee.address} />
                        <KycLine label="4. TOWN / CITY / DISTRICT" value={employee.work_location} />
                        <KycLine label="5. STATE / UNION TERRITORY" value="" />
                      </div>

                      <div className="col-span-3 flex justify-center">
                        <div className="w-28 h-36 border border-black flex items-center justify-center text-[10px]">
                          {employee.user_photo ? (
                            <img
                              src={getImageUrl(employee.user_photo)}
                              crossOrigin="anonymous"
                              alt="Photo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "PHOTO"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 px-3 pb-2">
                      <div className="col-span-4">
                        <KycSmall label="6. PINCODE" value="" />
                      </div>
                      <div className="col-span-4">
                        <KycSmall label="7. TELEPHONE NO" value="" />
                      </div>
                      <div className="col-span-4">
                        <KycSmall label="8. MOBILE NO" value={employee.mobile} />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 px-3 pb-2">
                      <div className="col-span-4">
                        <KycSmall label="9. D.O.B" value={employee.dob} />
                      </div>
                      <div className="col-span-8">
                        <KycSmall label="10. EMAIL" value={employee.email} />
                      </div>
                    </div>

                    <div className="px-3 pb-2">
                      <KycLine
                        label="11. IDENTITY DETAILS PLEASE TICK ANY ONE"
                        value={`Aadhaar: ${employee.aadhaar || "-"} / PAN: ${employee.pan || "-"}`}
                      />
                    </div>

                    <SectionTitle title="ADDRESS PROOF FOR VERIFICATION" />

                    <div className="px-3 py-2 grid grid-cols-4 gap-2 text-[11px]">
                      <CheckBox label="Passport" />
                      <CheckBox label="Voter ID" />
                      <CheckBox label="PAN Card" checked={!!employee.pan} />
                      <CheckBox label="Latest Electricity Bill" />
                      <CheckBox label="Aadhaar Card" checked={!!employee.aadhaar} />
                      <CheckBox label="Bank Proof" checked={!!employee.bank_proff} />
                      <CheckBox label="Ration Card" />
                      <CheckBox label="LPG Receipt" />
                    </div>

                    <div className="grid grid-cols-12 gap-2 px-3 py-2 border-t border-black">
                      <div className="col-span-6">
                        <KycSmall label="13. PAN NO" value={employee.pan} />
                      </div>
                      <div className="col-span-6">
                        <KycSmall label="14. NATIONALITY" value="Indian" />
                      </div>
                    </div>

                    <SectionTitle title="Verification" />

                    <div className="px-3 py-4 text-[11px] leading-6">
                      I ______________________________ do hereby declare that what I stated above is true to the best of my knowledge and belief.
                    </div>

                    <SectionTitle title="Terms and conditions" />

                    <div className="px-5 py-3 text-[11px] leading-6 space-y-2">
                      <p>1. Redemption of card is not allowed as per RBI guidelines.</p>
                      <p>2. For any misuse or fraudulent activity using the card will lead to severe legal action.</p>
                      <p>3. These terms and conditions are part of a contract between customer and company.</p>
                      <p>4. Card should not be used for any cross border transactions.</p>
                      <p>5. Card once submitted for purchase will not be cancelled.</p>
                      <p>6. Company is not responsible for any merchant/service provider issue.</p>
                      <p>7. The card is property of company and must be returned when requested.</p>
                      <p>8. You agree to pay full amount of the card.</p>
                      <p>9. Company is not responsible for misuse of card.</p>
                      <p>10. Company reserves the right to amend or withdraw the card without prior notice.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 px-5 py-5 text-[11px]">
                      <div>Verified By __________________</div>
                      <div>Signature / Seal ______________</div>
                      <div>Date __________________</div>
                    </div>

                    <div className="px-5 pb-5 text-[10px]">
                      For Head Office use / Record purpose only.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Download KYE */}

      <div style={{ position: "fixed", left: "0px", top: "0px", opacity: 0, pointerEvents: "none", zIndex: -1 }}>
        <div
          ref={idCardRef}
          style={{
            width: "320px",
            height: "520px",
            borderRadius: "28px",
            overflow: "hidden",
            background: "#ffffff",
            border: "2px solid #111",
            fontFamily: "Arial, sans-serif",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "150px",
              background: "#201b1f",
              color: "#fff",
              textAlign: "center",
              paddingTop: "22px",
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: "800" }}>
              OJMEE Tech Pvt Ltd
            </div>
            <div style={{ fontSize: "14px", marginTop: "5px" }}>
              Employee Id Card
            </div>
          </div>

          <div
            style={{
              height: "70px",
              background: "linear-gradient(135deg,#f97316,#facc15)",
              borderBottomLeftRadius: "100% 55%",
              marginTop: "-35px",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "-55px",
              width: "100%",
            }}
          >
            <img
              src={
                employee.user_photo
                  ? getImageUrl(employee.user_photo)
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Employee"
              crossOrigin="anonymous"
              onError={(e) => {
                console.log(
                  "ID Card image failed:",
                  getImageUrl(employee.user_photo)
                );

                e.currentTarget.src =
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
              }}
              style={{
                width: "105px",
                height: "105px",
                objectFit: "cover",
                borderRadius: "16px",
                border: "5px solid #f97316",
                background: "#fff",
                boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
              }}
            />
          </div>

          <div style={{ textAlign: "center", marginTop: "18px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "900",
                color: "#111",
                textTransform: "uppercase",
              }}
            >
              {employee.full_name}
            </h2>

            <p
              style={{
                margin: "5px 0 24px",
                color: "#f97316",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              {employee.designation}
            </p>
          </div>

          <div
            style={{
              padding: "0 42px",
              fontSize: "15px",
              lineHeight: "26px",
              color: "#111",
            }}
          >
            <div><b>Emp. Code :</b> {employee.employee_id}</div>
            <div><b>Branch Code :</b> {employee.work_location || "-"}</div>
            <div><b>Department :</b> {employee.department || "-"}</div>
            <div><b>Joining Date :</b> {
              employee.joining_date
                ? new Date(employee.joining_date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "-"
            }</div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50px",
              background: "#f97316",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontSize: "14px",
            }}
          >
            www.ojmeetech.in
          </div>
        </div>
      </div>

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

            <div className="flex bg-white border border-rose-100 shadow-sm rounded-2xl px-4 py-2">
              <button
                className={`h-12 px-6 rounded-2xl mr-4 font-semibold ${employee.salary_type === "Hold"
                  ? "bg-rose-100 text-rose-600"
                  : "bg-emerald-100 text-emerald-600"
                  }`}
              >
                Salary Status : {employee.salary_type}
              </button>
              <button
                className={`h-12 px-6 rounded-2xl font-semibold ${employee.status === "Active"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
                  }`}
              >
                User Status : {employee.status}
              </button>
              <button
                onClick={() => setShowKyc(true)}
                className="h-12 px-6 rounded-2xl ml-4 mr-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm font-bold transition-all flex items-center gap-2"
              >
                <FileText size={18} />
                KYC Form
              </button>
              <button
                onClick={downloadIdCard}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-bold transition-all">
                Download ID Card
              </button>
            </div>
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
                    Email Id : {employee.email}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-rose-500 mt-1" size={20} />
                  <span className="text-slate-700 capitalize">
                    Address : {employee.address}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="text-rose-500" size={20} />
                  <span className="text-slate-700">
                    Department : {employee.department}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="text-rose-500" size={20} />
                  <span className="text-slate-700">
                    Working Type : {employee.employment_type}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 className="text-rose-500" size={20} />
                  <span className="text-slate-700">
                    Shift Time : {
                      employee.shift_time
                        ? new Date(`2000-01-01 ${employee.shift_time}`)
                          .toLocaleTimeString("en-IN", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "-"
                    }
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
              <Chart10 complaintData={empComplaint}  penaltyData={penaltyData} />
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

function SectionTitle({ title }) {
  return (
    <div className="bg-slate-200 border-y border-black px-2 py-1 text-[11px] font-black">
      {title}
    </div>
  );
}

function KycLine({ label, value }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-4 text-[10px] font-bold">{label}</div>
      <div className="col-span-8 border-b border-black min-h-[22px] text-[12px] font-bold uppercase px-2">
        {value || ""}
      </div>
    </div>
  );
}

function KycSmall({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-bold mb-1">{label}</div>
      <div className="border-b border-black min-h-[22px] text-[12px] font-bold uppercase px-2">
        {value || ""}
      </div>
    </div>
  );
}

function CheckBox({ label, checked }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 border border-black inline-flex items-center justify-center text-[9px]">
        {checked ? "✓" : ""}
      </span>
      <span>{label}</span>
    </div>
  );
}