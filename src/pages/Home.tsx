import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, BookOpen, MessageCircle, ArrowRight, Heart } from "lucide-react";
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
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      
      {/* Features Section */}
      <section className="page-section bg-gradient-warm">
        <div className="page-section-content">
          <div className="text-center mb-16">
            <h2 className="page-title">How We Connect & Grow Together</h2>
            <p className="page-description">Discover the many ways our community supports interpersonal practice</p>
          </div>
          
          <div className="responsive-grid">
            {features.map((feature, index) => (
              <Card key={index} className="card-elegant cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Button variant="ghost" asChild className="transition-warm">
                    <Link to={feature.link} className="flex items-center">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
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
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <h2 className="page-title">Our Community Values</h2>
            <p className="page-description">We believe in creating spaces where people can show up authentically, practice vulnerable communication, and build meaningful connections. Our community is built on principles of curiosity, conscious boundaries and compassionate presence.</p>
            <div className="responsive-grid mt-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3 text-primary">Authentic Presence</h3>
                <p className="text-muted-foreground">Creating safe spaces for genuine expression and vulnerable sharing</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3 text-primary">Conscious Boundaries</h3>
                <p className="text-muted-foreground">Honoring boundaries while inviting growth and connection</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3 text-primary">Community Care</h3>
                <p className="text-muted-foreground">Supporting each other's journey with compassion and curiosity</p>
              </div>
            </div>
            <div className="mt-12">
              <Button size="lg" asChild className="btn-primary-gradient">
                <Link to="/about">Learn More About Our Vision</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;