import React, { useEffect, useState } from "react";
import {
  Plus,
  RefreshCcw,
  Search,
  Package,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../config/api";
import SideNav from "../SideNav";

const CURRENT_PATH = "/add-assests";

export default function EmployeeAssetsListForm() {
  const emptyForm = {
    id: "",
    asset_id: "",
    asset_name: "",
    status: "Active",
    asset_type: "",
    asset_number: "",
    create_date: "",
    allow_emp_date: "",
    disallow_emp_date: "",
    allow_employee_id: "",
    allow_employee_name: "",
    remark: "",
    asset_type_id: "",
    asset_company_id: "",
    asset_company: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);

  const role = localStorage.getItem("role") || "view";
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  const pagePermission =
    role === "superAdmin"
      ? { can_view: 1, can_add: 1, can_edit: 1, can_delete: 1 }
      : permissions.find((p) => p.route_path === CURRENT_PATH) || {};

  const canView = role === "superAdmin" || Number(pagePermission.can_view) === 1;
  const canAdd = role === "superAdmin" || Number(pagePermission.can_add) === 1;
  const canEdit = role === "superAdmin" || Number(pagePermission.can_edit) === 1;
  const canDelete =
    role === "superAdmin" || Number(pagePermission.can_delete) === 1;

  const formAllowed = editMode ? canEdit : canAdd;

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/employee_assets_list_get`);
      const json = await res.json();

      if (json.status === true && Array.isArray(json.data)) {
        setAssets(json.data);
      } else {
        setAssets([]);
      }
    } catch {
      toast.error("Failed to fetch assets");
      setAssets([]);
    }
  };

  const handleChange = (e) => {
    if (!formAllowed) {
      toast.error(
        editMode
          ? "You do not have edit permission"
          : "You do not have add permission"
      );
      return;
    }

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setEditMode(false);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editMode && !canAdd) {
      toast.error("You do not have add permission");
      return;
    }

    if (editMode && !canEdit) {
      toast.error("You do not have edit permission");
      return;
    }

    if (!formData.asset_name.trim()) {
      toast.error("Asset Name required");
      return;
    }

    if (formData.status === "Inactive" && !formData.disallow_emp_date) {
      toast.error("Disallow Employee Date required when status is Inactive");
      return;
    }

    setLoading(true);

    try {
      const url = editMode
        ? `${API_BASE_URL}/employee_assets_list_update`
        : `${API_BASE_URL}/employee_assets_list_post`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.status === true) {
        toast.success(
          json.message ||
            (editMode ? "Asset updated successfully" : "Asset added successfully")
        );
        resetForm();
        fetchAssets();
      } else {
        toast.error(json.message || "Failed to save asset");
      }
    } catch {
      toast.error("API error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) {
      toast.error("You do not have edit permission");
      return;
    }

    setEditMode(true);

    setFormData({
      id: item.id || "",
      asset_id: item.asset_id || "",
      asset_name: item.asset_name || "",
      status: item.status || "Active",
      asset_type: item.asset_type || "",
      asset_number: item.asset_number || "",
      create_date: item.create_date || "",
      allow_emp_date: item.allow_emp_date || "",
      disallow_emp_date: item.disallow_emp_date || "",
      allow_employee_id: item.allow_employee_id || "",
      allow_employee_name: item.allow_employee_name || "",
      remark: item.remark || "",
      asset_type_id: item.asset_type_id || "",
      asset_company_id: item.asset_company_id || "",
      asset_company: item.asset_company || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      toast.error("You do not have delete permission");
      return;
    }

    if (!window.confirm("Delete this asset?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/employee_assets_list_delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      });

      const json = await res.json();

      if (json.status === true || json.success === true) {
        toast.success(json.message || "Asset deleted successfully");
        fetchAssets();
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch {
      toast.error("Delete API error");
    }
  };

  const filteredAssets = assets.filter((item) =>
    [
      item.asset_id,
      item.asset_name,
      item.asset_type,
      item.asset_number,
      item.asset_company,
      item.allow_employee_id,
      item.allow_employee_name,
      item.status,
    ]
      .map((v) => String(v || ""))
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const inputStyle =
    "w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <Toaster position="top-right" />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-4 md:p-5">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-[32px] p-6 shadow-2xl mb-6 text-white">
          <h1 className="text-4xl font-black flex items-center gap-3">
            <Package /> Employee Assets List
          </h1>
          <p className="text-pink-100 mt-2">Add and manage employee assets</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black">
                  {editMode ? "Update Asset" : "Add Asset"}
                </h2>
                <p className="text-sm text-slate-300">
                  {formAllowed
                    ? editMode
                      ? "Update asset details"
                      : "Asset ID auto generate होगा"
                    : editMode
                    ? "View Only Permission - Edit Not Allowed"
                    : "View Only Permission - Add Not Allowed"}
                </p>
              </div>

              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white text-pink-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editMode && (
                  <Input
                    label="Asset ID"
                    name="asset_id"
                    value={formData.asset_id}
                    readOnly
                    inputStyle={inputStyle}
                  />
                )}

                <Input
                  label="Asset Name"
                  name="asset_name"
                  value={formData.asset_name}
                  onChange={handleChange}
                  required
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Asset Type"
                  name="asset_type"
                  value={formData.asset_type}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Asset Number"
                  name="asset_number"
                  value={formData.asset_number}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Asset Company"
                  name="asset_company"
                  value={formData.asset_company}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Create Date"
                  type="date"
                  name="create_date"
                  value={formData.create_date}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Allow Employee Date"
                  type="date"
                  name="allow_emp_date"
                  value={formData.allow_emp_date}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Disallow Employee Date"
                  type="date"
                  name="disallow_emp_date"
                  value={formData.disallow_emp_date}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Allow Employee ID"
                  name="allow_employee_id"
                  value={formData.allow_employee_id}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Allow Employee Name"
                  name="allow_employee_name"
                  value={formData.allow_employee_name}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Asset Type ID"
                  type="number"
                  name="asset_type_id"
                  value={formData.asset_type_id}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <Input
                  label="Asset Company ID"
                  type="number"
                  name="asset_company_id"
                  value={formData.asset_company_id}
                  onChange={handleChange}
                  readOnly={!formAllowed}
                  inputStyle={inputStyle}
                />

                <div>
                  <label className="label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputStyle}
                    disabled={!formAllowed}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Remark</label>
                  <textarea
                    name="remark"
                    rows="3"
                    value={formData.remark}
                    onChange={handleChange}
                    className={inputStyle}
                    placeholder="Enter remark"
                    readOnly={!formAllowed}
                  />
                </div>
              </div>

              {formAllowed ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Plus size={18} />
                  {loading
                    ? "Saving..."
                    : editMode
                    ? "Update Asset"
                    : "Add Asset"}
                </button>
              ) : (
                <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-700 py-4 rounded-2xl text-center font-black">
                  {editMode
                    ? "View Only Permission - Edit Not Allowed"
                    : "View Only Permission - Add Not Allowed"}
                </div>
              )}
            </form>
          </div>

          <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black">Asset List</h2>
                  <p className="text-sm text-slate-300">
                    Total Assets: {assets.length}
                  </p>
                </div>

                <button
                  onClick={fetchAssets}
                  className="bg-white text-pink-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                  <RefreshCcw size={16} />
                  Refresh
                </button>
              </div>

              <div className="relative mt-4">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search asset..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-pink-50 sticky top-0">
                  <tr>
                    <th className="p-3">Asset</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-slate-500">
                        No assets found
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b text-center hover:bg-pink-50"
                      >
                        <td className="p-3">
                          <div className="font-black text-slate-800">
                            {item.asset_id}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.asset_name}
                          </div>
                        </td>

                        <td className="p-3">
                          <div>{item.asset_type || "-"}</div>
                          <div className="text-xs text-slate-500">
                            {item.asset_number || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <div>{item.allow_employee_id || "-"}</div>
                          <div className="text-xs text-slate-500">
                            {item.allow_employee_name || "-"}
                          </div>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full font-black text-xs ${
                              item.status === "Inactive"
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {item.status || "Active"}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex gap-2 justify-center">
                            {canEdit ? (
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl font-bold flex items-center gap-1"
                              >
                                <Edit size={15} />
                                Edit
                              </button>
                            ) : (
                              <span className="text-xs font-black text-slate-400">
                                View Only
                              </span>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl font-bold flex items-center gap-1"
                              >
                                <Trash2 size={15} />
                                Delete
                              </button>
                            )}
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

        <style>{`
          .label {
            display: block;
            margin-bottom: 8px;
            font-weight: 800;
            color: #334155;
          }

          input:read-only,
          textarea:read-only,
          select:disabled {
            background: #f1f5f9;
            color: #64748b;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
}

function Input({ label, inputStyle, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input {...props} className={inputStyle} />
    </div>
  );
}