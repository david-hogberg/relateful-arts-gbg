import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import EditProfileModal from "@/components/EditProfileModal";
import { Loader2, User, Settings } from "lucide-react";

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navigation />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
              {(profile as any)?.image_url ? (
                <img 
                  src={(profile as any).image_url} 
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Your Profile
              </h1>
              <p className="text-muted-foreground">
                Manage your personal information
              </p>
            </div>
          </div>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Profile Information
                  </CardTitle>
                  <CardDescription>Your community profile details</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setEditProfileOpen(true)}>
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Full Name:</span> {profile.full_name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {profile.email}
              </div>
              {profile.phone && (
                <div>
                  <span className="font-medium">Phone:</span> {profile.phone}
                </div>
              )}
              {profile.bio && (
                <div>
                  <span className="font-medium">Bio:</span>
                  <p className="mt-1 text-sm text-muted-foreground">{profile.bio}</p>
                </div>
              )}
              <div>
                <span className="font-medium">Role:</span>
                <Badge variant="secondary" className="ml-2 capitalize">
                  {profile.role}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Member since:</span>{' '}
                {new Date(profile.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <EditProfileModal 
        open={editProfileOpen} 
        onOpenChange={setEditProfileOpen} 
      />
    </div>
  );
}