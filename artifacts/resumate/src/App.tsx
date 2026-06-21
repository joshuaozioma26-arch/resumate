import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResumeProvider } from "@/context/ResumeContext";
import NotFound from "@/pages/not-found";
import EmailGate from "@/pages/EmailGate";
import Builder from "@/pages/Builder";
import Preview from "@/pages/Preview";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={EmailGate} />
      <Route path="/builder" component={Builder} />
      <Route path="/preview" component={Preview} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ResumeProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </ResumeProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
