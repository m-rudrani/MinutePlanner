import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Plan from "./pages/Plan";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/features" element={<PlaceholderPage title="Features" description="Explore all the powerful features that make MinutePlanner the best travel planning tool" />} />
          <Route path="/examples" element={<PlaceholderPage title="Example Itineraries" description="Get inspired by amazing trips planned by our community" />} />
          <Route path="/pricing" element={<PlaceholderPage title="Pricing Plans" description="Choose the perfect plan for your travel planning needs" />} />
          <Route path="/api" element={<PlaceholderPage title="Developer API" description="Integrate MinutePlanner's intelligence into your own applications" />} />
          <Route path="/mobile" element={<PlaceholderPage title="Mobile Apps" description="Take your itineraries on the go with our mobile applications" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
