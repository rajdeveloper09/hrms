import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import { Toaster } from "react-hot-toast";

const API = "https://ojmee.in/employee";

export default function AddOfficeAssetsForm() {
    const today = new Date().toISOString().slice(0, 10);

    const emptyForm = {
        id: "",
        asset_id: "",
        asset_type_id: "",
        asset_type: "",
        asset_company_id: "",
        asset_company: "",
        asset_name: "",
        asset_number: "",
        create_date: today,
        allow_emp_date: "",
        disallow_emp_date: "",
        allow_employee_id: "",
        allow_employee_name: "",
        status: "Active",
        remark: "",
    };

    const [form, setForm] = useState(emptyForm);
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [assetCompanies, setAssetCompanies] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchAssets();
        fetchEmployees();
        fetchAssetTypes();
        fetchAssetCompanies();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await axios.get(`${API}/get_office_assets`);
            setAssets(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API}/get_employee`);
            setEmployees(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAssetTypes = async () => {
        try {
            const res = await axios.get(`${API}/get_office_asset_types`);
            const data = res.data.data || [];
            setAssetTypes(data);
            return data;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const fetchAssetCompanies = async (assetTypeId = "") => {
        try {
            const url = assetTypeId
                ? `${API}/get_office_asset_companies?asset_type_id=${assetTypeId}`
                : `${API}/get_office_asset_companies`;

            const res = await axios.get(url);
            const data = res.data.data || [];
            setAssetCompanies(data);
            return data;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const findTypeId = (item, typeList = assetTypes) => {
        if (item.asset_type_id) return String(item.asset_type_id);

        const type = typeList.find(
            (t) =>
                String(t.asset_type || "").toLowerCase().trim() ===
                String(item.asset_type || "").toLowerCase().trim()
        );

        return type ? String(type.id) : "";
    };

    const findCompanyData = (item, companyList) => {
        const companyName =
            item.asset_company ||
            item.company_name ||
            item.asset_company_name ||
            "";

        let company = null;

        if (item.asset_company_id) {
            company = companyList.find(
                (c) => String(c.id) === String(item.asset_company_id)
            );
        }

        if (!company && companyName) {
            company = companyList.find(
                (c) =>
                    String(c.company_name || "").toLowerCase().trim() ===
                    String(companyName).toLowerCase().trim()
            );
        }

        if (!company && companyList.length === 1) {
            company = companyList[0];
        }

        return {
            id: company ? String(company.id) : String(item.asset_company_id || ""),
            name: company?.company_name || companyName || "",
        };
    };

    const filteredAssets = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return assets;

        return assets.filter((item) =>
            [
                item.asset_id,
                item.asset_type,
                item.asset_company,
                item.company_name,
                item.asset_name,
                item.asset_number,
                item.allow_employee_id,
                item.allow_employee_name,
                item.status,
                item.remark,
            ]
                .map((v) => String(v || "").toLowerCase())
                .join(" ")
                .includes(q)
        );
    }, [assets, search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAssetTypeChange = async (e) => {
        const assetTypeId = e.target.value;
        const selected = assetTypes.find(
            (item) => String(item.id) === String(assetTypeId)
        );

        setForm((prev) => ({
            ...prev,
            asset_type_id: assetTypeId,
            asset_type: selected?.asset_type || "",
            asset_company_id: "",
            asset_company: "",
        }));

        await fetchAssetCompanies(assetTypeId);
    };

    const handleAssetCompanyChange = (e) => {
        const companyId = e.target.value;
        const selected = assetCompanies.find(
            (item) => String(item.id) === String(companyId)
        );

        setForm((prev) => ({
            ...prev,
            asset_company_id: companyId,
            asset_company: selected?.company_name || "",
        }));
    };

    const handleEmployeeChange = (e) => {
        const empId = e.target.value;
        const emp = employees.find((item) => item.employee_id === empId);

        if (!emp) {
            setForm((prev) => ({
                ...prev,
                allow_employee_id: "",
                allow_employee_name: "",
                status: "Active",
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            allow_employee_id: emp.employee_id || "",
            allow_employee_name:
                emp.full_name || emp.emp_name || emp.employee_name || "",
            status: "Active",
            allow_emp_date: prev.allow_emp_date || today,
        }));
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (!form.asset_type_id && !form.asset_type) {
            return alert("Asset type required");
        }

        if (!form.asset_company_id && !form.asset_company) {
            return alert("Asset company required");
        }

        if (form.status === "Inactive" && !form.disallow_emp_date) {
            return alert("Disallow Employee Date required when status is Inactive");
        }

        if (!form.asset_name) return alert("Asset name required");
        if (!form.asset_number) return alert("Asset number required");

        const payload = {
            ...form,
            create_date: form.create_date || today,
            asset_type_id: form.asset_type_id || "0",
            asset_company_id: form.asset_company_id || "0",
            asset_company: form.asset_company || "",
        };

        try {
            const url = editMode
                ? `${API}/update_office_assets`
                : `${API}/post_office_assets`;

            const res = await axios.post(url, payload);

            if (res.data.status) {
                alert(res.data.message);
                setForm({ ...emptyForm, create_date: today });
                setEditMode(false);
                fetchAssets();
                fetchAssetCompanies();
            } else {
                alert(res.data.message || "Something went wrong");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "API not working");
        }
    };

    const handleEdit = async (item) => {
        setEditMode(true);

        const typeList = assetTypes.length ? assetTypes : await fetchAssetTypes();
        const finalAssetTypeId = findTypeId(item, typeList);

        const companyList = await fetchAssetCompanies(finalAssetTypeId);
        const companyData = findCompanyData(item, companyList);

        setForm({
            id: item.id || "",
            asset_id: item.asset_id || "",
            asset_type_id: finalAssetTypeId,
            asset_type: item.asset_type || "",
            asset_company_id: companyData.id,
            asset_company: companyData.name,
            asset_name: item.asset_name || "",
            asset_number: item.asset_number || "",
            create_date: item.create_date || today,
            allow_emp_date: item.allow_emp_date || "",
            disallow_emp_date: item.disallow_emp_date || "",
            allow_employee_id: item.allow_employee_id || "",
            allow_employee_name: item.allow_employee_name || "",
            status: item.status || "Active",
            remark: item.remark || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const assignAsset = async () => {
        if (!form.id) return alert("Please select asset first");
        if (!form.allow_employee_id) return alert("Employee required");
        if (!form.allow_emp_date) return alert("Allow employee date required");

        try {
            const res = await axios.post(`${API}/assign_office_asset`, form);

            if (res.data.status) {
                alert(res.data.message);
                setForm({ ...emptyForm, create_date: today });
                setEditMode(false);
                fetchAssets();
            } else {
                alert(res.data.message || "Something went wrong");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "API not working");
        }
    };

    const releaseAsset = async () => {
        if (!form.id) return alert("Please select asset first");
        if (!form.disallow_emp_date) {
            return alert("Disallow Employee Date required");
        }

        try {
            const res = await axios.post(`${API}/release_office_asset`, form);

            if (res.data.status) {
                alert(res.data.message);
                setForm({ ...emptyForm, create_date: today });
                setEditMode(false);
                fetchAssets();
            } else {
                alert(res.data.message || "Something went wrong");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "API not working");
        }
    };

    const cancelEdit = () => {
        setEditMode(false);
        setForm({ ...emptyForm, create_date: today });
        fetchAssetCompanies();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 flex">
            <Toaster />
            <SideNav />

            <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
                <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
                    <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 p-6 text-white shadow-xl">
                        <h1 className="text-3xl font-black">Office Assets</h1>
                        <p className="text-blue-100 mt-1">
                            Create and update office assets
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
                            <div className="p-5 border-b bg-blue-50">
                                <h2 className="text-xl font-black text-slate-800">
                                    {editMode ? "Modify Asset" : "Create Asset"}
                                </h2>
                            </div>

                            <form
                                onSubmit={submitForm}
                                className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <Input
                                    label="Asset ID"
                                    value={editMode ? form.asset_id : "Auto Generated"}
                                    readOnly
                                />

                                {editMode ? (
                                    <Input label="Asset Type" value={form.asset_type} readOnly />
                                ) : (
                                    <div>
                                        <label className="label">Asset Type</label>
                                        <select
                                            name="asset_type_id"
                                            value={form.asset_type_id}
                                            onChange={handleAssetTypeChange}
                                            required
                                            className="input"
                                        >
                                            <option value="">Select Asset Type</option>
                                            {assetTypes
                                                .filter((item) => item.status === "Active")
                                                .map((item) => (
                                                    <option key={item.id} value={String(item.id)}>
                                                        {item.asset_type}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}

                                {editMode ? (
                                    <Input
                                        label="Asset Company"
                                        value={form.asset_company || "Company Missing In Old Record"}
                                        readOnly
                                    />
                                ) : (
                                    <div>
                                        <label className="label">Asset Company</label>
                                        <select
                                            name="asset_company_id"
                                            value={form.asset_company_id}
                                            onChange={handleAssetCompanyChange}
                                            required
                                            className="input"
                                        >
                                            <option value="">Select Asset Company</option>
                                            {assetCompanies
                                                .filter((item) => item.status === "Active")
                                                .map((item) => (
                                                    <option key={item.id} value={String(item.id)}>
                                                        {item.company_name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}

                                <Input
                                    label="Asset Name"
                                    name="asset_name"
                                    value={form.asset_name}
                                    onChange={handleChange}
                                    readOnly={editMode}
                                    required
                                />

                                <Input
                                    label="Asset Number"
                                    name="asset_number"
                                    value={form.asset_number}
                                    onChange={handleChange}
                                    readOnly={editMode}
                                    required
                                />

                                {editMode && (
                                    <>
                                        <div>
                                            <label className="label">Allow Employee</label>
                                            <select
                                                value={form.allow_employee_id}
                                                onChange={handleEmployeeChange}
                                                className="input"
                                            >
                                                <option value="">Select Employee</option>
                                                {employees.map((emp) => (
                                                    <option key={emp.employee_id} value={emp.employee_id}>
                                                        {emp.employee_id} -{" "}
                                                        {emp.full_name || emp.emp_name || emp.employee_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <Input
                                            label="Allow Employee Name"
                                            value={form.allow_employee_name}
                                            readOnly
                                        />

                                        <Input
                                            label="Allow Employee Date"
                                            name="allow_emp_date"
                                            type="date"
                                            value={form.allow_emp_date}
                                            onChange={handleChange}
                                        />


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

                                        <Input
                                            label="Disallow Employee Date"
                                            name="disallow_emp_date"
                                            type="date"
                                            value={form.disallow_emp_date}
                                            onChange={handleChange}
                                            required={form.status === "Inactive"}
                                        />

                                        <div className="md:col-span-2">
                                            <label className="label">Remark</label>
                                            <textarea
                                                name="remark"
                                                value={form.remark}
                                                onChange={handleChange}
                                                className="input h-24"
                                                placeholder="Enter remark"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="md:col-span-2 flex flex-col gap-3">
                                    {!editMode ? (
                                        <button className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-3 rounded-2xl font-black shadow-lg">
                                            Create Asset
                                        </button>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={assignAsset}
                                                    className="bg-emerald-600 text-white py-3 rounded-2xl font-black shadow-lg"
                                                >
                                                    Assign / Active Employee
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={releaseAsset}
                                                    className="bg-red-600 text-white py-3 rounded-2xl font-black shadow-lg"
                                                >
                                                    Release / Inactive Employee
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="bg-slate-600 text-white py-3 rounded-2xl font-black"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
                            <div className="p-5 bg-slate-900 text-white">
                                <h2 className="text-xl font-black">Office Asset List</h2>

                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search asset..."
                                    className="mt-4 w-full px-4 py-3 rounded-2xl text-slate-800 outline-none"
                                />
                            </div>

                            <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-blue-50 text-slate-700 sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3">Asset</th>
                                            <th className="p-3">Type / Company</th>
                                            <th className="p-3">Employee</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredAssets.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-500">
                                                    No asset data found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredAssets.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b text-center hover:bg-blue-50/50"
                                                >
                                                    <td className="p-3">
                                                        <div className="font-black text-slate-800">
                                                            {item.asset_id}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {item.asset_name}
                                                        </div>
                                                        <div className="text-xs text-blue-600 font-bold">
                                                            {item.asset_number}
                                                        </div>
                                                    </td>

                                                    <td className="p-3">
                                                        <div className="font-bold text-slate-800">
                                                            {item.asset_type || "-"}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {item.asset_company || item.company_name || "-"}
                                                        </div>
                                                    </td>

                                                    <td className="p-3">
                                                        <div className="font-black text-slate-800">
                                                            {item.allow_employee_id || "-"}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {item.allow_employee_name || "-"}
                                                        </div>
                                                    </td>

                                                    <td className="p-3">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-black ${item.status === "Active"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {item.status || "Active"}
                                                        </span>
                                                    </td>

                                                    <td className="p-3">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="bg-amber-500 text-white px-3 py-2 rounded-xl font-bold"
                                                        >
                                                            Modify
                                                        </button>
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
          border:1px solid #dbeafe;
          background:#ffffff;
          outline:none;
          font-weight:700;
          color:#1e293b;
        }
        .input:focus {
          border-color:#2563eb;
          box-shadow:0 0 0 4px rgba(37,99,235,0.12);
        }
        .input:read-only {
          background:#f8fafc;
          color:#475569;
          cursor:not-allowed;
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