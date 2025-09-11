import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import AdminLayout from '../../components/admin/admin-layout';
import { adminAPI } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    specialization: ''
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const { data } = await adminAPI.getFaculty();
      setFaculty(Array.isArray(data) ? data : data?.faculty || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      console.error('Error response:', error.response?.data, 'status:', error.response?.status);
      setFaculty([]);
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = '/login';
      }
    }
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create faculty account via API
      const payload = {
        name: newFaculty.name,
        email: newFaculty.email,
        department: newFaculty.department,
        designation: newFaculty.designation,
        specialization: newFaculty.specialization
      };
      const { data } = await adminAPI.createFaculty(payload);
      console.log('Faculty created:', data);
      
  // Reset form
      setNewFaculty({
        name: '',
        email: '',
        department: '',
        designation: '',
        specialization: ''
      });
      setShowCreateForm(false);
      
      // Refresh faculty list
      fetchFaculty();
  addToast({ title: 'Success', description: 'Faculty account created successfully! Invitation sent.', type: 'success' });
    } catch (error) {
      console.error('Error creating faculty:', error);
      addToast({ title: 'Error', description: 'Error creating faculty account. Please try again.', type: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  // Invitations are sent by backend on create; for resend use adminAPI

  const resendInvitation = async (facultyMember) => {
    try {
      await adminAPI.resendFacultyInvitation(facultyMember._id || facultyMember.id);
      addToast({ title: 'Success', description: 'Invitation resent successfully!', type: 'success' });
    } catch (error) {
      console.error('Error resending invitation:', error);
      addToast({ title: 'Error', description: 'Error resending invitation.', type: 'destructive' });
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (!window.confirm('Delete this faculty profile and linked user?')) return;
    try {
      await adminAPI.deleteFaculty(facultyId);
      addToast({ title: 'Deleted', description: 'Faculty removed', type: 'success' });
      fetchFaculty();
    } catch (error) {
      console.error('Failed to delete faculty:', error);
      addToast({ title: 'Error', description: 'Failed to delete faculty', type: 'destructive' });
    }
  };

  const handleEditFaculty = (member) => {
    setEditingFaculty({
      _id: member._id || member.id,
      name: member.name || '',
      email: member.email || ''
    });
  };

  const submitEditFaculty = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateFaculty(editingFaculty._id, { name: editingFaculty.name, email: editingFaculty.email });
      setEditingFaculty(null);
      fetchFaculty();
      addToast({ title: 'Updated', description: 'Faculty updated', type: 'success' });
    } catch (error) {
      console.error('Failed to update faculty:', error);
      addToast({ title: 'Error', description: 'Failed to update faculty', type: 'destructive' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Faculty Management
                </h1>
                <p className="text-gray-400 text-base md:text-lg">
                  Create and manage faculty accounts for Innoverse 2025
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg w-full sm:w-auto"
                >
                  {showCreateForm ? '❌ Cancel' : '➕ Add Faculty'}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Create Faculty Form */}
          {showCreateForm && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-lg md:text-xl font-semibold text-white flex items-center">
                    <span className="text-xl md:text-2xl mr-3">🎓</span>
                    Add New Faculty Member
                  </h3>
                </div>
                <div className="p-6">
                  <form onSubmit={handleCreateFaculty} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Faculty Name *
                        </label>
                        <Input
                          value={newFaculty.name}
                          onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                          placeholder="Dr. John Smith"
                          required
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address * (Invitation will be sent here)
                        </label>
                        <Input
                          type="email"
                          value={newFaculty.email}
                          onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                          placeholder="john.smith@university.edu"
                          required
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Department
                        </label>
                        <Input
                          value={newFaculty.department}
                          onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})}
                          placeholder="Computer Science"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Designation *
                        </label>
                        <select
                          value={newFaculty.designation}
                          onChange={(e) => setNewFaculty({...newFaculty, designation: e.target.value})}
                          className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-md px-3 py-2"
                          required
                        >
                          <option value="">Select Designation</option>
                          <option value="Assistant Professor">Assistant Professor</option>
                          <option value="Associate Professor">Associate Professor</option>
                          <option value="Professor">Professor</option>
                          <option value="HOD" className="font-bold text-yellow-300">HOD (Head of Department)</option>
                          <option value="Principal" className="font-bold text-red-300">Principal</option>
                        </select>
                        {newFaculty.designation === 'HOD' && (
                          <p className="mt-1 text-sm text-yellow-400">
                            🏢 HOD will receive a distinguished invitation template
                          </p>
                        )}
                        {newFaculty.designation === 'Principal' && (
                          <p className="mt-1 text-sm text-red-400">
                            👑 Principal will receive a VIP invitation template
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specialization / Research Area
                      </label>
                      <Textarea
                        value={newFaculty.specialization}
                        onChange={(e) => setNewFaculty({...newFaculty, specialization: e.target.value})}
                        placeholder="AI & Machine Learning, Data Science, etc."
                        rows={3}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white w-full"
                        >
                          {loading ? '⏳ Creating...' : '✅ Create Account & Send Invitation'}
                        </Button>
                      </motion.div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Faculty List */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg md:text-xl font-semibold text-white flex items-center">
                  <span className="text-xl md:text-2xl mr-3">🎓</span>
                  Faculty Members ({faculty.length})
                </h3>
              </div>
              <div className="p-6">
                {faculty.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <div className="text-4xl md:text-6xl mb-4">🎓</div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No faculty members added yet</h3>
                    <p className="text-gray-400 text-sm md:text-base">
                      Add faculty members to help evaluate teams
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {faculty.map((member) => (
                      <motion.div
                        key={member._id || member.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-4 md:p-6 rounded-xl md:rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="flex items-start justify-between mb-3 md:mb-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base md:text-lg font-bold text-white mb-1 truncate">{member.name}</h4>
                            <p className="text-purple-400 text-sm md:text-base truncate">{member.designation}</p>
                          </div>
                          <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 text-xs ml-2 flex-shrink-0">
                            {member.status || 'active'}
                    {/* Edit Faculty Modal */}
                    {editingFaculty && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setEditingFaculty(null)} />
                        <Card className="z-10 w-full max-w-lg">
                          <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Edit Faculty</h3>
                            <form onSubmit={submitEditFaculty} className="space-y-4">
                              <div>
                                <label className="block text-sm text-gray-300 mb-1">Name</label>
                                <input value={editingFaculty.name} onChange={(e) => setEditingFaculty({...editingFaculty, name: e.target.value})} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-300 mb-1">Email</label>
                                <input value={editingFaculty.email} onChange={(e) => setEditingFaculty({...editingFaculty, email: e.target.value})} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setEditingFaculty(null)}>Cancel</Button>
                                <Button type="submit">Save</Button>
                              </div>
                            </form>
                          </div>
                        </Card>
                      </div>
                    )}
                          </Badge>
                        </div>

                        <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="text-gray-400 text-xs md:text-sm font-medium">Email:</span>
                            <span className="text-gray-300 text-xs md:text-sm break-all sm:ml-2">{member.email}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="text-gray-400 text-xs md:text-sm font-medium">Department:</span>
                            <span className="text-gray-300 text-xs md:text-sm sm:ml-2">{member.department}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <span className="text-gray-400 text-xs md:text-sm font-medium">Added:</span>
                            <span className="text-gray-300 text-xs md:text-sm sm:ml-2">
                              {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>

                        {member.specialization && (
                          <div className="mb-3 md:mb-4">
                            <span className="text-gray-400 text-xs md:text-sm font-medium">Specialization:</span>
                            <p className="text-gray-300 text-xs md:text-sm mt-1 break-words">{member.specialization}</p>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            size="sm"
                            onClick={() => resendInvitation(member)}
                            className="bg-purple-600 hover:bg-purple-700 text-white flex-1 text-xs md:text-sm"
                          >
                            📧 Resend Invitation
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditFaculty(member)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs md:text-sm"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFaculty(member._id || member.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-xs md:text-sm"
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
    </motion.div>
  );
}

export default AdminFaculty;
