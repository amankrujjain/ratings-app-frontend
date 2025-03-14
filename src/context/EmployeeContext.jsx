import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const EmployeeContext = createContext();

export default function EmployeeContextProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken'); // Get token once here

  // Helper function for API calls
  const apiFetch = async (url, options = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if exists
          ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        },
        credentials: 'include', // Keep cookies if needed
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      toast.error(error.message);
      if (error.message.includes('Token') || error.message.includes('Forbidden')) {
        navigate('/login');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create Employee
  const createEmployee = async (employeeData) => {
    const data = await apiFetch('/add-user', {
      method: 'POST',
      body: employeeData, // Could be FormData or JSON
    });
    setEmployees((prev) => [...prev, data.user]);
    toast.success('Employee created successfully!');
    return data;
  };

  // Get All Employees
  const getAllEmployees = async () => {
    const data = await apiFetch('/all-user', { method: 'GET' });
    setEmployees(data || []); // Fallback to empty array if no data
    return data;
  };

  // Get Employee by ID
  const getEmployeeById = async (id) => {
    const data = await apiFetch(`/get-user/${id}`, { method: 'GET' });
    setSelectedEmployee(data);
    return data;
  };

  // Update Employee
  const updateEmployee = async (id, employeeData) => {
    const data = await apiFetch(`/update-user/${id}`, {
      method: 'PUT',
      body: employeeData instanceof FormData ? employeeData : JSON.stringify(employeeData),
    });
    setEmployees((prev) => prev.map((emp) => (emp._id === id ? data.user : emp)));
    setSelectedEmployee(data.user);
    toast.success('Employee updated successfully!');
    return data;
  };

  // Delete Employee
  const deleteEmployee = async (id) => {
    const data = await apiFetch(`/delete-user/${id}`, { method: 'DELETE' });
    setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    if (selectedEmployee?._id === id) setSelectedEmployee(null);
    toast.success('Employee deleted successfully!');
    return data;
  };

  // Context value
  const value = {
    employees,
    selectedEmployee,
    loading,
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within an EmployeeContextProvider');
  }
  return context;
};