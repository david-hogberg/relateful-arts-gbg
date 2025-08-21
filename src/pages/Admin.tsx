import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ViewApplicationModal from "@/components/ViewApplicationModal";
import { ManageResourceSubmissions } from "@/components/ManageResourceSubmissions";
import { ManageVenueSubmissions } from "@/components/ManageVenueSubmissions";
import { Loader2, Search, Users, FileText, Shield, BookOpen, Building } from "lucide-react";

interface FacilitatorApplication {
  id: string;
  user_id: string;
  experience_description: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  title?: string;
  public_bio?: string;
  years_experience?: number;
  website?: string;
  approach?: string;
  certifications?: string;
  preferred_practice_types?: string[];
  availability?: string;
  contact_email?: string;
  contact_references?: string;
  work_types?: string[];
  languages?: string[];
  admin_notes?: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'user' | 'facilitator' | 'admin';
  created_at: string;
}

export default function Admin() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<FacilitatorApplication[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewApplicationOpen, setViewApplicationOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<FacilitatorApplication | null>(null);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      navigate('/dashboard');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchApplications();
      fetchUsers();
    }
  }, [user, profile]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('facilitator_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately and merge with applications
      const userIds = data?.map(app => app.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Merge applications with profile data
      const applicationsWithProfiles = data?.map(app => ({
        ...app,
        profiles: profiles?.find(p => p.user_id === app.user_id)
      })) || [];

      setApplications(applicationsWithProfiles);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setLoadingApplications(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleApplicationAction = async (
    applicationId: string, 
    status: 'approved' | 'rejected', 
    userId: string
  ) => {
    setActionLoading(applicationId);
    try {
      // Update application status
      const { error: appError } = await supabase
        .from('facilitator_applications')
        .update({ 
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user!.id
        })
        .eq('id', applicationId);

      if (appError) throw appError;

      // If approved, update user role to facilitator
      if (status === 'approved') {
        const { error: roleError } = await supabase
          .from('profiles')
          .update({ role: 'facilitator' })
          .eq('user_id', userId);

        if (roleError) throw roleError;
      }

      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });

      fetchApplications();
      fetchUsers();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'facilitator' | 'admin') => {
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewApplication = (application: FacilitatorApplication) => {
    setSelectedApplication(application);
    setViewApplicationOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-destructive';
      default: return 'bg-warning';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive';
      case 'facilitator': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage facilitator applications and user roles
              </p>
            </div>
          </div>

          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="venues" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Venues
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Facilitator Applications</CardTitle>
                  <CardDescription>
                    Review and manage facilitator applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingApplications ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : applications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No applications found
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications.map((application) => (
                            <TableRow 
                              key={application.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleViewApplication(application)}
                            >
                              <TableCell className="font-medium">
                                {application.profiles?.full_name || 'Unknown'}
                              </TableCell>
                              <TableCell>{application.profiles?.email || 'Unknown'}</TableCell>
                              <TableCell>
                                <Badge className={`capitalize ${getStatusColor(application.status)}`}>
                                  {application.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(application.submitted_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                {application.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleApplicationAction(
                                        application.id, 
                                        'approved', 
                                        application.user_id
                                      )}
                                      disabled={actionLoading === application.id}
                                    >
                                      {actionLoading === application.id && (
                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                      )}
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleApplicationAction(
                                        application.id, 
                                        'rejected', 
                                        application.user_id
                                      )}
                                      disabled={actionLoading === application.id}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Submissions</CardTitle>
                  <CardDescription>
                    Review and manage community resource submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ManageResourceSubmissions />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="venues">
              <Card>
                <CardHeader>
                  <CardTitle>Venue Submissions</CardTitle>
                  <CardDescription>
                    Review and manage community venue submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ManageVenueSubmissions />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all users and their roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {loadingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                {user.full_name}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge className={`capitalize ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(user.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={user.role}
                                  onValueChange={(value) => handleRoleChange(user.user_id, value as 'user' | 'facilitator' | 'admin')}
                                  disabled={actionLoading === user.user_id}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="facilitator">Facilitator</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <ViewApplicationModal
        open={viewApplicationOpen}
        onOpenChange={setViewApplicationOpen}
        application={selectedApplication}
      />
    </div>
  );
}
