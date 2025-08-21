import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import EditProfileModal from "@/components/EditProfileModal";
import { Loader2, User, Calendar, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface FacilitatorApplication {
  id: string;
  experience_description: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  admin_notes?: string;
}

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState<FacilitatorApplication | null>(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchApplication();
    }
  }, [user]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('facilitator_applications')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoadingApp(false);
    }
  };

  const handleApplyToFacilitate = () => {
    navigate('/apply-facilitator');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-destructive';
      default: return 'bg-warning';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome, {profile.full_name}
              </h1>
              <p className="text-muted-foreground">
                Manage your profile and community involvement
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your community profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Email:</span> {profile.email}
                </div>
                <div>
                  <span className="font-medium">Role:</span>
                  <Badge variant="secondary" className="ml-2 capitalize">
                    {profile.role}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Member since:</span>{' '}
                  {new Date(profile.created_at).toLocaleDateString()}
                </div>
                <Button variant="outline" className="w-full" onClick={() => setEditProfileOpen(true)}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Facilitator Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Facilitator Status
                </CardTitle>
                <CardDescription>Your facilitator application status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingApp ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : application ? (
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge 
                        className={`ml-2 capitalize ${getStatusColor(application.status)}`}
                      >
                        {application.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Applied:</span>{' '}
                      {new Date(application.submitted_at).toLocaleDateString()}
                    </div>
                    {application.admin_notes && (
                      <div>
                        <span className="font-medium">Admin Notes:</span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {application.admin_notes}
                        </p>
                      </div>
                    )}
                    {application.status === 'pending' && (
                      <Button variant="outline" className="w-full">
                        Edit Application
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      You haven't applied to become a facilitator yet.
                    </p>
                    <Button onClick={handleApplyToFacilitate} className="w-full">
                      Apply to Facilitate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Admin Section */}
          {profile.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Administrative functions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  View Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <EditProfileModal 
        open={editProfileOpen} 
        onOpenChange={setEditProfileOpen} 
      />
    </div>
  );
}