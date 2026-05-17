import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Bell,
    Settings,
    UserCircle2,
} from "lucide-react";

export default function TopBar({ setIsAuth }) {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedDate = currentTime.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const formattedTime = currentTime.toLocaleTimeString("en-IN");

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5 mb-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Dashboard
                        </h1>
                        <div className="mt-1 flex gap-3 text-sm text-gray-500">
                            <span>{formattedDate}</span>
                            <span>|</span>
                            <span className="font-semibold text-pink-600">
                                {formattedTime}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 transition">
                        <Bell className="w-5 h-5 text-pink-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition">
                        <Settings className="w-5 h-5 text-gray-700" />
                    </button>
                    {/* <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border">
                        <UserCircle2 className="w-10 h-10 text-pink-500" />
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-800">
                                Admin User
                            </p>
                            <p className="text-xs text-gray-500">
                                HR Management
                            </p>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    );
}