
import { useBusinessConfig } from '@/hooks/useBusinessConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, FileText, Calendar, TrendingUp, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { config } = useBusinessConfig();

  const stats = [
    {
      title: 'Total Vehicles',
      value: '24',
      change: '+2 this month',
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      title: 'Expiring Soon',
      value: '6',
      change: 'Next 30 days',
      icon: Calendar,
      color: 'bg-orange-500'
    },
    {
      title: 'Documents',
      value: '144',
      change: 'All types',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'This Month',
      value: '8',
      change: '+33% from last month',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Vehicle',
      description: 'Register a new vehicle with all required documents',
      icon: Plus,
      href: '/vehicle',
      color: config?.theme.primary
    },
    {
      title: 'View All Vehicles',
      description: 'Browse and manage existing vehicle records',
      icon: Eye,
      href: '/vehicle/view',
      color: config?.theme.accent
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to {config?.brandName}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage your vehicle records, track document validity, and stay compliant with all requirements.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: action.color }}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">{action.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to={action.href}>
                <Button 
                  className="w-full shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: action.color }}
                >
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Vehicle KA05MX1234 added', time: '2 hours ago', type: 'success' },
              { action: 'Insurance expiring for UP12AB5678', time: '1 day ago', type: 'warning' },
              { action: 'PUC renewed for MH14CD9012', time: '3 days ago', type: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-gray-900">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
