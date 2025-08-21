import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, MessageCircle, Loader2, Users } from "lucide-react";
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
      <section className="py-16 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Facilitators</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Meet the facilitators who guide the community. 
                Each brings their unique approach and expertise to relating practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilitators Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading facilitators...</span>
            </div>
          ) : facilitators.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Public Facilitator Profiles Yet</h3>
              <p className="text-muted-foreground">Check back soon as facilitators update their public profiles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {facilitators.map((facilitator) => (
                <Card key={facilitator.id} className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="relative z-10 pt-8 pb-4">
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
                        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-xl shadow-soft mb-4">
                          {facilitator.full_name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      
                      <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors mb-1">
                        {facilitator.full_name}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-muted-foreground">
                        {facilitator.title || 'Facilitator'}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {facilitator.work_types.map((workType, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                            {workType}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {facilitator.public_bio && (
                      <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                        {facilitator.public_bio}
                      </p>
                    )}
                    
                    {facilitator.approach && (
                      <div className="mb-4 p-4 bg-gradient-subtle rounded-xl border border-primary/10 shadow-soft">
                        <p className="text-sm italic text-foreground/90 leading-relaxed">
                          "{facilitator.approach}"
                        </p>
                      </div>
                    )}
                    
                    {facilitator.languages.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-2">Languages:</div>
                        <div className="flex flex-wrap gap-1">
                          {facilitator.languages.map((language, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-auto space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full text-sm group/btn border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                        onClick={() => window.location.href = `mailto:${facilitator.contact_email}`}
                      >
                        <MessageCircle className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Contact {facilitator.full_name.split(' ')[0]}
                      </Button>
                      {facilitator.website && (
                        <Button 
                          variant="ghost" 
                          className="w-full text-sm hover:bg-accent/20 transition-colors"
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
                className="bg-gradient-hero shadow-warm"
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