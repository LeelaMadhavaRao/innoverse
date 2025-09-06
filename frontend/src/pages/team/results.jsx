import { useState, useEffect } from 'react';
import TeamLayout from '../../components/team/team-layout';
import { Card } from '../../components/ui/card';
import { teamAPI } from '../../lib/api';

function TeamResults() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await teamAPI.getResults();
        setResults(response.data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (isLoading) return <div>Loading results...</div>;

  return (
    <TeamLayout>
      <div className="team-results">
        <h1>Team Results</h1>
        <div className="results-grid">
          {results.map((result) => (
            <Card key={result.id} className="result-card">
              <h3>{result.evaluationTitle}</h3>
              <div className="score">Score: {result.score}/100</div>
              <div className="feedback">{result.feedback}</div>
              <div className="date">
                Evaluated on: {new Date(result.evaluatedAt).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </TeamLayout>
  );
}

export default TeamResults;
