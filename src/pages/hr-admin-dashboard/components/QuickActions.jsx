import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'add_employee',
      title: 'Add New Employee',
      description: 'Register a new employee for onboarding',
      icon: 'UserPlus',
      color: 'primary'
    },
    {
      id: 'manage_content',
      title: 'Manage Content',
      description: 'Update training materials and resources',
      icon: 'FileText',
      color: 'secondary'
    },
    {
      id: 'send_announcement',
      title: 'Send Announcement',
      description: 'Broadcast message to all employees',
      icon: 'Megaphone',
      color: 'warning'
    },
    {
      id: 'generate_report',
      title: 'Generate Report',
      description: 'Create comprehensive progress reports',
      icon: 'BarChart3',
      color: 'success'
    },
    {
      id: 'manage_mentors',
      title: 'Manage Mentors',
      description: 'Assign and manage mentor relationships',
      icon: 'Users',
      color: 'accent'
    },
    {
      id: 'system_settings',
      title: 'System Settings',
      description: 'Configure application settings',
      icon: 'Settings',
      color: 'secondary'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20 hover:bg-error/20';
      case 'accent':
        return 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
      <div className="space-y-4">
        {actions?.map((action) => (
          <div
            key={action?.id}
            className={`border rounded-lg p-4 cursor-pointer transition-smooth ${getColorClasses(action?.color)}`}
            onClick={() => onAction(action?.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{action?.title}</h4>
                <p className="text-xs opacity-80">{action?.description}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="opacity-60" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="font-medium text-foreground mb-4">Recent Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-muted-foreground">Sarah Johnson completed IT setup</span>
            <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-warning rounded-full" />
            <span className="text-muted-foreground">Mike Chen needs mentor assignment</span>
            <span className="text-xs text-muted-foreground ml-auto">15 min ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-muted-foreground">New training module uploaded</span>
            <span className="text-xs text-muted-foreground ml-auto">1 hour ago</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('view_all_activity')}
          className="w-full mt-4"
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
        >
          View All Activity
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;