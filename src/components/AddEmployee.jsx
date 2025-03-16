// AddEmployeeForm.jsx
import React, { useState, useEffect } from 'react';

const AddEmployeeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    email: '',
    employeeId: '',
    department: '',
    designation: '',
    contactNo: '',
    bloodGroup: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employeePhoto: null, // Changed to null for file input
    role: '',
    password: ''
  });
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const token = localStorage.getItem('accessToken'); // Get token from localStorage
        const response = await fetch('http://localhost:5000/api/all-roles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '', // Add token if available
          },
        });
  
        if (!response.ok) throw new Error('Failed to fetch roles');
  
        const data = await response.json();
        setRoles(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, role: data[0]._id }));
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };
  
    fetchRoles();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      employeePhoto: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For file upload, we'll need to use FormData
    const submitData = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    }
    onSubmit(submitData);
  };

  return (
    <div className="relative flex flex-col w-full bg-white shadow-lg rounded-xl p-5 sm:p-8">
      <button
        className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 focus:outline-none"
        onClick={onCancel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="flex flex-col">
        <h4 className="text-2xl mb-1 font-semibold text-slate-700">Add New Member</h4>
        <p className="mb-6 text-slate-400">Fill in the details for the new member</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm text-slate-700">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Enter employee ID"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Enter employee name"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Enter department"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Enter designation"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Contact Number</label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Enter contact number"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Enter blood group"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Employee Photo</label>
              <input
                type="file"
                name="employeePhoto"
                onChange={handleFileChange}
                className="pl-5 py-2 w-full h-14 bg-transparent text-slate-700 text-sm border border-slate-200 rounded px-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                accept="image/*"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                disabled={loadingRoles}
                required
              >
                {loadingRoles ? (
                  <option>Loading roles...</option>
                ) : (
                  roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              className="w-full sm:w-auto select-none rounded border border-red-600 py-2 px-6 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto select-none rounded bg-slate-800 py-2 px-6 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;