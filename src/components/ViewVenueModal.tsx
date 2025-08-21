import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { MapPin, Users, DollarSign, Calendar, Building, Phone } from 'lucide-react';

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
}

interface ViewVenueModalProps {
  venue: Venue;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewVenueModal: React.FC<ViewVenueModalProps> = ({
  venue,
  isOpen,
  onClose,
}) => {
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
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              {venue.name}
            </span>
            <Badge className={getCostLevelColor(venue.cost_level)}>
              {venue.cost_level}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Location
                </h3>
                <p className="text-foreground">{venue.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Hosting Capacity
                </h3>
                <p className="text-foreground">{venue.hosting_capacity} people</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Contact Information
                </h3>
                <p className="text-foreground whitespace-pre-wrap">{venue.contact_information}</p>
              </div>
            </div>

            {venue.notes && (
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Notes & Instructions
                  </h3>
                  <p className="text-foreground whitespace-pre-wrap">{venue.notes}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Added on
                </h3>
                <p className="text-foreground">{formatDate(venue.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};