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
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const workTypes = [
  'Circling',
  'Authentic Relating',
  'Nonviolent Communication',
  'Somatic Practices',
  'Mindfulness',
  'Men\'s Work',
  'Women\'s Work',
  'Trauma-Informed Practices',
  'Conflict Resolution',
  'Other'
];

const availableLanguages = [
  'Swedish',
  'English',
  'German',
  'Spanish',
  'French',
  'Italian',
  'Norwegian',
  'Danish',
  'Other'
];

export default function ApplyFacilitator() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

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
      title: formData.get('title') as string,
      experience_description: formData.get('experience') as string,
      years_experience: parseInt(formData.get('years_experience') as string) || null,
      certifications: formData.get('certifications') as string,
      work_types: selectedWorkTypes,
      preferred_practice_types: selectedWorkTypes, // Keep for backward compatibility
      languages: selectedLanguages,
      website: formData.get('website') as string,
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

      navigate('/profile');
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

  const handleWorkTypeToggle = (workType: string) => {
    setSelectedWorkTypes(prev =>
      prev.includes(workType)
        ? prev.filter(p => p !== workType)
        : [...prev, workType]
    );
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Circling Facilitator & Coach"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years_experience">Years of Experience</Label>
                    <Input
                      id="years_experience"
                      name="years_experience"
                      type="number"
                      min="0"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">More About You *</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Please describe your experience with authentic relating, circling, or related practices..."
                    className="min-h-32"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Work Types / Specialties *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {workTypes.map((workType) => (
                      <div key={workType} className="flex items-center space-x-2">
                        <Checkbox
                          id={workType}
                          checked={selectedWorkTypes.includes(workType)}
                          onCheckedChange={() => handleWorkTypeToggle(workType)}
                        />
                        <Label htmlFor={workType} className="text-sm">
                          {workType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Languages *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableLanguages.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={selectedLanguages.includes(language)}
                          onCheckedChange={() => handleLanguageToggle(language)}
                        />
                        <Label htmlFor={language} className="text-sm">
                          {language}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
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
                    onClick={() => navigate('/profile')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || selectedWorkTypes.length === 0 || selectedLanguages.length === 0}
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