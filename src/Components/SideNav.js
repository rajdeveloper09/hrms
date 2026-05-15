import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  CalendarCheck,
  Wallet,
  FileText,
  Briefcase,
  Building2,
  Settings
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function SideNav() {
  const [openMenu, setOpenMenu] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 text-pink-600 font-semibold bg-pink-50 p-3 rounded-xl"
      : "flex items-center gap-3 hover:text-pink-500 hover:bg-pink-50 p-3 rounded-xl transition";

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50">
      {/* TOP MOBILE BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow z-50 flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-bold text-pink-600">
          Admin
        </h2>

        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`
    fixed top-0 left-0 h-screen w-72 bg-white shadow-2xl z-50
    transform transition-transform duration-300
    overflow-hidden
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        {/* LOGO */}
        <div className="p-6 border-b sticky top-0 bg-white z-20">
          <NavLink
            to="/dashboard"
            className="text-3xl font-bold text-pink-600"
          >
            Admin
          </NavLink>
        </div>

        {/* MENU */}
        <div className="p-4 space-y-2 pb-32">

          {/* Dashboard */}
          <NavLink to="/dashboard" end className={linkClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          {/* EMPLOYEE MENU */}
          <div>
            <button
              onClick={() => toggleMenu("employee")}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-pink-50"
            >
              <div className="flex items-center gap-3">
                <Users size={20} />
                <span>Employees</span>
              </div>

              {openMenu === "employee" ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>

            {openMenu === "employee" && (
              <div className="ml-8 mt-2 space-y-2">
                <NavLink
                  to="/employees-list"
                  className={linkClass}
                >
                  Employee List
                </NavLink>

                <NavLink
                  to="/add-employee"
                  className={linkClass}
                >
                  Add Employee
                </NavLink>

                <NavLink
                  to="/employee-transfer"
                  className={linkClass}
                >
                  Transfer Employee
                </NavLink>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleMenu("salary")}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-pink-50"
            >
              <div className="flex items-center gap-3">
                <Wallet size={20} />
                <span>Add/Update Reports</span>
              </div>

              {openMenu === "salary" ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>

            {openMenu === "salary" && (
              <div className="ml-8 mt-2 space-y-2">
                
                <NavLink
                  to="/all-report"
                  className={linkClass}
                >
                  All Reports
                </NavLink>
                <NavLink
                  to="/add-penalty"
                  className={linkClass}
                >
                  Add Penalty
                </NavLink>


                <NavLink
                  to="/add-resignation"
                  className={linkClass}
                >
                  Add Resignation
                </NavLink>


                <NavLink
                  to="/add-overtime"
                  className={linkClass}
                >
                  Add Over Time
                </NavLink>


                <NavLink to="/add-complaint" className={linkClass}>
                  Add Complaint
                </NavLink>

                <NavLink to="/add-assests" className={linkClass}>
                  Add Assests
                </NavLink>

                <NavLink to="/add-bonus" className={linkClass}>
                  Add Bonus
                </NavLink>

                <NavLink to="/add-increment" className={linkClass}>
                  Add Increment
                </NavLink>

                <NavLink to="/add-meeting" className={linkClass}>
                  Add Meeting
                </NavLink>

                <NavLink to="/add-reward" className={linkClass}>
                  Add Reward
                </NavLink>

              </div>
            )}
          </div>

          {/* BRANCH */}
          <NavLink to="/branches" className={linkClass}>
            <Building2 size={20} />
            Branches
          </NavLink>

          {/* JOB */}
          <NavLink to="/jobs" className={linkClass}>
            <Briefcase size={20} />
            Jobs
          </NavLink>

          {/* SETTINGS */}
          <NavLink to="/settings" className={linkClass}>
            <Settings size={20} />
            Settings
          </NavLink>
        </div>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}