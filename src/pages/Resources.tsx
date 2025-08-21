import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, FileText, Video, Podcast, User } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  author: string;
  type: "article" | "video" | "podcast" | "substack" | "external";
  category: "beginner" | "intermediate" | "advanced" | "facilitator";
  description: string;
  url?: string;
  publishDate: string;
}

const Resources = () => {
  const resources: Resource[] = [
    {
      id: "1",
      title: "Getting Started with Authentic Relating",
      author: "Anna Lindberg",
      type: "article",
      category: "beginner",
      description: "A gentle introduction to the principles and practices of authentic relating, perfect for newcomers to the community.",
      publishDate: "2024-01-10"
    },
    {
      id: "2",
      title: "The Art of Vulnerable Sharing",
      author: "Sofia Andersson", 
      type: "substack",
      category: "intermediate",
      description: "Exploring how to share vulnerably while maintaining healthy boundaries and consent in relating practices.",
      url: "https://sofia-relating.substack.com",
      publishDate: "2024-01-05"
    },
    {
      id: "3",
      title: "Circling Practice Guidelines",
      author: "Marcus Johansson",
      type: "article", 
      category: "facilitator",
      description: "A comprehensive guide for facilitators on creating safe containers and holding space in circling practices.",
      publishDate: "2023-12-20"
    },
    {
      id: "4",
      title: "Somatic Awareness in Relating",
      author: "Sofia Andersson",
      type: "video",
      category: "intermediate", 
      description: "A recorded workshop on integrating body awareness and somatic practices with authentic relating.",
      publishDate: "2023-12-15"
    },
    {
      id: "5",
      title: "Men's Work & Emotional Intelligence",
      author: "Erik Nilsson",
      type: "substack",
      category: "intermediate",
      description: "Exploring how men can develop emotional intelligence through authentic relating and men's circle work.",
      url: "https://erik-menswork.substack.com",
      publishDate: "2023-12-10"
    },
    {
      id: "6",
      title: "NVC Meets Authentic Relating",
      author: "Maja Petersson",
      type: "podcast",
      category: "intermediate",
      description: "A deep conversation about integrating Nonviolent Communication principles with authentic relating practices.",
      publishDate: "2023-12-01"
    },
    {
      id: "7",
      title: "Mindful Presence in Community",
      author: "David Kumar",
      type: "article",
      category: "beginner",
      description: "How mindfulness and meditation practices can deepen our capacity for authentic connection with others.",
      publishDate: "2023-11-25"
    },
    {
      id: "8",
      title: "Building Consent Culture in Groups",
      author: "Community Contributors",
      type: "external",
      category: "facilitator",
      description: "Best practices for creating consent-based cultures in authentic relating and circling communities.",
      url: "https://authentic-relating-global.org/consent",
      publishDate: "2023-11-20"
    }
  ];

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "article": return FileText;
      case "video": return Video;
      case "podcast": return Podcast;
      case "substack": return BookOpen;
      case "external": return ExternalLink;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: Resource["category"]) => {
    switch (category) {
      case "beginner": return "bg-green-100 text-green-800 border-green-200";
      case "intermediate": return "bg-primary/10 text-primary border-primary/20";
      case "advanced": return "bg-orange-100 text-orange-800 border-orange-200";
      case "facilitator": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-muted/50 text-muted-foreground border-muted";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-green-100 text-green-800 border-green-200">Beginner</Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20">Intermediate</Badge>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">Advanced</Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">Facilitator</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {resources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <Card key={resource.id} className="shadow-card hover:shadow-gentle transition-warm h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={getCategoryColor(resource.category)}>
                        {resource.category}
                      </Badge>
                      <TypeIcon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {resource.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm flex-1">
                      {resource.description}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="text-xs text-muted-foreground mb-3">
                        Published {formatDate(resource.publishDate)}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant={resource.url || resource.type === "external" ? "default" : "outline"} 
                          size="sm" 
                          className="flex-1"
                        >
                          {resource.url || resource.type === "external" ? (
                            <>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Visit
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4 mr-2" />
                              Read
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Contribute to Our Resource Library</h3>
              <p className="text-muted-foreground mb-6">
                Have you written an article, created a video, or started a Substack about 
                authentic relating? We'd love to feature your content in our community library.
              </p>
              <Button size="lg" className="bg-gradient-hero shadow-warm">
                Submit Your Resource
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-20 bg-gradient-gentle">
        <div className="container mx-auto px-6">
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
                  <Button variant="outline" size="sm">
                    Visit Website
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
                  <Button variant="outline" size="sm">
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;