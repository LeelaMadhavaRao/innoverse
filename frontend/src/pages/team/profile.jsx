import { useState, useEffect } from 'react';
import TeamLayout from '../../components/team/team-layout';
import { Card } from '../../components/ui/card';
import { teamAPI } from '../../lib/api';

function TeamProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await teamAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <TeamLayout>
      <div className="team-profile">
        <h1>Team Profile</h1>
        <Card className="profile-card">
          <div className="profile-header">
            <img src={profile.avatar || '/placeholder-user.jpg'} alt="Team Avatar" />
            <h2>{profile.name}</h2>
          </div>
          <div className="profile-details">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Members:</strong> {profile.members.join(', ')}</p>
            <p><strong>Institution:</strong> {profile.institution}</p>
          </div>
        </Card>
      </div>
    </TeamLayout>
  );
}

export default TeamProfile;
