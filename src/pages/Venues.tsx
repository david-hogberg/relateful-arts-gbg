import React, { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SubmitVenueModal } from '../components/SubmitVenueModal';
import { ViewVenueModal } from '../components/ViewVenueModal';
import { EditVenueModal } from '../components/EditVenueModal';
import { supabase } from '../integrations/supabase/client';
import { MapPin, Users, DollarSign, Building, Edit, Trash2, Loader2 } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="page-header">
        <div className="page-header-content">
          <div className="page-header-inner">
            <h1 className="page-title">Community Venues</h1>
            <p className="page-description">
              Discover and share community spaces for relating practices and events
            </p>
          </div>
        </div>
      </section>

      <div className="page-section-content py-12">
        {/* Submit Venue Section */}
        <div className="form-section">
          <Card className="form-card">
            <CardHeader className="form-card-header">
              <CardTitle className="flex items-center justify-center gap-2">
                <Building className="h-6 w-6" />
                Share Your Space
              </CardTitle>
              <CardDescription>
                Register your venue to help the community find great spaces for events
              </CardDescription>
            </CardHeader>
            <CardContent className="form-card-content">
              <Button onClick={() => setShowSubmitModal(true)} size="lg">
                Register a Venue
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Venues Grid */}
        {loading ? (
          <div className="loading-container">
            <Loader2 className="loading-spinner" />
            <span className="loading-text">Loading venues...</span>
          </div>
        ) : venues.length === 0 ? (
          <div className="empty-state">
            <Building className="empty-state-icon" />
            <h3 className="empty-state-title">No venues yet</h3>
            <p className="empty-state-description">Be the first to register a venue for the community!</p>
          </div>
        ) : (
          <div className="responsive-grid">
            {venues.map((venue) => (
              <Card 
                key={venue.id} 
                className="card-elegant cursor-pointer"
                onClick={() => handleViewVenue(venue)}
              >
                {/* Venue Image */}
                {venue.image_url && (
                  <div className="card-image-container">
                    <img 
                      src={venue.image_url} 
                      alt={venue.name}
                      className="card-image"
                    />
                    <div className="card-image-overlay" />
                  </div>
                )}
                
                <CardHeader className="card-content-wrapper">
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-lg">{venue.name}</span>
                    {!venue.image_url && (
                      <Badge className="tag-primary">
                        {venue.cost_level}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="line-clamp-2">{venue.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-content-wrapper space-y-4">
                  {/* Key Info Section */}
                  <div className="space-y-3">
                    {/* Capacity Info */}
                    <div className="info-item">
                      <div className="info-icon">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Capacity</div>
                        <div className="info-value">{venue.hosting_capacity} people</div>
                      </div>
                    </div>
                    
                    {/* Cost Level Info */}
                    <div className="info-item">
                      <div className="info-icon">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Cost Level</div>
                        <div className="info-value capitalize">{venue.cost_level} cost</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  {(venue.contact_information || venue.notes) && (
                    <div className="space-y-3">
                      {/* Contact Information */}
                      {venue.contact_information && (
                        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                          <div className="text-xs font-medium text-foreground mb-1">Contact Information</div>
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
                    </div>
                  )}
                   
                  {/* Edit Actions */}
                  {canEditVenue(venue) && (
                    <div className="pt-3 border-t border-border/50">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditVenue(venue);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit Venue
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