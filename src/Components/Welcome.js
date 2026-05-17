import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  const empId = localStorage.getItem("emp_id") || "Employee";
  const welcomeKey = `welcome_seen_${empId}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(welcomeKey, "true");
      navigate("/dashboard", { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, welcomeKey]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-pink-900 p-5 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 w-full max-w-3xl text-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[36px] shadow-2xl p-8 sm:p-12 text-white">
        <div className="mx-auto mb-6 w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-5xl shadow-2xl">
          🤖
        </div>

        <p className="text-sm uppercase tracking-[5px] text-pink-200 mb-3">
          AI Powered Panel
        </p>

        <h1 className="text-4xl sm:text-6xl font-black mb-4">
          Welcome, {empId}
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 via-white to-blue-300 bg-clip-text text-transparent mb-5">
          Welcome to AI Powered Dashboard
        </h2>

        <p className="text-white/75 max-w-xl mx-auto text-sm sm:text-base mb-8">
          Smart HR automation, employee insights, attendance, reports and AI tools
          are ready for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-bold">Fast Access</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="text-3xl mb-2">🔐</div>
            <p className="font-bold">Secure Login</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-bold">Smart Reports</p>
          </div>
        </div>

        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-400 to-blue-400 rounded-full loading-bar" />
        </div>

        <p className="text-xs text-white/60 mt-4">
          Redirecting to dashboard in 5 seconds...
        </p>
      </div>

      <style>{`
        .loading-bar {
          animation: loading 5s linear forwards;
        }

        @keyframes loading {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}