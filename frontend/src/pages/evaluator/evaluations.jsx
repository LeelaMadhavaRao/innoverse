import { useEffect, useState } from 'react';
import { evaluationAPI } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { Slider } from '../../components/ui/slider';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';

export default function EvaluatorEvaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await evaluationAPI.getAll();
      setEvaluations(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch evaluations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvaluation = async (id, data) => {
    try {
      await evaluationAPI.update(id, data);
      toast({
        title: 'Success',
        description: 'Evaluation submitted successfully',
      });
      fetchEvaluations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit evaluation',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Evaluations</h1>
      <div className="grid gap-4">
        {evaluations.map((evaluation) => (
          <Card key={evaluation._id} className="p-4">
            <h3 className="font-semibold">Team: {evaluation.teamName}</h3>
            
            <div className="grid gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Innovation Score
                </label>
                <Slider
                  defaultValue={[evaluation.scores?.innovation || 0]}
                  max={10}
                  step={1}
                  onValueChange={(value) =>
                    handleSubmitEvaluation(evaluation._id, {
                      ...evaluation,
                      scores: { ...evaluation.scores, innovation: value[0] },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Technical Complexity
                </label>
                <Slider
                  defaultValue={[evaluation.scores?.technicalComplexity || 0]}
                  max={10}
                  step={1}
                  onValueChange={(value) =>
                    handleSubmitEvaluation(evaluation._id, {
                      ...evaluation,
                      scores: { ...evaluation.scores, technicalComplexity: value[0] },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Presentation
                </label>
                <Slider
                  defaultValue={[evaluation.scores?.presentation || 0]}
                  max={10}
                  step={1}
                  onValueChange={(value) =>
                    handleSubmitEvaluation(evaluation._id, {
                      ...evaluation,
                      scores: { ...evaluation.scores, presentation: value[0] },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Feasibility
                </label>
                <Slider
                  defaultValue={[evaluation.scores?.feasibility || 0]}
                  max={10}
                  step={1}
                  onValueChange={(value) =>
                    handleSubmitEvaluation(evaluation._id, {
                      ...evaluation,
                      scores: { ...evaluation.scores, feasibility: value[0] },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Comments
                </label>
                <Textarea
                  defaultValue={evaluation.comments}
                  onChange={(e) =>
                    handleSubmitEvaluation(evaluation._id, {
                      ...evaluation,
                      comments: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Total Score: {evaluation.totalScore?.toFixed(2) || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                Status: {evaluation.status}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
