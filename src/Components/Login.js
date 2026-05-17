import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuth }) {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSupport, setShowSupport] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");

  const users = [
    { id: "HO129", pin: "9212" },
    { id: "BKD001", pin: "1234" },
  ];

  const handleLogin = () => {
    setError("");
    setSupportMsg("");

    if (!employeeId || !pin) {
      setError("Employee ID and PIN required");
      return;
    }

    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const validUser = users.find(
        (u) => u.id === employeeId.toUpperCase() && u.pin === pin
      );

      if (validUser) {
        const emp = employeeId.toUpperCase();

        localStorage.setItem("login", "true");
        localStorage.setItem("emp_id", emp);

        setIsAuth(true);
        setLoading(false);

        const welcomeKey = `welcome_seen_${emp}`;

        if (localStorage.getItem(welcomeKey) === "true") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/welcome", { replace: true });
        }
      } else {
        setLoading(false);
        setError("Invalid Employee ID or PIN");
      }

      setLoading(false);
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleSupportRequest = () => {
    setError("");

    if (!employeeId) {
      setSupportMsg("Please enter Employee ID for support request");
      return;
    }

    setSupportMsg("Reset request sent! HR will contact you.");
  };

  const handleKeyPress = (key) => {
    if (key === "Clear") setPin("");
    else if (key === "Del") setPin(pin.slice(0, -1));
    else if (pin.length < 4) setPin(pin + key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-pink-950 to-rose-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl border border-white/20">

        {/* LEFT SIDE */}
        <div className="hidden md:flex relative min-h-[640px] items-center justify-center p-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600" />

          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-white">
            <div className="mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-lg">
                🔐
              </div>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight mb-4">
              HR Smart <br /> Access
            </h1>

            <p className="text-white/85 text-base max-w-sm mb-8">
              Secure employee login with Employee ID and 4-digit PIN.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-white/80">Secure</p>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                <p className="text-2xl font-bold">Fast</p>
                <p className="text-xs text-white/80">Login</p>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
                <p className="text-2xl font-bold">Role</p>
                <p className="text-xs text-white/80">Based</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-white/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
                alt="office"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-5 sm:p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                👤
              </div>

              <h2 className="text-3xl font-extrabold text-gray-900">
                Employee Login
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Enter Employee ID and secure 4-digit PIN
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {supportMsg && (
              <div className="mb-4 rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
                {supportMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  placeholder="Example: HO01"
                  value={employeeId}
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  4 Digit PIN
                </label>
                <input
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition tracking-[12px] text-center text-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "Clear", 0, "Del"].map(
                  (key, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => handleKeyPress(key)}
                      className={`py-3 rounded-2xl font-semibold transition shadow-sm ${key === "Clear" || key === "Del"
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-pink-50 text-pink-700 hover:bg-pink-100"
                        }`}
                    >
                      {key}
                    </button>
                  )
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-200 transition disabled:opacity-60"
              >
                {loading ? "Authenticating..." : "Login Securely"}
              </button>
            </form>

            <div className="text-center mt-5">
              <button
                type="button"
                onClick={() => setShowSupport(!showSupport)}
                className="text-sm font-semibold text-pink-600 hover:text-pink-700"
              >
                Forgot PIN? Need Help
              </button>
            </div>

            {showSupport && (
              <div className="mt-4 p-4 rounded-2xl border border-pink-100 bg-pink-50">
                <p className="text-xs text-gray-600 mb-3">
                  Enter Employee ID and request PIN reset.
                </p>

                <button
                  type="button"
                  onClick={handleSupportRequest}
                  className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-semibold transition"
                >
                  Request New PIN
                </button>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-8">
              Secure Employee Access System © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}