import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import EditProfileModal from "@/components/EditProfileModal";
import { Loader2, User, Calendar, Settings, Clock, MapPin, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FacilitatorApplication {
  id: string;
  experience_description: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  admin_notes?: string;
}

interface UserEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "group_session" | "retreat";
  facilitator_name: string;
  registration_id: string;
  is_past: boolean;
}

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState<FacilitatorApplication | null>(null);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [loadingApp, setLoadingApp] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchApplication();
      fetchUserEvents();
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

  const fetchUserEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          id,
          event_id,
          events!inner(
            id,
            title,
            date,
            time,
            location,
            type,
            facilitator_id
          )
        `)
        .eq('user_id', user!.id)
        .is('cancelled_at', null);

      if (error) throw error;

      if (data && data.length > 0) {
        // Get facilitator names
        const facilitatorIds = data.map(reg => reg.events.facilitator_id);
        const { data: facilitators, error: facilitatorsError } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', facilitatorIds);

        if (facilitatorsError) throw facilitatorsError;

        const facilitatorNames = facilitators?.reduce((acc, profile) => {
          acc[profile.user_id] = profile.full_name;
          return acc;
        }, {} as Record<string, string>) || {};

        const today = new Date().toISOString().split('T')[0];
        
        const eventsWithDetails: UserEvent[] = data.map(registration => ({
          id: registration.events.id,
          title: registration.events.title,
          date: registration.events.date,
          time: registration.events.time,
          location: registration.events.location,
          type: registration.events.type as UserEvent["type"],
          facilitator_name: facilitatorNames[registration.events.facilitator_id] || 'Unknown',
          registration_id: registration.id,
          is_past: registration.events.date < today
        }));

        // Sort by date, upcoming events first
        eventsWithDetails.sort((a, b) => {
          if (a.is_past !== b.is_past) {
            return a.is_past ? 1 : -1;
          }
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setUserEvents(eventsWithDetails);
      } else {
        setUserEvents([]);
      }
    } catch (error) {
      console.error('Error fetching user events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleCancelRegistration = async (registrationId: string, eventTitle: string) => {
    setCancelling(registrationId);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .update({ cancelled_at: new Date().toISOString() })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: "Registration Cancelled",
        description: `Successfully cancelled registration for "${eventTitle}"`,
      });

      fetchUserEvents(); // Refresh the events list
    } catch (error: any) {
      console.error('Error cancelling registration:', error);
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel registration",
        variant: "destructive",
      });
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTypeColor = (type: UserEvent["type"]) => {
    switch (type) {
      case "workshop": return "bg-primary/10 text-primary";
      case "group_session": return "bg-secondary/50 text-secondary-foreground";
      case "retreat": return "bg-accent/50 text-accent-foreground";
      default: return "bg-muted/50 text-muted-foreground";
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

          {/* Events Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Events</CardTitle>
              <CardDescription>Your registered events and participation history</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEvents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : userEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You haven't registered for any events yet.
                  </p>
                  <Button onClick={() => navigate('/events')}>
                    Browse Events
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    {userEvents.filter(e => !e.is_past).length} upcoming event(s), {userEvents.filter(e => e.is_past).length} past event(s)
                  </div>
                  {userEvents.map((event) => (
                    <Card key={event.registration_id} className={`border ${event.is_past ? 'opacity-60' : ''}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeColor(event.type)}>
                                {event.type.replace('_', ' ')}
                              </Badge>
                              {event.is_past && (
                                <Badge variant="secondary" className="text-xs">
                                  Past Event
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Facilitated by {event.facilitator_name}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          {!event.is_past && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelRegistration(event.registration_id, event.title)}
                              disabled={cancelling === event.registration_id}
                            >
                              {cancelling === event.registration_id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Cancelling
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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