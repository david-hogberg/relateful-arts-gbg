import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, MessageCircle, Calendar, ExternalLink, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Heart className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4">About Relateful Arts</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We are a community of practitioners, facilitators, and seekers dedicated to exploring 
              relateful practices in Gothenburg. Our mission is to create 
              spaces where people can connect genuinely, practice vulnerable communication, 
              and support each other's journey toward deeper authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* What is Authentic Relating */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">What is Authentic Relating?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-primary">Authentic Relating</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Authentic Relating is a practice of conscious communication that emphasizes being 
                  real, present, and vulnerable in relationship. Through structured games, exercises, 
                  and conversations, participants learn to express themselves authentically while 
                  staying connected to others.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Key elements include sharing impact, speaking from curiosity rather than judgment, 
                  and practicing consent in emotional intimacy. It's designed to help people break 
                  through social conditioning to access more genuine ways of relating.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-primary">Circling</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Circling is an interpersonal meditation practice that focuses on being with 
                  what's happening in the present moment between people. Participants sit in a 
                  circle and practice staying present with their authentic experience while 
                  witnessing others do the same.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  It emphasizes dropping beneath surface-level conversation to explore what's 
                  actually happening emotionally, somatically, and relationally in real-time. 
                  The practice develops capacity for intimacy, presence, and authentic expression.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Community Values */}
      <section className="py-20 bg-gradient-gentle">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Community Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant text-center">
                <CardHeader>
                  <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Authentic Presence</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    We value showing up as we truly are, embracing both our shadows and our light. 
                    Authenticity is not about being perfect, but about being real and present with what is.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant text-center">
                <CardHeader>
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Conscious Boundaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    We honor everyone's boundaries and choices about their level of participation. 
                    Growth happens through invitation, not force, and everyone has the right to say no.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant text-center">
                <CardHeader>
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Community Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    We support each other's journey with compassion, curiosity, and non-judgment. 
                    Our community is a space for mutual learning and growth.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Community Structure */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">How Our Community Works</h2>
            
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-primary mr-3" />
                    <CardTitle>Regular Events & Practices</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    Facilitators offer various formats including weekly circling groups, 
                    authentic relating game nights, weekend workshops, and drop-in practice sessions. 
                    Events range from beginner-friendly introductions to advanced practices for 
                    experienced participants.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center">
                    <MessageCircle className="w-6 h-6 text-primary mr-3" />
                    <CardTitle>Ongoing Connection</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    Between in-person events, community members stay connected through WhatsApp 
                    groups for different interests and experience levels, plus a Discord server 
                    for deeper discussions, resource sharing, and coordination.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-card via-card to-card/95 border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-primary mr-3" />
                    <CardTitle>Facilitator Coordination</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    Twice yearly, our facilitators gather for coordination meetings to share 
                    resources, align on community values, plan collaborative events, and support 
                    each other's growth as practitioners and leaders.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community */}
      <section id="community" className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Ready to explore relateful arts? Whether you're completely 
              new or an experienced practitioner, there's a place for you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Button size="lg" className="bg-gradient-hero shadow-warm">
                <MessageCircle className="w-5 h-5 mr-2" />
                Join WhatsApp Groups
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20">
                <ExternalLink className="w-5 h-5 mr-2" />
                Join Discord Server
              </Button>
            </div>
            
            <p className="text-muted-foreground">
              Have questions? Want to learn more before diving in? Feel free to reach out to 
              any of our facilitators or attend one of our community gatherings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;