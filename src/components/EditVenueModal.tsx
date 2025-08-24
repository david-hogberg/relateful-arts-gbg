import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageUpload } from './ImageUpload';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';

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
  image_url?: string;
  author_id: string;
}

interface EditVenueModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

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

export const EditVenueModal: React.FC<EditVenueModalProps> = ({
  venue,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [category, setCategory] = useState('');
  const [priceInformation, setPriceInformation] = useState('');
  const [description, setDescription] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = venue && (
    user?.id === venue.author_id || 
    profile?.role === 'admin'
  );

  useEffect(() => {
    if (venue && isOpen) {
      setName(venue.name);
      setAddress(venue.address);
      setCapacity(venue.capacity.toString());
      setContactEmail(venue.contact_email);
      setContactPhone(venue.contact_phone);
      setCategory(venue.category);
      setPriceInformation(venue.price_information);
      setDescription(venue.description);
      setAdditionalNotes(venue.additional_notes || '');
      setImageUrl(venue.image_url || '');
    }
  }, [venue, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!venue || !canEdit) return;

    setIsSubmitting(true);
    
    try {
      const updateData = {
        name,
        address,
        capacity: parseInt(capacity),
        contact_email: contactEmail,
        contact_phone: contactPhone,
        category,
        price_information: priceInformation,
        description,
        additional_notes: additionalNotes || null,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('venues')
        .update(updateData)
        .eq('id', venue.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Venue updated successfully!",
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update venue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!venue || !canEdit) return;
    
    if (!confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venue.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Venue deleted successfully!",
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete venue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!venue || !canEdit) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Venue</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Venue Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of the venue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address of the venue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Capacity *</label>
            <Input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Maximum number of people"
              min="1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email *</label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@venue.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone *</label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <Select value={category} onValueChange={setCategory}>
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
            <label className="block text-sm font-medium mb-2">Price Information *</label>
            <Input
              value={priceInformation}
              onChange={(e) => setPriceInformation(e.target.value)}
              placeholder="e.g., Free, $50/hour, Contact for pricing"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the venue, its features, and what makes it suitable for events"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes</label>
            <Textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any additional information about facilities, accessibility, parking, etc."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Venue Image</label>
            <ImageUpload
              currentImage={imageUrl}
              onImageUploaded={setImageUrl}
              onImageRemoved={() => setImageUrl('')}
              bucket="venue-images"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Venue'}
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete Venue
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};