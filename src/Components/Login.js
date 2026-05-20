import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://ojmee.in/employee";

export default function Login({ setIsAuth }) {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!employeeId || !pin) return setError("Employee ID and PIN required");
    if (pin.length !== 4) return setError("PIN must be 4 digits");

    try {
      setLoading(true);

      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId, pin }),
      });

      const data = await res.json();

      if (!data.status) {
        setError(data.message || "Invalid login");
        setLoading(false);
        return;
      }

      localStorage.setItem("login", "true");
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("emp_id", data.user.employee_id);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsAuth(true);
      setLoading(false);

      const welcomeKey = `welcome_seen_${data.user.employee_id}`;
      navigate(localStorage.getItem(welcomeKey) === "true" ? "/dashboard" : "/welcome", {
        replace: true,
      });
    } catch (err) {
      setLoading(false);
      setError("Server not working");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleKeyPress = (key) => {
    if (key === "Clear") setPin("");
    else if (key === "Del") setPin(pin.slice(0, -1));
    else if (pin.length < 4) setPin(pin + key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-pink-950 to-rose-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl border border-white/20">
        <div className="hidden md:flex relative min-h-[640px] items-center justify-center p-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600" />
          <div className="relative z-10 text-white">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mb-8">🔐</div>
            <h1 className="text-5xl font-extrabold leading-tight mb-4">HR Smart <br /> Access</h1>
            <p className="text-white/85 text-base max-w-sm mb-8">
              Secure dynamic employee login with role based access.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                👤
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">Employee Login</h2>
              <p className="text-gray-500 text-sm mt-2">Enter Employee ID and 4-digit PIN</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Employee ID"
                value={employeeId}
                style={{ textTransform: "uppercase" }}
                onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-2xl border bg-gray-50 outline-none"
              />

              <input
                type="password"
                placeholder="••••"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 rounded-2xl border bg-gray-50 outline-none tracking-[12px] text-center text-xl font-bold"
              />

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[1,2,3,4,5,6,7,8,9,"Clear",0,"Del"].map((key, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleKeyPress(key)}
                    className="py-3 rounded-2xl font-semibold bg-pink-50 text-pink-700 hover:bg-pink-100"
                  >
                    {key}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg disabled:opacity-60"
              >
                {loading ? "Authenticating..." : "Login Securely"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}