import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ImageUpload } from './ImageUpload';
import { X, Plus } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';

interface Resource {
  id: string;
  title: string;
  author_name: string;
  type: 'article' | 'link';
  category: string;
  description: string;
  content?: string;
  url?: string;
  tags: string[];
  image_url?: string;
  author_id: string;
}

interface EditResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const categories = [
  'Authentic Relating',
  'Circling', 
  'Communication',
  'Community Building',
  'Personal Growth',
  'Practice Guides',
  'Theory & Philosophy',
  'Other'
];

export const EditResourceModal: React.FC<EditResourceModalProps> = ({
  resource,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'article' | 'link'>('article');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = resource && (
    user?.id === resource.author_id || 
    profile?.role === 'admin'
  );

  useEffect(() => {
    if (resource && isOpen) {
      setTitle(resource.title);
      setType(resource.type);
      setCategory(resource.category);
      setDescription(resource.description);
      setContent(resource.content || '');
      setUrl(resource.url || '');
      setTags(resource.tags);
      setImageUrl(resource.image_url || '');
    }
  }, [resource, isOpen]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resource || !canEdit) return;

    setIsSubmitting(true);
    
    try {
      const updateData = {
        title,
        type,
        category,
        description,
        content: type === 'article' ? content : null,
        url: type === 'link' ? url : null,
        tags,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('resources')
        .update(updateData)
        .eq('id', resource.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource updated successfully!",
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update resource",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!resource || !canEdit) return;
    
    if (!confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resource.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource deleted successfully!",
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete resource",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!resource || !canEdit) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type *</label>
            <Select value={type} onValueChange={(value) => setType(value as 'article' | 'link')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="link">External Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the resource"
              rows={3}
              required
            />
          </div>

          {type === 'article' && (
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full article content (optional - can be added later)"
                rows={6}
              />
            </div>
          )}

          {type === 'link' && (
            <div>
              <label className="block text-sm font-medium mb-2">URL *</label>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Resource Image</label>
            <ImageUpload
              currentImage={imageUrl}
              onImageUploaded={setImageUrl}
              onImageRemoved={() => setImageUrl('')}
              bucket="resource-images"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Resource'}
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete Resource
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