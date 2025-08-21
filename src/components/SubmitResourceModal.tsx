import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import MDEditor from '@uiw/react-md-editor';

interface SubmitResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_TAGS = [
  'beginner',
  'advanced',
  'facilitator',
  'article',
  'video',
  'long-read',
  'short-read',
  'practice',
  'theory',
  'community',
];

const CATEGORIES = [
  'Authentic Relating',
  'Circling',
  'Communication',
  'Community Building',
  'Personal Growth',
  'Practice Guides',
  'Theory & Philosophy',
  'Other',
];

export function SubmitResourceModal({ open, onOpenChange }: SubmitResourceModalProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resourceType, setResourceType] = useState<'article' | 'link'>('article');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  const canPublishDirectly = profile?.role === 'facilitator' || profile?.role === 'admin';

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (publishDirectly = false) => {
    if (!user) return;

    if (!title || !category || !description || !selectedTags.length) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and select at least one tag.",
        variant: "destructive",
      });
      return;
    }

    if (resourceType === 'article' && !content) {
      toast({
        title: "Missing content",
        description: "Please provide content for your article.",
        variant: "destructive",
      });
      return;
    }

    if (resourceType === 'link' && !url) {
      toast({
        title: "Missing URL",
        description: "Please provide a valid URL for your resource.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (publishDirectly && canPublishDirectly) {
        // Publish directly to resources table
        const { error } = await supabase
          .from('resources')
          .insert({
            title,
            author_id: user.id,
            author_name: profile?.full_name || 'Anonymous',
            type: resourceType,
            category,
            description,
            content: resourceType === 'article' ? content : null,
            url: resourceType === 'link' ? url : null,
            tags: selectedTags,
            image_url: imageUrl || null,
          });

        if (error) throw error;

        toast({
          title: "Resource published",
          description: "Your resource has been published successfully.",
        });
      } else {
        // Submit for review
        const { error } = await supabase
          .from('resource_submissions')
          .insert({
            user_id: user.id,
            title,
            type: resourceType,
            category,
            description,
            content: resourceType === 'article' ? content : null,
            url: resourceType === 'link' ? url : null,
            tags: selectedTags,
            image_url: imageUrl || null,
          });

        if (error) throw error;

        toast({
          title: "Resource submitted",
          description: "Your resource has been submitted for review. You'll be notified when it's approved.",
        });
      }

      // Reset form
      setTitle('');
      setCategory('');
      setDescription('');
      setContent('');
      setUrl('');
      setSelectedTags([]);
      setImageUrl('');
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Resource</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter resource title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of your resource..."
              className="min-h-20"
            />
          </div>

          <ImageUpload
            bucket="resource-images"
            currentImage={imageUrl}
            onImageUploaded={(url) => setImageUrl(url)}
            onImageRemoved={() => setImageUrl('')}
            label="Resource Image"
          />

          <Tabs value={resourceType} onValueChange={(value) => setResourceType(value as 'article' | 'link')}>
            <TabsList>
              <TabsTrigger value="article">Article Content</TabsTrigger>
              <TabsTrigger value="link">External Link</TabsTrigger>
            </TabsList>

            <TabsContent value="article" className="space-y-4">
              <div className="space-y-2">
                <Label>Content *</Label>
                <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || '')}
                    preview="edit"
                    height={300}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/resource"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>Tags * (select at least one)</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <Label htmlFor={tag} className="cursor-pointer">
                    <Badge variant={selectedTags.includes(tag) ? "default" : "outline"}>
                      {tag}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            
            {!canPublishDirectly ? (
              <Button onClick={() => handleSubmit(false)} disabled={loading}>
                Submit for Review
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleSubmit(false)} disabled={loading}>
                  Submit for Review
                </Button>
                <Button onClick={() => handleSubmit(true)} disabled={loading}>
                  Publish Now
                </Button>
              </>
            )}
          </div>

          {!canPublishDirectly && (
            <p className="text-sm text-muted-foreground">
              Your resource will be reviewed by an admin before being published.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}