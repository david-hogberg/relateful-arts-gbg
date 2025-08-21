import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, MessageCircle, Loader2 } from "lucide-react";
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
        website: profile.website
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
                Meet the experienced practitioners and facilitators who guide our community. 
                Each brings their unique approach and expertise to authentic relating practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilitators Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading facilitators...</span>
            </div>
          ) : facilitators.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No Public Facilitator Profiles Yet</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon as facilitators update their public profiles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {facilitators.map((facilitator) => (
                <Card key={facilitator.id} className="shadow-card hover:shadow-gentle transition-warm h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl mb-2">{facilitator.full_name}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {facilitator.title || 'Facilitator'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {facilitator.work_types.map((workType, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
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
                      <div className="mb-4 p-3 bg-accent/20 rounded-lg">
                        <p className="text-sm italic text-foreground">
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
                    
                    <div className="mt-auto space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full text-sm"
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
          
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Become a Community Facilitator</h3>
              <p className="text-muted-foreground mb-6">
                Are you an experienced practitioner interested in contributing to our community? 
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