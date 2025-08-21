import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import CreateEventModal from "@/components/CreateEventModal";
import EditEventModal from "@/components/EditEventModal";
import ViewParticipantsModal from "@/components/ViewParticipantsModal";
import { Loader2, Calendar, Clock, MapPin, Plus, Edit, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FacilitatorEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "group_session" | "retreat";
  max_participants: number;
  price: number;
  created_at: string;
  registration_count: number;
  is_past: boolean;
}

export default function ManageEvents() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<FacilitatorEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [editEventOpen, setEditEventOpen] = useState(false);
  const [viewParticipantsOpen, setViewParticipantsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<FacilitatorEvent | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && profile && (profile.role === 'facilitator' || profile.role === 'admin')) {
      fetchEvents();
    } else if (!loading && profile && profile.role === 'user') {
      // Redirect users who aren't facilitators
      navigate('/profile');
      toast({
        title: "Access Denied",
        description: "You need to be a facilitator to manage events.",
        variant: "destructive",
      });
    }
  }, [user, profile, loading, navigate]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_registrations!inner(count)
        `)
        .eq('facilitator_id', user!.id)
        .order('date', { ascending: true });

      if (error) throw error;

      if (data) {
        const eventsWithCounts: FacilitatorEvent[] = await Promise.all(
          data.map(async (event) => {
            const { count, error: countError } = await supabase
              .from('event_registrations')
              .select('*', { count: 'exact' })
              .eq('event_id', event.id)
              .is('cancelled_at', null);

            if (countError) {
              console.error('Error fetching registration count:', countError);
              return {
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
                type: event.type as FacilitatorEvent["type"],
                max_participants: event.max_participants,
                price: event.price,
                created_at: event.created_at,
                registration_count: 0,
                is_past: event.date < new Date().toISOString().split('T')[0]
              };
            }

            return {
              id: event.id,
              title: event.title,
              description: event.description,
              date: event.date,
              time: event.time,
              location: event.location,
              type: event.type as FacilitatorEvent["type"],
              max_participants: event.max_participants,
              price: event.price,
              created_at: event.created_at,
              registration_count: count || 0,
              is_past: event.date < new Date().toISOString().split('T')[0]
            };
          })
        );

        setEvents(eventsWithCounts);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(eventId);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Event Deleted",
        description: `Successfully deleted "${eventTitle}"`,
      });

      fetchEvents(); // Refresh the events list
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleEditEvent = (event: FacilitatorEvent) => {
    setSelectedEvent(event);
    setEditEventOpen(true);
  };

  const handleViewParticipants = (event: FacilitatorEvent) => {
    setSelectedEvent(event);
    setViewParticipantsOpen(true);
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

  const getTypeColor = (type: FacilitatorEvent["type"]) => {
    switch (type) {
      case "workshop": return "bg-primary/10 text-primary";
      case "group_session": return "bg-secondary/50 text-secondary-foreground";
      case "retreat": return "bg-accent/50 text-accent-foreground";
      default: return "bg-muted/50 text-muted-foreground";
    }
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

  // Only allow facilitators and admins
  if (profile.role !== 'facilitator' && profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Manage Events
                </h1>
                <p className="text-muted-foreground">
                  Create, edit and manage your events
                </p>
              </div>
            </div>
            <Button onClick={() => setCreateEventOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          {/* Events Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Events</CardTitle>
              <CardDescription>Events you're facilitating and their registration status</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEvents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You haven't created any events yet.
                  </p>
                  <Button onClick={() => setCreateEventOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    {events.filter(e => !e.is_past).length} upcoming event(s), {events.filter(e => e.is_past).length} past event(s)
                  </div>
                  {events.map((event) => (
                    <Card key={event.id} className={`border ${event.is_past ? 'opacity-60' : ''}`}>
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
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-6 px-2"
                                onClick={() => handleViewParticipants(event)}
                              >
                                <Users className="w-3 h-3 mr-1" />
                                {event.registration_count}/{event.max_participants}
                              </Button>
                            </div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            {event.description && (
                              <p className="text-sm text-muted-foreground">
                                {event.description}
                              </p>
                            )}
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
                            {event.price > 0 && (
                              <p className="text-sm font-medium">
                                Price: ${event.price}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={event.is_past}
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id, event.title)}
                              disabled={deleting === event.id || event.registration_count > 0}
                            >
                              {deleting === event.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
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
      
      <CreateEventModal 
        open={createEventOpen} 
        onOpenChange={setCreateEventOpen}
        onEventCreated={fetchEvents}
      />
      
      <EditEventModal
        open={editEventOpen}
        onOpenChange={setEditEventOpen}
        onEventUpdated={fetchEvents}
        event={selectedEvent ? {
          id: selectedEvent.id,
          title: selectedEvent.title,
          description: selectedEvent.description,
          date: selectedEvent.date,
          time: selectedEvent.time,
          location: selectedEvent.location,
          type: selectedEvent.type,
          max_participants: selectedEvent.max_participants,
          price: selectedEvent.price,
        } : null}
      />
      
      <ViewParticipantsModal
        open={viewParticipantsOpen}
        onOpenChange={setViewParticipantsOpen}
        eventId={selectedEvent?.id || null}
        eventTitle={selectedEvent?.title || ""}
      />
    </div>
  );
}