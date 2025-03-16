import React, { useEffect, useState } from "react";
import { useRoles } from "../context/RoleContext";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"; // Import the modal

const BASE_URL = "http://localhost:5000";

const RolesTable = () => {
  const { roles, loading, error, createRole, updateRole, deleteRole } = useRoles();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [editRole, setEditRole] = useState({ id: "", name: "" });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [roleToDelete, setRoleToDelete] = useState(null); // Track role to delete
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter out "Admin" and "Subadmin" roles
  const filteredRoles = roles.filter(
    (role) => role.name !== "Admin" && role.name !== "Subadmin"
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleAddRoleClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddSubmit = () => {
    if (newRole.trim()) {
      createRole(newRole)
        .then(() => {
          setNewRole("");
          setIsAddDialogOpen(false);
        })
        .catch((err) => console.error("Failed to add role:", err));
    }
  };

  const handleEditClick = (role) => {
    setEditRole({ id: role._id, name: role.name });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (e) => {
    setEditRole((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleSaveEdit = (id) => {
    updateRole(id, { name: editRole.name })
      .then(() => {
        setIsEditDialogOpen(false);
      })
      .catch((err) => console.error("Failed to update role:", err));
  };

  const handleDeleteClick = (id) => {
    setRoleToDelete(id);
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const confirmDelete = (id) => {
    deleteRole(id)
      .then(() => {
        console.log(`Role with ID ${id} deleted successfully`);
        if (currentRoles.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1); // Adjust page if last item on page
        }
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
      })
      .catch((err) => {
        console.error("Failed to delete role:", err);
        alert("Failed to delete role!");
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
      });
  };

  if (loading) return <div className="text-center py-4 text-gray-500">Loading roles...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <div className="relative flex flex-col w-full max-w-screen-2xl mx-auto my-16 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl p-5 overflow-hidden">
        {/* Header and Add Button */}
        <div className="relative mx-4 mt-4 text-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Roles List</h3>
              <p className="text-slate-500">Manage your roles below</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
              <button
                className="flex items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                onClick={handleAddRoleClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path
                    d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"
                  ></path>
                </svg>
                Add Role
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Role Name
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      ></path>
                    </svg>
                  </p>
                </th>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Actions
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.length > 0 ? (
                currentRoles.map((role) => (
                  <tr key={role._id}>
                    <td className="p-4 border-b border-slate-200">
                      <p className="text-sm text-slate-500">{role.name}</p>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <button
                        className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        onClick={() => handleEditClick(role)}
                      >
                        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="w-4 h-4"
                          >
                            <path
                              d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"
                            ></path>
                          </svg>
                        </span>
                      </button>
                      <button
                        className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-red-600 transition-all hover:bg-red-600/10 active:bg-red-600/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                        type="button"
                        onClick={() => handleDeleteClick(role._id)}
                      >
                        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.75 4.5a2.25 2.25 0 00-2.25 2.25v12a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25v-12a2.25 2.25 0 00-2.25-2.25H6.75zM6 6.75v12a.75.75 0 00.75.75h10.5a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75zm3 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-4 text-center text-slate-500">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3">
          <p className="block text-sm text-slate-500">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-1">
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Add Role Dialog */}
        {isAddDialogOpen && (
          <div
            data-dialog-backdrop="dialog"
            data-dialog-backdrop-close="true"
            className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center backdrop-blur-sm transition-opacity duration-300 overflow-y-auto py-8"
            onClick={() => setIsAddDialogOpen(false)}
          >
            <div
              data-dialog="dialog"
              className="relative w-full max-w-screen-md mx-4 sm:mx-6 lg:mx-8 flex flex-col rounded-xl bg-white text-slate-700 shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Cross Button */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex flex-col">
                  <h4 className="text-2xl font-semibold text-slate-800">Add Role</h4>
                  <p className="mt-1 text-sm text-slate-500">Enter the new role name below.</p>
                </div>
                <button
                  className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none transition-colors duration-200"
                  onClick={() => setIsAddDialogOpen(false)}
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content */}
              <div className="flex flex-col p-6 space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">Role Name</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                    placeholder="Enter role name"
                  />
                </div>
              </div>

              {/* Footer with Buttons */}
              <div className="flex flex-col sm:flex-row justify-end p-6 border-t border-slate-200 space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  className="w-full sm:w-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={handleAddSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Dialog */}
        {isEditDialogOpen && (
          <div
            data-dialog-backdrop="dialog"
            data-dialog-backdrop-close="true"
            className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center backdrop-blur-sm transition-opacity duration-300 overflow-y-auto py-8"
            onClick={() => setIsEditDialogOpen(false)}
          >
            <div
              data-dialog="dialog"
              className="relative w-full max-w-screen-md mx-4 sm:mx-6 lg:mx-8 flex flex-col rounded-xl bg-white text-slate-700 shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Cross Button */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex flex-col">
                  <h4 className="text-2xl font-semibold text-slate-800">Edit Role</h4>
                  <p className="mt-1 text-sm text-slate-500">Update the role name below.</p>
                </div>
                <button
                  className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none transition-colors duration-200"
                  onClick={() => setIsEditDialogOpen(false)}
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content */}
              <div className="flex flex-col p-6 space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-700">Role Name</label>
                  <input
                    type="text"
                    value={editRole.name}
                    onChange={handleEditInputChange}
                    className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                    placeholder="Enter role name"
                  />
                </div>
              </div>

              {/* Footer with Buttons */}
              <div className="flex flex-col sm:flex-row justify-end p-6 border-t border-slate-200 space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  className="w-full sm:w-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => handleSaveEdit(editRole.id)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setRoleToDelete(null);
          }}
          onConfirm={confirmDelete}
          ratingId={roleToDelete} // Passing role ID as ratingId (matching prop name)
        />
      </div>
    </div>
  );
};

export default RolesTable;