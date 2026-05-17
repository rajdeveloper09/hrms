import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import {
  Plus,
  Trash2,
  Package,
  User,
  Calendar,
  FileText,
  Hash,
  Search,
  Edit,
  X,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../config/api";

const EMPTY_ASSET = {
  asset_id: "",
  asset_name: "",
  asset_number: "",
  no_of_assets: 1,
  start_date: "",
  end_date: "",
  remark: "",
  status: 1,
};

export default function EmployeeAssetsForm() {
  const [employeeList, setEmployeeList] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    emp_id: "",
    assets: [{ ...EMPTY_ASSET }],
  });

  const [editForm, setEditForm] = useState({
    id: "",
    emp_id: "",
    emp_name: "",
    asset_id: "",
    asset_name: "",
    asset_number: "",
    no_of_assets: "",
    start_date: "",
    end_date: "",
    remark: "",
    status: "1",
  });

  useEffect(() => {
    fetchEmployees();
    fetchAssets();
    fetchAssignedAssets();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_employee`);
      setEmployeeList(res.data.data || []);
    } catch (error) {
      console.log("Employee API Error:", error);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_office_assets`);
      setAssetList(res.data.data || []);
    } catch (error) {
      console.log("Assets API Error:", error);
    }
  };

  const fetchAssignedAssets = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/employee_assets`);
      setAssignedAssets(res.data.data || []);
    } catch (error) {
      console.log("Assigned Assets API Error:", error);
    }
  };

  const filteredAssignedAssets = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return assignedAssets;

    return assignedAssets.filter((item) =>
      [
        item.id,
        item.employee_id,
        item.emp_id,
        item.full_name,
        item.emp_name,
        item.asset_id,
        item.asset_name,
        item.asset_number,
        item.no_of_assets,
        item.start_date,
        item.end_date,
        item.remark,
        item.status,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [assignedAssets, search]);

  const addRow = () => {
    setForm((prev) => ({
      ...prev,
      assets: [...prev.assets, { ...EMPTY_ASSET }],
    }));
  };

  const removeRow = (index) => {
    const updated = [...form.assets];
    updated.splice(index, 1);

    setForm({
      ...form,
      assets: updated.length ? updated : [{ ...EMPTY_ASSET }],
    });
  };

  const handleAssetChange = (index, field, value) => {
    const updated = [...form.assets];
    updated[index][field] = value;

    if (field === "asset_id") {
      const selected = assetList.find((item) => item.asset_id === value);
      updated[index].asset_name = selected ? selected.asset_name : "";
    }

    setForm({
      ...form,
      assets: updated,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    setEditMode(true);

    setEditForm({
      id: item.id || "",
      emp_id: item.emp_id || item.employee_id || "",
      emp_name: item.emp_name || item.full_name || "",
      asset_id: item.asset_id || "",
      asset_name: item.asset_name || "",
      asset_number: item.asset_number || "",
      no_of_assets: item.no_of_assets || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      remark: item.remark || "",
      status: String(item.status ?? "1"),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditForm({
      id: "",
      emp_id: "",
      emp_name: "",
      asset_id: "",
      asset_name: "",
      asset_number: "",
      no_of_assets: "",
      start_date: "",
      end_date: "",
      remark: "",
      status: "1",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.emp_id) {
      alert("Please select employee");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/employee_assets_post`, form);

      alert(res.data.message || "Assets submitted successfully");

      setForm({
        emp_id: "",
        assets: [{ ...EMPTY_ASSET }],
      });

      fetchAssignedAssets();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editForm.id) {
      alert("Record ID missing");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id: editForm.id,
        end_date: editForm.end_date,
        remark: editForm.remark,
        status: editForm.status,
      };

      const res = await axios.post(
        `${API_BASE_URL}/employee_assets_update`,
        payload
      );

      if (res.data.success) {
        alert(res.data.message || "Asset updated successfully");
        cancelEdit();
        fetchAssignedAssets();
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      alert("Update API not working");
    } finally {
      setLoading(false);
    }
  };

  const selectedEmployee = employeeList.find(
    (emp) => emp.employee_id === form.emp_id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100 flex">
      <Toaster />
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-screen">
        <div className="mx-auto space-y-6 mt-[70px] sm:mt-0">
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                <Package className="text-white" size={30} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Employee Assets
                </h1>
                <p className="text-slate-500 mt-1">
                  Assign, track and update employee assets
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* LEFT FORM */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-white text-xl font-black">
                    {editMode ? "Update Asset" : "Assign Assets"}
                  </h2>
                  <p className="text-pink-100 text-sm">
                    {editMode
                      ? "Only status, end date and remark can be updated"
                      : "Select employee and add one or multiple assets"}
                  </p>
                </div>

                {/* {editMode && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-white text-rose-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              )} */}
              </div>

              {!editMode ? (
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="mb-6">
                    <label className="label">
                      <User size={18} />
                      Select Employee
                    </label>

                    <select
                      value={form.emp_id}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          emp_id: e.target.value,
                        })
                      }
                      className="input"
                      required
                    >
                      <option value="">Select Employee</option>

                      {employeeList.map((emp) => (
                        <option
                          key={emp.id || emp.employee_id}
                          value={emp.employee_id}
                        >
                          {emp.employee_id} - {emp.full_name} ({emp.department})
                        </option>
                      ))}
                    </select>

                    {selectedEmployee && (
                      <div className="mt-3 bg-pink-50 border border-pink-100 rounded-2xl p-4 text-sm text-slate-700">
                        <b>{selectedEmployee.full_name}</b> •{" "}
                        {selectedEmployee.department || "-"} •{" "}
                        {selectedEmployee.designation || "-"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-5 max-h-[620px] overflow-y-auto pr-1">
                    {form.assets.map((asset, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden"
                      >
                        <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              <Package className="text-white" size={20} />
                            </div>

                            <div>
                              <h3 className="text-white font-bold">
                                Asset #{index + 1}
                              </h3>
                              <p className="text-slate-300 text-xs">
                                Employee asset details
                              </p>
                            </div>
                          </div>

                          {form.assets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRow(index)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 font-bold"
                            >
                              <Trash2 size={16} />
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="label">
                              <Package size={16} />
                              Select Asset
                            </label>

                            <select
                              value={asset.asset_id}
                              onChange={(e) =>
                                handleAssetChange(
                                  index,
                                  "asset_id",
                                  e.target.value
                                )
                              }
                              className="input"
                              required
                            >
                              <option value="">Choose Asset</option>

                              {assetList.map((item) => (
                                <option key={item.id} value={item.asset_id}>
                                  {item.asset_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <Input
                            label="Asset Number"
                            icon={<Hash size={16} />}
                            value={asset.asset_number}
                            onChange={(e) =>
                              handleAssetChange(
                                index,
                                "asset_number",
                                e.target.value
                              )
                            }
                            placeholder="Enter asset number"
                          />

                          <Input
                            label="Quantity"
                            type="number"
                            min="1"
                            value={asset.no_of_assets}
                            onChange={(e) =>
                              handleAssetChange(
                                index,
                                "no_of_assets",
                                e.target.value
                              )
                            }
                          />

                          <div>
                            <label className="label">Status</label>
                            <select
                              value={asset.status}
                              onChange={(e) =>
                                handleAssetChange(index, "status", e.target.value)
                              }
                              className="input"
                            >
                              <option value={1}>Active</option>
                              <option value={0}>Inactive</option>
                            </select>
                          </div>

                          <Input
                            label="Start Date"
                            icon={<Calendar size={16} />}
                            type="date"
                            value={asset.start_date}
                            onChange={(e) =>
                              handleAssetChange(
                                index,
                                "start_date",
                                e.target.value
                              )
                            }
                          />

                          <Input
                            label="End Date"
                            icon={<Calendar size={16} />}
                            type="date"
                            value={asset.end_date}
                            onChange={(e) =>
                              handleAssetChange(
                                index,
                                "end_date",
                                e.target.value
                              )
                            }
                          />

                          <div className="md:col-span-2">
                            <label className="label">
                              <FileText size={16} />
                              Remark
                            </label>

                            <textarea
                              rows="2"
                              value={asset.remark}
                              onChange={(e) =>
                                handleAssetChange(
                                  index,
                                  "remark",
                                  e.target.value
                                )
                              }
                              placeholder="Write remark..."
                              className="input resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <button
                      type="button"
                      onClick={addRow}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Add More Asset
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-60"
                    >
                      {loading ? "Submitting..." : "Submit Assets"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleUpdate} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Employee ID" value={editForm.emp_id} readOnly />
                  <Input label="Employee Name" value={editForm.emp_name} readOnly />
                  <Input label="Asset ID" value={editForm.asset_id} readOnly />
                  <Input label="Asset Name" value={editForm.asset_name} readOnly />
                  <Input label="Asset Number" value={editForm.asset_number} readOnly />
                  <Input label="Quantity" value={editForm.no_of_assets} readOnly />
                  <Input label="Start Date" type="date" value={editForm.start_date} readOnly />

                  <Input
                    label="End Date"
                    type="date"
                    name="end_date"
                    value={editForm.end_date}
                    onChange={handleEditChange}
                  />

                  <div>
                    <label className="label">Status</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      className="input"
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">
                      <FileText size={16} />
                      Remark
                    </label>

                    <textarea
                      name="remark"
                      rows="3"
                      value={editForm.remark}
                      onChange={handleEditChange}
                      className="input resize-none"
                      placeholder="Enter remark"
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-60"
                    >
                      {loading ? "Updating..." : "Update Asset"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-slate-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT LIST */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-900 text-white p-5">
                <h2 className="text-xl font-black">Assets List</h2>
                <p className="text-sm text-slate-300">
                  Search employee assigned assets
                </p>

                <div className="relative mt-4">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employee, asset, number..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[780px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-pink-50 text-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Asset</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Remark</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAssignedAssets.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No assets data found
                        </td>
                      </tr>
                    ) : (
                      filteredAssignedAssets.map((item, index) => (
                        <tr
                          key={item.id || index}
                          className="border-b text-center hover:bg-pink-50/60"
                        >
                          <td className="p-3">
                            <div className="font-black text-slate-800">
                              {item.emp_id || item.employee_id || "-"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.emp_name || item.full_name || "-"}
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="font-bold text-slate-800">
                              {item.asset_name || "-"}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.asset_number || item.asset_id || "-"}
                            </div>
                          </td>

                          <td className="p-3 font-bold">
                            {item.no_of_assets || 1}
                          </td>

                          <td className="p-3">
                            <div>{item.start_date || "-"}</div>
                            <div className="text-xs text-slate-500">
                              {item.end_date || "Continue"}
                            </div>
                          </td>
                          <td className="text-sm text-slate-500">
                            {item.remark || 1}
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black ${String(item.status) === "1"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                                }`}
                            >
                              {String(item.status) === "1" ? "Active" : "Inactive"}
                            </span>
                          </td>
                          {item.status === "1" && (
                            <td className="p-3">
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 mx-auto"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                            </td>
                          )}

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
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 8px;
          }

          .input {
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 16px;
            padding: 12px 14px;
            outline: none;
            font-size: 14px;
            background: white;
          }

          .input:focus {
            border-color: #ec4899;
            box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.15);
          }

          .input[readonly] {
            background: #f8fafc;
            color: #64748b;
          }
        `}</style>
        </div>
      </div>
    </div>
  );
}

function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="label">
        {icon}
        {label}
      </label>
      <input {...props} className="input" />
    </div>
  );
}