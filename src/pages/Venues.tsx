import React, { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SubmitVenueModal } from '../components/SubmitVenueModal';
import { ViewVenueModal } from '../components/ViewVenueModal';
import { EditVenueModal } from '../components/EditVenueModal';
import { supabase } from '../integrations/supabase/client';
import { MapPin, Users, DollarSign, Building, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/useAuth';

interface Venue {
  id: string;
  name: string;
  location: string;
  hosting_capacity: number;
  contact_information: string;
  cost_level: string;
  notes?: string;
  author_id: string;
  created_at: string;
  image_url?: string;
}

const Venues: React.FC = () => {
  const { user, profile } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast({
        title: "Error",
        description: "Failed to load venues",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowViewModal(true);
  };

  const handleEditVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setShowEditModal(true);
  };

  const canEditVenue = (venue: Venue) => {
    return user && (user.id === venue.author_id || profile?.role === 'admin');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading venues...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Community Venues
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover and share spaces for authentic relating and circling events
            </p>
          </div>

          {/* Submit Venue Section */}
          <div className="mb-12">
            <Card className="border-dashed border-2 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Building className="h-6 w-6" />
                  Share Your Space
                </CardTitle>
                <CardDescription>
                  Register your venue to help the community find great spaces for events
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setShowSubmitModal(true)} size="lg">
                  Register a Venue
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Venues Grid */}
          {venues.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No venues yet</h3>
              <p className="text-muted-foreground">Be the first to register a venue for the community!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <Card 
                  key={venue.id} 
                  className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleViewVenue(venue)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Venue Image */}
                  {venue.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={venue.image_url} 
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      <Badge className="absolute top-3 right-3 bg-primary/90 text-white border-0 backdrop-blur-sm">
                        {venue.cost_level}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-start justify-between">
                      <span className="text-lg group-hover:text-primary transition-colors">{venue.name}</span>
                      {!venue.image_url && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                          {venue.cost_level}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="line-clamp-2">{venue.location}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 space-y-4">
                    {/* Capacity Info */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-subtle rounded-lg border border-primary/10">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">Capacity</div>
                        <div className="text-xs text-muted-foreground">{venue.hosting_capacity} people</div>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-subtle rounded-lg border border-primary/10">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">Cost Level</div>
                        <div className="text-xs text-muted-foreground capitalize">{venue.cost_level} cost</div>
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    {venue.contact_information && (
                      <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                        <div className="text-xs font-medium text-foreground mb-1">Contact</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{venue.contact_information}</div>
                      </div>
                    )}
                    
                    {/* Notes */}
                    {venue.notes && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs font-medium text-foreground mb-1">Additional Notes</div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {venue.notes}
                        </p>
                      </div>
                    )}
                     
                    {/* Edit/Delete Actions */}
                    {canEditVenue(venue) && (
                      <div className="pt-3 border-t border-border/50">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditVenue(venue);
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Date Added */}
                    <div className="pt-2 border-t border-border/50">
                      <div className="text-xs text-muted-foreground">
                        Added {new Date(venue.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <SubmitVenueModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={fetchVenues}
      />

      {selectedVenue && (
        <ViewVenueModal
          venue={selectedVenue}
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
        />
      )}

      <EditVenueModal
        venue={selectedVenue}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={fetchVenues}
      />
    </div>
  );
};

export default Venues;