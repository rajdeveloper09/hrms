import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  Sparkles,
  LogOut,
  UserCircle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function SideNav() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = localStorage.getItem("role") || user.role || "view";
  const empId = localStorage.getItem("emp_id") || user.employee_id || "User";

  const canShow = (allowedRoles) => allowedRoles.includes(role);

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

  const logout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("emp_id");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  return (
    <>
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

      <div
        className={`
          fixed top-0 left-0 h-screen w-72 z-50
          bg-white/95 backdrop-blur-xl shadow-2xl
          border-r border-rose-100
          transform transition-transform duration-300
          flex flex-col overflow-hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="shrink-0 bg-white/95 backdrop-blur-xl border-b border-rose-100 p-5">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-pink-200">
              <Sparkles size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Admin
              </h1>
              <p className="text-xs font-semibold text-slate-400">
                {role}
              </p>
            </div>
          </NavLink>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 sidebar-scroll">
          {canShow(["view", "contributor", "admin", "superAdmin"]) && (
            <NavLink to="/dashboard" end className={linkClass}>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
          )}

          {canShow(["view", "admin", "superAdmin"]) && (
            <NavLink to="/all-report" className={linkClass}>
              <FileText size={20} />
              All Reports
            </NavLink>
          )}

          {canShow(["contributor", "admin", "superAdmin"]) && (
            <NavLink to="/employees-list" className={linkClass}>
              <Users size={20} />
              Employee List
            </NavLink>
          )}

          {canShow(["contributor", "admin", "superAdmin"]) && (
            <MenuGroup
              title="Add/Update Reports"
              icon={<Wallet size={20} />}
              open={openMenu === "reports"}
              onClick={() => toggleMenu("reports")}
            >
              {canShow(["superAdmin"]) && (
                <NavLink to="/create-login-user" className={subLinkClass}>
                  Create Login User
                </NavLink>
              )}

              {canShow(["admin", "superAdmin"]) && (
                <>
                  <NavLink to="/create-user" className={subLinkClass}>
                    Add New Employee
                  </NavLink>

                  <NavLink to="/add-EsicPf" className={subLinkClass}>
                    Add ESIC & PF
                  </NavLink>

                  <NavLink to="/add-office-assets-category" className={subLinkClass}>
                    Add Office Assets Category
                  </NavLink>
                </>
              )}

              {canShow(["contributor", "admin", "superAdmin"]) && (
                <>
                  <NavLink to="/add-office-assets" className={subLinkClass}>
                    Add Office Assets
                  </NavLink>

                  <NavLink to="/add-expenses" className={subLinkClass}>
                    Add Expenses
                  </NavLink>

                  <NavLink to="/add-advance" className={subLinkClass}>
                    Add Advance
                  </NavLink>

                  <NavLink to="/add-bonus" className={subLinkClass}>
                    Add Bonus
                  </NavLink>

                  <NavLink to="/add-penalty" className={subLinkClass}>
                    Add Penalty
                  </NavLink>

                  <NavLink to="/add-reward" className={subLinkClass}>
                    Add Reward
                  </NavLink>
                </>
              )}
            </MenuGroup>
          )}

          {role === "view" && (
            <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm font-bold text-blue-700">
              View role: only Dashboard and Reports allowed.
            </div>
          )}
        </div>

        <div className="shrink-0 p-4 bg-white/95 backdrop-blur-xl border-t border-rose-100">
          <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 border border-rose-100 p-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-200">
                <UserCircle size={28} />
              </div>

              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-black text-slate-800 truncate">
                  {empId}
                </h3>
                <p className="text-xs font-semibold text-slate-400 truncate">
                  {role}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black shadow-lg shadow-pink-200 hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

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
        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${open
          ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600"
          : "text-slate-600 hover:bg-rose-50 hover:text-rose-600"
          }`}
      >
        <div className="flex items-center gap-3 font-bold">
          {icon}
          <span>{title}</span>
        </div>

        <div className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
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