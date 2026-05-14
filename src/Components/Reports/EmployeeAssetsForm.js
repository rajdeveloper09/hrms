import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeAssetsForm() {

  const [assetList, setAssetList] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
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

  // Fetch Assets
  useEffect(() => {
    fetchAssets();
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

  // Add New Row
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

  // Remove Row
  const removeRow = (index) => {
    const updated = [...form.assets];
    updated.splice(index, 1);

    setForm({
      ...form,
      assets: updated,
    });
  };

  // Handle Asset Change
  const handleAssetChange = (index, field, value) => {
    const updated = [...form.assets];

    updated[index][field] = value;

    // Auto fill asset name
    if (field === "asset_id") {
      const selected = assetList.find(
        (item) => item.asset_id === value
      );

      if (selected) {
        updated[index]["asset_name"] = selected.asset_name;
      }
    }

    setForm({
      ...form,
      assets: updated,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://ojmee.in/employee/employee_assets_post",
        form
      );

      alert(res.data.message);

      setForm({
        employee_id: "",
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
      alert("Error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Employee Assets Form
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Employee ID */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold">
              Employee ID
            </label>

            <input
              type="text"
              value={form.employee_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  employee_id: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
              required
            />
          </div>

          {/* Asset Rows */}
          {form.assets.map((asset, index) => (
            <div
              key={index}
              className="border rounded-2xl p-5 mb-5 bg-slate-50"
            >

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Asset Select */}
                <div>
                  <label className="block mb-2">
                    Asset
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
                    className="w-full border rounded-xl px-4 py-3"
                    required
                  >
                    <option value="">
                      Select Asset
                    </option>

                    {assetList.map((item) => (
                      <option
                        key={item.id}
                        value={item.asset_id}
                      >
                        {item.asset_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Asset Number */}
                <div>
                  <label className="block mb-2">
                    Asset Number
                  </label>

                  <input
                    type="text"
                    value={asset.asset_number}
                    onChange={(e) =>
                      handleAssetChange(
                        index,
                        "asset_number",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                {/* Qty */}
                <div>
                  <label className="block mb-2">
                    No of Assets
                  </label>

                  <input
                    type="number"
                    value={asset.no_of_assets}
                    onChange={(e) =>
                      handleAssetChange(
                        index,
                        "no_of_assets",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block mb-2">
                    Status
                  </label>

                  <select
                    value={asset.status}
                    onChange={(e) =>
                      handleAssetChange(
                        index,
                        "status",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={asset.start_date}
                    onChange={(e) =>
                      handleAssetChange(
                        index,
                        "start_date",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={asset.end_date}
                    onChange={(e) =>
                      handleAssetChange(
                        index,
                        "end_date",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                {/* Remark */}
                <div className="md:col-span-2">
                  <label className="block mb-2">
                    Remark
                  </label>

                  <input
                    type="text"
                    value={asset.remark}
                    onChange={(e) =>
                      handleAssetChange(
                        index,
                        "remark",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

              </div>

              {/* Remove Button */}
              {form.assets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {/* Add Row */}
          <button
            type="button"
            onClick={addRow}
            className="bg-blue-500 text-white px-5 py-3 rounded-xl mr-3"
          >
            + Add Asset
          </button>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-3 rounded-xl"
          >
            Submit
          </button>

        </form>
      </div>
    </div>
  );
}