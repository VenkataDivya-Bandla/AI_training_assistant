import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import EmployeeTable from './components/EmployeeTable';
import OnboardingChart from './components/OnboardingChart';
import QuickActions from './components/QuickActions';
import NotificationPanel from './components/NotificationPanel';
import Button from '../../components/ui/Button';


const HRAdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (parsedUser?.role !== 'hr_admin') {
        navigate('/employee-dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Mock data for metrics
  const metricsData = [
    {
      title: 'Active Onboardees',
      value: '24',
      subtitle: '6 new this week',
      trend: 'up',
      trendValue: '+12%',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Completion Rate',
      value: '87%',
      subtitle: 'Above target (85%)',
      trend: 'up',
      trendValue: '+3%',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'Avg. Time to Productivity',
      value: '18 days',
      subtitle: '2 days faster than last month',
      trend: 'down',
      trendValue: '-2 days',
      icon: 'Clock',
      color: 'warning'
    },
    {
      title: 'Satisfaction Score',
      value: '4.6/5',
      subtitle: 'Based on 156 responses',
      trend: 'up',
      trendValue: '+0.2',
      icon: 'Star',
      color: 'success'
    }
  ];

  // Mock data for employees
  const employeesData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'engineering',
      startDate: '12/01/2024',
      progress: 85,
      status: 'in_progress',
      mentor: 'Alex Chen',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@company.com',
      department: 'marketing',
      startDate: '12/05/2024',
      progress: 100,
      status: 'completed',
      mentor: 'Lisa Wang',
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      department: 'sales',
      startDate: '12/08/2024',
      progress: 45,
      status: 'in_progress',
      mentor: 'John Smith',
      lastActivity: '30 minutes ago'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@company.com',
      department: 'finance',
      startDate: '12/10/2024',
      progress: 20,
      status: 'overdue',
      mentor: 'Maria Garcia',
      lastActivity: '3 days ago'
    },
    {
      id: 5,
      name: 'Jessica Brown',
      email: 'jessica.brown@company.com',
      department: 'hr',
      startDate: '12/12/2024',
      progress: 10,
      status: 'not_started',
      mentor: 'Robert Taylor',
      lastActivity: 'Never'
    }
  ];

  // Mock data for charts
  const funnelData = [
    { stage: 'Started', count: 24 },
    { stage: 'IT Setup', count: 22 },
    { stage: 'Training', count: 18 },
    { stage: 'Mentoring', count: 15 },
    { stage: 'Completed', count: 12 }
  ];

  const completionData = [
    { name: 'Completed', value: 12 },
    { name: 'In Progress', value: 8 },
    { name: 'Overdue', value: 3 },
    { name: 'Not Started', value: 1 }
  ];

  const trendData = [
    { month: 'Aug', completionRate: 82, satisfactionScore: 4.2 },
    { month: 'Sep', completionRate: 85, satisfactionScore: 4.4 },
    { month: 'Oct', completionRate: 88, satisfactionScore: 4.5 },
    { month: 'Nov', completionRate: 87, satisfactionScore: 4.6 },
    { month: 'Dec', completionRate: 87, satisfactionScore: 4.6 }
  ];

  // Mock notifications data
  const notificationsData = [
    {
      id: 1,
      title: 'Employee Needs Attention',
      message: 'David Kim has been inactive for 3 days and is falling behind schedule',
      type: 'attention',
      priority: 'urgent',
      timestamp: '5 minutes ago',
      read: false,
      actionRequired: true,
      actionText: 'Contact Employee'
    },
    {
      id: 2,
      title: 'Training Module Overdue',
      message: '3 employees have overdue security training modules',
      type: 'overdue',
      priority: 'high',
      timestamp: '1 hour ago',
      read: false,
      actionRequired: true,
      actionText: 'Send Reminder'
    },
    {
      id: 3,
      title: 'Onboarding Completed',
      message: 'Michael Rodriguez has successfully completed all onboarding tasks',
      type: 'completion',
      priority: 'normal',
      timestamp: '2 hours ago',
      read: false,
      actionRequired: false
    },
    {
      id: 4,
      title: 'System Update',
      message: 'New training content has been uploaded to the platform',
      type: 'system',
      priority: 'low',
      timestamp: '1 day ago',
      read: true,
      actionRequired: false
    }
  ];

  const handleViewEmployeeDetails = (employee) => {
    console.log('Viewing details for:', employee?.name);
    // Navigate to employee detail page or open modal
  };

  const handleBulkAction = (action, employeeIds) => {
    console.log(`Performing ${action} on employees:`, employeeIds);
    // Handle bulk actions like messaging, task assignment, export
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action:', actionId);
    switch (actionId) {
      case 'add_employee': console.log('Navigate to add employee form');
        break;
      case 'manage_content': console.log('Navigate to content management');
        break;
      case 'send_announcement': console.log('Open announcement composer');
        break;
      case 'generate_report': console.log('Generate progress report');
        break;
      case 'manage_mentors': console.log('Navigate to mentor management');
        break;
      case 'system_settings': console.log('Navigate to system settings');
        break;
      case 'view_all_activity': console.log('Navigate to activity log');
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  const handleNotificationAction = (action, notificationId) => {
    console.log(`${action} notification:`, notificationId);
    // Handle notification actions
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <Breadcrumb />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">HR Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Monitor onboarding progress and manage employee training
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  {timeRangeOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
                
                <Button
                  variant="outline"
                  onClick={() => console.log('Export dashboard data')}
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                >
                  Export
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => handleQuickAction('add_employee')}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add Employee
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard 
                key={index} 
                title={metric.title}
                value={metric.value}
                subtitle={metric.subtitle}
                trend={metric.trend}
                trendValue={metric.trendValue}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Column - Employee Table */}
            <div className="xl:col-span-3 space-y-8">
              <EmployeeTable
                employees={employeesData}
                onViewDetails={handleViewEmployeeDetails}
                onBulkAction={handleBulkAction}
              />

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OnboardingChart
                  type="funnel"
                  data={funnelData}
                  title="Onboarding Funnel"
                />
                <OnboardingChart
                  type="completion"
                  data={completionData}
                  title="Completion Status"
                />
              </div>

              {/* Trend Chart */}
              <OnboardingChart
                type="trend"
                data={trendData}
                title="Monthly Trends"
              />
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              <QuickActions onAction={handleQuickAction} />
              <NotificationPanel
                notifications={notificationsData}
                onMarkAsRead={(id) => handleNotificationAction('mark_read', id)}
                onDismiss={(id) => handleNotificationAction('dismiss', id)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HRAdminDashboard;