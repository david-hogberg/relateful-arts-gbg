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
  location: string;
  hosting_capacity: number;
  contact_information: string;
  cost_level: string;
  notes?: string;
  image_url?: string;
  author_id: string;
}

interface EditVenueModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const costLevels = ['free', 'low', 'medium', 'high'];

export const EditVenueModal: React.FC<EditVenueModalProps> = ({
  venue,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [hostingCapacity, setHostingCapacity] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  const [costLevel, setCostLevel] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = venue && (
    user?.id === venue.author_id || 
    profile?.role === 'admin'
  );

  useEffect(() => {
    if (venue && isOpen) {
      setName(venue.name);
      setLocation(venue.location);
      setHostingCapacity(venue.hosting_capacity.toString());
      setContactInformation(venue.contact_information);
      setCostLevel(venue.cost_level);
      setNotes(venue.notes || '');
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
        location,
        hosting_capacity: parseInt(hostingCapacity),
        contact_information: contactInformation,
        cost_level: costLevel,
        notes: notes || null,
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
            <label className="block text-sm font-medium mb-2">Location *</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, address or general area"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hosting Capacity *</label>
            <Input
              type="number"
              value={hostingCapacity}
              onChange={(e) => setHostingCapacity(e.target.value)}
              placeholder="Maximum number of people"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Information *</label>
            <Textarea
              value={contactInformation}
              onChange={(e) => setContactInformation(e.target.value)}
              placeholder="How should facilitators contact you? (Email, phone, etc.)"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cost Level *</label>
            <Select value={costLevel} onValueChange={setCostLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select cost level" />
              </SelectTrigger>
              <SelectContent>
                {costLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about the venue (facilities, accessibility, etc.)"
              rows={4}
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