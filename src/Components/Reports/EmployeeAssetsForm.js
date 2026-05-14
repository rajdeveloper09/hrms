import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function EmployeeAssetsForm() {

  const [employeeList, setEmployeeList] =
    useState([]);

  const fetchEmployees = async () => {

    try {

      const res = await axios.get(
        `${API_BASE_URL}/get_employee`
      );

      setEmployeeList(
        res.data.data || []
      );

    } catch (error) {

      console.log(error);

    }

  };

  const [assetList, setAssetList] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    emp_id: "",
    assets: [
      {
        asset_id: "",
        asset_name: "",
        asset_number: "",
        no_of_assets: 1,
        start_date: "",
        end_date: "",
        remark: "",
        status: 1,
      },
    ],
  });


  useEffect(() => {

    fetchAssets();
    fetchEmployees();

  }, []);

  const fetchAssets = async () => {

    try {

      const res = await axios.get(
        "https://ojmee.in/employee/get_office_assets"
      );

      setAssetList(res.data.data || []);

    } catch (error) {

      console.log(error);

    }

  };

  /* ADD ROW */
  const addRow = () => {

    setForm({
      ...form,
      assets: [
        ...form.assets,
        {
          asset_id: "",
          asset_name: "",
          asset_number: "",
          no_of_assets: 1,
          start_date: "",
          end_date: "",
          remark: "",
          status: 1,
        },
      ],
    });

  };

  /* REMOVE ROW */
  const removeRow = (index) => {

    const updated = [...form.assets];

    updated.splice(index, 1);

    setForm({
      ...form,
      assets: updated,
    });

  };

  /* HANDLE CHANGE */
  const handleAssetChange = (
    index,
    field,
    value
  ) => {

    const updated = [...form.assets];

    updated[index][field] = value;

    if (field === "asset_id") {

      const selected = assetList.find(
        (item) =>
          item.asset_id === value
      );

      if (selected) {

        updated[index]["asset_name"] =
          selected.asset_name;

      }

    }

    setForm({
      ...form,
      assets: updated,
    });

  };

  /* SUBMIT */
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await axios.post(
        "https://ojmee.in/employee/employee_assets_post",
        form
      );

      alert(res.data.message);

      setForm({
        emp_id: "",
        assets: [
          {
            asset_id: "",
            asset_name: "",
            asset_number: "",
            no_of_assets: 1,
            start_date: "",
            end_date: "",
            remark: "",
            status: 1,
          },
        ],
      });

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100 flex">

      <SideNav />

      <div className="flex-1 xl:ml-72 p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-xl p-6 mb-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">

              <Package className="text-white" size={30} />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-800">
                Employee Assets Form
              </h1>

              <p className="text-slate-500 mt-1">
                Assign and manage employee assets
              </p>

            </div>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* EMPLOYEE ID */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 mb-6">

            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">

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
                className="
      w-full rounded-2xl border border-slate-300
      px-5 py-4 bg-white
      focus:ring-4 focus:ring-pink-200
      focus:border-pink-400
      outline-none transition-all
    "
                required
              >

                <option value="">
                  Select Employee
                </option>

                {employeeList.map((emp) => (

                  <option
                    key={emp.id}
                    value={emp.employee_id}
                  >

                    {emp.employee_id}
                    {" - "}
                    {emp.full_name}
                    {" ("}
                    {emp.department}
                    {")"}

                  </option>

                ))}

              </select>

            </div>

          </div>

          {/* ASSET ROWS */}
          <div className="space-y-6">

            {form.assets.map(
              (asset, index) => (

                <div
                  key={index}
                  className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden"
                >

                  {/* TOP BAR */}
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">

                        <Package className="text-white" size={20} />

                      </div>

                      <div>

                        <h2 className="text-white font-bold text-lg">
                          Asset #{index + 1}
                        </h2>

                        <p className="text-pink-100 text-sm">
                          Employee Asset Details
                        </p>

                      </div>

                    </div>

                    {form.assets.length >
                      1 && (

                        <button
                          type="button"
                          onClick={() =>
                            removeRow(
                              index
                            )
                          }
                          className="bg-white text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all"
                        >

                          <Trash2 size={18} />

                          Remove

                        </button>

                      )}

                  </div>

                  {/* FORM */}
                  <div className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                      {/* ASSET */}
                      <div>

                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">

                          <Package size={16} />

                          Select Asset

                        </label>

                        <select
                          value={
                            asset.asset_id
                          }
                          onChange={(e) =>
                            handleAssetChange(
                              index,
                              "asset_id",
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:ring-4 focus:ring-pink-200 outline-none"
                          required
                        >

                          <option value="">
                            Choose Asset
                          </option>

                          {assetList.map(
                            (item) => (

                              <option
                                key={
                                  item.id
                                }
                                value={
                                  item.asset_id
                                }
                              >

                                {
                                  item.asset_name
                                }

                              </option>

                            )
                          )}

                        </select>

                      </div>

                      {/* ASSET NUMBER */}
                      <div>

                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">

                          <Hash size={16} />

                          Asset Number

                        </label>

                        <input
                          type="text"
                          value={
                            asset.asset_number
                          }
                          onChange={(e) =>
                            handleAssetChange(
                              index,
                              "asset_number",
                              e.target.value
                            )
                          }
                          placeholder="Enter Asset Number"
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:ring-4 focus:ring-pink-200 outline-none"
                        />

                      </div>

                      {/* QTY */}
                      <div>

                        <label className="text-sm font-semibold text-slate-700 mb-2 block">
                          Quantity
                        </label>

                        <input
                          type="number"
                          value={
                            asset.no_of_assets
                          }
                          onChange={(e) =>
                            handleAssetChange(
                              index,
                              "no_of_assets",
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:ring-4 focus:ring-pink-200 outline-none"
                        />

                      </div>

                      {/* STATUS */}
                      <div>

                        <label className="text-sm font-semibold text-slate-700 mb-2 block">
                          Status
                        </label>

                        <select
                          value={
                            asset.status
                          }
                          onChange={(e) =>
                            handleAssetChange(
                              index,
                              "status",
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:ring-4 focus:ring-pink-200 outline-none"
                        >

                          <option value={1}>
                            Active
                          </option>

                          <option value={0}>
                            Inactive
                          </option>

                        </select>

                      </div>

                      {/* START DATE */}
                      <div>

                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">

                          <Calendar size={16} />

                          Start Date

                        </label>

                        <input
                          type="date"
                          value={
                            asset.start_date
                          }
                          onChange={(e) =>
                            handleAssetChange(
                              index,
                              "start_date",
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:ring-4 focus:ring-pink-200 outline-none"
                        />

                      </div>

                      {/* END DATE */}
                      <div>

                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">

                          <Calendar size={16} />

                          End Date

                        </label>

                        <input
                          type="date"
                          value={
                            asset.end_date
                          }
                          onChange={(e) =>
                            handleAssetChange(
                              index,
                              "end_date",
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:ring-4 focus:ring-pink-200 outline-none"
                        />

                      </div>

                      {/* REMARK */}
                      <div className="md:col-span-2">

                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">

                          <FileText size={16} />

                          Remark

                        </label>

                        <textarea
                          rows="2"
                          value={
                            asset.remark
                          }
                          onChange={(e) =>
                            handleAssetChange(
                              index,
                              "remark",
                              e.target.value
                            )
                          }
                          placeholder="Write remark..."
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:ring-4 focus:ring-pink-200 outline-none resize-none"
                        />

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-8">

            <button
              type="button"
              onClick={addRow}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 transition-all text-white px-6 py-4 rounded-2xl font-semibold shadow-lg flex items-center gap-2"
            >

              <Plus size={20} />

              Add More Asset

            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:scale-105 transition-all text-white px-8 py-4 rounded-2xl font-semibold shadow-lg"
            >

              {loading
                ? "Submitting..."
                : "Submit Assets"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}