import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDefaultRedirect } from "../utils/permissionRedirect";

export default function Welcome() {
  const navigate = useNavigate();

  const empId = localStorage.getItem("emp_id") || "Employee";
  const welcomeKey = `welcome_seen_${empId}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(welcomeKey, "true");
      navigate(getDefaultRedirect(), { replace: true });
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate, welcomeKey]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-300 via-white to-pink-50 p-5 relative overflow-hidden">

      {/* BACKGROUND BLUR */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-rose-200/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl text-center bg-white/90 backdrop-blur-2xl border border-rose-100 rounded-[40px] shadow-2xl shadow-rose-100 p-8 sm:p-12">

        {/* TITLE */}
        <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mt-5 mb-8">
          AI Powered Dashboard
        </h2>

        {/* USER */}
        <h1 className="text-4xl sm:text-6xl font-black mb-5 text-slate-900">
          Welcome, {empId}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base mb-10 leading-7">
          Smart HR automation, employee analytics, attendance management,
          AI reports and intelligent monitoring system are ready for you.
        </p>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

          <div className="bg-rose-50 rounded-3xl p-5 border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
              alt="AI"
              className="w-14 h-14 mx-auto mb-3 animate-bounce"
            />

            <p className="font-black text-slate-800 text-lg">
              AI Access
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Smart automated employee panel
            </p>
          </div>

          <div className="bg-pink-50 rounded-3xl p-5 border border-pink-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
              alt="Security"
              className="w-14 h-14 mx-auto mb-3 animate-pulse"
            />

            <p className="font-black text-slate-800 text-lg">
              Secure Login
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Protected employee authentication
            </p>
          </div>

          <div className="bg-rose-50 rounded-3xl p-5 border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4149/4149647.png"
              alt="Reports"
              className="w-14 h-14 mx-auto mb-3 animate-spin"
              style={{ animationDuration: "8s" }}
            />

            <p className="font-black text-slate-800 text-lg">
              Smart Reports
            </p>

            <p className="text-xs text-slate-500 mt-1">
              AI generated analytics & reports
            </p>
          </div>

        </div>

        {/* LOADING BAR */}
        <div className="w-full bg-rose-100 rounded-full h-3 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-600 to-pink-600 rounded-full loading-bar" />
        </div>

        <p className="text-[14px] text-slate-400 font-semibold mt-4">
          Redirecting to your allowed page in 8 seconds...
        </p>

      </div>

      <style>{`
        .loading-bar {
          animation: loading 8s linear forwards;
        }

        @keyframes loading {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}