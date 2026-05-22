import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SideNav from "../SideNav";
import {
  Search,
  RefreshCcw,
  Wallet,
  Users,
  CalendarDays,
  IndianRupee,
  FileDown,
} from "lucide-react";

const API = "https://ojmee.in/employee";

export default function FinalSalaryCurrentMonth() {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [month, setMonth] = useState(currentMonth);
  const [salaryData, setSalaryData] = useState([]);
  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalary();
  }, []);

  const fetchSalary = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/emp_final_salary_current_month.php?month=${month}`
      );

      if (res.data.status) {
        setSalaryData(res.data.data || []);
        setSummary(res.data || {});
      } else {
        alert(res.data.message || "Salary API error");
        setSalaryData([]);
        setSummary({});
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "API not working");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return salaryData;

    return salaryData.filter((item) =>
      [
        item.employee_id,
        item.full_name,
        item.current_salary,
        item.bonus,
        item.reward,
        item.increment_amount,
        item.overtime,
        item.penalty,
        item.advance_amount,
        item.esicpf,
        item.final_salary,
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ")
        .includes(q)
    );
  }, [salaryData, search]);

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const exportCSV = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Employee ID",
      "Name",
      "Current Salary",
      "Bonus",
      "Reward",
      "Increment",
      "Overtime",
      "Penalty",
      "Advance",
      "ESIC/PF",
      "Final Salary",
    ];

    const rows = filteredData.map((item) => [
      item.employee_id || "",
      item.full_name || "",
      item.current_salary || 0,
      item.bonus || 0,
      item.reward || 0,
      item.increment_amount || 0,
      item.overtime || 0,
      item.penalty || 0,
      item.advance_amount || 0,
      item.esicpf || 0,
      item.final_salary || 0,
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `final_salary_${month}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex">
      <SideNav />

      <div className="flex-1 w-full lg:ml-72 p-4 md:p-6 overflow-y-auto">
        <div className="bg-gradient-to-r from-slate-900 via-pink-700 to-rose-600 rounded-[32px] p-6 text-white shadow-2xl mb-6">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Wallet /> Final Salary Current Month
          </h1>

          <p className="text-pink-100 mt-2">
            Salary + Bonus + Reward + Increment + Overtime - Penalty - Advance - ESIC/PF
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card
            icon={<CalendarDays />}
            title="Month"
            value={summary.month || month}
          />
          <Card
            icon={<Users />}
            title="Total Employees"
            value={summary.total_employees || 0}
          />
          <Card
            icon={<IndianRupee />}
            title="Total Final Salary"
            value={money(summary.total_final_salary)}
          />
          <Card
            icon={<Wallet />}
            title="Records Showing"
            value={filteredData.length}
          />
        </div>

        <div className="bg-white rounded-[28px] shadow-xl border border-pink-100 overflow-hidden">
          <div className="p-5 bg-slate-900 text-white">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black">Salary List</h2>
                <p className="text-sm text-slate-300">
                  Employee wise current month final salary
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-4 py-3 rounded-2xl text-slate-800 outline-none font-bold"
                />

                <button
                  type="button"
                  onClick={fetchSalary}
                  disabled={loading}
                  className="bg-white text-pink-600 px-5 py-3 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <RefreshCcw size={17} />
                  {loading ? "Loading..." : "Fetch"}
                </button>

                <button
                  type="button"
                  onClick={exportCSV}
                  className="bg-emerald-500 text-white px-5 py-3 rounded-2xl font-black flex items-center justify-center gap-2"
                >
                  <FileDown size={17} />
                  Export
                </button>
              </div>
            </div>

            <div className="relative mt-4">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee id, name, amount..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-pink-50 text-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Salary</th>
                  <th className="p-3">Bonus</th>
                  <th className="p-3">Reward</th>
                  <th className="p-3">Increment</th>
                  <th className="p-3">OT</th>
                  <th className="p-3">Penalty</th>
                  <th className="p-3">Advance</th>
                  <th className="p-3">ESIC/PF</th>
                  <th className="p-3">Final Salary</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-slate-500">
                      No salary data found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.employee_id}
                      className="border-b text-center hover:bg-pink-50/60"
                    >
                      <td className="p-3">
                        <div className="font-black text-slate-800">
                          {item.employee_id}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.full_name}
                        </div>
                      </td>

                      <td className="p-3 font-bold">
                        {money(item.current_salary)}
                      </td>

                      <td className="p-3 text-emerald-600 font-bold">
                        {money(item.bonus)}
                      </td>

                      <td className="p-3 text-emerald-600 font-bold">
                        {money(item.reward)}
                      </td>

                      <td className="p-3 text-emerald-600 font-bold">
                        {money(item.increment_amount)}
                      </td>

                      <td className="p-3 text-emerald-600 font-bold">
                        {money(item.overtime)}
                      </td>

                      <td className="p-3 text-red-600 font-bold">
                        -{money(item.penalty)}
                      </td>

                      <td className="p-3 text-red-600 font-bold">
                        -{money(item.advance_amount)}
                      </td>

                      <td className="p-3 text-red-600 font-bold">
                        -{money(item.esicpf)}
                      </td>

                      <td className="p-3">
                        <span className="px-4 py-2 rounded-full bg-slate-900 text-white font-black">
                          {money(item.final_salary)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {filteredData.length > 0 && (
                <tfoot className="bg-slate-100 font-black sticky bottom-0">
                  <tr className="text-center">
                    <td className="p-3">Total</td>
                    <td className="p-3">{money(sum("current_salary"))}</td>
                    <td className="p-3 text-emerald-700">{money(sum("bonus"))}</td>
                    <td className="p-3 text-emerald-700">{money(sum("reward"))}</td>
                    <td className="p-3 text-emerald-700">{money(sum("increment_amount"))}</td>
                    <td className="p-3 text-emerald-700">{money(sum("overtime"))}</td>
                    <td className="p-3 text-red-700">-{money(sum("penalty"))}</td>
                    <td className="p-3 text-red-700">-{money(sum("advance_amount"))}</td>
                    <td className="p-3 text-red-700">-{money(sum("esicpf"))}</td>
                    <td className="p-3">{money(sum("final_salary"))}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  function sum(key) {
    return filteredData.reduce(
      (total, item) => total + Number(item[key] || 0),
      0
    );
  }
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <h3 className="text-xl font-black text-slate-900 mt-1">{value}</h3>
        </div>
      </div>
    </div>
  );
}