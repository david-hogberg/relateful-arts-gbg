import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, BookOpen, MessageCircle, ArrowRight, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [{
    icon: Calendar,
    title: "Community Events",
    description: "Join relateful sessions, workshops, and practice groups throughout Gothenburg",
    link: "/events"
  }, {
    icon: Users,
    title: "Meet Facilitators",
    description: "Connect with experienced practitioners offering unique approaches to interpersonal growth",
    link: "/facilitators"
  }, {
    icon: BookOpen,
    title: "Resources & Articles",
    description: "Access community-contributed content, including blog posts and Substack publications",
    link: "/resources"
  }, {
    icon: MessageCircle,
    title: "Join the Conversation",
    description: "Connect through our WhatsApp groups and Discord servers for ongoing community support",
    link: "/about#community"
  }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <Navigation />
      <HeroSection />
      
      {/* Features Section */}
      <section className="page-section bg-gradient-cozy">
        <div className="page-section-content">
          <div className="text-center mb-20">
            <h2 className="page-title">How We Connect & Grow Together</h2>
            <p className="page-description">Discover the many ways our community supports interpersonal practice and builds meaningful connections</p>
          </div>
          
          <div className="responsive-grid">
            {features.map((feature, index) => (
              <Card key={index} className="card-elegant cursor-pointer group hover:scale-105 transition-all duration-500">
                <CardHeader className="text-center p-6">
                  <div className="mx-auto mb-6 p-4 bg-primary/15 rounded-2xl w-fit group-hover:bg-primary/20 transition-all duration-300">
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center p-6 pt-0">
                  <CardDescription className="mb-6 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    asChild 
                    className="btn-outline-primary rounded-full px-6 py-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    <Link to={feature.link} className="flex items-center">
                      Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Values Section */}
      <section className="page-section bg-background">
        <div className="page-section-content">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-primary/15 rounded-2xl">
                <Heart className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h2 className="page-title">Our Community Values</h2>
            <p className="page-description max-w-4xl mx-auto">
              We believe in creating spaces where people can show up authentically, practice vulnerable communication, 
              and build meaningful connections. Our community is built on principles of curiosity, conscious boundaries 
              and compassionate presence.
            </p>
            
            <div className="responsive-grid mt-16">
              <div className="text-center p-6 bg-gradient-subtle rounded-2xl border border-primary/10 hover:shadow-cozy transition-all duration-300">
                <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Authentic Presence</h3>
                <p className="text-muted-foreground leading-relaxed">Creating safe spaces for genuine expression and vulnerable sharing</p>
              </div>
              <div className="text-center p-6 bg-gradient-subtle rounded-2xl border border-primary/10 hover:shadow-cozy transition-all duration-300">
                <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Conscious Boundaries</h3>
                <p className="text-muted-foreground leading-relaxed">Honoring boundaries while inviting growth and connection</p>
              </div>
              <div className="text-center p-6 bg-gradient-subtle rounded-2xl border border-primary/10 hover:shadow-cozy transition-all duration-300">
                <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Community Care</h3>
                <p className="text-muted-foreground leading-relaxed">Supporting each other's journey with compassion and curiosity</p>
              </div>
            </div>
            
            <div className="mt-16">
              <Button size="lg" asChild className="inviting-button text-lg px-8 py-4 h-auto">
                <Link to="/about">Learn More About Our Vision</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="page-section bg-gradient-warm">
        <div className="page-section-content">
          <div className="cozy-container text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Ready to Join Our Community?</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Start your journey with relateful practices and discover the power of authentic connection. 
              Whether you're new to interpersonal work or an experienced practitioner, there's a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="inviting-button text-lg px-8 py-4 h-auto">
                <Link to="/events">Explore Events</Link>
              </Button>
              <Button size="lg" asChild className="btn-outline-primary text-lg px-8 py-4 h-auto">
                <Link to="/cozy-demo">See Our Design</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;