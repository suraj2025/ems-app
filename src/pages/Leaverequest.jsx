import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    employeeId: '',
    status: '',       // added status here
  });
  const [searchId, setSearchId] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const uri="https://springboot-ems.onrender.com"

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get(`${uri}/api/leaveRequests/my-leaves`, {
        headers,
      });
      setLeaveRequests(res.data);
      setFilteredRequests(res.data);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${uri}/api/employees/my-employees`, {
        headers,
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${uri}/api/leaveRequests`,
        {
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          status: formData.status,        // added status here
          employee: { id: formData.employeeId },
        },
        { headers }
      );
      alert('Leave request submitted!');
      setFormData({ startDate: '', endDate: '', reason: '', employeeId: '', status: '' });
      fetchLeaveRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting leave');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchId(value);
    if (value === '') {
      setFilteredRequests(leaveRequests);
    } else {
      const filtered = leaveRequests.filter((lr) =>
        lr.employee?.id?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  };

  const handleRowClick = (lr) => {
    setSelectedRequest({
      ...lr,
      employeeId: lr.employee?.id || '',
    });
    setShowModal(true);
  };

  const handleUpdate = async (lr) => {
    try {
      await axios.put(
        `${uri}/api/leaveRequests/${lr.id}`,
        {
          startDate: lr.startDate,
          endDate: lr.endDate,
          reason: lr.reason,
          status: lr.status,         // added status here
          employee: { id: lr.employeeId },
        },
        { headers }
      );
      alert('Leave request updated!');
      setShowModal(false);
      fetchLeaveRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating leave');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) return;
    try {
      await axios.delete(`${uri}/api/leaveRequests/${id}`, { headers });
      alert('Leave request deleted!');
      setShowModal(false);
      fetchLeaveRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting leave');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Submit Leave Request</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          name="reason"
          type="text"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
          required
          className="p-2 border rounded col-span-1 md:col-span-2"
        />
        <input
          list="employeeOptions"
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <datalist id="employeeOptions">
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.id} - {emp.name}
            </option>
          ))}
        </datalist>

        {/* New status select */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">Select Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Submit Leave
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Search Leave Requests</h3>
      <input
        type="text"
        placeholder="Search by Employee ID"
        value={searchId}
        onChange={handleSearch}
        className="p-2 border rounded w-full sm:w-64 mb-6"
      />

      <h3 className="text-xl font-semibold mb-2">Leave Request List</h3>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Employee ID</th>
            <th className="border p-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((lr) => (
              <tr
                key={lr.id}
                onClick={() => handleRowClick(lr)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="border p-2">{lr.startDate}</td>
                <td className="border p-2">{lr.endDate}</td>
                <td className="border p-2">{lr.reason}</td>
                <td className="border p-2">{lr.status}</td>
                <td className="border p-2">{lr.employee?.id}</td>
                <td className="border p-2">{lr.employee?.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Edit Leave Request</h2>
            {['startDate', 'endDate', 'reason'].map((field) => (
              <input
                key={field}
                name={field}
                type={field.includes('Date') ? 'date' : 'text'}
                value={selectedRequest[field]}
                onChange={(e) =>
                  setSelectedRequest({ ...selectedRequest, [field]: e.target.value })
                }
                className="w-full mb-2 p-2 border rounded"
              />
            ))}
            <input
              list="employeeOptions"
              name="employeeId"
              value={selectedRequest.employeeId}
              onChange={(e) =>
                setSelectedRequest({ ...selectedRequest, employeeId: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
              placeholder="Employee ID"
            />

            {/* Status select in modal */}
            <select
              name="status"
              value={selectedRequest.status}
              onChange={(e) =>
                setSelectedRequest({ ...selectedRequest, status: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleUpdate(selectedRequest)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(selectedRequest.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;
