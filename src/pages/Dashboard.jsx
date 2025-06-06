import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [emp, setEmp] = useState(0);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch employees and count
        const response = await axios.get("http://localhost:8081/api/employees/my-employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmp(response.data.length);

        // Fetch all leaves for the user
        const response1 = await axios.get("http://localhost:8081/api/leaveRequests/my-leaves", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const leaves = response1.data;

        // Set total requests
        setTotalRequests(leaves.length);

        // Calculate counts by status
        setPending(leaves.filter((l) => l.status === "PENDING").length);
        setApproved(leaves.filter((l) => l.status === "APPROVED").length);
        setRejected(leaves.filter((l) => l.status === "REJECTED").length);

        // Fetch recent leaves for table
        const leavesRes = await axios.get("http://localhost:8081/api/leaveRequests/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentLeaves(leavesRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-20 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10">📊 Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        <SummaryCard label="Total Requests" value={totalRequests} icon="🗂️" />
        <SummaryCard label="Pending" value={pending} icon="⏳" />
        <SummaryCard label="Approved" value={approved} icon="✅" />
        <SummaryCard label="Rejected" value={rejected} icon="❌" />
        <SummaryCard label="Employees" value={emp} icon="👥" />
      </div>

      {/* Recent Leave Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-semibold text-gray-800 p-6 border-b">📅 Recent Leave Requests</h2>
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-600 text-white text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">To</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentLeaves.length > 0 ? (
              recentLeaves.map((leave) => (
                <tr key={leave.id} className="border-b hover:bg-gray-50 transition-all duration-200">
                  <td className="px-6 py-3">{leave.employeeName || leave.employee?.name || "N/A"}</td>
                  <td className="px-6 py-3">{leave.startDate}</td>
                  <td className="px-6 py-3">{leave.endDate}</td>
                  <td className="px-6 py-3">{leave.leaveType || leave.reason}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SummaryCard component outside Dashboard
const SummaryCard = ({ label, value, icon }) => (
  <div className="bg-white border border-blue-100 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
    <div className="flex flex-col items-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h2 className="text-3xl font-bold text-blue-600">{value ?? 0}</h2>
      <p className="text-gray-700 font-medium mt-2 text-sm text-center">{label}</p>
    </div>
  </div>
);

export default Dashboard;
