import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-community.jpg";
const HeroSection = () => {
  return <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-gentle">
      <div className="absolute inset-0 bg-gradient-warm opacity-90" />
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
      backgroundImage: `url(${heroImage})`
    }} />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Relateful Community in Gothenburg</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Relateful Arts
            </span>
            <br />
            <span className="text-foreground">Gothenburg</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">A platform for deepening interpersonal practices in and around Gothenburg, Sweden.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-hero shadow-warm transition-warm">
              <Link to="/events">
                Explore Events
                <ArrowRight className="w-5 h-5 ml-2 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary/20">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;