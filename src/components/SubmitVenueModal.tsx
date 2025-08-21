import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';

interface SubmitVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const SubmitVenueModal: React.FC<SubmitVenueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    hosting_capacity: '',
    contact_information: '',
    cost_level: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Check if user is facilitator or admin (can submit directly to venues table)
      const canSubmitDirectly = profile?.role === 'facilitator' || profile?.role === 'admin';

      if (canSubmitDirectly) {
        // Submit directly to venues table
        const { error } = await supabase
          .from('venues')
          .insert([{
            author_id: user.id,
            name: formData.name,
            location: formData.location,
            hosting_capacity: parseInt(formData.hosting_capacity),
            contact_information: formData.contact_information,
            cost_level: formData.cost_level,
            notes: formData.notes || null,
          }]);

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your venue has been registered successfully.",
        });
      } else {
        // Submit to venue_submissions for approval
        const { error } = await supabase
          .from('venue_submissions')
          .insert([{
            user_id: user.id,
            name: formData.name,
            location: formData.location,
            hosting_capacity: parseInt(formData.hosting_capacity),
            contact_information: formData.contact_information,
            cost_level: formData.cost_level,
            notes: formData.notes || null,
          }]);

        if (error) throw error;

        toast({
          title: "Submission Received!",
          description: "Your venue submission has been received and is pending approval.",
        });
      }

      // Reset form
      setFormData({
        name: '',
        location: '',
        hosting_capacity: '',
        contact_information: '',
        cost_level: '',
        notes: '',
      });

      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error submitting venue:', error);
      toast({
        title: "Error",
        description: "Failed to submit venue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register a Venue</DialogTitle>
          <DialogDescription>
            Share your space with the community for hosting authentic relating and circling events.
            {profile?.role === 'user' && (
              <span className="block mt-2 text-sm text-muted-foreground">
                Your submission will be reviewed by our admin team before being published.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Venue Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Community Center Main Hall"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., 123 Main Street, City, State"
                required
              />
            </div>

            <div>
              <Label htmlFor="hosting_capacity">Hosting Capacity *</Label>
              <Input
                id="hosting_capacity"
                type="number"
                min="1"
                value={formData.hosting_capacity}
                onChange={(e) => handleChange('hosting_capacity', e.target.value)}
                placeholder="e.g., 25"
                required
              />
            </div>

            <div>
              <Label htmlFor="contact_information">Contact Information *</Label>
              <Textarea
                id="contact_information"
                value={formData.contact_information}
                onChange={(e) => handleChange('contact_information', e.target.value)}
                placeholder="How to contact for booking (email, phone, website, etc.)"
                required
              />
            </div>

            <div>
              <Label htmlFor="cost_level">Cost Level *</Label>
              <Select onValueChange={(value) => handleChange('cost_level', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select cost level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="low">Low ($)</SelectItem>
                  <SelectItem value="medium">Medium ($$)</SelectItem>
                  <SelectItem value="high">High ($$$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes & Instructions</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional information about the venue, booking process, amenities, restrictions, etc."
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Venue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};