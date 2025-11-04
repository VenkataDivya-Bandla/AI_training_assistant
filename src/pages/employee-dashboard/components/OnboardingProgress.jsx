import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OnboardingProgress = () => {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);

  const progressData = {
    overall: 68,
    completedTasks: 17,
    totalTasks: 25,
    daysRemaining: 23
  };

  const upcomingTasks = [
    {
      id: 1,
      title: "Complete Security Training",
      description: "Mandatory cybersecurity awareness course",
      priority: "high",
      dueDate: "2025-08-15",
      estimatedTime: "45 min",
      category: "training",
      icon: "Shield"
    },
    {
      id: 2,
      title: "Set up Development Environment",
      description: "Install required tools and configure workspace",
      priority: "medium",
      dueDate: "2025-08-16",
      estimatedTime: "2 hours",
      category: "setup",
      icon: "Code"
    },
    {
      id: 3,
      title: "Meet with Team Lead",
      description: "Introduction meeting and role expectations",
      priority: "high",
      dueDate: "2025-08-14",
      estimatedTime: "30 min",
      category: "meeting",
      icon: "Users"
    },
    {
      id: 4,
      title: "Review Company Handbook",
      description: "Read through policies and procedures",
      priority: "low",
      dueDate: "2025-08-18",
      estimatedTime: "1 hour",
      category: "documentation",
      icon: "BookOpen"
    }
  ];

  const recentCompletions = [
    {
      id: 1,
      title: "HR Orientation",
      completedAt: "2025-08-12",
      category: "orientation"
    },
    {
      id: 2,
      title: "IT Account Setup",
      completedAt: "2025-08-11",
      category: "setup"
    },
    {
      id: 3,
      title: "Office Tour",
      completedAt: "2025-08-10",
      category: "orientation"
    }
  ];

  const handleTaskClick = (task) => {
    if (task?.category === 'meeting') {
      navigate('/meeting-scheduler');
    } else {
      navigate('/onboarding-checklist');
    }
  };

  const handleCompleteTask = (taskId) => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
    // Task completion logic would go here
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10';
      case 'medium': return 'bg-warning/10';
      case 'low': return 'bg-muted/50';
      default: return 'bg-muted/50';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
      {/* Progress Overview */}
      <div className="bg-card rounded-lg border border-border shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Onboarding Progress</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/onboarding-checklist')}
            iconName="ExternalLink"
            iconPosition="right"
            iconSize={14}
          >
            View All
          </Button>
        </div>

        {/* Progress Circle */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted stroke-current"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary stroke-current"
                strokeWidth="3"
                strokeDasharray={`${progressData?.overall}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-foreground">{progressData?.overall}%</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-lg font-semibold text-foreground">
                  {progressData?.completedTasks}/{progressData?.totalTasks}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Left</p>
                <p className="text-lg font-semibold text-foreground">{progressData?.daysRemaining}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressData?.overall}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Great progress! You're {progressData?.overall}% through your onboarding journey.
        </p>
      </div>
      {/* Upcoming Tasks */}
      <div className="bg-card rounded-lg border border-border shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Tasks</h3>
          <span className="text-sm text-muted-foreground">{upcomingTasks?.length} pending</span>
        </div>

        <div className="space-y-3">
          {upcomingTasks?.slice(0, 4)?.map((task) => (
            <div
              key={task?.id}
              className="flex items-center space-x-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityBg(task?.priority)}`}>
                <Icon name={task?.icon} size={18} className={getPriorityColor(task?.priority)} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground text-sm truncate">{task?.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBg(task?.priority)} ${getPriorityColor(task?.priority)}`}>
                    {task?.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{task?.description}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Icon name="Clock" size={12} className="mr-1" />
                    {task?.estimatedTime}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Icon name="Calendar" size={12} className="mr-1" />
                    {formatDate(task?.dueDate)}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e?.stopPropagation();
                  handleCompleteTask(task?.id);
                }}
                className="h-8 w-8"
              >
                <Icon name="Check" size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Completions */}
      <div className="bg-card rounded-lg border border-border shadow-soft p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recently Completed</h3>
        
        <div className="space-y-3">
          {recentCompletions?.map((completion) => (
            <div key={completion?.id} className="flex items-center space-x-3 p-2 rounded-lg">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={16} className="text-success" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{completion?.title}</p>
                <p className="text-xs text-muted-foreground">
                  Completed on {new Date(completion.completedAt)?.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border shadow-soft p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/onboarding-checklist')}
            iconName="CheckSquare"
            iconPosition="left"
            iconSize={16}
            className="justify-start"
          >
            View Full Checklist
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
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgress;