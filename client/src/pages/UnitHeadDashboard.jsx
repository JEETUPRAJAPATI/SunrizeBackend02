import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Factory,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Award,
  Calendar,
  BarChart3
} from 'lucide-react';

// Dummy data for Unit Head Dashboard
const unitStats = {
  totalEmployees: 145,
  activeProjects: 12,
  monthlyProduction: 85600,
  monthlyRevenue: 2840000,
  efficiency: 94.5,
  qualityScore: 98.2,
  onTimeDelivery: 96.8,
  costSavings: 180000
};

const departmentData = [
  { name: 'Production', employees: 45, efficiency: 96.2, status: 'Excellent', target: 50000, achieved: 48100 },
  { name: 'Quality Control', employees: 12, efficiency: 98.5, status: 'Excellent', target: 10000, achieved: 9850 },
  { name: 'Packaging', employees: 25, efficiency: 92.8, status: 'Good', target: 30000, achieved: 27840 },
  { name: 'Dispatch', employees: 18, efficiency: 94.1, status: 'Good', target: 15000, achieved: 14115 },
  { name: 'Maintenance', employees: 15, efficiency: 89.5, status: 'Fair', target: 5000, achieved: 4475 },
  { name: 'Administration', employees: 30, efficiency: 91.2, status: 'Good', target: 8000, achieved: 7296 }
];

const recentAlerts = [
  { id: 1, type: 'warning', message: 'Machine #3 requires maintenance scheduled', time: '2 hours ago', dept: 'Production' },
  { id: 2, type: 'info', message: 'New batch quality check completed', time: '4 hours ago', dept: 'Quality' },
  { id: 3, type: 'success', message: 'Monthly targets achieved in Packaging', time: '6 hours ago', dept: 'Packaging' },
  { id: 4, type: 'warning', message: 'Overtime approval pending for dispatch team', time: '8 hours ago', dept: 'Dispatch' }
];

const monthlyTargets = [
  { category: 'Production Volume', current: 85600, target: 90000, unit: 'units' },
  { category: 'Quality Score', current: 98.2, target: 97.0, unit: '%' },
  { category: 'Cost Efficiency', current: 94.5, target: 95.0, unit: '%' },
  { category: 'Employee Satisfaction', current: 87.3, target: 85.0, unit: '%' }
];

export default function UnitHeadDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-10 w-10" />
              Unit Head Dashboard
            </h1>
            <p className="text-purple-100 mt-2">
              Complete overview of unit operations and performance metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unitStats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Production</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unitStats.monthlyProduction.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(unitStats.monthlyRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              +8.7% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unitStats.efficiency}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5" />
              Department Performance
            </CardTitle>
            <CardDescription>
              Real-time performance metrics by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{dept.name}</h3>
                      <Badge className={getStatusColor(dept.status)}>
                        {dept.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {dept.employees} employees
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Efficiency: {dept.efficiency}%</span>
                      <span>{dept.achieved.toLocaleString()} / {dept.target.toLocaleString()}</span>
                    </div>
                    <Progress value={(dept.achieved / dept.target) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Important notifications and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {alert.dept}
                      </Badge>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Monthly Targets Progress
          </CardTitle>
          <CardDescription>
            Track progress against key performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monthlyTargets.map((target) => (
              <div key={target.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{target.category}</h3>
                  <Badge variant={target.current >= target.target ? "default" : "secondary"}>
                    {target.current >= target.target ? (
                      <Award className="h-3 w-3 mr-1" />
                    ) : null}
                    {target.current >= target.target ? "Achieved" : "In Progress"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {target.current} {target.unit}</span>
                    <span>Target: {target.target} {target.unit}</span>
                  </div>
                  <Progress 
                    value={Math.min((target.current / target.target) * 100, 100)} 
                    className="h-3"
                  />
                  <div className="text-xs text-gray-500">
                    {target.current >= target.target 
                      ? `${((target.current / target.target - 1) * 100).toFixed(1)}% above target`
                      : `${(100 - (target.current / target.target) * 100).toFixed(1)}% remaining`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}