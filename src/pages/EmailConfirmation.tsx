import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    // If there are verification tokens in the URL, process them
    if (token && type === 'signup') {
      handleEmailVerification();
    }
  }, [token, type]);

  const handleEmailVerification = async () => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token!,
        type: 'signup'
      });

      if (error) throw error;

      setVerificationStatus('success');
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified. Redirecting to dashboard...",
      });

      // Redirect to dashboard after successful verification
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      toast({
        title: "Verification failed",
        description: "Failed to verify your email. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

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

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Verifying your email...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <CardTitle className="text-2xl">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You'll be redirected to the dashboard shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
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
              <Button onClick={resendConfirmation} className="w-full" variant="outline">
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
      <Card className="w-full max-w-md">
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
              <Button onClick={resendConfirmation} className="w-full" variant="outline">
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