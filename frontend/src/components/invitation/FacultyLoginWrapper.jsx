import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/auth-context';
import FacultyInvitation from './FacultyInvitation';

const FacultyLoginWrapper = () => {
  const [showInvitation, setShowInvitation] = useState(false);
  const [facultyData, setFacultyData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user just logged in as faculty
    if (user && user.role === 'faculty') {
      setFacultyData({
        name: user.name,
        email: user.email,
        department: user.department || 'Computer Science',
        designation: user.designation || 'Assistant Professor',
        specialization: user.specialization || 'Software Engineering'
      });
      setShowInvitation(true);
    }
  }, [user]);

  const handleInvitationComplete = () => {
    setShowInvitation(false);
    // Navigate to home page after invitation
    navigate('/', { replace: true });
  };

  if (!showInvitation || !facultyData) {
    return null;
  }

  return (
    <AnimatePresence>
      <FacultyInvitation 
        facultyData={facultyData}
        onComplete={handleInvitationComplete}
      />
    </AnimatePresence>
  );
};

export default FacultyLoginWrapper;
