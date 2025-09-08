import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';

function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    specialization: ''
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      // Mock data - replace with actual API call
      const mockFaculty = [
        {
          id: 1,
          name: "Dr. Rajesh Kumar",
          email: "rajesh.kumar@university.edu",
          department: "Computer Science",
          designation: "Professor",
          specialization: "AI & Machine Learning",
          status: "active",
          createdAt: "2025-09-01"
        },
        {
          id: 2,
          name: "Prof. Priya Sharma",
          email: "priya.sharma@university.edu",
          department: "Electronics",
          designation: "Associate Professor",
          specialization: "IoT & Embedded Systems",
          status: "active",
          createdAt: "2025-09-02"
        }
      ];
      setFaculty(mockFaculty);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create faculty account
      const facultyData = {
        name: newFaculty.name,
        email: newFaculty.email,
        password: generatePassword(),
        role: 'faculty',
        facultyDetails: {
          department: newFaculty.department,
          designation: newFaculty.designation,
          specialization: newFaculty.specialization
        }
      };

      // This would be actual API calls
      console.log('Creating faculty:', facultyData);
      
      // Send invitation email
      await sendFacultyInvitation(facultyData);
      
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
      
      alert('Faculty account created successfully! Invitation sent.');
    } catch (error) {
      console.error('Error creating faculty:', error);
      alert('Error creating faculty account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const sendFacultyInvitation = async (facultyData) => {
    // This would send email with faculty credentials
    const emailData = {
      to: facultyData.email,
      subject: 'Innoverse 2025 - Faculty Portal Invitation',
      template: 'faculty-invitation',
      data: {
        name: facultyData.name,
        email: facultyData.email,
        password: facultyData.password,
        loginUrl: 'https://innoverse-n.vercel.app/login',
        department: facultyData.facultyDetails.department,
        designation: facultyData.facultyDetails.designation
      }
    };
    
    console.log('Sending faculty invitation:', emailData);
    // await emailAPI.send(emailData);
  };

  const resendInvitation = async (facultyMember) => {
    try {
      await sendFacultyInvitation({
        email: facultyMember.email,
        name: facultyMember.name,
        password: 'resetPassword123', // This would be generated or retrieved
        facultyDetails: { 
          department: facultyMember.department,
          designation: facultyMember.designation
        }
      });
      alert('Invitation resent successfully!');
    } catch (error) {
      console.error('Error resending invitation:', error);
      alert('Error resending invitation.');
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
    <AdminLayout>
      <div className="min-h-screen bg-gray-900 text-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Faculty Management
                </h1>
                <p className="text-gray-400 text-lg">
                  Create and manage faculty accounts for Innoverse 2025
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
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
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <span className="text-2xl mr-3">🎓</span>
                    Add New Faculty Member
                  </h3>
                </div>
                <div className="p-6">
                  <form onSubmit={handleCreateFaculty} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Faculty Name *
                        </label>
                        <Input
                          value={newFaculty.name}
                          onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                          placeholder="Dr. John Smith"
                          required
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
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
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Department
                        </label>
                        <Input
                          value={newFaculty.department}
                          onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})}
                          placeholder="Computer Science"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Designation
                        </label>
                        <Input
                          value={newFaculty.designation}
                          onChange={(e) => setNewFaculty({...newFaculty, designation: e.target.value})}
                          placeholder="Professor / Associate Professor"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
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
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="flex gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                        >
                          {loading ? '⏳ Creating...' : '✅ Create Account & Send Invitation'}
                        </Button>
                      </motion.div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">🎓</span>
                  Faculty Members ({faculty.length})
                </h3>
              </div>
              <div className="p-6">
                {faculty.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎓</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No faculty members added yet</h3>
                    <p className="text-gray-400">
                      Add faculty members to help evaluate teams
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {faculty.map((member) => (
                      <motion.div
                        key={member.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                            <p className="text-purple-400">{member.designation}</p>
                          </div>
                          <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
                            {member.status}
                          </Badge>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div>
                            <span className="text-gray-400 text-sm">Email: </span>
                            <span className="text-gray-300 text-sm">{member.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Department: </span>
                            <span className="text-gray-300 text-sm">{member.department}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Added: </span>
                            <span className="text-gray-300 text-sm">{new Date(member.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {member.specialization && (
                          <div className="mb-4">
                            <span className="text-gray-400 text-sm">Specialization: </span>
                            <p className="text-gray-300 text-sm mt-1">{member.specialization}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => resendInvitation(member)}
                            className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                          >
                            📧 Resend Invitation
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            ✏️ Edit
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
      </div>
    </AdminLayout>
  );
}

export default AdminFaculty;
