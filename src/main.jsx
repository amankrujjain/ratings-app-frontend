// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import UserContextProvider from './context/userContext.jsx';
import EmployeeContextProvider from './context/EmployeeContext.jsx';
import { RoleProvider } from './context/RoleContext.jsx'
import { RatingProvider } from './context/RatingContext.jsx'; // Import RatingProvider
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <EmployeeContextProvider>
          <RatingProvider>
            <RoleProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </RoleProvider>
          </RatingProvider>
        </EmployeeContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);