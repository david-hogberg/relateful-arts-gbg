import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";

interface Event {
  id: string;
  title: string;
  facilitator: string;
  date: string;
  time: string;
  location: string;
  type: "circling" | "authentic-relating" | "workshop" | "gathering";
  participants: string;
  description: string;
  price: string;
}

const Events = () => {
  const upcomingEvents: Event[] = [
    {
      id: "1",
      title: "Weekly Circling Practice",
      facilitator: "Anna Lindberg",
      date: "2024-01-15",
      time: "19:00 - 21:00",
      location: "Hvitfeldtska Gymnasiet, Gothenburg",
      type: "circling",
      participants: "8-12 people",
      description: "A regular practice space for deepening authentic connection through circling. Perfect for both beginners and experienced practitioners.",
      price: "150 SEK"
    },
    {
      id: "2", 
      title: "Authentic Relating Games",
      facilitator: "Marcus Johansson",
      date: "2024-01-18",
      time: "18:30 - 21:30",
      location: "Folkuniversitetet, Gothenburg",
      type: "authentic-relating",
      participants: "10-16 people",
      description: "Playful exploration of authentic relating through structured games and exercises. Great introduction to the practice.",
      price: "200 SEK"
    },
    {
      id: "3",
      title: "Vulnerability & Connection Workshop",
      facilitator: "Sofia Andersson",
      date: "2024-01-22",
      time: "10:00 - 17:00", 
      location: "Kollektiv Studio, Gothenburg",
      type: "workshop",
      participants: "6-10 people",
      description: "A deep-dive day workshop exploring vulnerability as a pathway to authentic connection and personal growth.",
      price: "800 SEK"
    },
    {
      id: "4",
      title: "Monthly Community Gathering",
      facilitator: "Various Facilitators",
      date: "2024-01-28",
      time: "14:00 - 18:00",
      location: "Naturum Göteborg, Slottskogen",
      type: "gathering", 
      participants: "30+ people",
      description: "Open community gathering with mini-sessions, socializing, and coordination for facilitators. All experience levels welcome.",
      price: "Free"
    }
  ];

  const getTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "circling": return "bg-primary/10 text-primary border-primary/20";
      case "authentic-relating": return "bg-secondary/50 text-secondary-foreground border-secondary";
      case "workshop": return "bg-accent/50 text-accent-foreground border-accent";
      case "gathering": return "bg-muted/50 text-muted-foreground border-muted";
      default: return "bg-muted/50 text-muted-foreground border-muted";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">Community Events</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our upcoming circling sessions, authentic relating workshops, and community gatherings. 
              All events are designed to foster genuine connection and personal growth.
            </p>
            <Button size="lg" className="bg-gradient-hero shadow-warm">
              <ExternalLink className="w-5 h-5 mr-2" />
              Join WhatsApp for Updates
            </Button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="shadow-card hover:shadow-gentle transition-warm">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getTypeColor(event.type)}>
                      {event.type.replace('-', ' ')}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{event.price}</div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                  <CardDescription className="text-lg">
                    Facilitated by {event.facilitator}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-5 h-5 mr-3 text-primary" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-5 h-5 mr-3 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-5 h-5 mr-3 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-5 h-5 mr-3 text-primary" />
                      <span>{event.participants}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1">
                      Register Now
                    </Button>
                    <Button variant="outline">
                      More Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <h3 className="text-2xl font-semibold mb-4">Want to Host an Event?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you're a facilitator interested in hosting circling or authentic relating events, 
              we'd love to support you in connecting with our community.
            </p>
            <Button variant="outline" size="lg">
              Contact Us About Hosting
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;