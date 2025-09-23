
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vehicle from "./pages/Vehicle";
import VehicleView from "./pages/VehicleView";
import LicenseView from "./pages/LicenseView";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/vehicle" 
              element={
                <>
                  <Navbar />
                  <Vehicle />
                </>
              } 
            />
            <Route 
              path="/vehicle/view" 
              element={
                <>
                  <Navbar />
                  <VehicleView />
                </>
              } 
            />
            <Route 
              path="/license/view" 
              element={
                <>
                  <Navbar />
                  <LicenseView />
                </>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
