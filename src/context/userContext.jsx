import { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../../config';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch roles from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.API_URL}/all-roles`);
        if (!response.ok) throw new Error('Failed to fetch roles');
        const data = await response.json();
        setRoles(data); // Assuming the response is an array of role objects
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <UserContext.Provider value={{ roles, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);