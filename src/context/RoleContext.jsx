// RoleProvider in RoleContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toast

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  const base_url = "http://localhost:5000/api";

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${base_url}/all-roles`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      const filteredRoles = data.filter(
        (role) => role.name !== "admin" && role.name !== "subadmin"
      );
      setRoles(filteredRoles);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch roles: ${err.message}`); // Error toast
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleName) => {
    try {
      const response = await fetch(`${base_url}/create-roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: roleName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      if (data.role.name !== "admin" && data.role.name !== "subadmin") {
        setRoles([...roles, data.role]);
        toast.success(`Role "${roleName}" created successfully`); // Success toast
      } else {
        toast.warn(`Role "${roleName}" is restricted and not added to the list`);
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to create role: ${err.message}`); // Error toast
    }
  };

  const updateRole = async (id, updatedData) => {
    try {
      const response = await fetch(`${base_url}/update-role/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      if (data.updatedRole.name !== "admin" && data.updatedRole.name !== "subadmin") {
        setRoles(roles.map((role) => (role._id === id ? data.updatedRole : role)));
        toast.success(`Role updated to "${updatedData.name}" successfully`); // Success toast
      } else {
        setRoles(roles.filter((role) => role._id !== id));
        toast.warn(`Role updated to "${updatedData.name}" and removed from the list`);
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to update role: ${err.message}`); // Error toast
    }
  };

  const deleteRole = async (id) => {
    try {
      const response = await fetch(`${base_url}/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setRoles(roles.filter((role) => role._id !== id));
      toast.success("Role deleted successfully"); // Success toast
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to delete role: ${err.message}`); // Error toast
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <RoleContext.Provider value={{ roles, loading, error, createRole, updateRole, deleteRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => {
  return useContext(RoleContext);
};