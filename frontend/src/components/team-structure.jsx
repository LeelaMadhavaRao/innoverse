import React from 'react';
import { Badge } from './ui/badge';

const TeamStructure = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Event Team Structure
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Meet the dedicated team of faculty and students organizing this exceptional event
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Student Coordinators */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg">👥</span>
              </div>
              <h3 className="text-2xl font-bold">Student Coordinators</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">Alex Thompson</h4>
                <p className="text-green-100 mb-3">Final Year - CS</p>
                <Badge variant="outline" className="border-red-400 text-red-400 bg-red-400/10">
                  Lead Coordinator
                </Badge>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">Priya Sharma</h4>
                <p className="text-green-100 mb-3">Third Year - ECE</p>
                <Badge variant="outline" className="border-red-400 text-red-400 bg-red-400/10">
                  Event Coordinator
                </Badge>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">David Kim</h4>
                <p className="text-green-100 mb-3">Final Year - ME</p>
                <Badge variant="outline" className="border-red-400 text-red-400 bg-red-400/10">
                  Technical Coordinator
                </Badge>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">Maria Garcia</h4>
                <p className="text-green-100 mb-3">Third Year - Arts</p>
                <Badge variant="outline" className="border-red-400 text-red-400 bg-red-400/10">
                  Cultural Coordinator
                </Badge>
              </div>
            </div>
          </div>

          {/* Evaluation Team */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg">🏆</span>
              </div>
              <h3 className="text-2xl font-bold">Evaluation Team</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">Dr. Jennifer Brown</h4>
                <p className="text-green-100 mb-3">AI & Machine Learning</p>
                <Badge variant="outline" className="border-red-400 text-red-400 bg-red-400/10">
                  Senior Evaluator
                </Badge>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">Prof. Mark Davis</h4>
                <p className="text-green-100 mb-3">Software Engineering</p>
                <Badge variant="outline" className="border-red-400 text-red-400 bg-red-400/10">
                  Technical Evaluator
                </Badge>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">Dr. Amanda White</h4>
                <p className="text-green-100 mb-3">Innovation & Design</p>
                <Badge variant="outline" className="border-red-400 text-red-400 bg-red-400/10">
                  Design Evaluator
                </Badge>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-2">Prof. Kevin Lee</h4>
                <p className="text-green-100 mb-3">Research Methodology</p>
                <Badge variant="outline" className="border-red-400 text-red-400 bg-red-400/10">
                  Research Evaluator
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Heads of Department Section */}
        <div className="mt-16">
          <div className="flex items-center justify-center mb-8">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">👑</span>
            </div>
            <h3 className="text-2xl font-bold">Heads of Department</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <h4 className="text-xl font-semibold mb-2">Dr. Sarah Johnson</h4>
              <p className="text-green-100 mb-2">Computer Science</p>
              <p className="text-sm text-green-200">sarah.johnson@university.edu</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <h4 className="text-xl font-semibold mb-2">Prof. Michael Chen</h4>
              <p className="text-green-100 mb-2">Engineering</p>
              <p className="text-sm text-green-200">michael.chen@university.edu</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <h4 className="text-xl font-semibold mb-2">Dr. Emily Rodriguez</h4>
              <p className="text-green-100 mb-2">Arts & Sciences</p>
              <p className="text-sm text-green-200">emily.rodriguez@university.edu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamStructure;
