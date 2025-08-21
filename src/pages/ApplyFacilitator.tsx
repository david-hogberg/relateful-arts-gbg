import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const practiceTypes = [
  'Circling',
  'Authentic Relating',
  'T-Group',
  'Nonviolent Communication',
  'Somatic Practices',
  'Mindfulness',
  'Other'
];

export default function ApplyFacilitator() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'user')) {
      navigate('/');
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const applicationData = {
      user_id: user.id,
      experience_description: formData.get('experience') as string,
      certifications: formData.get('certifications') as string,
      preferred_practice_types: selectedPractices,
      availability: formData.get('availability') as string,
      contact_references: formData.get('references') as string,
    };

    try {
      const { error } = await supabase
        .from('facilitator_applications')
        .insert([applicationData]);

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your facilitator application has been submitted for review.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePracticeToggle = (practice: string) => {
    setSelectedPractices(prev =>
      prev.includes(practice)
        ? prev.filter(p => p !== practice)
        : [...prev, practice]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Apply to Become a Facilitator</CardTitle>
              <CardDescription>
                Share your experience and help us understand how you'd contribute to our community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Description *</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Please describe your experience with authentic relating, circling, or related practices..."
                    className="min-h-32"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications & Training</Label>
                  <Textarea
                    id="certifications"
                    name="certifications"
                    placeholder="List any relevant certifications, training programs, or qualifications..."
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Preferred Practice Types</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {practiceTypes.map((practice) => (
                      <div key={practice} className="flex items-center space-x-2">
                        <Checkbox
                          id={practice}
                          checked={selectedPractices.includes(practice)}
                          onCheckedChange={() => handlePracticeToggle(practice)}
                        />
                        <Label htmlFor={practice} className="text-sm">
                          {practice}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Textarea
                    id="availability"
                    name="availability"
                    placeholder="When are you typically available to facilitate? (days, times, frequency)"
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="references">References</Label>
                  <Textarea
                    id="references"
                    name="references"
                    placeholder="Please provide contact information for references (optional but helpful)"
                    className="min-h-24"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || selectedPractices.length === 0}
                    className="flex-1"
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Application
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}