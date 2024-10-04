import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddReceipt from './pages/AddReceipt';
import ViewReceipt from './pages/ViewReceipt';
import EditReceipt from './pages/EditReceipt';
import LandingPage from './pages/Landing';
import PrivateRoute from './components/PrivateRoute';
import { isAuthenticated } from './services/Api';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/viewreceipt" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addreceipt" element={<PrivateRoute><AddReceipt /></PrivateRoute>} />
          <Route path="/viewreceipt" element={<PrivateRoute><ViewReceipt /></PrivateRoute>} />
          <Route path="/editreceipt/:id" element={<PrivateRoute><EditReceipt /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/landing" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
