import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset 
} from "@/components/ui/sidebar";
import { GitBranch, FileText, Settings, HelpCircle, ChevronRight, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import GitReplace from "@/pages/git-replace";
import SalesWorkflows from "@/pages/sales-workflows";
import ReplitToVercel from "@/pages/replit-to-vercel";
import LovablePrompts from "@/pages/lovable-prompts";
import FlutterWebView from "@/pages/flutter-webview";
import OdooHosting from "@/pages/odoo-hosting";
import Auth from "@/pages/auth";

function AppSidebar({ user }: { user: any }) {
  const [location, setLocation] = useLocation();
  const [techWorkflowsOpen, setTechWorkflowsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/auth");
  };
  
  return (
    <Sidebar className="border-r border-sidebar-border shadow-lg">
      <SidebarHeader className="bg-sidebar-accent/50 border-b border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-bold text-sidebar-foreground">Navigation</h2>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 hover:bg-sidebar-accent hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarMenu className="gap-1 px-2">
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location === "/"}
              className="transition-all duration-200 hover:bg-sidebar-accent hover:scale-[1.02] data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-md"
            >
              <Link href="/">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location === "/git-replace"}
              className="transition-all duration-200 hover:bg-sidebar-accent hover:scale-[1.02] data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-md"
            >
              <Link href="/git-replace">
                <GitBranch className="h-4 w-4" />
                <span className="font-medium">Git Replace Command</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location === "/sales-workflows"}
              className="transition-all duration-200 hover:bg-sidebar-accent hover:scale-[1.02] data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-md"
            >
              <Link href="/sales-workflows">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Sales Workflows</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setTechWorkflowsOpen(!techWorkflowsOpen)}
              isActive={location === "/replit-to-vercel" || location === "/lovable-prompts" || location === "/flutter-webview" || location === "/odoo-hosting"}
              className="transition-all duration-200 hover:bg-sidebar-accent hover:scale-[1.02] data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-md"
            >
              <Settings className="h-4 w-4" />
              <span className="font-medium">Tech Workflows</span>
              <ChevronRight className={`ml-auto transition-transform duration-200 ${techWorkflowsOpen ? 'rotate-90' : ''}`} />
            </SidebarMenuButton>
            {techWorkflowsOpen && (
              <SidebarMenuSub className="ml-4 mt-1 space-y-1 border-l-2 border-sidebar-border pl-2">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild 
                    isActive={location === "/lovable-prompts"}
                    className="transition-all duration-200 hover:bg-sidebar-accent/70 data-[active=true]:bg-sidebar-primary/80 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:font-medium"
                  >
                    <Link href="/lovable-prompts">
                      <span className="text-sm">Lovable Prompts</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild 
                    isActive={location === "/flutter-webview"}
                    className="transition-all duration-200 hover:bg-sidebar-accent/70 data-[active=true]:bg-sidebar-primary/80 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:font-medium"
                  >
                    <Link href="/flutter-webview">
                      <span className="text-sm">Flutter Web View App</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild 
                    isActive={location === "/odoo-hosting"}
                    className="transition-all duration-200 hover:bg-sidebar-accent/70 data-[active=true]:bg-sidebar-primary/80 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:font-medium"
                  >
                    <Link href="/odoo-hosting">
                      <span className="text-sm">Odoo Hosting</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    asChild 
                    isActive={location === "/replit-to-vercel"}
                    className="transition-all duration-200 hover:bg-sidebar-accent/70 data-[active=true]:bg-sidebar-primary/80 data-[active=true]:text-sidebar-primary-foreground data-[active=true]:font-medium"
                  >
                    <Link href="/replit-to-vercel">
                      <span className="text-sm">Replit Made to Vercel Ready</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="transition-all duration-200 hover:bg-sidebar-accent hover:scale-[1.02]">
              <HelpCircle className="h-4 w-4" />
              <span className="font-medium">Add-hocs Workflows</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function ProtectedRoute({ component: Component }: { component: any }) {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      const session = res?.data?.session;
      setUser(session?.user ?? null);
      if (!session) {
        setLocation("/auth");
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setLocation("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <Component /> : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/">
        {() => <ProtectedRoute component={Home} />}
      </Route>
      <Route path="/git-replace">
        {() => <ProtectedRoute component={GitReplace} />}
      </Route>
      <Route path="/sales-workflows">
        {() => <ProtectedRoute component={SalesWorkflows} />}
      </Route>
      <Route path="/replit-to-vercel">
        {() => <ProtectedRoute component={ReplitToVercel} />}
      </Route>
      <Route path="/lovable-prompts">
        {() => <ProtectedRoute component={LovablePrompts} />}
      </Route>
      <Route path="/flutter-webview">
        {() => <ProtectedRoute component={FlutterWebView} />}
      </Route>
      <Route path="/odoo-hosting">
        {() => <ProtectedRoute component={OdooHosting} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App Component
function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      const session = res?.data?.session;
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar user={user} />
          <SidebarInset>
            <Toaster />
            <Router />
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
