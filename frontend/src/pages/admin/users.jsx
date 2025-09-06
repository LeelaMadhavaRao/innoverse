import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { adminAPI } from '../../lib/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.role === filter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage and monitor all system users</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'admin'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setFilter('team')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'team'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setFilter('evaluator')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'evaluator'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Evaluators
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Card key={user.id} className="bg-gray-800 border-gray-700 hover:border-emerald-500 transition-colors">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.name || 'Unnamed User'}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`${
                      user.role === 'admin' 
                        ? 'border-red-500 text-red-400 bg-red-500/10'
                        : user.role === 'evaluator'
                        ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                        : 'border-green-500 text-green-400 bg-green-500/10'
                    }`}
                  >
                    {user.role}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-2">📅</span>
                    <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-2">🔐</span>
                    <span>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteUser(user.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No users have been registered yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-gray-400 text-sm">Total Users</div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-gray-400 text-sm">Admins</div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {users.filter(u => u.role === 'team').length}
            </div>
            <div className="text-gray-400 text-sm">Teams</div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {users.filter(u => u.role === 'evaluator').length}
            </div>
            <div className="text-gray-400 text-sm">Evaluators</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminUsers;
