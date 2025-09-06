import { useEffect, useState } from 'react';
import { teamAPI } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

export default function TeamGallery() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await teamAPI.getGallery();
      setSubmissions(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Team Gallery</h1>
      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission._id} className="p-4">
            <h3 className="font-semibold">{submission.title}</h3>
            <p className="text-sm text-gray-600">{submission.description}</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Status: {submission.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
