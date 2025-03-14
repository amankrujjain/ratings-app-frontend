// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import UserContextProvider from './context/UserContext.jsx';
import EmployeeContextProvider from './context/EmployeeContext.jsx';
import { RatingProvider } from './context/RatingContext.jsx'; // Import RatingProvider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <EmployeeContextProvider>
          <RatingProvider>
            <App />
          </RatingProvider>
        </EmployeeContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);