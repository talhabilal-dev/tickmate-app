'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { LogOut, Users, BarChart3, Shield, Database, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-ai opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-ai-reverse opacity-10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2"></div>

      {/* Header */}
      <header className="border-b border-primary/10 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-gradient-ai">Admin Control Panel</h1>
            <p className="text-sm text-muted-foreground">Manage system and users</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-primary/30">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* System Status Alert */}
        <Card className="mb-8 border-secondary/30 bg-secondary/5">
          <CardContent className="pt-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-secondary flex-shrink-0" />
            <div>
              <p className="font-semibold">System Status</p>
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Users Management Card */}
          <Card className="border-primary/20 shadow-md ai-glow hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">User Management</CardTitle>
                <div className="w-10 h-10 rounded-full gradient-ai flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">View and manage all users</p>
              <Button className="w-full ai-button" size="sm">
                Manage Users
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card className="border-primary/20 shadow-md ai-glow hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Analytics</CardTitle>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">View system analytics and reports</p>
              <Button className="w-full ai-button" size="sm">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="border-primary/20 shadow-md ai-glow hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Security</CardTitle>
                <div className="w-10 h-10 rounded-full gradient-ai-diagonal flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Manage security settings</p>
              <Button className="w-full ai-button" size="sm">
                Security Settings
              </Button>
            </CardContent>
          </Card>

          {/* Database Card */}
          <Card className="border-primary/20 shadow-md ai-glow hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Database</CardTitle>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Manage database and backups</p>
              <Button className="w-full ai-button" size="sm">
                Database Management
              </Button>
            </CardContent>
          </Card>

          {/* System Logs Card */}
          <Card className="border-primary/20 shadow-md ai-glow hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">System Logs</CardTitle>
                <div className="w-10 h-10 rounded-full gradient-ai flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">View system logs and events</p>
              <Button className="w-full ai-button" size="sm">
                View Logs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Stats Section */}
        <div>
          <h3 className="text-xl font-bold mb-6">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: '0' },
              { label: 'Active Sessions', value: '0' },
              { label: 'API Requests', value: '0' },
              { label: 'System Uptime', value: '100%' },
            ].map((stat) => (
              <Card key={stat.label} className="border-primary/10">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-gradient-ai">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
