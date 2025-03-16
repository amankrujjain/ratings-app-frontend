import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Link } from 'react-router-dom';

function Profile() {
  const { user } = useContext(UserContext);
  console.log(user);

  if (!user) {
    return <div className="text-center text-red-500">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-6 relative">
        {/* Edit Pencil Icon */}
        <Link
          to={`/edit-profile/${user._id}`}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
          title="Edit Profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </Link>

        {/* Profile Header with Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-indigo-600">
            <img
              src={user.employeePhoto || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{user.employeeName || 'N/A'}</h2>
          <p className="text-sm text-gray-600 mt-1">{user.designation || 'N/A'}</p>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {user.employeeId || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {user.email || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {user.contactNo || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {user.department || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {user.bloodGroup || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Joining Date</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {user.role?.name || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1 p-2 w-full bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {user.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          {/* Reset Password Link */}
          <div className="text-center mt-6">
            <Link
              to="/reset-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Reset Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;