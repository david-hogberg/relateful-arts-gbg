import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle, Loader2, Home, User, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'waiting' | 'success' | 'error'>('waiting');
  
  const email = searchParams.get('email');

  useEffect(() => {
    // Check if user is authenticated (email was verified)
    if (!loading && user) {
      setVerificationStatus('success');
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified. Choose where you'd like to go next.",
      });
    } else if (!loading && !user) {
      // Check URL hash for error or success indicators
      const hash = window.location.hash;
      if (hash.includes('error')) {
        setVerificationStatus('error');
        toast({
          title: "Verification failed",
          description: "Failed to verify your email. The link may have expired or already been used.",
          variant: "destructive",
        });
      }
    }
  }, [user, loading]);

  const resendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "No email address found. Please sign up again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`
        }
      });

      if (error) throw error;

      toast({
        title: "Email sent",
        description: "A new confirmation email has been sent to your inbox.",
      });
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        title: "Error",
        description: "Failed to resend confirmation email. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-elegant">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Checking authentication status...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-elegant">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <CardTitle className="text-2xl">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. Choose where you'd like to go next.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate('/profile')} 
              className="w-full"
              variant="default"
            >
              <User className="w-4 h-4 mr-2" />
              Go to Profile
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
              variant="ghost"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-elegant">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Verification Failed</CardTitle>
            <CardDescription>
              We couldn't verify your email. The link may have expired or already been used.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {email && (
              <Button onClick={resendConfirmation} className="w-full btn-outline-primary" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Confirmation Email
              </Button>
            )}
            <Button onClick={() => navigate('/auth')} className="w-full">
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default state - waiting for email confirmation
  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-elegant">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a confirmation email to{' '}
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground text-center space-y-2">
            <p>
              Click the verification link in the email to activate your account.
            </p>
            <p>
              Don't see the email? Check your spam folder.
            </p>
          </div>
          
          <div className="space-y-2">
            {email && (
              <Button onClick={resendConfirmation} className="w-full btn-outline-primary" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Confirmation Email
              </Button>
            )}
            <Button onClick={() => navigate('/auth')} className="w-full" variant="ghost">
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}