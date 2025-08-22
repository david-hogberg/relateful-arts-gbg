import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Loader2, Calendar, Clock, MapPin, X, User, Users, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

export default function MyEvents() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserEvents();
    }
  }, [user]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navigation />
        <div className="loading-container">
          <Loader2 className="loading-spinner" />
          <span className="loading-text">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navigation />
      
      <main className="page-section-content py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              My Events
            </h1>
            <p className="text-muted-foreground">
              Your registered events and participation history
            </p>
          </div>

          {/* Events Section */}
          <Card className="profile-card">
            <CardHeader>
              <div className="profile-section-title">
                <Calendar className="profile-section-title-icon" />
                Registered Events
              </div>
              <CardDescription>Events you've signed up for and your attendance history</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEvents ? (
                <div className="loading-container">
                  <Loader2 className="loading-spinner" />
                </div>
              ) : userEvents.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-description">
                    You haven't registered for any events yet.
                  </p>
                  <Button onClick={() => navigate('/events')} className="btn-primary-gradient">
                    Browse Events
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4 p-3 bg-gradient-subtle rounded-lg border border-primary/10">
                    {userEvents.filter(e => !e.is_past).length} upcoming event(s), {userEvents.filter(e => e.is_past).length} past event(s)
                  </div>
                  {userEvents.map((event) => (
                    <Card key={event.registration_id} className={`profile-card ${event.is_past ? 'opacity-60' : ''}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="profile-badge">
                                {event.type.replace('_', ' ')}
                              </span>
                              {event.is_past && (
                                <span className="profile-badge bg-muted/20 text-muted-foreground border-muted/30">
                                  Past Event
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <div className="profile-field-row">
                              <Users className="profile-field-row-icon" />
                              <div className="profile-field-row-content">
                                <div className="profile-field-row-label">Facilitated by</div>
                                <div className="profile-field-row-value">{event.facilitator_name}</div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="profile-field-row">
                                <Calendar className="profile-field-row-icon" />
                                <div className="profile-field-row-content">
                                  <div className="profile-field-row-label">Date</div>
                                  <div className="profile-field-row-value">{formatDate(event.date)}</div>
                                </div>
                              </div>
                              <div className="profile-field-row">
                                <Clock className="profile-field-row-icon" />
                                <div className="profile-field-row-content">
                                  <div className="profile-field-row-label">Time</div>
                                  <div className="profile-field-row-value">{event.time}</div>
                                </div>
                              </div>
                              <div className="profile-field-row">
                                <MapPin className="profile-field-row-icon" />
                                <div className="profile-field-row-content">
                                  <div className="profile-field-row-label">Location</div>
                                  <div className="profile-field-row-value">{event.location}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {!event.is_past && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelRegistration(event.registration_id, event.title)}
                              disabled={cancelling === event.registration_id}
                              className="ml-4"
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
        </div>
      </main>
    </div>
  );
}