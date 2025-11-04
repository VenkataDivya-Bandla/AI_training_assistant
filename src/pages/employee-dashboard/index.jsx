import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ChatInterface from './components/ChatInterface';
import OnboardingProgress from './components/OnboardingProgress';
import TrainingModules from './components/TrainingModules';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      navigate('/login');
    }

    // Check for mobile view
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, [navigate]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'training', label: 'Training', icon: 'BookOpen' },
    { id: 'chat', label: 'AI Assistant', icon: 'Bot' }
  ];

  const quickStats = [
    {
      id: 1,
      title: "Tasks Completed",
      value: "17/25",
      percentage: 68,
      icon: "CheckCircle",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: 2,
      title: "Training Hours",
      value: "12.5",
      subtitle: "This week",
      icon: "Clock",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: 3,
      title: "Meetings Scheduled",
      value: "3",
      subtitle: "Next 7 days",
      icon: "Calendar",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      id: 4,
      title: "Messages",
      value: "8",
      subtitle: "Unread",
      icon: "MessageSquare",
      color: "text-error",
      bgColor: "bg-error/10"
    }
  ];

  const welcomeMessage = {
    title: `Welcome back, ${user?.name || 'Employee'}! 👋`,
    subtitle: "You\'re making great progress on your onboarding journey. Here\'s what\'s happening today.",
    currentDate: new Date()?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb />
          </div>

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  {welcomeMessage?.title}
                </h1>
                <p className="text-muted-foreground mb-1">{welcomeMessage?.subtitle}</p>
                <p className="text-sm text-muted-foreground">{welcomeMessage?.currentDate}</p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Icon name="Sparkles" size={32} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats?.map((stat) => (
              <div key={stat?.id} className="bg-card rounded-lg border border-border shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat?.title}</p>
                    <p className="text-2xl font-semibold text-foreground">{stat?.value}</p>
                    {stat?.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{stat?.subtitle}</p>
                    )}
                    {stat?.percentage && (
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-1">
                          <div 
                            className="bg-success h-1 rounded-full transition-all duration-500"
                            style={{ width: `${stat?.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat?.bgColor}`}>
                    <Icon name={stat?.icon} size={24} className={stat?.color} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Tab Navigation */}
          {isMobileView && (
            <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
              {tabs?.map((tab) => (
                <Button
                  key={tab?.id}
                  variant={activeTab === tab?.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab?.id)}
                  iconName={tab?.icon}
                  iconPosition="left"
                  iconSize={16}
                  className="flex-1"
                >
                  {tab?.label}
                </Button>
              ))}
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Desktop: Chat Interface (8 cols) | Mobile: Tab Content */}
            <div className={`${isMobileView ? 'col-span-1' : 'lg:col-span-8'}`}>
              {isMobileView ? (
                <>
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      <OnboardingProgress />
                    </div>
                  )}
                  {activeTab === 'training' && <TrainingModules />}
                  {activeTab === 'chat' && (
                    <div className="h-[600px]">
                      <ChatInterface />
                    </div>
                  )}
                </>
              ) : (
                <div className="h-[700px]">
                  <ChatInterface />
                </div>
              )}
            </div>

            {/* Desktop: Sidebar (4 cols) | Mobile: Hidden */}
            {!isMobileView && (
              <div className="lg:col-span-4">
                <OnboardingProgress />
              </div>
            )}
          </div>

          {/* Desktop: Training Modules Section */}
          {!isMobileView && (
            <div className="mt-12">
              <TrainingModules />
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className="mt-12 bg-card rounded-lg border border-border shadow-soft p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/onboarding-checklist')}
                iconName="CheckSquare"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                View Checklist
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/meeting-scheduler')}
                iconName="Calendar"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Schedule Meeting
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/feedback-collection')}
                iconName="MessageSquare"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Give Feedback
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log('Contact support')}
                iconName="HelpCircle"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;