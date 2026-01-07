import { Plus, Loader2, Filter } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import api from '../../lib/axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedRole ? `/api/admin/users?role=${selectedRole}` : '/api/admin/users';
      const res = await api.get(url);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching outlets', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleFilter = (role) => {
    setSelectedRole(role === selectedRole ? '' : role);
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div className="p-6 bg-background min-h-screen text-text">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">User Management</h1>
          <p className="text-secondary">Manage all users.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-colors">
            <Plus size={20} />
            Add User
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex items-center gap-3">
        <Filter size={20} className="text-secondary" />
        <span className="text-secondary font-medium">Filter by Role:</span>
        <button
          onClick={() => setSelectedRole('')}
          className={`px-4 py-2 rounded-lg transition-colors hover:cursor-pointer ${
            selectedRole === ''
              ? 'bg-primary text-on-primary'
              : 'bg-surface text-text border border-secondary/20 hover:bg-background'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => handleRoleFilter('SUPER_ADMIN')}
          className={`px-4 py-2 rounded-lg transition-colors hover:cursor-pointer ${
            selectedRole === 'SUPER_ADMIN'
              ? 'bg-primary text-on-primary'
              : 'bg-surface text-text border border-secondary/20 hover:bg-background'
          }`}
        >
          Super Admin
        </button>
        <button
          onClick={() => handleRoleFilter('OUTLET_MANAGER')}
          className={`px-4 py-2 rounded-lg transition-colors hover:cursor-pointer ${
            selectedRole === 'OUTLET_MANAGER'
              ? 'bg-primary text-on-primary'
              : 'bg-surface text-text border border-secondary/20 hover:bg-background'
          }`}
        >
          Outlet Manager
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-secondary/10">
          <h2 className="text-xl font-semibold mb-4 text-primary border-b border-secondary/10 pb-2">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-secondary text-sm border-b border-secondary/10">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Role</th>
                  <th className="py-3 px-4 font-medium">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user._id} className="border-b border-secondary/5 hover:bg-background/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 font-medium">{user.email}</td>
                    <td className="py-3 px-4 font-medium">{user.role}</td>
                    <td className="py-3 px-4 font-medium">{user.phoneNumber}</td>
                    <td className="py-3 px-4 font-medium text-right">
                      <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-colors hover:cursor-pointer">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
