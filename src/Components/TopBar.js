import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Bell,
    Settings,
    UserCircle2,
    Menu
} from "lucide-react";

export default function TopBar({ setIsAuth }) {
    const navigate = useNavigate();

    const [currentTime, setCurrentTime] = useState(new Date());

    // ✅ LIVE CLOCK
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // ✅ LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("login");
        localStorage.removeItem("emp_id");

        if (setIsAuth) {
            setIsAuth(false);
        }

        navigate("/");
    };

    // ✅ DATE FORMAT
    const formattedDate = currentTime.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    // ✅ TIME FORMAT
    const formattedTime = currentTime.toLocaleTimeString("en-IN");

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5 mb-4">

            {/* TOP SECTION */}
            <div className="flex justify-between items-center">

                {/* LEFT */}
                <div className="flex items-center gap-4">

                    {/* MENU ICON */}
                    {/* <button className="p-2 rounded-xl hover:bg-pink-50 transition">
            <Menu className="w-6 h-6 text-gray-700" />
          </button> */}

                    {/* DASHBOARD TEXT */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Dashboard
                        </h1>

                        {/* LIVE DATE + TIME */}
                        <div className="mt-1 flex gap-3 text-sm text-gray-500">
                            <span>{formattedDate}</span>
                            <span>|</span>
                            <span className="font-semibold text-pink-600">
                                {formattedTime}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">

                    {/* NOTIFICATION */}
                    <button className="relative p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 transition">
                        <Bell className="w-5 h-5 text-pink-600" />

                        {/* DOT */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* SETTINGS */}
                    <button className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition">
                        <Settings className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* USER */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border">

                        <UserCircle2 className="w-10 h-10 text-pink-500" />

                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-800">
                                Admin User
                            </p>

                            <p className="text-xs text-gray-500">
                                HR Management
                            </p>
                        </div>
                    </div>

                    {/* LOGOUT */}
                    <button
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 transition text-white px-6 py-3 rounded-2xl shadow-md font-semibold"
                    >
                        Logout
                    </button>

                </div>
            </div>
        </div>
    );
}