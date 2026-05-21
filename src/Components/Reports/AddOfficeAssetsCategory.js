import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import { Toaster } from "react-hot-toast";

const API = "https://ojmee.in/employee";
const CURRENT_PATH = "/add-office-assets-category";

export default function AddOfficeAssetsCategory() {
  const emptyType = { id: "", asset_type: "", status: "Active" };
  const emptyCompany = { id: "", asset_type_id: "", company_name: "", status: "Active" };

  const [typeForm, setTypeForm] = useState(emptyType);
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [types, setTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [typeEditMode, setTypeEditMode] = useState(false);
  const [companyEditMode, setCompanyEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTypeId, setFilterTypeId] = useState("");

  const role = localStorage.getItem("role") || "view";
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  const pagePermission =
    role === "superAdmin"
      ? { can_view: 1, can_add: 1, can_edit: 1, can_delete: 1 }
      : permissions.find((p) => p.route_path === CURRENT_PATH) || {};

  const canView = role === "superAdmin" || Number(pagePermission.can_view) === 1;
  const canAdd = role === "superAdmin" || Number(pagePermission.can_add) === 1;
  const canEdit = role === "superAdmin" || Number(pagePermission.can_edit) === 1;
  const canDelete = role === "superAdmin" || Number(pagePermission.can_delete) === 1;

  useEffect(() => {
    fetchTypes();
    fetchCompanies();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await axios.get(`${API}/get_office_asset_types`);
      setTypes(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCompanies = async (assetTypeId = "") => {
    try {
      const url = assetTypeId
        ? `${API}/get_office_asset_companies?asset_type_id=${assetTypeId}`
        : `${API}/get_office_asset_companies`;

      const res = await axios.get(url);
      setCompanies(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTypeChange = (e) => {
    const { name, value } = e.target;
    setTypeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitType = async (e) => {
    e.preventDefault();

    if (!typeEditMode && !canAdd) return alert("You do not have add permission");
    if (typeEditMode && !canEdit) return alert("You do not have edit permission");
    if (!typeForm.asset_type) return alert("Asset type required");

    try {
      const url = typeEditMode
        ? `${API}/update_office_asset_type`
        : `${API}/post_office_asset_type`;

      const res = await axios.post(url, typeForm);

      if (res.data.status) {
        alert(res.data.message);
        setTypeForm(emptyType);
        setTypeEditMode(false);
        fetchTypes();
        fetchCompanies(filterTypeId);
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "API not working");
    }
  };

  const submitCompany = async (e) => {
    e.preventDefault();

    if (!companyEditMode && !canAdd) return alert("You do not have add permission");
    if (companyEditMode && !canEdit) return alert("You do not have edit permission");
    if (!companyForm.asset_type_id) return alert("Asset type required");
    if (!companyForm.company_name) return alert("Company name required");

    try {
      const url = companyEditMode
        ? `${API}/update_office_asset_company`
        : `${API}/post_office_asset_company`;

      const res = await axios.post(url, companyForm);

      if (res.data.status) {
        alert(res.data.message);
        setCompanyForm(emptyCompany);
        setCompanyEditMode(false);
        fetchCompanies(filterTypeId);
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "API not working");
    }
  };

  const editType = (item) => {
    if (!canEdit) return alert("You do not have edit permission");

    setTypeEditMode(true);
    setTypeForm({
      id: item.id,
      asset_type: item.asset_type,
      status: item.status || "Active",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editCompany = (item) => {
    if (!canEdit) return alert("You do not have edit permission");

    setCompanyEditMode(true);
    setCompanyForm({
      id: item.id,
      asset_type_id: item.asset_type_id,
      company_name: item.company_name,
      status: item.status || "Active",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelTypeEdit = () => {
    setTypeEditMode(false);
    setTypeForm(emptyType);
  };

  const cancelCompanyEdit = () => {
    setCompanyEditMode(false);
    setCompanyForm(emptyCompany);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterTypeId(value);
    fetchCompanies(value);
  };

  const filteredTypes = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return types;

    return types.filter((item) =>
      [item.asset_type, item.status]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [types, search]);

  const filteredCompanies = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return companies;

    return companies.filter((item) =>
      [item.asset_type, item.company_name, item.status]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [companies, search]);

  if (!canView) {
    return (
      <div className="min-h-screen bg-slate-100 flex">
        <SideNav />
        <div className="flex-1 lg:ml-72 p-6">
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
            <h1 className="text-2xl font-black text-red-600">Access Denied</h1>
            <p className="text-slate-500 mt-2">
              You do not have permission to view this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderFormBlocked = () => (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-2xl font-bold text-center">
      View Only Permission - Add / Edit Not Allowed
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700 p-6 text-white shadow-xl">
            <h1 className="text-3xl font-black">Office Asset Category</h1>
            <p className="text-blue-100 mt-1">
              Manage asset type and company master records
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
                <div className="p-5 border-b bg-blue-50">
                  <h2 className="text-xl font-black text-slate-800">
                    {typeEditMode ? "Update Asset Type" : "Create Asset Type"}
                  </h2>
                </div>

                {canAdd || canEdit ? (
                  <form onSubmit={submitType} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Asset Type"
                      name="asset_type"
                      value={typeForm.asset_type}
                      onChange={handleTypeChange}
                      readOnly={typeEditMode && !canEdit}
                      required
                    />

                    <div>
                      <label className="label">Status</label>
                      <select
                        name="status"
                        value={typeForm.status}
                        onChange={handleTypeChange}
                        className="input"
                        disabled={typeEditMode && !canEdit}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                      {(!typeEditMode && canAdd) || (typeEditMode && canEdit) ? (
                        <button className="flex-1 bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-3 rounded-2xl font-black shadow-lg">
                          {typeEditMode ? "Update Asset Type" : "Create Asset Type"}
                        </button>
                      ) : (
                        renderFormBlocked()
                      )}

                      {typeEditMode && (
                        <button
                          type="button"
                          onClick={cancelTypeEdit}
                          className="bg-slate-600 text-white px-8 py-3 rounded-2xl font-black"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="p-6">{renderFormBlocked()}</div>
                )}
              </div>

              <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
                <div className="p-5 border-b bg-cyan-50">
                  <h2 className="text-xl font-black text-slate-800">
                    {companyEditMode ? "Update Asset Company" : "Create Asset Company"}
                  </h2>
                </div>

                {canAdd || canEdit ? (
                  <form onSubmit={submitCompany} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Asset Type</label>
                      <select
                        name="asset_type_id"
                        value={companyForm.asset_type_id}
                        onChange={handleCompanyChange}
                        className="input"
                        required
                        disabled={companyEditMode && !canEdit}
                      >
                        <option value="">Select Asset Type</option>
                        {types
                          .filter((item) => item.status === "Active")
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.asset_type}
                            </option>
                          ))}
                      </select>
                    </div>

                    <Input
                      label="Company Name"
                      name="company_name"
                      value={companyForm.company_name}
                      onChange={handleCompanyChange}
                      readOnly={companyEditMode && !canEdit}
                      required
                    />

                    <div>
                      <label className="label">Status</label>
                      <select
                        name="status"
                        value={companyForm.status}
                        onChange={handleCompanyChange}
                        className="input"
                        disabled={companyEditMode && !canEdit}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                      {(!companyEditMode && canAdd) || (companyEditMode && canEdit) ? (
                        <button className="flex-1 bg-gradient-to-r from-cyan-700 to-blue-600 text-white py-3 rounded-2xl font-black shadow-lg">
                          {companyEditMode ? "Update Asset Company" : "Create Asset Company"}
                        </button>
                      ) : (
                        renderFormBlocked()
                      )}

                      {companyEditMode && (
                        <button
                          type="button"
                          onClick={cancelCompanyEdit}
                          className="bg-slate-600 text-white px-8 py-3 rounded-2xl font-black"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="p-6">{renderFormBlocked()}</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="p-5 bg-slate-900 text-white">
                <h2 className="text-xl font-black">Asset Category List</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search type / company..."
                    className="w-full px-4 py-3 rounded-2xl text-slate-800 outline-none"
                  />

                  <select
                    value={filterTypeId}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-2xl text-slate-800 outline-none"
                  >
                    <option value="">All Asset Types</option>
                    {types.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.asset_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-black text-slate-800 mb-3">Asset Types</h3>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-50 text-slate-700">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Asset Type</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTypes.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-5 text-center text-slate-500">
                            No asset type found
                          </td>
                        </tr>
                      ) : (
                        filteredTypes.map((item) => (
                          <tr key={item.id} className="border-b text-center hover:bg-blue-50/50">
                            <td className="p-3 font-black">{item.id}</td>
                            <td className="p-3 font-bold">{item.asset_type}</td>
                            <td className="p-3">
                              <StatusBadge status={item.status} />
                            </td>
                            <td className="p-3">
                              {canEdit ? (
                                <button
                                  onClick={() => editType(item)}
                                  className="bg-amber-500 text-white px-3 py-2 rounded-xl font-bold"
                                >
                                  Edit
                                </button>
                              ) : (
                                <span className="text-xs font-black text-slate-400">
                                  View Only
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <h3 className="font-black text-slate-800 mb-3">
                  Asset Companies
                </h3>

                <div className="overflow-x-auto max-h-[430px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-cyan-50 text-slate-700 sticky top-0 z-10">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Asset Type</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCompanies.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-5 text-center text-slate-500">
                            No company found
                          </td>
                        </tr>
                      ) : (
                        filteredCompanies.map((item) => (
                          <tr key={item.id} className="border-b text-center hover:bg-cyan-50/50">
                            <td className="p-3 font-black">{item.id}</td>
                            <td className="p-3 font-bold">{item.asset_type}</td>
                            <td className="p-3">{item.company_name}</td>
                            <td className="p-3">
                              <StatusBadge status={item.status} />
                            </td>
                            <td className="p-3">
                              {canEdit ? (
                                <button
                                  onClick={() => editCompany(item)}
                                  className="bg-amber-500 text-white px-3 py-2 rounded-xl font-bold"
                                >
                                  Edit
                                </button>
                              ) : (
                                <span className="text-xs font-black text-slate-400">
                                  View Only
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {!canDelete && (
                  <p className="text-xs text-slate-400 mt-4">
                    Delete permission is not assigned for this page.
                  </p>
                )}
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
        .input:read-only,
        .input:disabled {
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

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-black ${
        status === "Active"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}