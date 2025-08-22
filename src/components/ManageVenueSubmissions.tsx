import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { MapPin, Users, Building, Calendar, Phone } from 'lucide-react';

interface VenueSubmission {
  id: string;
  user_id: string;
  name: string;
  location: string;
  hosting_capacity: number;
  contact_information: string;
  cost_level: string;
  notes?: string;
  status: string;
  admin_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

interface VenueSubmissionWithProfile extends VenueSubmission {
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

export const ManageVenueSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<VenueSubmissionWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('venue_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profile data separately for each submission
      const submissionsWithProfiles = [];
      for (const submission of data || []) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('user_id', submission.user_id)
          .single();
          
        submissionsWithProfiles.push({
          ...submission,
          profiles: profileData
        });
      }
      
      setSubmissions(submissionsWithProfiles);

      // Initialize admin notes
      const notesMap: { [key: string]: string } = {};
      submissionsWithProfiles.forEach(submission => {
        notesMap[submission.id] = submission.admin_notes || '';
      });
      setAdminNotes(notesMap);
    } catch (error) {
      console.error('Error fetching venue submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load venue submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionAction = async (submissionId: string, action: 'approve' | 'reject') => {
    setProcessingId(submissionId);
    
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) return;

      if (action === 'approve') {
        // First, create the venue
        const { error: venueError } = await supabase
          .from('venues')
          .insert([{
            author_id: submission.user_id,
            name: submission.name,
            location: submission.location,
            hosting_capacity: submission.hosting_capacity,
            contact_information: submission.contact_information,
            cost_level: submission.cost_level,
            notes: submission.notes,
          }]);

        if (venueError) throw venueError;
      }

      // Update submission status
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('venue_submissions')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          admin_notes: adminNotes[submissionId] || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Venue submission has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
      });

      fetchSubmissions();
    } catch (error) {
      console.error('Error processing venue submission:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} venue submission.`,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCostLevelColor = (costLevel: string) => {
    switch (costLevel.toLowerCase()) {
      case 'free':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading venue submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">
          {submissions.filter(s => s.status === 'pending').length} pending
        </Badge>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No venue submissions yet.</p>
        </div>
      ) : (
        submissions.map((submission) => (
          <div key={submission.id} className="p-6 bg-gradient-subtle rounded-lg border border-primary/10 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5" />
                  {submission.name}
                </h3>
                <div className="flex gap-2 mb-2">
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status}
                  </Badge>
                  <Badge className={getCostLevelColor(submission.cost_level)}>
                    {submission.cost_level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Submitted by {submission.profiles?.full_name || 'Unknown'} ({submission.profiles?.email || 'No email'})
                </p>
                <p className="text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  {formatDate(submission.submitted_at)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Location</p>
                    <p className="text-sm text-muted-foreground">{submission.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Capacity</p>
                    <p className="text-sm text-muted-foreground">{submission.hosting_capacity} people</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Contact Information</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submission.contact_information}</p>
                </div>
              </div>

              {submission.notes && (
                <div>
                  <p className="font-medium text-sm mb-1">Notes & Instructions</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submission.notes}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Admin Notes</label>
                <Textarea
                  value={adminNotes[submission.id] || ''}
                  onChange={(e) => setAdminNotes(prev => ({ ...prev, [submission.id]: e.target.value }))}
                  placeholder="Add notes about this submission..."
                  className="w-full"
                />
              </div>

              {submission.status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleSubmissionAction(submission.id, 'approve')}
                    disabled={processingId === submission.id}
                    className="bg-green-600"
                  >
                    {processingId === submission.id ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleSubmissionAction(submission.id, 'reject')}
                    disabled={processingId === submission.id}
                  >
                    {processingId === submission.id ? 'Processing...' : 'Reject'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};