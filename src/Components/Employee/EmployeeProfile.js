import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  User,
  CreditCard,
  Building2,
  Briefcase,
  Clock3,
  Wallet,
  BadgeCheck,
  IndianRupee,
  ShieldCheck,
  Users,
} from "lucide-react";

import SideNav from "../SideNav";
import { API_BASE_URL } from "../../config/api";

export default function EmployeeProfile() {

  const { employee_id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-lg font-semibold text-gray-700">
            Loading Employee...
          </p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
          <h2 className="text-3xl font-bold text-red-500">
            Employee Not Found
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Basic Salary",
      value: `₹${Number(employee.basic_salary).toLocaleString("en-IN")}`,
      icon: <IndianRupee size={22} />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Allowances",
      value: `₹${Number(employee.allowances).toLocaleString("en-IN")}`,
      icon: <Wallet size={22} />,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Advance",
      value: `₹${Number(employee.advance_payment).toLocaleString("en-IN")}`,
      icon: <CreditCard size={22} />,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Penalty",
      value: `₹${Number(employee.penalty).toLocaleString("en-IN")}`,
      icon: <ShieldCheck size={22} />,
      color: "from-red-500 to-rose-500",
    },
    {
      title: "Rewards",
      value: `₹${Number(employee.rewards).toLocaleString("en-IN")}`,
      icon: <BadgeCheck size={22} />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Working Hours",
      value: `${employee.working_hours} Hr`,
      icon: <Clock3 size={22} />,
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex">

      <SideNav />

      <div className="flex-1 ml-72 p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-5 mb-6 border border-pink-100">

          <div className="flex justify-between items-center flex-wrap gap-4">

            <div className="flex items-center gap-4">

              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition"
              >
                <ArrowLeft className="text-pink-600" />
              </button>

              <div>
                <h1 className="text-3xl font-bold text-gray-800 capitalize">
                  {employee.full_name}
                </h1>

                <p className="text-gray-500 mt-1">
                  Employee ID : {employee.employee_id}
                </p>
              </div>

            </div>

            <div className="flex gap-3 flex-wrap">

              <button className="px-5 py-2 rounded-xl bg-pink-100 text-pink-600 font-semibold hover:scale-105 transition">
                Complaint
              </button>

              <button className="px-5 py-2 rounded-xl bg-blue-100 text-blue-600 font-semibold hover:scale-105 transition">
                Generate KYE
              </button>

              <button className="px-5 py-2 rounded-xl bg-violet-100 text-violet-600 font-semibold hover:scale-105 transition">
                Rider Payout
              </button>

              <button
                className={`px-5 py-2 rounded-xl font-semibold hover:scale-105 transition ${
                  employee.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {employee.status}
              </button>

            </div>

          </div>

        </div>

        {/* PROFILE */}
        <div className="grid grid-cols-12 gap-6 mb-6">

          {/* LEFT */}
          <div className="col-span-12 xl:col-span-4">

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

              {/* TOP */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white text-center">

                <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white mx-auto flex items-center justify-center text-5xl font-bold">
                  {employee.full_name?.charAt(0)}
                </div>

                <h2 className="text-3xl font-bold mt-5 capitalize">
                  {employee.full_name}
                </h2>

                <p className="mt-2 opacity-90">
                  {employee.designation}
                </p>

              </div>

              {/* DETAILS */}
              <div className="p-6 space-y-5">

                <div className="flex items-center gap-3">
                  <Phone className="text-pink-500" size={20} />

                  <span className="text-gray-700">
                    +91-{employee.mobile}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-pink-500" size={20} />

                  <span className="text-gray-700 break-all">
                    {employee.email}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-pink-500 mt-1" size={20} />

                  <span className="text-gray-700 capitalize">
                    {employee.address}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="text-pink-500" size={20} />

                  <span className="text-gray-700">
                    {employee.department}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="text-pink-500" size={20} />

                  <span className="text-gray-700">
                    {employee.employment_type}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 className="text-pink-500" size={20} />

                  <span className="text-gray-700">
                    {employee.shift_time}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="col-span-12 xl:col-span-8">

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {stats.map((item, index) => (

                <div
                  key={index}
                  className={`bg-gradient-to-r ${item.color} rounded-3xl p-6 shadow-xl text-white relative overflow-hidden`}
                >

                  <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-[90px]">
                    {item.icon}
                  </div>

                  <div className="flex items-center justify-between">

                    <h3 className="text-lg font-medium">
                      {item.title}
                    </h3>

                    {item.icon}

                  </div>

                  <h2 className="text-3xl font-bold mt-8 break-words">
                    {item.value}
                  </h2>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

          {/* PERSONAL */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-5">
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
                  className="bg-rose-50 rounded-2xl p-4"
                >

                  <p className="text-sm text-gray-500">
                    {item[0]}
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-1 capitalize break-words">
                    {item[1] || "-"}
                  </h3>

                </div>

              ))}

            </div>

          </div>

          {/* DOCUMENT */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-5">
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
                  className="bg-violet-50 rounded-2xl p-4"
                >

                  <p className="text-sm text-gray-500">
                    {item[0]}
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-1 break-words capitalize">
                    {item[1] || "-"}
                  </h3>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* BANK + WORK */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* BANK */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-5">
              <h2 className="text-2xl font-bold text-white">
                Bank Details
              </h2>
            </div>

            <div className="p-6 space-y-5">

              {[
                ["Bank Account", employee.bank_account],
                ["IFSC Code", employee.ifsc],
                ["Salary Type", employee.salary_type],
                [
                  "Basic Salary",
                  `₹${Number(employee.basic_salary).toLocaleString("en-IN")}`,
                ],
                [
                  "Allowances",
                  `₹${Number(employee.allowances).toLocaleString("en-IN")}`,
                ],
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-4"
                >

                  <span className="text-gray-500 font-medium">
                    {item[0]}
                  </span>

                  <span className="font-semibold text-gray-800 break-all">
                    {item[1]}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* WORK */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-5">
              <h2 className="text-2xl font-bold text-white">
                Employee Working Info
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              {[
                ["Department", employee.department],
                ["Designation", employee.designation],
                ["Employment Type", employee.employment_type],
                ["Shift Time", employee.shift_time],
                ["Role", employee.role],
                ["OT Allow", employee.ot_allow],
              ].map((item, index) => (

                <div
                  key={index}
                  className="bg-cyan-50 rounded-2xl p-4"
                >

                  <p className="text-sm text-gray-500">
                    {item[0]}
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-1 capitalize">
                    {item[1]}
                  </h3>

                </div>

              ))}

              <div className="md:col-span-2">

                <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.01] transition text-white py-4 rounded-2xl font-semibold shadow-lg">
                  Update Employee
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}