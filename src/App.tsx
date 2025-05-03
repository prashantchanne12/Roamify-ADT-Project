import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import SavedPropertiesPage from './pages/SavedPropertiesPage';
import HostDashboardPage from './pages/HostDashboardPage';
import CreateListingPage from './pages/CreateListingPage';
import ManageListingsPage from './pages/ManageListingsPage';
import HostBookingsPage from './pages/HostBookingsPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import HostRoute from './components/HostRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="property/:id" element={<PropertyDetailsPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/:id" element={<BookingDetailsPage />} />
          <Route path="saved" element={<SavedPropertiesPage />} />
        </Route>
        
        {/* Host Routes */}
        <Route element={<HostRoute />}>
          <Route path="host" element={<HostDashboardPage />} />
          <Route path="host/create-listing" element={<CreateListingPage />} />
          <Route path="host/listings" element={<ManageListingsPage />} />
          <Route path="host/bookings" element={<HostBookingsPage />} />
        </Route>
        
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;