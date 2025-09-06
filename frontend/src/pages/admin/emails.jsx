import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';

export default function AdminEmails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await adminAPI.getEmails();
      setEmails(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch emails',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Email Management</h1>
      <div className="grid gap-4">
        {emails.map((email) => (
          <Card key={email._id} className="p-4">
            <h3 className="font-semibold">{email.subject}</h3>
            <p className="text-sm text-gray-600">{email.content}</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Sent: {new Date(email.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
