import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-community.jpg";
const HeroSection = () => {
  return <section className="relative min-h-[90vh] flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-gentle" />
      <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{
      backgroundImage: `url(${heroImage})`
    }} />
      
      <div className="container mx-auto px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-3 bg-card px-5 py-3 rounded-lg border border-border/50 shadow-card">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground font-medium text-sm tracking-wide">Community in Gothenburg</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light mb-8 leading-tight tracking-tight">
            <span className="text-primary font-medium">
              Relateful Arts
            </span>
            <br />
            <span className="text-foreground font-extralight">Gothenburg</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            A platform for deepening interpersonal practices in and around Gothenburg, Sweden.
          </p>
          
          <div className="flex justify-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 shadow-gentle hover:shadow-warm transition-all duration-300 group rounded-lg">
              <Link to="/events">
                <Users className="w-5 h-5 mr-3" />
                Explore Events
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;