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
    { id: "BKD001", pin: "1234" }
  ];

  const handleLogin = () => {
    setError("");

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
        localStorage.setItem("login", "true");
        localStorage.setItem("emp_id", employeeId);

        setIsAuth(true); // ✅ important
        setLoading(false);
        navigate("/dashboard");
      } else {
        setLoading(false);
        setError("Invalid Employee ID or PIN");
      }
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 🔥 prevent reload
    handleLogin();
  };

  const handleSupportRequest = () => {
    if (!employeeId) {
      setSupportMsg("Please enter Employee ID for support request");
      return;
    }

    setSupportMsg("Reset request sent! HR will contact you.");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff3a75] via-pink-500 to-rose-500 opacity-95" />

        <div className="relative text-center text-white p-10">
          <h1 className="text-4xl font-bold mb-3">HR Smart Access</h1>
          <p className="text-sm opacity-90 mb-6">
            Login with Employee ID & Secure 4-digit PIN
          </p>

          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            className="rounded-2xl shadow-2xl w-[320px] mx-auto border-4 border-white/20"
            alt="office"
          />

          <div className="mt-6 text-xs opacity-80">
            Secure • Fast • Role Based Access
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">

        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Employee Login</h1>
            <p className="text-gray-500 text-sm">Enter ID & 4-digit PIN</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          {supportMsg && (
            <div className="bg-green-100 text-green-700 p-2 rounded mb-3 text-sm">
              {supportMsg}
            </div>
          )}

          {/* ✅ FORM START */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Employee ID (e.g. EMP1023)"
              value={employeeId}
              style={{ textTransform: "uppercase" }}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            />

            <input
              type="password"
              placeholder="4 Digit PIN"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none tracking-widest text-center text-lg"
            />

            {/* PIN PAD */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600">
              {[1,2,3,4,5,6,7,8,9,"Clear",0,"Del"].map((key,i)=>(
                <button
                  type="button" // 🔥 important (warna form submit ho jayega)
                  key={i}
                  onClick={()=>{
                    if(key==="Clear") setPin("");
                    else if(key==="Del") setPin(pin.slice(0,-1));
                    else if(pin.length<4) setPin(pin+key);
                  }}
                  className="py-2 bg-pink-100 rounded hover:bg-pink-200 transition"
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              type="submit" // 🔥 Enter key ke liye
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff3a75] to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>

          </form>
          {/* ✅ FORM END */}

          <div className="text-center text-sm mt-3">
            <button
              onClick={() => setShowSupport(!showSupport)}
              className="text-pink-600 hover:underline"
            >
              Forgot PIN? Need Help / Support
            </button>
          </div>

          {showSupport && (
            <div className="mt-3 p-3 border rounded-lg bg-pink-50">
              <p className="text-xs text-gray-600 mb-2">
                Enter Employee ID and request PIN reset
              </p>

              <button
                onClick={handleSupportRequest}
                className="w-full bg-gradient-to-r from-[#ff3a75] to-pink-500 hover:from-pink-600 hover:to-rose-500 text-white py-2 rounded"
              >
                Request New PIN
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-6">
            Secure Employee Access System © 2026
          </p>

        </div>
      </div>

    </div>
  );
}