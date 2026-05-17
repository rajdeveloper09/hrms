import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  Wallet,
  Briefcase,
  Building2,
  Settings,
  FileText,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function SideNav() {
  const [openMenu, setOpenMenu] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "group flex items-center gap-3 text-white font-bold bg-gradient-to-r from-rose-600 to-pink-600 p-3 rounded-2xl shadow-lg shadow-pink-200"
      : "group flex items-center gap-3 text-slate-600 font-semibold hover:text-rose-600 hover:bg-rose-50 p-3 rounded-2xl transition-all duration-300";

  const subLinkClass = ({ isActive }) =>
    isActive
      ? "block text-sm font-bold text-rose-600 bg-white border border-rose-100 px-4 py-2.5 rounded-xl shadow-sm"
      : "block text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-white px-4 py-2.5 rounded-xl transition-all";

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl shadow-lg z-50 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center justify-center shadow">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-800">Admin</h2>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-72 z-50
          bg-white/95 backdrop-blur-xl shadow-2xl
          border-r border-rose-100
          transform transition-transform duration-300
          overflow-y-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* LOGO */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-rose-100 p-5">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-pink-200">
              <Sparkles size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Admin
              </h1>
              <p className="text-xs font-semibold text-slate-400">
                Employee Panel
              </p>
            </div>
          </NavLink>
        </div>

        {/* MENU */}
        <div className="p-4 space-y-2 pb-32">
          <NavLink to="/dashboard" end className={linkClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/all-report" className={linkClass}>
            <FileText size={20} />
            All Reports
          </NavLink>

          {/* EMPLOYEE MENU */}
          <MenuGroup
            title="Employees"
            icon={<Users size={20} />}
            open={openMenu === "employee"}
            onClick={() => toggleMenu("employee")}
          >
            <NavLink to="/employees-list" className={subLinkClass}>
              Employee List
            </NavLink>

            <NavLink to="/add-employee" className={subLinkClass}>
              Add Employee
            </NavLink>

            <NavLink to="/employee-transfer" className={subLinkClass}>
              Transfer Employee
            </NavLink>
          </MenuGroup>

          {/* ADD UPDATE REPORTS */}
          <MenuGroup
            title="Add/Update Reports"
            icon={<Wallet size={20} />}
            open={openMenu === "salary"}
            onClick={() => toggleMenu("salary")}
          >
            <NavLink to="/add-increment" className={subLinkClass}>
              Add Increment
            </NavLink>

            <NavLink to="/add-areaManagerBranch" className={subLinkClass}>
              Add Area Manager Branch
            </NavLink>

            <NavLink to="/add-expenses" className={subLinkClass}>
              Add Expenses
            </NavLink>

            <NavLink to="/add-advance" className={subLinkClass}>
              Add Advance
            </NavLink>

            <NavLink to="/add-penalty" className={subLinkClass}>
              Add Penalty
            </NavLink>

            <NavLink to="/add-resignation" className={subLinkClass}>
              Add Resignation
            </NavLink>

            <NavLink to="/add-overtime" className={subLinkClass}>
              Add Over Time
            </NavLink>

            <NavLink to="/add-transfer" className={subLinkClass}>
              Add Transfer
            </NavLink>

            <NavLink to="/add-complaint" className={subLinkClass}>
              Add Complaint
            </NavLink>

            <NavLink to="/add-assests" className={subLinkClass}>
              Add Assests
            </NavLink>

            <NavLink to="/add-bonus" className={subLinkClass}>
              Add Bonus
            </NavLink>

            <NavLink to="/add-meeting" className={subLinkClass}>
              Add Meeting
            </NavLink>

            <NavLink to="/add-reward" className={subLinkClass}>
              Add Reward
            </NavLink>
          </MenuGroup>

          <NavLink to="/branches" className={linkClass}>
            <Building2 size={20} />
            Branches
          </NavLink>

          <NavLink to="/jobs" className={linkClass}>
            <Briefcase size={20} />
            Jobs
          </NavLink>

          <NavLink to="/settings" className={linkClass}>
            <Settings size={20} />
            Settings
          </NavLink>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

function MenuGroup({ title, icon, open, onClick, children }) {
  return (
    <div className="rounded-2xl">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${
          open
            ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600"
            : "text-slate-600 hover:bg-rose-50 hover:text-rose-600"
        }`}
      >
        <div className="flex items-center gap-3 font-bold">
          {icon}
          <span>{title}</span>
        </div>

        <div
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      {open && (
        <div className="ml-6 mt-2 space-y-2 border-l-2 border-rose-100 pl-4 bg-gradient-to-b from-rose-50/60 to-transparent py-2 rounded-r-2xl">
          {children}
        </div>
      )}
    </div>
  );
}