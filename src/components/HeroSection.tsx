import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-community.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-cozy py-16">
      <div className="absolute inset-0 bg-gradient-warm opacity-85" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25" 
        style={{
          backgroundImage: `url(${heroImage})`
        }} 
      />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3 bg-primary/15 px-6 py-3 rounded-full border border-primary/25 shadow-soft">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-primary font-semibold text-lg">Relateful Community in Gothenburg</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="text-foreground leading-tight">Relateful Arts</span>
            <br />
            <span className="text-foreground leading-tight">Gothenburg</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-muted-foreground mb-10 leading-relaxed max-w-4xl mx-auto font-medium">
            A warm, welcoming platform for deepening interpersonal practices and building meaningful connections in and around Gothenburg, Sweden.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="inviting-button text-lg px-8 py-4 h-auto"
            >
              <Link to="/events">
                Explore Events
                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="btn-outline-primary text-lg px-8 py-4 h-auto"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Join our community</span>
              </div>
              <div className="w-px h-6 bg-primary/20"></div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="font-medium">Build meaningful connections</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;