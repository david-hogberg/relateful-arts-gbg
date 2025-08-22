import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Calendar, MapPin, Star, ArrowRight } from "lucide-react";

const CozyDesignDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-cozy">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-3 bg-primary/15 px-6 py-3 rounded-full border border-primary/25 shadow-soft">
                <Heart className="w-6 h-6 text-primary" />
                <span className="text-primary font-semibold text-lg">Cozy Design System</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Warm & Welcoming
              </span>
              <br />
              <span className="text-foreground">Design Experience</span>
            </h1>
            
            <p className="text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              Experience our cozy design system with warm earthy tones, friendly rounded fonts, and soft shadows that evoke intimacy and welcome.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button className="inviting-button text-lg px-8 py-4 h-auto">
                Explore Components
                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button className="btn-outline-primary text-lg px-8 py-4 h-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Design Elements Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Design Elements</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the warm, inviting elements that make our design system feel like a cozy gathering place.
            </p>
          </div>

          {/* Color Palette */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 text-center">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-2xl mx-auto mb-3 shadow-cozy"></div>
                <p className="font-medium text-sm">Primary</p>
                <p className="text-xs text-muted-foreground">Terracotta</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-secondary rounded-2xl mx-auto mb-3 shadow-cozy"></div>
                <p className="font-medium text-sm">Secondary</p>
                <p className="text-xs text-muted-foreground">Warm Wood</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-accent rounded-2xl mx-auto mb-3 shadow-cozy"></div>
                <p className="font-medium text-sm">Accent</p>
                <p className="text-xs text-muted-foreground">Soft Earth</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl mx-auto mb-3 shadow-cozy"></div>
                <p className="font-medium text-sm">Muted</p>
                <p className="text-xs text-muted-foreground">Gentle</p>
              </div>
            </div>
          </div>

          {/* Component Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card Example */}
            <Card className="card-elegant group">
              <div className="card-image-container">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-primary/60" />
                </div>
                <div className="card-image-overlay" />
                <Badge className="card-badge-overlay">Featured</Badge>
              </div>
              <CardHeader className="card-content-wrapper">
                <CardTitle className="text-xl mb-2">Cozy Card Design</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Warm and inviting card components with soft shadows and rounded corners.
                </CardDescription>
              </CardHeader>
              <CardContent className="card-content-wrapper pt-0">
                <div className="space-y-3 mb-4">
                  <div className="info-item">
                    <div className="info-icon">
                      <Star className="w-4 h-4" />
                    </div>
                    <div className="info-content">
                      <div className="info-label">Rating</div>
                      <div className="info-value">5.0 / 5.0</div>
                    </div>
                  </div>
                </div>
                <Button className="w-full btn-primary-gradient">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            {/* Info Grid Example */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Info Elements</h4>
              <div className="info-item">
                <div className="info-icon">
                  <Users className="w-5 h-5" />
                </div>
                <div className="info-content">
                  <div className="info-label">Community</div>
                  <div className="info-value">500+ members</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="info-content">
                  <div className="info-label">Events</div>
                  <div className="info-value">Monthly meetups</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="info-content">
                  <div className="info-label">Location</div>
                  <div className="info-value">Gothenburg</div>
                </div>
              </div>
            </div>

            {/* Button Showcase */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Button Styles</h4>
              <div className="space-y-3">
                <Button className="inviting-button w-full">
                  Primary Action
                </Button>
                <Button className="btn-outline-primary w-full">
                  Secondary Action
                </Button>
                <Button className="btn-primary-gradient w-full">
                  Gradient Style
                </Button>
              </div>
            </div>
          </div>

          {/* Cozy Container Example */}
          <div className="mt-16">
            <div className="cozy-container text-center">
              <h3 className="text-2xl font-semibold mb-4">Cozy Container</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                This container uses our cozy styling with warm gradients, soft shadows, and inviting borders. 
                Perfect for highlighting important content or creating welcoming sections.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="tag-primary">Warm</Badge>
                <Badge className="tag-primary">Inviting</Badge>
                <Badge className="tag-primary">Cozy</Badge>
                <Badge className="tag-primary">Welcoming</Badge>
              </div>
            </div>
          </div>

          {/* Warm Divider */}
          <div className="warm-divider"></div>

          {/* Typography Showcase */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Typography</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Our typography system uses warm, friendly fonts with comfortable spacing and readable line heights.
            </p>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-foreground">Heading 1 - Large & Bold</h1>
              <h2 className="text-3xl font-semibold text-foreground">Heading 2 - Clear & Readable</h2>
              <h3 className="text-2xl font-semibold text-foreground">Heading 3 - Balanced & Warm</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Body text with comfortable line height and warm, inviting typography that makes reading a pleasure.
                Our design emphasizes readability and creates a sense of welcome and connection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CozyDesignDemo;
