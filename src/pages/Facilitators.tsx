import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ExternalLink, MessageCircle } from "lucide-react";

interface Facilitator {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experience: string;
  description: string;
  approach: string;
  languages: string[];
  contact: string;
  website?: string;
}

const Facilitators = () => {
  const facilitators: Facilitator[] = [
    {
      id: "1",
      name: "Anna Lindberg",
      title: "Circling Facilitator & Authentic Relating Coach",
      specialties: ["Circling", "Vulnerability Work", "Group Dynamics"],
      experience: "5+ years",
      description: "Anna has been facilitating circling groups in Gothenburg since 2019. She brings a gentle, compassionate approach to creating safe spaces for authentic expression.",
      approach: "I believe in the power of witnessed vulnerability to heal and connect us. My facilitation style focuses on creating containers where people feel safe to be truly seen.",
      languages: ["Swedish", "English"],
      contact: "anna.circles@email.com",
      website: "https://annalindbgerg.se"
    },
    {
      id: "2", 
      name: "Marcus Johansson",
      title: "Authentic Relating Games Facilitator",
      specialties: ["AR Games", "Communication Skills", "Playful Connection"],
      experience: "3+ years",
      description: "Marcus discovered authentic relating in 2021 and has been passionate about sharing the transformative power of these practices through games and structured exercises.",
      approach: "I love using play and curiosity to help people explore authentic expression. Games create a safe structure for practicing new ways of relating.",
      languages: ["Swedish", "English", "German"],
      contact: "marcus.ar@email.com"
    },
    {
      id: "3",
      name: "Sofia Andersson", 
      title: "Somatic Experiencing & Relating Practitioner",
      specialties: ["Somatic Work", "Trauma-Informed Practices", "Body Awareness"],
      experience: "8+ years",
      description: "Sofia combines her background in somatic experiencing with authentic relating to offer a body-centered approach to connection and healing.",
      approach: "Our bodies hold so much wisdom about connection. I help people attune to their somatic experience as a guide for authentic relating.",
      languages: ["Swedish", "English"],
      contact: "sofia.somatic@email.com",
      website: "https://sofiaandersson.com"
    },
    {
      id: "4",
      name: "Erik Nilsson",
      title: "Men's Work & Authentic Relating Facilitator", 
      specialties: ["Men's Circles", "Emotional Intelligence", "Leadership"],
      experience: "4+ years",
      description: "Erik focuses on supporting men in developing emotional intelligence and authentic expression through both men's work and mixed-gender relating practices.",
      approach: "I'm passionate about helping men break through conditioning to access their full emotional range and capacity for vulnerable connection.",
      languages: ["Swedish", "English"],
      contact: "erik.menswork@email.com"
    },
    {
      id: "5",
      name: "Maja Petersson",
      title: "NVC & Authentic Communication Trainer",
      specialties: ["Nonviolent Communication", "Conflict Resolution", "Empathy Building"], 
      experience: "6+ years",
      description: "Maja brings her expertise in Nonviolent Communication to authentic relating, helping people develop clear, compassionate communication skills.",
      approach: "Through NVC principles, I support people in expressing their truth while staying connected to their own and others' humanity.",
      languages: ["Swedish", "English", "Spanish"],
      contact: "maja.nvc@email.com",
      website: "https://majapeterson.se"
    },
    {
      id: "6",
      name: "David Kumar",
      title: "Mindfulness & Relating Integration Coach",
      specialties: ["Mindfulness", "Meditation", "Presence Practices"],
      experience: "7+ years", 
      description: "David integrates contemplative practices with authentic relating, offering a mindful approach to connection and self-awareness.",
      approach: "Mindful presence is the foundation of authentic relating. I help people cultivate awareness as a pathway to genuine connection.",
      languages: ["English", "Swedish", "Hindi"],
      contact: "david.mindful@email.com"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">Our Facilitators</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Meet the experienced practitioners and facilitators who guide our community. 
              Each brings their unique approach and expertise to authentic relating practices.
            </p>
            <div className="flex justify-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Facilitator Gathering: Bi-Annual Community Coordination
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Facilitators Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {facilitators.map((facilitator) => (
              <Card key={facilitator.id} className="shadow-card hover:shadow-gentle transition-warm h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">
                      {facilitator.experience}
                    </Badge>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{facilitator.name}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {facilitator.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {facilitator.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    {facilitator.description}
                  </p>
                  
                  <div className="mb-4 p-3 bg-accent/20 rounded-lg">
                    <p className="text-sm italic text-foreground">
                      "{facilitator.approach}"
                    </p>
                  </div>
                  
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
                  
                  <div className="mt-auto space-y-3">
                    <Button variant="outline" className="w-full text-sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact {facilitator.name.split(' ')[0]}
                    </Button>
                    {facilitator.website && (
                      <Button variant="ghost" className="w-full text-sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Become a Community Facilitator</h3>
              <p className="text-muted-foreground mb-6">
                Are you an experienced practitioner interested in contributing to our community? 
                We welcome facilitators who share our values of authentic connection and conscious relating.
              </p>
              <Button size="lg" className="bg-gradient-hero shadow-warm">
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