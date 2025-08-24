import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageUpload } from './ImageUpload';
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
  
  const venueCategories = [
    'Community Center',
    'Studio',
    'Gallery',
    'Theater',
    'Outdoor Space',
    'Conference Room',
    'Workshop Space',
    'Retreat Center',
    'Other'
  ];
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: '',
    contact_email: '',
    contact_phone: '',
    category: '',
    price_information: '',
    description: '',
    additional_notes: '',
    image_url: '',
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
            address: formData.address,
            capacity: parseInt(formData.capacity),
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            category: formData.category,
            price_information: formData.price_information,
            description: formData.description,
            additional_notes: formData.additional_notes || null,
            image_url: formData.image_url || null,
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
            address: formData.address,
            capacity: parseInt(formData.capacity),
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            category: formData.category,
            price_information: formData.price_information,
            description: formData.description,
            additional_notes: formData.additional_notes || null,
            image_url: formData.image_url || null,
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
        address: '',
        capacity: '',
        contact_email: '',
        contact_phone: '',
        category: '',
        price_information: '',
        description: '',
        additional_notes: '',
        image_url: '',
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
            <ImageUpload
              bucket="venue-images"
              currentImage={formData.image_url}
              onImageUploaded={(url) => handleChange('image_url', url)}
              onImageRemoved={() => handleChange('image_url', '')}
              label="Venue Image"
            />
            
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
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g., 123 Main Street, City, State"
                required
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                placeholder="e.g., 25"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  placeholder="contact@venue.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone *</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => handleChange('category', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select venue category" />
                </SelectTrigger>
                <SelectContent>
                  {venueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price_information">Price Information *</Label>
              <Input
                id="price_information"
                value={formData.price_information}
                onChange={(e) => handleChange('price_information', e.target.value)}
                placeholder="e.g., Free, $50/hour, Contact for pricing"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the venue, its features, and what makes it suitable for events"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="additional_notes">Additional Notes</Label>
              <Textarea
                id="additional_notes"
                value={formData.additional_notes}
                onChange={(e) => handleChange('additional_notes', e.target.value)}
                placeholder="Additional information about facilities, accessibility, parking, etc."
                rows={3}
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