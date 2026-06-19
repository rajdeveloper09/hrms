import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNav from "./SideNav";

const API = "https://hrms-apis-ezda.onrender.com";

const MODULES = [
  {
    module_name: "Main",
    pages: [
      { page_name: "Dashboard", route_path: "/dashboard" },
      { page_name: "Add Permission", route_path: "/create-user-permission" },
      { page_name: "All Reports", route_path: "/all-report" },
      { page_name: "Employee List", route_path: "/employees-list" },
    ],
  },
  {
    module_name: "User Management",
    pages: [
      { page_name: "Create Login User", route_path: "/create-login-user" },
      { page_name: "Add New Employee", route_path: "/create-user" },
    ],
  },
  {
    module_name: "Salary / HR",
    pages: [
      { page_name: "Add ESIC & PF", route_path: "/add-EsicPf" },
      { page_name: "Add Advance", route_path: "/add-advance" },
      { page_name: "Add Bonus", route_path: "/add-bonus" },
      { page_name: "Add Penalty", route_path: "/add-penalty" },
      { page_name: "Add Reward", route_path: "/add-reward" },
      { page_name: "Add Increment", route_path: "/add-increment" },
      { page_name: "Add Expenses", route_path: "/add-expenses" },
    ],
  },
  {
    module_name: "Office Assets",
    pages: [
      { page_name: "Add Office Assets", route_path: "/add-office-assets" },
      { page_name: "Add Office Assets Category", route_path: "/add-office-assets-category" },
    ],
  },
  {
    module_name: "Employee Action",
    pages: [
      { page_name: "Add Complaint", route_path: "/add-complaint" },
      { page_name: "Add Meeting", route_path: "/add-meeting" },
      { page_name: "Add Resignation", route_path: "/add-resignation" },
      { page_name: "Add Overtime", route_path: "/add-overtime" },
      { page_name: "Add Transfer", route_path: "/add-transfer" },
    ],
  },
];

