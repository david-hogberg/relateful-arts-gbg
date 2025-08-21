import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, User, Globe, Calendar, FileText } from "lucide-react";

interface ApplicationDetails {
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

interface ViewApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationDetails | null;
}

const ViewApplicationModal = ({ open, onOpenChange, application }: ViewApplicationModalProps) => {
  if (!application) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-destructive';
      default: return 'bg-warning';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Facilitator Application
          </DialogTitle>
          <DialogDescription>
            Full application details for {application.profiles?.full_name || 'Unknown'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{application.profiles?.full_name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {application.profiles?.email || 'No email'}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Submitted: {new Date(application.submitted_at).toLocaleDateString()}
              </div>
            </div>
            <Badge className={`capitalize ${getStatusColor(application.status)}`}>
              {application.status}
            </Badge>
          </div>

          <Separator />

          {/* Application Details */}
          <div className="grid gap-6">
            {application.title && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Professional Title</Label>
                <p className="mt-1">{application.title}</p>
              </div>
            )}

            {application.years_experience && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Years of Experience</Label>
                <p className="mt-1">{application.years_experience} years</p>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Experience Description</Label>
              <p className="mt-1 whitespace-pre-wrap">{application.experience_description}</p>
            </div>

            {application.public_bio && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Public Bio</Label>
                <p className="mt-1 whitespace-pre-wrap">{application.public_bio}</p>
              </div>
            )}

            {application.approach && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Approach</Label>
                <p className="mt-1 whitespace-pre-wrap">{application.approach}</p>
              </div>
            )}

            {application.certifications && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Certifications</Label>
                <p className="mt-1 whitespace-pre-wrap">{application.certifications}</p>
              </div>
            )}

            {application.preferred_practice_types && application.preferred_practice_types.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Preferred Practice Types</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {application.preferred_practice_types.map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {application.work_types && application.work_types.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Work Types</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {application.work_types.map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {application.languages && application.languages.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Languages</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {application.languages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {application.availability && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Availability</Label>
                <p className="mt-1 whitespace-pre-wrap">{application.availability}</p>
              </div>
            )}

            {application.website && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={application.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {application.website}
                  </a>
                </div>
              </div>
            )}

            {application.contact_email && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Contact Email</Label>
                <p className="mt-1">{application.contact_email}</p>
              </div>
            )}

            {application.contact_references && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">References</Label>
                <p className="mt-1 whitespace-pre-wrap">{application.contact_references}</p>
              </div>
            )}

            {application.admin_notes && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Admin Notes</Label>
                <p className="mt-1 whitespace-pre-wrap text-sm bg-muted/50 p-2 rounded">
                  {application.admin_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationModal;