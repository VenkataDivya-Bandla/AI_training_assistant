import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = ({ notifications, onMarkAsRead, onDismiss }) => {
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications?.length },
    { value: 'urgent', label: 'Urgent', count: notifications?.filter(n => n?.priority === 'urgent')?.length },
    { value: 'overdue', label: 'Overdue', count: notifications?.filter(n => n?.type === 'overdue')?.length },
    { value: 'system', label: 'System', count: notifications?.filter(n => n?.type === 'system')?.length }
  ];

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return notification?.priority === 'urgent';
    return notification?.type === filter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'overdue':
        return 'AlertTriangle';
      case 'system':
        return 'Settings';
      case 'completion':
        return 'CheckCircle';
      case 'attention':
        return 'AlertCircle';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (priority, type) => {
    if (priority === 'urgent') return 'text-error';
    switch (type) {
      case 'overdue':
        return 'text-warning';
      case 'completion':
        return 'text-success';
      case 'system':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getBadgeColor = (priority, type) => {
    if (priority === 'urgent') return 'bg-error/10 text-error border-error/20';
    switch (type) {
      case 'overdue':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'completion':
        return 'bg-success/10 text-success border-success/20';
      case 'system':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead('all')}
            iconName="Check"
            iconPosition="left"
            iconSize={16}
          >
            Mark All Read
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                filter === option?.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option?.label}
              {option?.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === option?.value ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
                }`}>
                  {option?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifications?.map((notification) => (
              <div
                key={notification?.id}
                className={`p-4 hover:bg-muted/30 transition-smooth ${
                  !notification?.read ? 'bg-muted/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 ${getNotificationColor(notification?.priority, notification?.type)}`}>
                    <Icon name={getNotificationIcon(notification?.type)} size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground mb-1">
                          {notification?.title}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification?.message}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(notification?.priority, notification?.type)}`}>
                            {notification?.priority === 'urgent' ? 'Urgent' : notification?.type?.charAt(0)?.toUpperCase() + notification?.type?.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {notification?.timestamp}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification?.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification?.id)}
                            iconName="Check"
                            iconSize={14}
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismiss(notification?.id)}
                          iconName="X"
                          iconSize={14}
                        />
                      </div>
                    </div>
                    
                    {notification?.actionRequired && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log('Action clicked for', notification?.id)}
                          iconName="ArrowRight"
                          iconPosition="right"
                          iconSize={14}
                        >
                          {notification?.actionText || 'Take Action'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;