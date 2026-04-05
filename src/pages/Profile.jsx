import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import { config } from '../../config';

const BASE_URL = config.BASE_URL;

function Profile() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Please log in to view your profile.
      </div>
    );
  }

  const firstLetter = user.employeeName
    ? user.employeeName.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-slate-50 to-slate-100 px-4 pt-20 pb-8 xl:py-8">

      <div className="max-w-2xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-5 sm:p-8 mb-6">

          {/* Header */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6 pb-6 border-b border-slate-200">

            {/* Avatar */}
            {user.employeePhoto ? (
              <img
                src={`${BASE_URL}/${user.employeePhoto.replace(/\\/g, "/")}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full 
                              bg-gradient-to-br from-slate-700 to-slate-900 
                              flex items-center justify-center 
                              text-white text-4xl font-bold">
                {firstLetter}
              </div>
            )}

            {/* Name + Role */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {user.employeeName || "N/A"}
              </h1>

              <p className="text-lg text-slate-600 mt-1">
                {user.designation || user.role?.name || "N/A"}
              </p>

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full 
                  ${user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                  }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">

            <ProfileItem label="Employee ID" value={user.employeeId} />
            <ProfileItem label="Email" value={user.email} />
            <ProfileItem label="Contact Number" value={user.contactNo} />
            <ProfileItem label="Department" value={user.department} />
            <ProfileItem label="Blood Group" value={user.bloodGroup} />
            <ProfileItem
              label="Joining Date"
              value={
                user.joiningDate
                  ? new Date(user.joiningDate).toLocaleDateString()
                  : "N/A"
              }
            />
            <ProfileItem label="Role" value={user.role?.name} />
            <ProfileItem
              label="Status"
              value={user.isActive ? "Active" : "Inactive"}
              highlight={user.isActive}
            />

          </div>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-slate-700 mb-4">
            Forgot your password?
          </p>

          <Link
            to="/reset-password"
            className="block text-center
                       w-full 
                       select-none rounded 
                       bg-slate-800 
                       py-3 px-6 
                       text-sm font-semibold text-white 
                       shadow-md shadow-slate-900/10 
                       transition-all 
                       hover:shadow-lg hover:shadow-slate-900/20 
                       active:opacity-[0.85]"
          >
            Click here to: Reset Password
          </Link>
        </div>

      </div>
    </div>
  );
}

function ProfileItem({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
        {label}
      </p>
      <p
        className={`text-sm mt-1 ${
          highlight ? "text-green-600 font-semibold" : "text-slate-800"
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
  );
}

export default Profile;