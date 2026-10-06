import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ArticleHub from "./pages/ArticleHub";
import ArticlePage from "./pages/ArticlePage";

const queryClient = new QueryClient();

const ResumeRedirect = () => {
  if (typeof window !== "undefined") {
    window.location.replace("/Nasiful_Alam_Resume.pdf");
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
          <Route path="/vault/series-craft" element={<Index forceSection="vault-craft" />} />
          <Route path="/writing/essays/on-running-for-nothing" element={<Index forceSection="writing-essays-on-running-for-nothing" />} />
          <Route path="/writing/essays/on-running-for-nothing-bn" element={<Index forceSection="writing-essays-on-running-for-nothing-bn" />} />
          <Route path="/writing/essays/on-staying-small" element={<Index forceSection="writing-essays-on-staying-small" />} />
          <Route path="/writing/essays/on-staying-small-bn" element={<Index forceSection="writing-essays-on-staying-small-bn" />} />
          <Route path="/writing/essays/on-forgetting" element={<Index forceSection="writing-essays-on-forgetting" />} />
          <Route path="/writing/essays/on-forgetting-bn" element={<Index forceSection="writing-essays-on-forgetting-bn" />} />
          <Route path="/writing/tech-articles/series-01" element={<ArticleHub />} />
          <Route path="/writing/the-machine-beneath-your-code" element={<ArticlePage article="the-machine-beneath-your-code" />} />
          <Route path="/writing/whats-inside-a-bit" element={<ArticlePage article="whats-inside-a-bit" />} />
          <Route path="/writing/how-does-anything-become-bits" element={<ArticlePage article="how-does-anything-become-bits" />} />
          <Route path="/writing/cpu-blueprint" element={<ArticlePage article="cpu-blueprint" />} />
          <Route path="/writing/heartbeat-fde" element={<ArticlePage article="heartbeat-fde" />} />
          <Route path="/writing/memory-hierarchy" element={<ArticlePage article="memory-hierarchy" />} />
          <Route path="/writing/os-grand-conductor" element={<ArticlePage article="os-grand-conductor" />} />
          <Route path="/writing/code-to-machine-code" element={<ArticlePage article="code-to-machine-code" />} />
          <Route path="/writing/from-keypress-to-screen" element={<ArticlePage article="from-keypress-to-screen" />} />
          <Route path="*" element={<Index forceSection="404" />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
