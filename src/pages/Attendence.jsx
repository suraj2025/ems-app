import React, { useEffect, useState } from 'react';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const [formData, setFormData] = useState({
    date: '',
    status: 'Present',
    employeeId: '',
  });
  const uri="https://springboot-ems.onrender.com"

  const token = localStorage.getItem('token');

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${uri}/api/employees/my-employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchAttendances = async () => {
    try {
      const res = await fetch(`${uri}/api/attendances/my-attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAttendances(data);
      setFilteredAttendance(data);
    } catch (err) {
      console.error('Failed to fetch attendance records:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendances();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'employeeId') {
      const filtered = employees.filter((emp) =>
        emp.id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleEmployeeSelect = (id) => {
    setFormData((prev) => ({ ...prev, employeeId: id }));
    setSearchDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${uri}/api/attendances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: formData.date,
          status: formData.status,
          employee: { id: formData.employeeId },
        }),
      });

      if (res.ok) {
        alert('Attendance recorded successfully!');
        setFormData({ date: '', status: 'Present', employeeId: '' });
        fetchAttendances();
      } else {
        const err = await res.json();
        alert(err.message || 'Error recording attendance');
      }
    } catch (err) {
      console.error('Add attendance failed:', err);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchId(value);
    if (value === '') {
      setFilteredAttendance(attendances);
    } else {
      const filtered = attendances.filter((att) =>
        att.employee?.id?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAttendance(filtered);
    }
  };

  const handleRowClick = (att) => {
    setSelectedAttendance(att);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${uri}/api/attendances/${selectedAttendance.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedAttendance.date,
          status: selectedAttendance.status,
          employee: { id: selectedAttendance.employee.id },
        }),
      });
      if (res.ok) {
        alert('Attendance updated!');
        setShowModal(false);
        fetchAttendances();
      } else {
        const err = await res.json();
        alert(err.message || 'Update failed');
      }
    } catch (err) {
      alert('Failed to update attendance',err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      await fetch(`${uri}/api/attendances/${selectedAttendance.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Deleted successfully');
      setShowModal(false);
      fetchAttendances();
    } catch (err) {
      alert('Failed to delete record',err);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Record Attendance</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Leave">Leave</option>
        </select>

        <div className="relative">
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={(e) => {
              handleChange(e);
              setSearchDropdownOpen(true);
            }}
            onFocus={() => setSearchDropdownOpen(true)}
            placeholder="Search or select Employee ID"
            required
            className="p-2 border rounded w-full"
          />

          {searchDropdownOpen && filteredEmployees.length > 0 && (
            <ul
              className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto rounded shadow"
              onMouseDown={(e) => e.preventDefault()}
            >
              {filteredEmployees.map((emp) => (
                <li
                  key={emp.id}
                  onMouseDown={() => handleEmployeeSelect(emp.id)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {emp.id} - {emp.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Submit Attendance
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Search Attendance</h3>
      <input
        value={searchId}
        onChange={handleSearch}
        placeholder="Search by Employee ID"
        className="p-2 border rounded w-full sm:w-64 mb-6"
      />

      <h3 className="text-xl font-semibold mb-2">Attendance Records</h3>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Employee ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Department</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((att) => (
              <tr
                key={att.id}
                onClick={() => handleRowClick(att)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="border p-2">{att.date}</td>
                <td className="border p-2">{att.status}</td>
                <td className="border p-2">{att.employee?.id}</td>
                <td className="border p-2">{att.employee?.name}</td>
                <td className="border p-2">{att.employee?.department}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No attendance records found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showModal && selectedAttendance && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Edit Attendance</h2>
            <input
              type="date"
              value={selectedAttendance.date}
              onChange={(e) =>
                setSelectedAttendance((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              value={selectedAttendance.status}
              onChange={(e) =>
                setSelectedAttendance((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
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

export default Attendance;
