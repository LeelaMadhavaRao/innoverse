import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import FacultyLayout from '../../components/faculty/faculty-layout';

function FacultyTeams() {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch teams data
    const fetchTeams = async () => {
      try {
        // Mock data - replace with actual API call
        const mockTeams = [
          {
            id: 1,
            name: "InnovateTech",
            leader: "John Doe",
            members: ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown"],
            idea: "AI-powered healthcare monitoring system",
            score: 85,
            evaluated: true,
            submittedAt: "2025-09-05",
            status: "evaluated"
          },
          {
            id: 2,
            name: "EcoSolutions",
            leader: "Sarah Wilson",
            members: ["Sarah Wilson", "Mike Davis", "Emma White", "Tom Green"],
            idea: "Sustainable waste management platform",
            score: 92,
            evaluated: true,
            submittedAt: "2025-09-04",
            status: "evaluated"
          },
          {
            id: 3,
            name: "HealthAI",
            leader: "David Chen",
            members: ["David Chen", "Lisa Park", "Ryan Lee"],
            idea: "Mental health support chatbot",
            score: 0,
            evaluated: false,
            submittedAt: "2025-09-06",
            status: "pending"
          },
          {
            id: 4,
            name: "SmartCity",
            leader: "Maria Garcia",
            members: ["Maria Garcia", "Alex Rodriguez", "Sam Kim", "Nina Patel"],
            idea: "IoT-based traffic optimization",
            score: 78,
            evaluated: true,
            submittedAt: "2025-09-03",
            status: "evaluated"
          }
        ];
        
        setTeams(mockTeams);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.idea.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || team.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

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

  if (loading) {
    return (
      <FacultyLayout>
        <div className="p-6 bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading teams...</div>
        </div>
      </FacultyLayout>
    );
  }

  return (
    <FacultyLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Teams Overview</h1>
            <p className="text-gray-400 text-lg">
              Monitor and evaluate participating teams in Innoverse 2025
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search teams, leaders, or ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    className={filterStatus === 'all' 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    All Teams
                  </Button>
                  <Button
                    variant={filterStatus === 'evaluated' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('evaluated')}
                    className={filterStatus === 'evaluated' 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    Evaluated
                  </Button>
                  <Button
                    variant={filterStatus === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('pending')}
                    className={filterStatus === 'pending' 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    Pending
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Teams Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredTeams.map((team) => (
              <motion.div
                key={team.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                  <div className="p-6">
                    {/* Team Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                        <p className="text-gray-400">Led by {team.leader}</p>
                      </div>
                      <Badge 
                        className={
                          team.evaluated 
                            ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
                            : "bg-orange-600/20 text-orange-400 border-orange-500/30"
                        }
                      >
                        {team.evaluated ? 'Evaluated' : 'Pending'}
                      </Badge>
                    </div>

                    {/* Team Idea */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Project Idea</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{team.idea}</p>
                    </div>

                    {/* Team Members */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Team Members ({team.members.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {team.members.map((member, index) => (
                          <div
                            key={index}
                            className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300"
                          >
                            {member}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Score and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-gray-400 text-sm">Score: </span>
                          <span className="text-white font-semibold">
                            {team.evaluated ? `${team.score}/100` : 'Not scored'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Submitted: </span>
                          <span className="text-gray-300 text-sm">
                            {new Date(team.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          View Details
                        </Button>
                        {!team.evaluated && (
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Evaluate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredTeams.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No teams found</h3>
              <p className="text-gray-400">
                Try adjusting your search terms or filters
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </FacultyLayout>
  );
}

export default FacultyTeams;
