import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Assuming UserContext is in the same directory

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const EmployeeContext = createContext();

export default function EmployeeContextProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);


  const { user } = useContext(UserContext); // Get user from UserContext for auth state
  const navigate = useNavigate();

  // Create Employee
  const createEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/add-user`, {
        method: 'POST',
        credentials: 'include', // Send cookies
        body: employeeData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create employee');
      }

      const data = await response.json();
      console.log('Create employee response:', data);
      setEmployees((prev) => [...prev, data.user]);
      toast.success('Employee created successfully!');
      return data;
    } catch (error) {
      console.error('Create employee error:', error.message);
      toast.error(error.message);
      if (error.message.includes('Token') || error.message.includes('Forbidden')) {
        navigate('/login');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Get All Employees
  const getAllEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/all-user`, {
        method: 'GET',
        credentials: 'include', // Send cookies
      });

      console.log('Get all employees status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Get all employees error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch employees');
      }

      const data = await response.json();
      console.log('Get all employees data:', data);
      setEmployees(data.users || data || []); // Flexible: handle users, data, or array
      return data.users || data;
    } catch (error) {
      console.error('Get all employees error:', error.message);
      toast.error(error.message);
      if (error.message.includes('Token') || error.message.includes('Forbidden')) {
        navigate('/login');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Get Employee by ID
  const getEmployeeById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/get-user/${id}`, {
        method: 'GET',
        credentials: 'include', // Send cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch employee');
      }

      const data = await response.json();
      console.log('Get employee by ID response:', data);
      setSelectedEmployee(data);
      return data;
    } catch (error) {
      console.error('Get employee by ID error:', error.message);
      toast.error(error.message);
      if (error.message.includes('Token') || error.message.includes('Forbidden')) {
        navigate('/login');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Update Employee
  const updateEmployee = useCallback(async (id, employeeData) => {
    setLoading(true);
    try {
      console.log('Sending update data:', Object.fromEntries(employeeData));
  
      const response = await fetch(`${API_URL}/update-user/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: employeeData instanceof FormData ? {} : { "Content-Type": "application/json" },
        body: employeeData instanceof FormData ? employeeData : JSON.stringify(employeeData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update employee');
      }
  
      const data = await response.json();
      console.log('Update employee response:', data);
  
      if (!data.user) throw new Error("Invalid response from server");
  
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? data.user : emp))
      );
  
      setSelectedEmployee(data.user);
      toast.success('Employee updated successfully!');
    } catch (error) {
      console.error('Update employee error:', error.message);
      toast.error(error.message);
      if (error.message.includes('Token') || error.message.includes('Forbidden')) {
        navigate('/login');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  // Delete Employee
  const deleteEmployee = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/delete-user/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      const data = await response.json(); // Store response
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete employee');
      }
  
      console.log('Delete employee response:', data);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      if (selectedEmployee?._id === id) setSelectedEmployee(null);
      toast.success('Employee deleted successfully!');
      return { message: 'Employee deleted' };
    } catch (error) {
      console.error('Delete employee error:', error.message);
      toast.error(error.message);
      if (error.message.includes('Token') || error.message.includes('Forbidden')) {
        navigate('/login');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, selectedEmployee]);
  

  const contextValue = useMemo(
    () => ({
      employees,
      selectedEmployee,
      loading,
      createEmployee,
      getAllEmployees,
      getEmployeeById,
      updateEmployee,
      deleteEmployee,
    }),
    [employees, selectedEmployee, loading, createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee]
  );

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
}

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within an EmployeeContextProvider');
  }
  return context;
};