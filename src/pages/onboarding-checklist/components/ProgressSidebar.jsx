import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressSidebar = ({ 
  overallProgress, 
  upcomingDeadlines, 
  quickActions, 
  onOpenChat,
  onOpenTraining 
}) => {
  const progressColor = overallProgress?.percentage >= 75 ? 'text-success' : 
                       overallProgress?.percentage >= 50 ? 'text-primary' : 
                       overallProgress?.percentage >= 25 ? 'text-warning' : 'text-error';

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Overall Progress</h3>
          <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
        </div>
        
        {/* Progress Circle */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${overallProgress?.percentage * 2.51} 251`}
                className={`${progressColor} transition-all duration-1000`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${progressColor}`}>
                {overallProgress?.percentage}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completed Tasks:</span>
            <span className="font-medium text-foreground">
              {overallProgress?.completedTasks}/{overallProgress?.totalTasks}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Days Remaining:</span>
            <span className="font-medium text-foreground">{overallProgress?.daysRemaining}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Phase:</span>
            <span className="font-medium text-foreground">{overallProgress?.currentPhase}</span>
          </div>
        </div>
        
        <Button
          variant="default"
          size="sm"
          fullWidth
          iconName="MessageSquare"
          iconPosition="left"
          iconSize={16}
          onClick={() => onOpenChat({ title: 'Progress Review', type: 'progress' })}
          className="mt-4"
        >
          Discuss Progress
        </Button>
      </div>
      {/* Upcoming Deadlines */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h3>
          <Icon name="AlertCircle" size={20} className="text-warning" />
        </div>
        
        <div className="space-y-3">
          {upcomingDeadlines?.map((deadline) => (
            <div key={deadline?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                deadline?.urgency === 'high' ? 'bg-error' :
                deadline?.urgency === 'medium' ? 'bg-warning' : 'bg-primary'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{deadline?.task}</p>
                <p className="text-xs text-muted-foreground">{deadline?.phase}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name="Clock" size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{deadline?.timeLeft}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="Calendar"
          iconPosition="left"
          iconSize={16}
          onClick={() => console.log('View all deadlines')}
          className="mt-4"
        >
          View All Deadlines
        </Button>
      </div>
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <Icon name="Zap" size={20} className="text-primary" />
        </div>
        
        <div className="space-y-2">
          {quickActions?.map((action) => (
            <Button
              key={action?.id}
              variant="ghost"
              size="sm"
              fullWidth
              iconName={action?.icon}
              iconPosition="left"
              iconSize={16}
              onClick={() => {
                if (action?.type === 'chat') {
                  onOpenChat(action);
                } else if (action?.type === 'training') {
                  onOpenTraining(action);
                } else {
                  console.log('Quick action:', action?.id);
                }
              }}
              className="justify-start"
            >
              {action?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Training Resources */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Training Materials</h3>
          <Icon name="BookOpen" size={20} className="text-accent" />
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Play" size={16} className="text-accent" />
              <span className="font-medium text-sm text-foreground">Git Fundamentals</span>
            </div>
            <p className="text-xs text-muted-foreground">Interactive video course • 45 min</p>
            <Button
              variant="ghost"
              size="sm"
              iconName="ExternalLink"
              iconPosition="right"
              iconSize={12}
              onClick={() => onOpenTraining({ type: 'video', title: 'Git Fundamentals' })}
              className="mt-2 text-xs"
            >
              Start Learning
            </Button>
          </div>
          
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="FileText" size={16} className="text-primary" />
              <span className="font-medium text-sm text-foreground">Company Handbook</span>
            </div>
            <p className="text-xs text-muted-foreground">PDF document • 120 pages</p>
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="right"
              iconSize={12}
              onClick={() => console.log('Download handbook')}
              className="mt-2 text-xs"
            >
              Download PDF
            </Button>
          </div>
          
          <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={16} className="text-warning" />
              <span className="font-medium text-sm text-foreground">Slack Best Practices</span>
            </div>
            <p className="text-xs text-muted-foreground">Interactive guide • 20 min</p>
            <Button
              variant="ghost"
              size="sm"
              iconName="ExternalLink"
              iconPosition="right"
              iconSize={12}
              onClick={() => onOpenTraining({ type: 'guide', title: 'Slack Best Practices' })}
              className="mt-2 text-xs"
            >
              Open Guide
            </Button>
          </div>
        </div>
      </div>
      {/* AI Assistant Quick Access */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 shadow-soft">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Bot" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Get instant help</p>
          </div>
        </div>
        
        <Button
          variant="default"
          size="sm"
          fullWidth
          iconName="MessageCircle"
          iconPosition="left"
          iconSize={16}
          onClick={() => onOpenChat({ title: 'General Help', type: 'general' })}
        >
          Start Conversation
        </Button>
      </div>
    </div>
  );
};

export default ProgressSidebar;