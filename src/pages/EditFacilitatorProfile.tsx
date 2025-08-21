import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, User, Settings, Edit } from "lucide-react";

const workTypes = [
  'Circling',
  'Authentic Relating',
  'T-Group',
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

export default function EditFacilitatorProfile() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    public_bio: '',
    approach: '',
    contact_email: '',
    website: '',
    image_url: ''
  });

  useEffect(() => {
    if (!loading && (!user || (profile?.role !== 'facilitator' && profile?.role !== 'admin'))) {
      navigate('/');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title || '',
        public_bio: profile.public_bio || '',
        approach: profile.approach || '',
        contact_email: profile.contact_email || profile.email,
        website: profile.website || '',
        image_url: (profile as any).image_url || ''
      });
      setSelectedWorkTypes(profile.work_types || []);
      setSelectedLanguages(profile.languages || []);
      setIsPublic(profile.is_public_profile !== false);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    const updateData = {
      title: formData.title,
      public_bio: formData.public_bio,
      approach: formData.approach,
      contact_email: formData.contact_email,
      website: formData.website,
      image_url: formData.image_url,
      work_types: selectedWorkTypes,
      languages: selectedLanguages,
      is_public_profile: isPublic
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your facilitator profile has been successfully updated.",
      });

      setIsEditing(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Update failed",
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

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Edit Facilitator Profile</CardTitle>
                    <CardDescription>
                      Update your public facilitator profile that appears on the Facilitators page
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <Switch
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                    <span className="text-sm">{isPublic ? 'Public' : 'Private'}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <ImageUpload
                    bucket="profile-images"
                    folder={user?.id}
                    currentImage={formData.image_url}
                    onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    onImageRemoved={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                    label="Profile Picture"
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Circling Facilitator & Coach"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="public_bio">Public Bio *</Label>
                    <Textarea
                      id="public_bio"
                      value={formData.public_bio}
                      onChange={(e) => setFormData({...formData, public_bio: e.target.value})}
                      placeholder="Write a brief bio that will be displayed on your public profile..."
                      className="min-h-24"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approach">Facilitation Approach</Label>
                    <Textarea
                      id="approach"
                      value={formData.approach}
                      onChange={(e) => setFormData({...formData, approach: e.target.value})}
                      placeholder="Describe your unique approach to facilitation and what participants can expect..."
                      className="min-h-24"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email *</Label>
                      <Input
                        id="contact_email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        type="url"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
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
                      Save Profile
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

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Facilitator Profile
              </h1>
              <p className="text-muted-foreground">
                Manage your public facilitator profile and visibility
              </p>
            </div>
          </div>

          {/* Facilitator Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Your public facilitator profile details</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Full Name:</span> {profile.full_name}
              </div>
              <div>
                <span className="font-medium">Professional Title:</span> {profile.title || 'Not set'}
              </div>
              <div>
                <span className="font-medium">Contact Email:</span> {profile.contact_email || profile.email}
              </div>
              {profile.website && (
                <div>
                  <span className="font-medium">Website:</span>
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
              <div>
                <span className="font-medium">Profile Visibility:</span>
                <Badge variant={isPublic ? "default" : "secondary"} className="ml-2">
                  {isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
              {profile.public_bio && (
                <div>
                  <span className="font-medium">Public Bio:</span>
                  <p className="mt-1 text-sm text-muted-foreground">{profile.public_bio}</p>
                </div>
              )}
              {profile.approach && (
                <div>
                  <span className="font-medium">Facilitation Approach:</span>
                  <p className="mt-1 text-sm text-muted-foreground italic">"{profile.approach}"</p>
                </div>
              )}
              {profile.work_types && profile.work_types.length > 0 && (
                <div>
                  <span className="font-medium">Work Types:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.work_types.map((workType, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {workType}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.languages && profile.languages.length > 0 && (
                <div>
                  <span className="font-medium">Languages:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.languages.map((language, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}