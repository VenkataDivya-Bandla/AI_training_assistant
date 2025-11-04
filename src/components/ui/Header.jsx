import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user = null, isCollapsed = false, onToggleSidebar = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: user?.role === 'hr_admin' ? '/hr-admin-dashboard' : '/employee-dashboard',
      icon: 'LayoutDashboard',
      roles: ['employee', 'hr_admin', 'manager']
    },
    { 
      label: 'My Progress', 
      path: '/onboarding-checklist',
      icon: 'CheckSquare',
      roles: ['employee']
    },
    { 
      label: 'Schedule', 
      path: '/meeting-scheduler',
      icon: 'Calendar',
      roles: ['employee', 'hr_admin', 'manager']
    },
    { 
      label: 'Feedback', 
      path: '/feedback-collection',
      icon: 'MessageSquare',
      roles: ['employee', 'hr_admin', 'manager']
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Welcome to AI Training Assistant',
      message: 'Complete your profile setup to get started',
      time: '2 hours ago',
      type: 'info',
      unread: true
    },
    {
      id: 2,
      title: 'Meeting Reminder',
      message: 'Your onboarding session starts in 30 minutes',
      time: '30 minutes ago',
      type: 'warning',
      unread: true
    },
    {
      id: 3,
      title: 'Task Completed',
      message: 'You have successfully completed the security training',
      time: '1 day ago',
      type: 'success',
      unread: false
    }
  ];

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  const filteredNavItems = navigationItems?.filter(item => 
    !user?.role || item?.roles?.includes(user?.role)
  );

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    setIsProfileOpen(false);
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    setIsNotificationOpen(false);
  };

  const markAllAsRead = () => {
    console.log('Mark all notifications as read');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location?.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              <Icon name="Menu" size={20} />
            </Button>
          )}
          
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation(user?.role === 'hr_admin' ? '/hr-admin-dashboard' : '/employee-dashboard')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Bot" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">AI Training Assistant</h1>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {filteredNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActive(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="px-4"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-1010">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-popover-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div
                      key={notification?.id}
                      className={`p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted transition-smooth ${
                        notification?.unread ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification?.type === 'success' ? 'bg-success' :
                          notification?.type === 'warning' ? 'bg-warning' :
                          notification?.type === 'error' ? 'bg-error' : 'bg-primary'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-popover-foreground">
                            {notification?.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification?.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification?.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role?.replace('_', ' ') || 'Employee'}
                </p>
              </div>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevated z-1010">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-popover-foreground">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || 'user@company.com'}
                  </p>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('Profile settings clicked');
                      setIsProfileOpen(false);
                    }}
                    iconName="Settings"
                    iconPosition="left"
                    iconSize={16}
                    className="w-full justify-start"
                  >
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log('Help clicked');
                      setIsProfileOpen(false);
                    }}
                    iconName="HelpCircle"
                    iconPosition="left"
                    iconSize={16}
                    className="w-full justify-start"
                  >
                    Help & Support
                  </Button>
                  <div className="border-t border-border my-2" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    iconName="LogOut"
                    iconPosition="left"
                    iconSize={16}
                    className="w-full justify-start text-error hover:text-error"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="p-4 space-y-2">
            {filteredNavItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActive(item?.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                className="w-full justify-start"
              >
                {item?.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;