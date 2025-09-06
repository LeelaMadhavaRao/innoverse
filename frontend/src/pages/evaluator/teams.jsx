import { useState, useEffect } from 'react';
import EvaluatorLayout from '../../components/evaluator/evaluator-layout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { evaluationAPI } from '../../lib/api';

function EvaluatorTeams() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await evaluationAPI.getTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading teams...</div>;

  return (
    <EvaluatorLayout>
      <div className="evaluator-teams">
        <h1>Teams to Evaluate</h1>
        <div className="teams-grid">
          {teams.map((team) => (
            <Card key={team.id} className="team-card">
              <h3>{team.name}</h3>
              <p>{team.description}</p>
              <div className="team-stats">
                <span>Members: {team.memberCount}</span>
                <span>Submissions: {team.submissionCount}</span>
              </div>
              <Button onClick={() => navigate(`/evaluator/teams/${team.id}`)}>
                View Details
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </EvaluatorLayout>
  );
}

export default EvaluatorTeams;
