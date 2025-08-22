import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Eye, User, Calendar, ExternalLink, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ViewResourceModal } from './ViewResourceModal';
import MDEditor from '@uiw/react-md-editor';

interface ResourceSubmission {
  id: string;
  user_id: string;
  title: string;
  type: 'article' | 'link';
  category: string;
  description: string;
  content?: string;
  url?: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  admin_notes?: string;
  profiles?: {
    full_name: string;
  } | null;
}

export function ManageResourceSubmissions() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ResourceSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ResourceSubmission | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [isAdmin]);

  const fetchSubmissions = async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('resource_submissions')
        .select(`
          *,
          profiles (full_name)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data as any || []);
    } catch (error: any) {
      toast({
        title: "Error loading submissions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submission: ResourceSubmission) => {
    try {
      // First, create the resource
      const { error: resourceError } = await supabase
        .from('resources')
        .insert({
          title: submission.title,
          author_id: submission.user_id,
          author_name: submission.profiles?.full_name || 'Anonymous',
          type: submission.type,
          category: submission.category,
          description: submission.description,
          content: submission.content,
          url: submission.url,
          tags: submission.tags,
        });

      if (resourceError) throw resourceError;

      // Then update the submission status
      const { error: updateError } = await supabase
        .from('resource_submissions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.user_id,
          admin_notes: adminNotes,
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      toast({
        title: "Resource approved",
        description: "The resource has been published to the community.",
      });

      fetchSubmissions();
      setAdminNotes('');
    } catch (error: any) {
      toast({
        title: "Approval failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (submission: ResourceSubmission) => {
    try {
      const { error } = await supabase
        .from('resource_submissions')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.user_id,
          admin_notes: adminNotes,
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast({
        title: "Resource rejected",
        description: "The submission has been rejected.",
      });

      fetchSubmissions();
      setAdminNotes('');
    } catch (error: any) {
      toast({
        title: "Rejection failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewSubmission = (submission: ResourceSubmission) => {
    // Convert submission to resource format for viewing
    const resourceForViewing = {
      id: submission.id,
      title: submission.title,
      author_name: submission.profiles?.full_name || 'Anonymous',
      type: submission.type,
      category: submission.category,
      description: submission.description,
      content: submission.content,
      url: submission.url,
      tags: submission.tags,
      publish_date: submission.submitted_at,
    };
    setSelectedSubmission(submission);
    setViewModalOpen(true);
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You don't have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading submissions...</p>
      </div>
    );
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
          <p className="text-muted-foreground">No resource submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="p-6 bg-gradient-subtle rounded-lg border border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{submission.title}</h3>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                    <Badge variant="outline">
                      {submission.type === 'article' ? <FileText className="h-3 w-3 mr-1" /> : <ExternalLink className="h-3 w-3 mr-1" />}
                      {submission.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {submission.profiles?.full_name || 'Anonymous'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(submission.submitted_at)}
                    </div>
                    <Badge variant="secondary">{submission.category}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {submission.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-3">{submission.description}</p>
                  
                  {submission.admin_notes && (
                    <div className="bg-muted p-2 rounded text-sm">
                      <strong>Admin Notes:</strong> {submission.admin_notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewSubmission(submission)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                
                {submission.status === 'pending' && (
                  <>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleApprove(submission)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleReject(submission)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSubmission && (
        <ViewResourceModal
          resource={{
            id: selectedSubmission.id,
            title: selectedSubmission.title,
            author_name: selectedSubmission.profiles?.full_name || 'Anonymous',
            type: selectedSubmission.type,
            category: selectedSubmission.category,
            description: selectedSubmission.description,
            content: selectedSubmission.content,
            url: selectedSubmission.url,
            tags: selectedSubmission.tags,
            publish_date: selectedSubmission.submitted_at,
          }}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
        />
      )}
    </div>
  );
}