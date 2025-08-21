import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">Community Events</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our upcoming relateful sessions, workshops, and community gatherings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-hero shadow-warm">
                <ExternalLink className="w-5 h-5 mr-2" />
                Join WhatsApp for Updates
              </Button>
              {canCreateEvents && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setCreateEventOpen(true)}
                  className="border-primary/20 hover:bg-primary/10"
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
      <section className="py-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No upcoming events found</h3>
              <p className="text-muted-foreground mb-4">Check back soon for new events or be the first to create one!</p>
              {canCreateEvents && (
                <Button onClick={() => setCreateEventOpen(true)}>
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Event
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.map((event) => (
              <Card key={event.id} className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Event Banner Image */}
                {event.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-primary/90 text-white border-0 backdrop-blur-sm">
                      {event.type.replace('_', ' ')}
                    </Badge>
                    <div className="absolute top-3 left-3 text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                      <div className="text-lg font-bold">
                        {event.price === 0 ? 'Free' : `${event.price} SEK`}
                      </div>
                    </div>
                  </div>
                )}
                
                <CardHeader className="relative z-10">
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
                  <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">{event.title}</CardTitle>
                  <CardDescription className="text-lg">
                    Facilitated by {event.facilitator_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-5 h-5 mr-3 text-primary" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-5 h-5 mr-3 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-5 h-5 mr-3 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-5 h-5 mr-3 text-primary" />
                      <span>{event.current_participants}/{event.max_participants} participants</span>
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
                className="bg-gradient-hero shadow-warm"
                onClick={() => user ? window.location.href = '/apply-facilitator' : window.location.href = '/auth'}
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