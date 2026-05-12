import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const ResumeRedirect = () => {
  if (typeof window !== "undefined") {
    window.location.replace("/resume.html");
  }
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resume" element={<ResumeRedirect />} />
          <Route path="/:section" element={<Index />} />
          <Route path="/:section/:subsection" element={<Index />} />
          <Route path="/vault" element={<Index forceSection="vault" />} />
          <Route path="/vault/the-real-story" element={<Index forceSection="vault-content" />} />
          <Route path="/writing/essays/on-running-for-nothing" element={<Index forceSection="writing-essays-on-running-for-nothing" />} />
          <Route path="/writing/essays/on-running-for-nothing-bn" element={<Index forceSection="writing-essays-on-running-for-nothing-bn" />} />
          <Route path="/writing/essays/on-staying-small" element={<Index forceSection="writing-essays-on-staying-small" />} />
          <Route path="/writing/essays/on-staying-small-bn" element={<Index forceSection="writing-essays-on-staying-small-bn" />} />
          <Route path="*" element={<Index forceSection="404" />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
