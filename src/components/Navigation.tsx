import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Users, BookOpen, Info } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Heart },
    { path: "/events", label: "Events", icon: Calendar },
    { path: "/facilitators", label: "Facilitators", icon: Users },
    { path: "/resources", label: "Resources", icon: BookOpen },
    { path: "/about", label: "About", icon: Info }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-gentle">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Relateful Arts
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={location.pathname === path ? "default" : "ghost"}
                asChild
                className="transition-warm"
              >
                <Link to={path} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>

          <Button variant="outline" className="hidden md:block">
            Join Community
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;