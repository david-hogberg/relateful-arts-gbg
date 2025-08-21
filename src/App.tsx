import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Facilitators from "./pages/Facilitators";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyEvents from "./pages/MyEvents";
import ManageEvents from "./pages/ManageEvents";
import EditFacilitatorProfile from "./pages/EditFacilitatorProfile";
import ApplyFacilitator from "./pages/ApplyFacilitator";
import Admin from "./pages/Admin";
import EmailConfirmation from "./pages/EmailConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/facilitators" element={<Facilitators />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/manage-events" element={<ManageEvents />} />
            <Route path="/apply-facilitator" element={<ApplyFacilitator />} />
            <Route path="/edit-facilitator-profile" element={<EditFacilitatorProfile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
