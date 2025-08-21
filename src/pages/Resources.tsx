import { useState, useEffect } from 'react';
import { Book, Video, FileText, ExternalLink, User, Calendar, Plus, Eye, Filter, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/Navigation';
import { SubmitResourceModal } from '@/components/SubmitResourceModal';
import { ViewResourceModal } from '@/components/ViewResourceModal';
import { EditResourceModal } from '@/components/EditResourceModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Define the Resource interface
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
  image_url?: string;
  author_id: string;
}

export default function Resources() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;
      const resourceData = (data || []) as Resource[];
      setResources(resourceData);
      
      // Extract unique tags from all resources
      const allTags = resourceData.flatMap(resource => resource.tags);
      const uniqueTags = Array.from(new Set(allTags)).sort();
      setAvailableTags(uniqueTags);
    } catch (error: any) {
      toast({
        title: "Error loading resources",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setViewModalOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setEditModalOpen(true);
  };

  const canEditResource = (resource: Resource) => {
    return user && (user.id === resource.author_id || profile?.role === 'admin');
  };

  // Helper function to get the appropriate icon for each resource type
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'link':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Helper function to get category-specific colors
  const getCategoryColor = (category: string) => {
    const colors = {
      'Authentic Relating': 'bg-blue-100 text-blue-800',
      'Circling': 'bg-green-100 text-green-800',
      'Communication': 'bg-purple-100 text-purple-800',
      'Community Building': 'bg-yellow-100 text-yellow-800',
      'Personal Growth': 'bg-pink-100 text-pink-800',
      'Practice Guides': 'bg-indigo-100 text-indigo-800',
      'Theory & Philosophy': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredResources = selectedTag === 'all' 
    ? resources 
    : resources.filter(resource => resource.tags.includes(selectedTag));

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">Community Resources</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore articles, videos, and resources created by our community members. 
              From beginner guides to advanced practices, find content that supports 
              your journey in authentic relating and circling.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Submit New Resource Section */}
        <Card className="border-dashed border-2 border-primary/20 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6" />
              Share Your Knowledge
            </CardTitle>
            <CardDescription>
              Submit your articles, guides, or external resources for others to discover
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              size="lg"
              onClick={() => user ? setSubmitModalOpen(true) : toast({
                title: "Sign in required",
                description: "Please sign in to submit resources.",
                variant: "destructive",
              })}
            >
              <Plus className="h-5 w-5 mr-2" />
              Submit Your Resource
            </Button>
          </CardContent>
        </Card>

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <Filter className="h-4 w-4" />
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {selectedTag === 'all' ? 'No resources available yet. Be the first to submit one!' : `No resources found for tag "${selectedTag}".`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Resource Banner Image */}
                {resource.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={resource.image_url} 
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-primary/90 text-white border-0 backdrop-blur-sm">
                      {resource.category}
                    </Badge>
                    <div className="absolute top-3 left-3 p-2 bg-black/30 backdrop-blur-sm rounded-lg">
                      <div className="text-white">
                        {getTypeIcon(resource.type)}
                      </div>
                    </div>
                  </div>
                )}
                
                <CardHeader className="relative z-10">
                  {!resource.image_url && (
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-primary rounded-lg text-white shadow-soft">
                          {getTypeIcon(resource.type)}
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                          {resource.category}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{resource.title}</CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-accent/20 text-foreground border-accent/30">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-accent/20 text-foreground border-accent/30">
                        +{resource.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {resource.author_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(resource.publish_date)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                        onClick={() => handleViewResource(resource)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {canEditResource(resource) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                          onClick={() => handleEditResource(resource)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {resource.type === 'link' && resource.url && (
                        <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-200" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* External Resources */}
        <section className="mt-20 bg-gradient-gentle rounded-lg p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Recommended External Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2 text-primary" />
                    Authentic Relating Global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 leading-relaxed">
                    The international community for authentic relating with resources, 
                    training programs, and connections to practitioners worldwide.
                  </CardDescription>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://authentic-relating-global.org" target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2 text-primary" />
                    Circling Institute
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 leading-relaxed">
                    Training and certification programs for circling facilitators, 
                    plus extensive resources on the practice and philosophy.
                  </CardDescription>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://circlinginstitute.com" target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <SubmitResourceModal 
        open={submitModalOpen} 
        onOpenChange={(open) => {
          setSubmitModalOpen(open);
          if (!open) {
            // Refresh resources when modal closes in case new resource was published
            fetchResources();
          }
        }} 
      />

      <ViewResourceModal
        resource={selectedResource}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />

      <EditResourceModal
        resource={selectedResource}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={fetchResources}
      />
    </div>
  );
}