import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Profile() {
  const { user } = useContext(UserContext);
  console.log(user)

  if (!user) {
    return <div className="text-center text-red-500">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        {/* Profile Header with Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.employeePhoto || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-600"
          />
          <h2 className="text-2xl font-semibold text-gray-800">{user.employeeName || 'N/A'}</h2>
          <p className="text-sm text-gray-600">{user.designation || 'N/A'}</p>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border rounded-md text-gray-800">
                {user.employeeId || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border rounded-md text-gray-800">
                {user.email || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border rounded-md text-gray-800">
                {user.contactNo || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border rounded-md text-gray-800">
                {user.department || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border rounded-md text-gray-800">
                {user.bloodGroup || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Joining Date</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border rounded-md text-gray-800">
                {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border rounded-md text-gray-800">
                {user.role?.name || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border rounded-md text-gray-800">
                {user.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;