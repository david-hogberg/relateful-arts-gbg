import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Heart, Calendar, Users, BookOpen, Info, Building, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    profile,
    signOut
  } = useAuth();

  // Close mobile menu when dropdown opens and vice versa
  const handleDropdownChange = (open: boolean) => {
    setDropdownOpen(open);
    if (open) setIsOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const navItems = [{
    path: "/",
    label: "Home",
    icon: Heart
  }, {
    path: "/events",
    label: "Events",
    icon: Calendar
  }, {
    path: "/facilitators",
    label: "Facilitators",
    icon: Users
  }, {
    path: "/resources",
    label: "Resources",
    icon: BookOpen
  }, {
    path: "/venues",
    label: "Venues",
    icon: Building
  }, {
    path: "/about",
    label: "About",
    icon: Info
  }];
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/10 shadow-cozy">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-primary/15 rounded-xl group-hover:bg-primary/20 transition-all duration-300">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">Relateful Arts GBG</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map(({
              path,
              label,
              icon: Icon
            }) => (
              <Button 
                key={path} 
                variant={location.pathname === path ? "default" : "ghost"} 
                asChild 
                className={`transition-all duration-300 rounded-full ${
                  location.pathname === path 
                    ? 'bg-gradient-hero shadow-glow text-white' 
                    : 'hover:bg-accent/50 text-foreground'
                }`}
              >
                <Link to={path} className="flex items-center space-x-2 px-4 py-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu open={dropdownOpen} onOpenChange={handleDropdownChange}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 hover:bg-accent/50 rounded-full px-4 py-2 transition-all duration-300 text-foreground"
                  >
                    <div className="p-1.5 bg-primary/15 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline font-medium">
                      {profile?.full_name || 'Profile'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-card border border-primary/20 shadow-cozy rounded-xl p-2 z-50"
                >
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-accent/50 transition-all duration-200 text-foreground">
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-accent/50 transition-all duration-200 text-foreground">
                    <Link to="/my-events">Booked Events</Link>
                  </DropdownMenuItem>
                  {(profile?.role === 'facilitator' || profile?.role === 'admin') && (
                    <>
                      <DropdownMenuSeparator className="bg-primary/20" />
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-accent/50 transition-all duration-200 text-foreground">
                        <Link to="/edit-facilitator-profile">Facilitator Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-accent/50 transition-all duration-200 text-foreground">
                        <Link to="/manage-events">Manage Events</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {profile?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-primary/20" />
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-accent/50 transition-all duration-200 text-foreground">
                        <Link to="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-primary/20" />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                asChild 
                size="sm" 
                className="btn-outline-primary rounded-full px-6 py-2"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden hover:bg-accent/50 rounded-full p-2 transition-all duration-300 text-foreground" 
              onClick={handleMobileMenuToggle}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mt-4 lg:hidden">
            <div className="flex flex-col space-y-2 pb-4 bg-card/50 rounded-xl p-4 border border-primary/10">
              {navItems.map(({
                path,
                label,
                icon: Icon
              }) => (
                <Button 
                  key={path} 
                  variant={location.pathname === path ? "default" : "ghost"} 
                  asChild 
                  className={`justify-start rounded-lg transition-all duration-300 ${
                    location.pathname === path 
                      ? 'bg-gradient-hero shadow-glow text-white' 
                      : 'hover:bg-accent/50 text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Link to={path} className="flex items-center space-x-2 w-full px-4 py-3">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
export { Navigation };
export default Navigation;