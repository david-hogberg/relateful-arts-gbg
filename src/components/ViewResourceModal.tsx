import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, User } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

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
  publish_date: string;
}

interface ViewResourceModalProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewResourceModal({ resource, open, onOpenChange }: ViewResourceModalProps) {
  if (!resource) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {resource.title}
            <Badge variant="outline">{resource.type}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {resource.author_name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(resource.publish_date)}
            </div>
            <Badge variant="secondary">{resource.category}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{resource.description}</p>
          </div>

          {resource.type === 'article' && resource.content && (
            <div>
              <h3 className="font-semibold mb-2">Content</h3>
              <div data-color-mode="light">
                <MDEditor.Markdown source={resource.content} />
              </div>
            </div>
          )}

          {resource.type === 'link' && resource.url && (
            <div>
              <h3 className="font-semibold mb-2">External Resource</h3>
              <Button asChild variant="outline">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit Resource
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}