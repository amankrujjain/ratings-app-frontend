import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/userContext'; // Adjust path if needed

function SignUp() {
  const { signup, roles } = useContext(UserContext); // Use signup and roles from new context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: '',
    email: '',
    employeeId: '',
    department: '',
    designation: '',
    contactNo: '',
    bloodGroup: '',
    joiningDate: '',
    employeePhoto: null,
    isActive: true,
    role: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(formData); // Use signup function from context
    if (!result.error) {
      navigate('/login'); // Navigate to login on success
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo and Animated Text */}
      <div className="hidden md:flex md:w-1/2 bg-gray-900 text-white flex-col justify-center items-center p-8">
        <div className="text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Company Logo"
            className="mb-6 mx-auto"
          />
          <h1 className="text-3xl font-bold animate-pulse">
            Welcome to Dashboard Admin
          </h1>
          <p className="mt-4 text-lg animate-fade-in">
            Create an account or login
          </p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">
                  Employee Name
                </label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  placeholder="e.g., ADM001"
                  required
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  placeholder="e.g., Administration"
                  required
                />
              </div>
              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  placeholder="e.g., Super Admin"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  placeholder="e.g., 7352419070"
                  required
                />
              </div>
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <input
                  type="text"
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  placeholder="e.g., O+"
                />
              </div>
              <div>
                <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700">
                  Joining Date
                </label>
                <input
                  type="date"
                  id="joiningDate"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="employeePhoto" className="block text-sm font-medium text-gray-700">
                  Employee Photo
                </label>
                <input
                  type="file"
                  id="employeePhoto"
                  name="employeePhoto"
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.length === 0 ? (
                    <option>Loading roles...</option>
                  ) : (
                    roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name || role.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-200"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;