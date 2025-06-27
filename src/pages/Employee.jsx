
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json';
const Employee = () => {
  const [loading, setLoading] = useState(true); 
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    department: '',
    salary: '',
  });
  const [searchId, setSearchId] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
const uri = "https://springboot-ems.onrender.com"; // ✅ correct

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${uri}/api/employees/my-employees`, { headers });
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }finally {
    setLoading(false);  // End loading
  }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${uri}/api/employees`, formData, { headers });
      alert('Employee added successfully!');
      setFormData({ id: '', name: '', email: '', department: '', salary: '' });
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding employee');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchId(value);
    if (value === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter((emp) =>
        emp.id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
    setShowModal(true);
  };

  const handleUpdate = async (emp) => {
    try {
      await axios.put(`${uri}/api/employees/${emp.id}`, emp, { headers });
      alert('Employee updated successfully!');
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating employee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`${uri}/api/employees/${id}`, { headers });
      alert('Employee deleted!');
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Employee</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {['id', 'name', 'email', 'department', 'salary'].map((field) => (
          <input
            key={field}
            name={field}
            type={field === 'email' ? 'email' : field === 'salary' ? 'number' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
        ))}
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Add Employee
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Search Employee</h3>
      <input
        type="text"
        placeholder="Search by Employee ID"
        value={searchId}
        onChange={handleSearch}
        className="p-2 border rounded w-full sm:w-64 mb-6"
      />

      <h3 className="text-xl font-semibold mb-2">Employee List</h3>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Employee ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Salary</th>
          </tr>
        </thead>
        <tbody>
  {loading ? (
    <tr>
      <td colSpan="5" className="text-center py-8">
        <Lottie
          animationData={loadingAnimation}
          className="w-[250px] sm:w-[300px] md:w-[400px] lg:w-[450px] mx-auto"
        />
        <p className="mt-4 text-gray-500">Loading employees...</p>
      </td>
    </tr>
  ) : filteredEmployees.length > 0 ? (
    filteredEmployees.map((emp) => (
      <tr
        key={emp.id}
        onClick={() => handleRowClick(emp)}
        className="cursor-pointer hover:bg-gray-100"
      >
        <td className="border p-2">{emp.id}</td>
        <td className="border p-2">{emp.name}</td>
        <td className="border p-2">{emp.email}</td>
        <td className="border p-2">{emp.department}</td>
        <td className="border p-2">{emp.salary}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center py-4 text-red-500 font-medium">
        No employee found.
      </td>
    </tr>
  )}
</tbody>

      </table>

      {/* Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] sm:w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            {['name', 'email', 'department', 'salary'].map((field) => (
              <input
                key={field}
                name={field}
                type={field === 'salary' ? 'number' : 'text'}
                value={selectedEmployee[field]}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, [field]: e.target.value })
                }
                className="w-full mb-2 p-2 border rounded"
              />
            ))}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleUpdate(selectedEmployee)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(selectedEmployee.id)}
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

export default Employee;
