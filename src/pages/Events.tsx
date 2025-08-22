import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ExternalLink, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import CreateEventModal from "@/components/CreateEventModal";

interface Event {
  id: string;
  title: string;
  description: string | null;
  facilitator_id: string;
  facilitator_name: string;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "group_session" | "retreat";
  max_participants: number;
  price: number;
  current_participants: number;
  is_registered: boolean;
  image_url?: string;
}

const Events = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [createEventOpen, setCreateEventOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      // First get events with their registrations
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          event_registrations(id, user_id, cancelled_at)
        `)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;

      // Get facilitator profiles separately
      const facilitatorIds = eventsData?.map(event => event.facilitator_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', facilitatorIds);

      if (profilesError) throw profilesError;

      // Create a map of facilitator names
      const facilitatorNames = profilesData?.reduce((acc, profile) => {
        acc[profile.user_id] = profile.full_name;
        return acc;
      }, {} as Record<string, string>) || {};

      const eventsWithRegistration: Event[] = eventsData?.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        facilitator_id: event.facilitator_id,
        facilitator_name: facilitatorNames[event.facilitator_id] || 'Unknown',
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type as Event["type"],
        max_participants: event.max_participants,
        price: event.price,
        current_participants: event.event_registrations?.filter(reg => !reg.cancelled_at).length || 0,
        is_registered: user ? event.event_registrations?.some(reg => 
          reg.user_id === user.id && !reg.cancelled_at
        ) || false : false,
        image_url: event.image_url
      })) || [];

      setEvents(eventsWithRegistration);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register for events",
        variant: "destructive",
      });
      return;
    }

    setRegistering(eventId);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully registered for the event!",
      });
      
      fetchEvents(); // Refresh events to update registration status
    } catch (error: any) {
      console.error('Error registering for event:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for event",
        variant: "destructive",
      });
    } finally {
      setRegistering(null);
    }
  };

  const canCreateEvents = profile && (profile.role === 'facilitator' || profile.role === 'admin');

  const getTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "workshop": return "bg-primary/10 text-primary border-primary/20";
      case "group_session": return "bg-secondary/50 text-secondary-foreground border-secondary";
      case "retreat": return "bg-accent/50 text-accent-foreground border-accent";
      default: return "bg-muted/50 text-muted-foreground border-muted";
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

  const formatTime = (timeString: string) => {
    // If time is in HH:MM:SS format, extract just HH:MM
    if (timeString && timeString.includes(':')) {
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
      }
    }
    return timeString;
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="page-header">
        <div className="page-header-content">
          <div className="page-header-inner">
            <h1 className="page-title">Community Events</h1>
            <p className="page-description">
              Join our upcoming relateful sessions, workshops, and community gatherings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary-gradient">
                <ExternalLink className="w-5 h-5 mr-2" />
                Join WhatsApp for Updates
              </Button>
              {canCreateEvents && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setCreateEventOpen(true)}
                  className="btn-outline-primary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="page-section">
        <div className="page-section-content">
          {loading ? (
            <div className="loading-container">
              <Loader2 className="loading-spinner" />
              <span className="loading-text">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <Calendar className="empty-state-icon" />
              <h3 className="empty-state-title">No upcoming events found</h3>
              <p className="empty-state-description">Check back soon for new events or be the first to create one!</p>
              {canCreateEvents && (
                <Button onClick={() => setCreateEventOpen(true)}>
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Event
                </Button>
              )}
            </div>
          ) : (
            <div className="responsive-grid-wide">
              {events.map((event) => (
                <Card key={event.id} className="group card-elegant">
                  {/* Event Banner Image */}
                  {event.image_url && (
                    <div className="card-image-container">
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="card-image"
                      />
                      <div className="card-image-overlay" />
                      <Badge className="card-badge-overlay">
                        {event.type.replace('_', ' ')}
                      </Badge>
                      <div className="card-price-overlay">
                        <div className="text-lg font-bold">
                          {event.price === 0 ? 'Free' : `${event.price} SEK`}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="card-content-wrapper">
                    {!event.image_url && (
                      <div className="flex items-start justify-between mb-4">
                        <Badge className={getTypeColor(event.type)}>
                          {event.type.replace('_', ' ')}
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {event.price === 0 ? 'Free' : `${event.price} SEK`}
                          </div>
                        </div>
                      </div>
                    )}
                    <CardTitle className="text-2xl mb-2 transition-colors">{event.title}</CardTitle>
                    <CardDescription className="text-lg">
                      Facilitated by {event.facilitator_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="card-content-wrapper">
                    <div className="space-y-4 mb-6">
                      <div className="info-item">
                        <div className="info-icon">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div className="info-content">
                          <div className="info-label">Date</div>
                          <div className="info-value">{formatDate(event.date)}</div>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div className="info-content">
                          <div className="info-label">Time</div>
                          <div className="info-value">{formatTime(event.time)}</div>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div className="info-content">
                          <div className="info-label">Location</div>
                          <div className="info-value">{event.location}</div>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className="info-content">
                          <div className="info-label">Participants</div>
                          <div className="info-value">{event.current_participants}/{event.max_participants}</div>
                        </div>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      {event.is_registered ? (
                        <Button variant="outline" className="flex-1" disabled>
                          Already Registered
                        </Button>
                      ) : event.current_participants >= event.max_participants ? (
                        <Button variant="outline" className="flex-1" disabled>
                          Event Full
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1"
                          onClick={() => handleRegister(event.id)}
                          disabled={registering === event.id}
                        >
                          {registering === event.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Registering...
                            </>
                          ) : (
                            'Register Now'
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Want to Host an Event?</h3>
              <p className="text-muted-foreground mb-6">
                If you're a facilitator interested in hosting events, 
                we'd love to support you in connecting with our community.
              </p>
              <Button 
                size="lg" 
                className="btn-primary-gradient"
                onClick={() => user ? navigate('/apply-facilitator') : navigate('/auth')}
              >
                Apply to Host Events
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <CreateEventModal 
        open={createEventOpen} 
        onOpenChange={setCreateEventOpen}
        onEventCreated={fetchEvents}
      />
    </div>
  );
};

export default Events;