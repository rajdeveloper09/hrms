import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import { Toaster } from "react-hot-toast";

const API = "https://ojmee.in/employee";

export default function CreateLoginNewUser() {
    const emptyForm = {
        id: "",
        employee_id: "",
        full_name: "",
        pin: "",
        role: "view",
        status: "Active",
    };

    const [form, setForm] = useState(emptyForm);
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await axios.get(`${API}/get_login_users`);
        setUsers(res.data.data || []);
    };

    const filteredUsers = useMemo(() => {

        const nonSuperAdminUsers =
            users.filter(
                (u) => u.role !== "superAdmin"
            );

        const q = search.toLowerCase().trim();

        if (!q) return nonSuperAdminUsers;

        return nonSuperAdminUsers.filter((u) =>

            [
                u.employee_id,
                u.full_name,
                u.role,
                u.status,
            ]
                .map((v) =>
                    String(v || "")
                        .toLowerCase()
                )
                .join(" ")
                .includes(q)

        );

    }, [users, search]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "employee_id" ? value.toUpperCase() : value,
        }));
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (!form.employee_id) return alert("Employee ID required");
        if (!form.full_name) return alert("Full name required");

        if (!editMode && !form.pin) return alert("PIN required");

        if (form.pin && !/^[0-9]{4}$/.test(form.pin)) {
            return alert("PIN must be 4 digits");
        }

        try {
            const url = editMode
                ? `${API}/update_login_user`
                : `${API}/post_login_user`;

            const res = await axios.post(url, form);

            if (res.data.status) {
                alert(res.data.message);
                setForm(emptyForm);
                setEditMode(false);
                fetchUsers();
            } else {
                alert(res.data.message || "Something went wrong");
            }
        } catch (err) {
            alert(err.response?.data?.message || "API error. Please check API.");
        }

    };

    const handleEdit = (user) => {

        if (
            user.role === "superAdmin"
        ) {

            return alert(
                "Super Admin cannot be modified."
            );

        }

        setEditMode(true);

        setForm({
            id: user.id || "",
            employee_id:
                user.employee_id || "",
            full_name:
                user.full_name || "",
            pin: "",
            role:
                user.role || "view",
            status:
                user.status || "Active",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    const deleteUser = async (user) => {

        if (
            user.role === "superAdmin"
        ) {

            return alert(
                "Super Admin cannot be deleted."
            );

        }

        if (
            !window.confirm(
                `Delete ${user.employee_id}?`
            )
        ) return;

        const res =
            await axios.post(
                `${API}/delete_login_user`,
                {
                    id: user.id
                }
            );

        if (res.data.status) {

            alert(
                res.data.message
            );

            fetchUsers();

        } else {

            alert(
                res.data.message ||
                "Delete failed"
            );

        }

    };

    const cancelEdit = () => {
        setEditMode(false);
        setForm(emptyForm);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-pink-50 to-rose-50 flex">
            <Toaster />
            <SideNav />

            <div className="flex-1 w-full lg:ml-72 p-4 md:p-6 min-h-screen">
                <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
                    <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-rose-800 to-pink-700 p-6 text-white shadow-xl">
                        <h1 className="text-3xl font-black">Login User Management</h1>
                        <p className="text-pink-100 mt-1">
                            Create, modify, delete and manage role-based login users
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden">
                            <div className="p-5 border-b bg-pink-50">
                                <h2 className="text-xl font-black text-slate-800">
                                    {editMode ? "Modify Login User" : "Create Login User"}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    PIN optional in modify mode. Fill PIN only if you want reset.
                                </p>
                            </div>

                            <form
                                onSubmit={submitForm}
                                className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <Input
                                    label="Employee ID"
                                    name="employee_id"
                                    value={form.employee_id}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="Full Name"
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label={editMode ? "New PIN Optional" : "4 Digit PIN"}
                                    name="pin"
                                    type="password"
                                    maxLength={4}
                                    value={form.pin}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            pin: e.target.value.replace(/\D/g, ""),
                                        }))
                                    }
                                    required={!editMode}
                                />

                                <div>
                                    <label className="label">Role</label>
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="view">
                                            View
                                        </option>

                                        <option value="contributor">
                                            Contributor
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Status</label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 flex gap-3">
                                    <button className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 rounded-2xl font-black shadow-lg">
                                        {editMode ? "Update User" : "Create User"}
                                    </button>

                                    {editMode && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="bg-slate-600 text-white px-8 py-3 rounded-2xl font-black"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden">
                            <div className="p-5 bg-slate-900 text-white">
                                <h2 className="text-xl font-black">Login User List</h2>

                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search employee, role, status..."
                                    className="mt-4 w-full px-4 py-3 rounded-2xl text-slate-800 outline-none"
                                />
                            </div>

                            <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-pink-50 text-slate-700 sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3">Employee</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                                    No login user found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b text-center hover:bg-pink-50/60"
                                                >
                                                    <td className="p-3">
                                                        <div className="font-black text-slate-800">
                                                            {user.employee_id}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {user.full_name}
                                                        </div>
                                                    </td>

                                                    <td className="p-3">
                                                        <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-700">
                                                            {user.role}
                                                        </span>
                                                    </td>

                                                    <td className="p-3">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-black ${user.status === "Active"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>

                                                    <td className="p-3">
                                                        <div className="flex gap-2 justify-center">
                                                            <button
                                                                onClick={() => handleEdit(user)}
                                                                className="bg-amber-500 text-white px-3 py-2 rounded-xl font-bold"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() => deleteUser(user)}
                                                                className="bg-red-600 text-white px-3 py-2 rounded-xl font-bold"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .label {
          display:block;
          font-size:13px;
          font-weight:800;
          color:#334155;
          margin-bottom:8px;
        }
        .input {
          width:100%;
          padding:12px 14px;
          border-radius:16px;
          border:1px solid #fbcfe8;
          background:#ffffff;
          outline:none;
          font-weight:700;
          color:#1e293b;
        }
        .input:focus {
          border-color:#db2777;
          box-shadow:0 0 0 4px rgba(219,39,119,0.12);
        }
      `}</style>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="label">{label}</label>
            <input {...props} className="input" />
        </div>
    );
}