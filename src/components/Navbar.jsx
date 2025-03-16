// components/Navbar.jsx
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

function Navbar() {
  const { user, logout, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log('Navbar - User:', user); // Debug user state

  const handleLogout = async () => {
    console.log('Navbar - Logging out...');
    await logout();
    setUser(null);
    localStorage.removeItem('accessToken'); // Ensure tokens are cleared
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (!user) return null; // Hide navbar if not logged in

  const isAdminOrSubadmin = user.role?.name === 'admin' || user.role?.name === 'subadmin';

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow xl:block hidden">
        <div className="mx-auto container px-6 py-2 xl:py-0">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <svg
                aria-label="Home"
                height={44}
                viewBox="0 0 300 300"
                width={43}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4c51bf"
                  d="m234.735 35.532c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16zm0 24c-4.412 0-8-3.588-8-8s3.588-8 8-8 8 3.588 8 8-3.588 8-8 8zm-62.529-14c0-2.502 2.028-4.53 4.53-4.53s4.53 2.028 4.53 4.53c0 2.501-2.028 4.529-4.53 4.529s-4.53-2.027-4.53-4.529zm89.059 60c0 2.501-2.028 4.529-4.53 4.529s-4.53-2.028-4.53-4.529c0-2.502 2.028-4.53 4.53-4.53s4.53 2.029 4.53 4.53zm-40.522-5.459-88-51.064c-1.242-.723-2.773-.723-4.016 0l-88 51.064c-1.232.715-1.992 2.033-1.992 3.459v104c0 1.404.736 2.705 1.938 3.428l88 52.936c.635.381 1.35.572 2.062.572s1.428-.191 2.062-.572l88-52.936c1.201-.723 1.938-2.023 1.938-3.428v-104c0-1.426-.76-2.744-1.992-3.459zm-90.008-42.98 80.085 46.47-52.95 31.289-23.135-13.607v-21.713c0-2.209-1.791-4-4-4s-4 1.791-4 4v21.713l-26.027 15.309c-1.223.719-1.973 2.029-1.973 3.447v29.795l-52 30.727v-94.688zm0 198.707-80.189-48.237 51.467-30.412 24.723 14.539v19.842c0 2.209 1.791 4 4 4s4-1.791 4-4v-19.842l26.027-15.307c1.223-.719 1.973-2.029 1.973-3.447v-31.667l52-30.728v94.729z"
                />
              </svg>
              <h2 className="hidden sm:block text-base text-gray-700 font-bold pl-3">Welcome</h2>
            </div>

            {/* Links */}
            <div className="flex items-center">
              <div className="hidden xl:flex md:mr-6 xl:mr-16">
                <Link
                  to="/dashboard"
                  className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <rect x={4} y={4} width={6} height={6} rx={1} />
                    <rect x={14} y={4} width={6} height={6} rx={1} />
                    <rect x={4} y={14} width={6} height={6} rx={1} />
                    <rect x={14} y={14} width={6} height={6} rx={1} />
                  </svg>
                  Dashboard
                </Link>
                {isAdminOrSubadmin ? (
                  <>
                    <Link
                      to="/manage-roles"
                      className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
                      </svg>
                      Manage Roles
                    </Link>
                    <Link
                      to="/all-ratings" // Fixed from /manage-user
                      className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M12 4v3m-4 5h8m-10 6h12m-8-10v8" />
                      </svg>
                      All Ratings
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/all-ratings" // Consistent with route
                    className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M12 4v3m-4 5h8m-10 6h12m-8-10v8" />
                    </svg>
                    View Ratings
                  </Link>
                )}
              </div>

              {/* Logout Button */}
              <div className="hidden xl:flex items-center">
                <button
                  onClick={handleLogout}
                  className="focus:outline-none bg-gray-100 border-gray-300 border transition duration-150 ease-in-out hover:bg-gray-300 rounded text-gray-600 px-5 py-2 text-xs"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="xl:hidden">
        <div className="py-4 px-6 w-full flex justify-between items-center bg-white fixed top-0 z-40">
          <div className="flex items-center">
            <svg
              height={44}
              viewBox="0 0 300 300"
              width={43}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4c51bf"
                d="m234.735 35.532c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16zm0 24c-4.412 0-8-3.588-8-8s3.588-8 8-8 8 3.588 8 8-3.588 8-8 8zm-62.529-14c0-2.502 2.028-4.53 4.53-4.53s4.53 2.028 4.53 4.53c0 2.501-2.028 4.529-4.53 4.529s-4.53-2.027-4.53-4.529zm89.059 60c0 2.501-2.028 4.529-4.53 4.529s-4.53-2.028-4.53-4.529c0-2.502 2.028-4.53 4.53-4.53s4.53 2.029 4.53 4.53zm-40.522-5.459-88-51.064c-1.242-.723-2.773-.723-4.016 0l-88 51.064c-1.232.715-1.992 2.033-1.992 3.459v104c0 1.404.736 2.705 1.938 3.428l88 52.936c.635.381 1.35.572 2.062.572s1.428-.191 2.062-.572l88-52.936c1.201-.723 1.938-2.023 1.938-3.428v-104c0-1.426-.76-2.744-1.992-3.459zm-90.008-42.98 80.085 46.47-52.95 31.289-23.135-13.607v-21.713c0-2.209-1.791-4-4-4s-4 1.791-4 4v21.713l-26.027 15.309c-1.223.719-1.973 2.029-1.973 3.447v29.795l-52 30.727v-94.688zm0 198.707-80.189-48.237 51.467-30.412 24.723 14.539v19.842c0 2.209 1.791 4 4 4s4-1.791 4-4v-19.842l26.027-15.307c1.223-.719 1.973-2.029 1.973-3.447v-31.667l52-30.728v94.729z"
              />
            </svg>
            <p className="text-base md:text-2xl text-gray-800 ml-3">Dashboard Admin</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1={4} y1={6} x2={20} y2={6} />
              <line x1={4} y1={12} x2={20} y2={12} />
              <line x1={4} y1={18} x2={20} y2={18} />
            </svg>
          </button>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`w-64 xl:hidden h-full absolute z-40 top-0 bg-white shadow transition duration-150 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="px-6 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      height={44}
                      viewBox="0 0 300 300"
                      width={43}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#4c51bf"
                        d="m234.735 35.532c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16zm0 24c-4.412 0-8-3.588-8-8s3.588-8 8-8 8 3.588 8 8-3.588 8-8 8zm-62.529-14c0-2.502 2.028-4.53 4.53-4.53s4.53 2.028 4.53 4.53c0 2.501-2.028 4.529-4.53 4.529s-4.53-2.027-4.53-4.529zm89.059 60c0 2.501-2.028 4.529-4.53 4.529s-4.53-2.028-4.53-4.529c0-2.502 2.028-4.53 4.53-4.53s4.53 2.029 4.53 4.53zm-40.522-5.459-88-51.064c-1.242-.723-2.773-.723-4.016 0l-88 51.064c-1.232.715-1.992 2.033-1.992 3.459v104c0 1.404.736 2.705 1.938 3.428l88 52.936c.635.381 1.35.572 2.062.572s1.428-.191 2.062-.572l88-52.936c1.201-.723 1.938-2.023 1.938-3.428v-104c0-1.426-.76-2.744-1.992-3.459zm-90.008-42.98 80.085 46.47-52.95 31.289-23.135-13.607v-21.713c0-2.209-1.791-4-4-4s-4 1.791-4 4v21.713l-26.027 15.309c-1.223.719-1.973 2.029-1.973 3.447v29.795l-52 30.727v-94.688zm0 198.707-80.189-48.237 51.467-30.412 24.723 14.539v19.842c0 2.209 1.791 4 4 4s4-1.791 4-4v-19.842l26.027-15.307c1.223-.719 1.973-2.029 1.973-3.447v-31.667l52-30.728v94.729z"
                      />
                    </svg>
                    <p className="text-base md:text-2xl text-gray-800 ml-3">Dashboard Admin</p>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <line x1={18} y1={6} x2={6} y2={18} />
                      <line x1={6} y1={6} x2={18} y2={18} />
                    </svg>
                  </button>
                </div>
                <ul className="mt-6">
                  <li className="text-gray-800 pt-8">
                    <Link to="/dashboard" className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 md:w-8 md:h-8 text-indigo-700"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <rect x={4} y={4} width={6} height={6} rx={1} />
                        <rect x={14} y={4} width={6} height={6} rx={1} />
                        <rect x={4} y={14} width={6} height={6} rx={1} />
                        <rect x={14} y={14} width={6} height={6} rx={1} />
                      </svg>
                      <p className="text-indigo-700 xl:text-base text-base ml-3">Dashboard</p>
                    </Link>
                  </li>
                  {isAdminOrSubadmin ? (
                    <>
                      <li className="text-gray-800 pt-8">
                        <Link to="/manage-roles" className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 md:w-8 md:h-8 text-gray-800"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
                          </svg>
                          <p className="text-gray-800 xl:text-base text-base ml-3">Manage Roles</p>
                        </Link>
                      </li>
                      <li className="text-gray-800 pt-8">
                        <Link to="/all-ratings" className="flex items-center"> {/* Fixed from /all-reviews */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-7 h-7 md:w-9 md:h-9 text-gray-800"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M12 4v3m-4 5h8m-10 6h12m-8-10v8" />
                          </svg>
                          <p className="text-gray-800 xl:text-base text-base ml-3">All Ratings</p>
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li className="text-gray-800 pt-8">
                      <Link to="/all-ratings" className="flex items-center"> {/* Fixed from /view-reviews */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 md:w-8 md:h-8 text-gray-800"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <path d="M12 4v3m-4 5h8m-10 6h12m-8-10v8" />
                        </svg>
                        <p className="text-gray-800 xl:text-base text-base ml-3">View Ratings</p>
                      </Link>
                    </li>
                  )}
                  <li className="text-gray-800 pt-8">
                    <button onClick={handleLogout} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 md:w-8 md:h-8 text-gray-800"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                        <path d="M7 12h14l-3 -3m0 6l3 -3" />
                      </svg>
                      <p className="text-gray-800 xl:text-base text-base ml-3">Logout</p>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;