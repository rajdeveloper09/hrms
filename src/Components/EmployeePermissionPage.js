import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNav from "./SideNav";

const API = "https://ojmee.in/employee";

const MODULES = [
    {
        module_name: "Dashboard",
        pages: ["Dashboard"],
    },
    {
        module_name: "Reports",
        pages: ["All Reports", "Attendance Report", "Salary Report"],
    },
    {
        module_name: "Employee",
        pages: ["Employee List", "Add Employee"],
    },
    {
        module_name: "Add/Update Reports",
        pages: [
            "Add Bonus",
            "Add Penalty",
            "Add Reward",
            "Add Advance",
            "Add ESIC PF",
            "Add Office Assets",
            "Add Office Assets Category",
            "Add Complaint",
            "Add Resignation",
            "Add Overtime",
            "Add Meeting"
        ],
    },
    {
        module_name: "Login User",
        pages: ["Create Login User"]
    }
];

export default function EmployeePermissionPage() {

    const [loginUsers, setLoginUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [selectedName, setSelectedName] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const [permissions, setPermissions] = useState({});
    const [openModule, setOpenModule] = useState("");

    useEffect(() => {
        fetchLoginUsers();
    }, []);

    const fetchLoginUsers = async () => {

        try {

            const res = await axios.get(
                `${API}/get_login_users`
            );

            setLoginUsers(res.data.data || []);

        } catch (err) {
            console.log(err);
            alert("Login user fetch failed");
        }
    };

    const loadPermissions = async (userId) => {

        const user = loginUsers.find(
            (u) => String(u.id) === String(userId)
        );

        setSelectedUserId(userId);
        setSelectedEmpId(user?.employee_id || "");
        setSelectedName(user?.full_name || "");
        setSelectedRole(user?.role || "");

        const base = {};

        MODULES.forEach((mod) => {

            mod.pages.forEach((page) => {

                const key = `${mod.module_name}__${page}`;

                base[key] = {
                    module_name: mod.module_name,
                    page_name: page,
                    can_view: false,
                    can_add: false,
                    can_edit: false,
                    can_delete: false
                };

            });

        });

        try {

            const res = await axios.get(
                `${API}/get_login_user_permissions?login_user_id=${userId}`
            );

            (res.data.data || []).forEach((p) => {

                const key = `${p.module_name}__${p.page_name}`;

                base[key] = {
                    module_name: p.module_name,
                    page_name: p.page_name,
                    can_view: Number(p.can_view) === 1,
                    can_add: Number(p.can_add) === 1,
                    can_edit: Number(p.can_edit) === 1,
                    can_delete: Number(p.can_delete) === 1
                };

            });

        } catch (err) {

            console.log(err);

        }

        setPermissions(base);
    };

    const togglePermission = (moduleName, pageName, field) => {

        const key = `${moduleName}__${pageName}`;

        setPermissions((prev) => ({

            ...prev,

            [key]: {
                ...prev[key],
                [field]: !prev[key]?.[field]
            }

        }));

    };

    const countModulePermissions = (moduleName) => {

        return Object.values(permissions).filter(

            (p) =>
                p.module_name === moduleName &&
                (
                    p.can_view ||
                    p.can_add ||
                    p.can_edit ||
                    p.can_delete
                )

        ).length;

    };

    const savePermissions = async () => {

        if (!selectedUserId) {
            return alert("Select login user");
        }

        try {

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

            if (res.data.status) {

                alert(res.data.message);

            } else {

                alert(
                    res.data.message ||
                    "Permission save failed"
                );

            }

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Save API failed"
            );

        }

    };

    return (

        <div className="min-h-screen bg-slate-100 flex">

            <SideNav />

            <div className="flex-1 lg:ml-72 p-4 md:p-6">

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

                    <div className="p-6 bg-gradient-to-r from-slate-900 to-pink-700 text-white">

                        <h1 className="text-3xl font-black">
                            Login User Permission Setup
                        </h1>

                        <p className="text-pink-100 mt-1">
                            Login user wise page permission
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

                            <option value="">
                                Select Login User
                            </option>

                            {loginUsers.map((u) => (

                                <option
                                    key={u.id}
                                    value={u.id}
                                >
                                    {u.employee_id}
                                    {" - "}
                                    {u.full_name}
                                    {" ("}
                                    {u.role}
                                    {")"}
                                </option>

                            ))}

                        </select>

                        {selectedUserId && (

                            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">

                                <Info
                                    title="Employee ID"
                                    value={selectedEmpId}
                                />

                                <Info
                                    title="Full Name"
                                    value={selectedName}
                                />

                                <Info
                                    title="Role"
                                    value={selectedRole}
                                />

                            </div>

                        )}

                    </div>

                    <div className="p-5 space-y-4">

                        {MODULES.map((mod, index) => {

                            const isOpen =
                                openModule === mod.module_name;

                            const count =
                                countModulePermissions(
                                    mod.module_name
                                );

                            return (

                                <div
                                    key={mod.module_name}
                                    className="border rounded-2xl overflow-hidden"
                                >

                                    <button
                                        type="button"
                                        onClick={() => setOpenModule(
                                            isOpen ? "" : mod.module_name
                                        )}
                                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50"
                                    >

                                        <div className="flex items-center gap-3">

                                            <span className="w-8 h-8 rounded-full border flex items-center justify-center font-bold">
                                                {index + 1}
                                            </span>

                                            <span className="font-black">
                                                {mod.module_name}
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-5">

                                            <span className="text-sm font-bold">
                                                {count} Permissions
                                            </span>

                                            <span className="text-2xl">
                                                {isOpen ? "−" : "+"}
                                            </span>

                                        </div>

                                    </button>

                                    {isOpen && (

                                        <div className="p-5 bg-slate-50">

                                            {mod.pages.map((page) => {

                                                const key =
                                                    `${mod.module_name}__${page}`;

                                                const p =
                                                    permissions[key] || {};

                                                return (

                                                    <div
                                                        key={page}
                                                        className="grid grid-cols-5 items-center border-b py-4"
                                                    >

                                                        <div className="font-bold">
                                                            {page}
                                                        </div>

                                                        {
                                                            [
                                                                "can_view",
                                                                "can_add",
                                                                "can_edit",
                                                                "can_delete"
                                                            ].map((field) => (

                                                                <div
                                                                    key={field}
                                                                    className="text-center"
                                                                >

                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!p[field]}
                                                                        onChange={() =>
                                                                            togglePermission(
                                                                                mod.module_name,
                                                                                page,
                                                                                field
                                                                            )
                                                                        }
                                                                        className="w-5 h-5 accent-green-600"
                                                                    />

                                                                </div>

                                                            ))
                                                        }

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
                            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 rounded-2xl font-black"
                        >
                            Save Permissions
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

            <div className="text-xs text-slate-500 font-bold">
                {title}
            </div>

            <div className="text-lg font-black text-slate-800 mt-1">
                {value}
            </div>

        </div>

    );
}