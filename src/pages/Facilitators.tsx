import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, MessageCircle, Loader2, Users, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Facilitator {
  id: string;
  user_id: string;
  full_name: string;
  title?: string;
  public_bio?: string;
  work_types: string[];
  approach?: string;
  languages: string[];
  contact_email: string;
  website?: string;
  image_url?: string;
}

const Facilitators = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [facilitators, setFacilitators] = useState<Facilitator[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserIsFacilitator = profile?.role === 'facilitator' || profile?.role === 'admin';

  useEffect(() => {
    fetchFacilitators();
  }, []);

  const fetchFacilitators = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['facilitator', 'admin'])
        .eq('is_public_profile', true)
        .order('full_name');

      if (error) throw error;

      const facilitatorsData = data?.map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        title: profile.title,
        public_bio: profile.public_bio,
        work_types: profile.work_types || [],
        approach: profile.approach,
        languages: profile.languages || [],
        contact_email: profile.contact_email || profile.email,
        website: profile.website,
        image_url: profile.image_url
      })) || [];

      setFacilitators(facilitatorsData);
    } catch (error) {
      console.error('Error fetching facilitators:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="page-header">
        <div className="page-header-content">
          <div className="page-header-inner">
            <h1 className="page-title">Facilitators</h1>
            <p className="page-description">
              Meet the facilitators who guide the community. 
              Each brings their unique approach and expertise to relating practices.
            </p>
          </div>
        </div>
      </section>

      {/* Facilitators Grid */}
      <section className="page-section">
        <div className="page-section-content">
          {loading ? (
            <div className="loading-container">
              <Loader2 className="loading-spinner" />
              <span className="loading-text">Loading facilitators...</span>
            </div>
          ) : facilitators.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-state-icon" />
              <h3 className="empty-state-title">No Public Facilitator Profiles Yet</h3>
              <p className="empty-state-description">Check back soon as facilitators update their public profiles.</p>
            </div>
          ) : (
            <div className="responsive-grid">
              {facilitators.map((facilitator) => (
                <Card key={facilitator.id} className="card-elegant h-full flex flex-col">
                  {/* Profile Image Banner */}
                  {facilitator.image_url && (
                    <div className="card-image-container">
                      <img 
                        src={facilitator.image_url} 
                        alt={facilitator.full_name}
                        className="card-image"
                      />
                      <div className="card-image-overlay" />
                      <Badge className="card-badge-overlay">
                        {facilitator.title || 'Facilitator'}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="card-content-wrapper">
                    {!facilitator.image_url && (
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="tag-primary">
                          {facilitator.title || 'Facilitator'}
                        </Badge>
                      </div>
                    )}
                    <div className="text-center">
                      {/* Profile Image - Centered and larger */}
                      {facilitator.image_url ? (
                        <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg mb-4">
                          <img 
                            src={facilitator.image_url} 
                            alt={facilitator.full_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center shadow-soft mb-4">
                          <User className="w-12 h-12 text-primary" />
                        </div>
                      )}
                      
                      <CardTitle className="text-xl text-foreground mb-1">
                        {facilitator.full_name}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-muted-foreground">
                        {facilitator.title || 'Facilitator'}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="card-content-wrapper flex-1 flex flex-col">
                    {/* Work Types - More prominent */}
                    {facilitator.work_types.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-foreground mb-2">Specialties</div>
                        <div className="tag-container">
                          {facilitator.work_types.map((workType, index) => (
                            <Badge key={index} variant="secondary" className="tag-primary">
                              {workType}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Bio - Cleaner presentation */}
                    {facilitator.public_bio && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-foreground mb-2">About</div>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {facilitator.public_bio}
                        </p>
                      </div>
                    )}
                    
                    {/* Approach - Elegant presentation */}
                    {facilitator.approach && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-foreground mb-2">Approach</div>
                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 to-primary/20 rounded-full"></div>
                          <p className="text-foreground/90 leading-relaxed text-sm italic pl-4 border-l-2 border-primary/20 ml-1">
                            "{facilitator.approach}"
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Languages - Better organized */}
                    {facilitator.languages.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-foreground mb-2">Languages</div>
                        <div className="tag-container">
                          {facilitator.languages.map((language, index) => (
                            <Badge key={index} variant="secondary" className="tag-item">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Contact Actions - Clearer separation */}
                    <div className="mt-auto space-y-2 pt-4 border-t border-border/50">
                      <Button 
                        variant="outline" 
                        className="w-full text-sm btn-outline-primary"
                        onClick={() => window.location.href = `mailto:${facilitator.contact_email}`}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact {facilitator.full_name.split(' ')[0]}
                      </Button>
                      {facilitator.website && (
                        <Button 
                          variant="ghost" 
                          className="w-full text-sm"
                          onClick={() => window.open(facilitator.website, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Become a Community Facilitator</h3>
              <p className="text-muted-foreground mb-6">
                Are you interested in contributing to our community as a facilitator? 
                We welcome facilitators who share our values of authentic connection and conscious relating.
              </p>
              <Button 
                size="lg" 
                className="btn-primary-gradient"
                onClick={() => user ? navigate('/apply-facilitator') : navigate('/auth')}
              >
                Apply to Join Our Facilitator Network
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Facilitators;