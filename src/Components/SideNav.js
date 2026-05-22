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

const NAV_ITEMS = [
  {
    type: "link",
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    type: "link",
    label: "Add Permission",
    path: "/create-user-permission",
    icon: <FileText size={20} />,
  },
  {
    type: "link",
    label: "All Reports",
    path: "/all-report",
    icon: <FileText size={20} />,
  },
  {
    type: "link",
    label: "Employee List",
    path: "/employees-list",
    icon: <Users size={20} />,
  },
   {
    type: "link",
    label: "Update Employee Salary Type",
    path: "/update-salary-type",
    icon: <Users size={20} />,
  },
  {
    type: "group",
    label: "Add/Update Reports",
    key: "reports",
    icon: <Wallet size={20} />,
    children: [
      //{ label: "Create Login User", path: "/create-login-user" },
      { label: "Create Login User", path: "/create-user" },
      { label: "Add ESIC & PF", path: "/add-EsicPf" },
      { label: "Final Salary", path: "/final-salary" },
      { label: "Add Office Assets Category", path: "/add-office-assets-category" },
      { label: "Add Office Assets", path: "/add-office-assets" },
      { label: "Add Employee Assets", path: "/add-assests" },
      { label: "Add Expenses", path: "/add-expenses" },
      { label: "Add Advance", path: "/add-advance" },
      { label: "Add Bonus", path: "/add-bonus" },
      { label: "Add Penalty", path: "/add-penalty" },
      { label: "Add Reward", path: "/add-reward" },
      { label: "Add Complaint", path: "/add-complaint" },
      { label: "Add Increment", path: "/add-increment" },
      { label: "Add Meeting", path: "/add-meeting" },
      { label: "Add Resignation", path: "/add-resignation" },
      { label: "Add Overtime", path: "/add-overtime" },
      { label: "Add Transfer", path: "/add-transfer" },
      { label: "Add Employee Aassets List", path: "/add-employee-assets-list" },
    ],
  },
];

export default function SideNav() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = localStorage.getItem("role") || user.role || "view";
  const empId = localStorage.getItem("emp_id") || user.employee_id || "User";

  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  const hasViewPermission = (path) => {
    if (role === "superAdmin") return true;

    return permissions.some(
      (p) =>
        p.route_path === path &&
        Number(p.can_view) === 1
    );
  };

  const visibleNavItems = NAV_ITEMS.map((item) => {
    if (item.type === "link") {
      return hasViewPermission(item.path) ? item : null;
    }

    if (item.type === "group") {
      const children = item.children.filter((child) =>
        hasViewPermission(child.path)
      );

      if (children.length === 0) return null;

      return { ...item, children };
    }

    return null;
  }).filter(Boolean);

  const linkClass = ({ isActive }) =>
    isActive
      ? "group flex items-center gap-3 text-white font-bold bg-gradient-to-r from-rose-600 to-pink-600 p-3 rounded-2xl shadow-lg shadow-pink-200"
      : "group flex items-center gap-3 text-slate-600 font-semibold hover:text-rose-600 hover:bg-rose-50 p-3 rounded-2xl transition-all duration-300";

  const subLinkClass = ({ isActive }) =>
    isActive
      ? "block text-sm font-bold text-rose-600 bg-white border border-rose-100 px-4 py-2.5 rounded-xl shadow-sm"
      : "block text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-white px-4 py-2.5 rounded-xl transition-all";

  const logout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("emp_id");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
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
        className={`fixed top-0 left-0 h-screen w-72 z-50 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-rose-100 transform transition-transform duration-300 flex flex-col overflow-hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
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
              <p className="text-xs font-semibold text-slate-400">{role}</p>
            </div>
          </NavLink>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 sidebar-scroll">
          {visibleNavItems.map((item) => {
            if (item.type === "link") {
              return (
                <NavLink key={item.path} to={item.path} end className={linkClass}>
                  {item.icon}
                  {item.label}
                </NavLink>
              );
            }

            return (
              <MenuGroup
                key={item.key}
                title={item.label}
                icon={item.icon}
                open={openMenu === item.key}
                onClick={() =>
                  setOpenMenu(openMenu === item.key ? "" : item.key)
                }
              >
                {item.children.map((child) => (
                  <NavLink key={child.path} to={child.path} className={subLinkClass}>
                    {child.label}
                  </NavLink>
                ))}
              </MenuGroup>
            );
          })}
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black shadow-lg"
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