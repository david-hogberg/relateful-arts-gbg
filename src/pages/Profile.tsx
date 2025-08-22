import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import EditProfileModal from "@/components/EditProfileModal";
import { Loader2, User, Settings, Mail, Phone, Calendar, Award, FileText } from "lucide-react";

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navigation />
        <div className="loading-container">
          <Loader2 className="loading-spinner" />
          <span className="loading-text">Loading profile...</span>
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
      
      <main className="page-section-content py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="profile-header">
            <h1 className="profile-title">Your Profile</h1>
            <p className="profile-description">
              Manage your personal information
            </p>
          </div>

          {/* Profile Information Card */}
          <Card className="profile-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Profile Information
                  </CardTitle>
                  <CardDescription>Your community profile details</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setEditProfileOpen(true)} className="btn-outline-primary">
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="profile-form">
              <div className="profile-section">
                <div className="profile-section-title">
                  <User className="profile-section-title-icon" />
                  Personal Information
                </div>
                <div className="profile-field-group">
                  <div className="profile-field">
                    <User className="profile-field-icon" />
                    <span className="profile-field-label">Full Name</span>
                    <span className="profile-field-value">{profile.full_name}</span>
                  </div>
                  <div className="profile-field">
                    <Mail className="profile-field-icon" />
                    <span className="profile-field-label">Email</span>
                    <span className="profile-field-value">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="profile-field">
                      <Phone className="profile-field-icon" />
                      <span className="profile-field-label">Phone</span>
                      <span className="profile-field-value">{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {profile.bio && (
                <>
                  <div className="profile-divider" />
                  <div className="profile-section">
                    <div className="profile-section-title">
                      <FileText className="profile-section-title-icon" />
                      About You
                    </div>
                    <div className="profile-field-row">
                      <FileText className="profile-field-row-icon" />
                      <div className="profile-field-row-content">
                        <div className="profile-field-row-label">Bio</div>
                        <div className="profile-field-row-value">{profile.bio}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="profile-divider" />
              <div className="profile-section">
                <div className="profile-section-title">
                  <Award className="profile-section-title-icon" />
                  Account Details
                </div>
                <div className="profile-field-group">
                  <div className="profile-field">
                    <Award className="profile-field-icon" />
                    <span className="profile-field-label">Role</span>
                    <div className="profile-field-value">
                      <span className="profile-badge">
                        <Award className="profile-badge-icon" />
                        {profile.role}
                      </span>
                    </div>
                  </div>
                  <div className="profile-field">
                    <Calendar className="profile-field-icon" />
                    <span className="profile-field-label">Member Since</span>
                    <span className="profile-field-value">{new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
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