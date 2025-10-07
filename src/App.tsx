import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import BrowseMentors from "./pages/BrowseMentors";
import Messages from "./pages/Messages";
import AdminDashboard from "./pages/AdminDashboard";
import BookSession from "./pages/BookSession";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import RefundCancellation from "./pages/RefundCancellation";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard/:role" element={<Dashboard />} />
          <Route path="/browse-mentors" element={<BrowseMentors />} />
          <Route path="/mentors" element={<BrowseMentors />} />
          <Route path="/messages/:mentorId" element={<Messages />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/book-session/:mentorId" element={<BookSession />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-cancellation" element={<RefundCancellation />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