export default function EmployeePermissionPage() {
  const [loginUsers, setLoginUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState({});
  const [openModule, setOpenModule] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoginUsers();
  }, []);

  const fetchLoginUsers = async () => {
    try {
      const res = await axios.get(`${API}/get_login_users`);

      const normalUsers = (res.data.data || []).filter(
        (u) => u.role !== "superAdmin"
      );

      setLoginUsers(normalUsers);
    } catch (err) {
      alert("Login users fetch failed");
    }
  };

  const createBasePermissions = () => {
    const base = {};

    MODULES.forEach((mod) => {
      mod.pages.forEach((page) => {
        const key = `${mod.module_name}__${page.page_name}`;

        base[key] = {
          module_name: mod.module_name,
          page_name: page.page_name,
          route_path: page.route_path,
          can_view: false,
          can_add: false,
          can_edit: false,
          can_delete: false,
        };
      });
    });

    return base;
  };

  const loadPermissions = async (userId) => {
    if (!userId) {
      setSelectedUserId("");
      setSelectedEmpId("");
      setSelectedName("");
      setSelectedRole("");
      setPermissions({});
      return;
    }

    const user = loginUsers.find((u) => String(u.id) === String(userId));

    if (!user || user.role === "superAdmin") {
      setSelectedUserId("");
      setSelectedEmpId("");
      setSelectedName("");
      setSelectedRole("");
      setPermissions({});
      return alert("Super Admin permission cannot be modified");
    }

    setSelectedUserId(userId);
    setSelectedEmpId(user.employee_id || "");
    setSelectedName(user.full_name || "");
    setSelectedRole(user.role || "");

    const base = createBasePermissions();

    try {
      const res = await axios.get(
        `${API}/get_login_user_permissions?login_user_id=${userId}`
      );

      (res.data.data || []).forEach((p) => {
        const key = `${p.module_name}__${p.page_name}`;

        if (base[key]) {
          base[key] = {
            ...base[key],
            can_view: Number(p.can_view) === 1,
            can_add: Number(p.can_add) === 1,
            can_edit: Number(p.can_edit) === 1,
            can_delete: Number(p.can_delete) === 1,
          };
        }
      });
    } catch (err) {
      console.log("Permission load error:", err);
    }

    setPermissions(base);
    setOpenModule(MODULES[0].module_name);
  };

  const togglePermission = (moduleName, pageName, field) => {
    const key = `${moduleName}__${pageName}`;

    setPermissions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: !prev[key]?.[field],
      },
    }));
  };

  const selectRowAll = (moduleName, page, checked) => {
    const key = `${moduleName}__${page.page_name}`;

    setPermissions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        can_view: checked,
        can_add: checked,
        can_edit: checked,
        can_delete: checked,
      },
    }));
  };

  const selectModuleAll = (mod, checked) => {
    setPermissions((prev) => {
      const updated = { ...prev };

      mod.pages.forEach((page) => {
        const key = `${mod.module_name}__${page.page_name}`;
        updated[key] = {
          ...updated[key],
          can_view: checked,
          can_add: checked,
          can_edit: checked,
          can_delete: checked,
        };
      });

      return updated;
    });
  };

  const isModuleAllChecked = (mod) => {
    return mod.pages.every((page) => {
      const p = permissions[`${mod.module_name}__${page.page_name}`];
      return p?.can_view && p?.can_add && p?.can_edit && p?.can_delete;
    });
  };

  const countModulePermissions = (moduleName) => {
    return Object.values(permissions).filter(
      (p) =>
        p.module_name === moduleName &&
        (p.can_view || p.can_add || p.can_edit || p.can_delete)
    ).length;
  };

  const savePermissions = async () => {
    if (!selectedUserId) return alert("Select login user first");

    try {
      setLoading(true);

      const payload = {
        login_user_id: selectedUserId,
        employee_id: selectedEmpId,
        full_name: selectedName,
        role: selectedRole,
        permissions: Object.values(permissions),
      };

      const res = await axios.post(
        `${API}/save_login_user_permissions`,
        payload
      );

      setLoading(false);

      if (res.data.status) {
        alert(res.data.message);
        loadPermissions(selectedUserId);
      } else {
        alert(res.data.message || "Permission save failed");
      }
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Save API failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <SideNav />

      <div className="flex-1 lg:ml-72 p-4 md:p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-900 to-pink-700 text-white">
            <h1 className="text-3xl font-black">Login User Permission Setup</h1>
            <p className="text-pink-100 mt-1">
              Old checked permission auto load hoga, fir superAdmin check/uncheck karke modify kar sakta hai.
            </p>
          </div>

          <div className="p-6 border-b">
            <label className="font-black text-slate-700">
              Select Login User
            </label>

            <select
              value={selectedUserId}
              onChange={(e) => loadPermissions(e.target.value)}
              className="mt-3 w-full max-w-2xl px-4 py-3 rounded-2xl border border-slate-200 font-bold"
            >
              <option value="">Select Login User</option>
              {loginUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.employee_id} - {u.full_name} ({u.role})
                </option>
              ))}
            </select>

            {selectedUserId && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Info title="Employee ID" value={selectedEmpId} />
                <Info title="Full Name" value={selectedName} />
                <Info title="Role" value={selectedRole} />
              </div>
            )}
          </div>

          <div className="p-5 space-y-4">
            {MODULES.map((mod, index) => {
              const isOpen = openModule === mod.module_name;
              const count = countModulePermissions(mod.module_name);
              const moduleAll = isModuleAllChecked(mod);

              return (
                <div key={mod.module_name} className="border rounded-2xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenModule(isOpen ? "" : mod.module_name)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full border flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span className="font-black">{mod.module_name}</span>
                    </div>

                    <div className="flex items-center gap-5">
                      <span className="text-sm font-bold">{count} Permissions</span>

                      <label
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-xs font-black"
                      >
                        <input
                          type="checkbox"
                          checked={moduleAll}
                          onChange={(e) => selectModuleAll(mod, e.target.checked)}
                          className="w-4 h-4 accent-green-600"
                        />
                        All
                      </label>

                      <span className="text-2xl">{isOpen ? "−" : "+"}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-5 bg-slate-50 overflow-x-auto">
                      <div className="min-w-[760px] grid grid-cols-6 bg-white border rounded-xl px-4 py-3 text-xs font-black text-slate-700">
                        <div>Page or Navigation</div>
                        <div className="text-center">View</div>
                        <div className="text-center">Add</div>
                        <div className="text-center">Edit</div>
                        <div className="text-center">Delete</div>
                        <div className="text-center">All</div>
                      </div>

                      {mod.pages.map((page) => {
                        const key = `${mod.module_name}__${page.page_name}`;
                        const p = permissions[key] || {};
                        const rowAll =
                          p.can_view && p.can_add && p.can_edit && p.can_delete;

                        return (
                          <div
                            key={page.page_name}
                            className="min-w-[760px] grid grid-cols-6 items-center border-b py-4 px-4"
                          >
                            <div>
                              <div className="font-bold text-slate-800">{page.page_name}</div>
                              <div className="text-xs text-slate-400">{page.route_path}</div>
                            </div>

                            {["can_view", "can_add", "can_edit", "can_delete"].map((field) => (
                              <div key={field} className="text-center">
                                <input
                                  type="checkbox"
                                  checked={!!p[field]}
                                  onChange={() =>
                                    togglePermission(mod.module_name, page.page_name, field)
                                  }
                                  className="w-5 h-5 accent-green-600"
                                />
                              </div>
                            ))}

                            <div className="text-center">
                              <input
                                type="checkbox"
                                checked={!!rowAll}
                                onChange={(e) =>
                                  selectRowAll(mod.module_name, page, e.target.checked)
                                }
                                className="w-5 h-5 accent-rose-600"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={savePermissions}
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 rounded-2xl font-black disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save / Update Permissions"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="bg-slate-50 border rounded-2xl p-4">
      <div className="text-xs text-slate-500 font-bold">{title}</div>
      <div className="text-lg font-black text-slate-800 mt-1">
        {value || "-"}
      </div>
    </div>
  );
}