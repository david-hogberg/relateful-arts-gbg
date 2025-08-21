import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Heart, Calendar, Users, BookOpen, Info, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const {
    user,
    profile,
    signOut
  } = useAuth();

  // Close menus when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    } else {
      setDropdownOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu when dropdown opens and vice versa
  const handleDropdownChange = (open: boolean) => {
    setDropdownOpen(open);
    if (open) setIsOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setDropdownOpen(false);
  };

  // Close dropdown when clicking outside on mobile
  useEffect(() => {
    if (isMobile && (isOpen || dropdownOpen)) {
      const handleClickOutside = () => {
        setIsOpen(false);
        setDropdownOpen(false);
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isOpen, dropdownOpen]);
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
  return <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-gentle">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">Relateful Arts GBG</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({
            path,
            label,
            icon: Icon
          }) => <Button key={path} variant={location.pathname === path ? "default" : "ghost"} asChild className="transition-warm">
                <Link to={path} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              </Button>)}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? <DropdownMenu open={!isMobile && dropdownOpen} onOpenChange={!isMobile ? handleDropdownChange : undefined}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2" disabled={isMobile && isOpen}>
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {profile?.full_name || 'Profile'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border shadow-lg z-[60] w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-events" onClick={() => setDropdownOpen(false)}>Booked Events</Link>
                  </DropdownMenuItem>
                  {(profile?.role === 'facilitator' || profile?.role === 'admin') && <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/manage-events" onClick={() => setDropdownOpen(false)}>Manage Events</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/edit-facilitator-profile" onClick={() => setDropdownOpen(false)}>Facilitator Profile</Link>
                      </DropdownMenuItem>
                    </>}
                  {profile?.role === 'admin' && <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}>Admin Panel</Link>
                      </DropdownMenuItem>
                    </>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { signOut(); setDropdownOpen(false); }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button asChild size="sm">
                <Link to="/auth">Sign In</Link>
              </Button>}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden" 
              onClick={handleMobileMenuToggle}
              disabled={dropdownOpen && !isMobile}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && <div className="mt-4 md:hidden bg-background/95 backdrop-blur-sm border-t">
            <div className="flex flex-col space-y-2 pb-4 pt-2">
              {navItems.map(({
            path,
            label,
            icon: Icon
          }) => <Button key={path} variant={location.pathname === path ? "default" : "ghost"} asChild className="justify-start" onClick={() => setIsOpen(false)}>
                  <Link to={path} className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                </Button>)}
              
              {/* Mobile Profile Menu Items */}
              {user && <>
                <div className="border-t pt-2 mt-2">
                  <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
                    <Link to="/my-events" className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Booked Events</span>
                    </Link>
                  </Button>
                  {(profile?.role === 'facilitator' || profile?.role === 'admin') && <>
                    <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
                      <Link to="/manage-events" className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Manage Events</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
                      <Link to="/edit-facilitator-profile" className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Facilitator Profile</span>
                      </Link>
                    </Button>
                  </>}
                  {profile?.role === 'admin' && (
                    <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
                      <Link to="/admin" className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="justify-start text-destructive" onClick={() => { signOut(); setIsOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </>}
            </div>
          </div>}
      </div>
    </nav>;
}
export { Navigation };
export default Navigation;