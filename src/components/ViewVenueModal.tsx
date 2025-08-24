import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { MapPin, Users, DollarSign, Calendar, Building, Phone } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  contact_email: string;
  contact_phone: string;
  category: string;
  price_information: string;
  description: string;
  additional_notes?: string;
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
  const getCategoryColor = (category: string) => {
    // Return a consistent color for categories
    return 'bg-blue-100 text-blue-800';
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
            <Badge className={getCategoryColor(venue.category)}>
              {venue.category}
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
                  Address
                </h3>
                <p className="text-foreground">{venue.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Capacity
                </h3>
                <p className="text-foreground">{venue.capacity} people</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Contact Information
                </h3>
                <div className="space-y-1">
                  <p className="text-foreground">📧 {venue.contact_email}</p>
                  <p className="text-foreground">📞 {venue.contact_phone}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Price Information
                </h3>
                <p className="text-foreground">{venue.price_information}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Description
                </h3>
                <p className="text-foreground whitespace-pre-wrap">{venue.description}</p>
              </div>
            </div>

            {venue.additional_notes && (
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Additional Notes
                  </h3>
                  <p className="text-foreground whitespace-pre-wrap">{venue.additional_notes}</p>
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