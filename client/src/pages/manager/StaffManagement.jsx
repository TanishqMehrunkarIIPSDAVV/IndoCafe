import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../lib/axios';
import Button from '../../components/ui/Button';

const StaffManagement = () => {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'WAITER',
    shiftStartTime: '',
    phoneNumber: '' // Added as it is required by backend
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = ['WAITER', 'KITCHEN', 'DISPATCHER'];

  useEffect(() => {
    if (user?.defaultOutletId) {
      fetchStaff();
    }
  }, [user]);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`/manager/staff/${user.defaultOutletId}`);
      setStaffList(response.data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      setError('Failed to load staff list.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/manager/staff', {
        ...formData,
        outletId: user.defaultOutletId
      });
      setSuccess('Staff member added successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'WAITER',
        shiftStartTime: '',
        phoneNumber: ''
      });
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add staff member.');
    }
  };

  const handleRemove = async (staffId) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;

    try {
      await axios.delete(`/manager/staff/${staffId}`);
      setStaffList(staffList.filter(staff => staff._id !== staffId));
      setSuccess('Staff member removed successfully.');
    } catch (err) {
      setError('Failed to remove staff member.');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Staff Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Staff Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Staff</h2>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift Start Time</label>
              <input
                type="time"
                name="shiftStartTime"
                value={formData.shiftStartTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Add Staff Member
            </Button>
          </form>
        </div>

        {/* Staff List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Staff</h2>
          
          <div className="overflow-y-auto max-h-[600px]">
            {staffList.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No staff members found.</p>
            ) : (
              <div className="space-y-4">
                {staffList.map(staff => (
                  <div key={staff._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-gray-800">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {staff.role}
                        </span>
                        <span className="text-xs text-gray-500">
                          Shift: {staff.shiftDetails?.startTime || 'Not set'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleRemove(staff._id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
