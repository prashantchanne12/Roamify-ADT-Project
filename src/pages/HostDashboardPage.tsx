import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Calendar, TrendingUp } from 'lucide-react';

function HostDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Host Dashboard</h1>
      <div className="flex justify-end mb-8">
        <Link
          to="create-listing"
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Add Listing
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <Building2 className="text-blue-500 h-8 w-8" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <Users className="text-green-500 h-8 w-8" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Upcoming Bookings</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <Calendar className="text-purple-500 h-8 w-8" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$0</p>
            </div>
            <TrendingUp className="text-red-500 h-8 w-8" />
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-gray-500 text-center py-8">
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}

export default HostDashboardPage;