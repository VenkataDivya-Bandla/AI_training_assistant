import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ items = [], className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeMap = {
    '/employee-dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/hr-admin-dashboard': { label: 'HR Dashboard', icon: 'LayoutDashboard' },
    '/onboarding-checklist': { label: 'My Progress', icon: 'CheckSquare' },
    '/meeting-scheduler': { label: 'Schedule', icon: 'Calendar' },
    '/feedback-collection': { label: 'Feedback', icon: 'MessageSquare' },
    '/login': { label: 'Login', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    if (items && items?.length > 0) {
      return items;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [];

    if (pathSegments?.length === 0) {
      return [{ label: 'Dashboard', path: '/employee-dashboard', icon: 'LayoutDashboard' }];
    }

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const routeInfo = routeMap?.[currentPath];
      
      if (routeInfo) {
        breadcrumbs?.push({
          label: routeInfo?.label,
          path: currentPath,
          icon: routeInfo?.icon,
          isLast: index === pathSegments?.length - 1
        });
      }
    });

    if (breadcrumbs?.length === 0) {
      breadcrumbs?.push({
        label: 'Dashboard',
        path: '/employee-dashboard',
        icon: 'LayoutDashboard',
        isLast: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleNavigation = (path) => {
    if (path && path !== location?.pathname) {
      navigate(path);
    }
  };

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground mx-2" 
              />
            )}
            
            {crumb?.isLast ? (
              <span className="flex items-center space-x-2 text-foreground font-medium">
                {crumb?.icon && (
                  <Icon name={crumb?.icon} size={16} className="text-muted-foreground" />
                )}
                <span>{crumb?.label}</span>
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(crumb?.path)}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground px-2 py-1 h-auto"
              >
                {crumb?.icon && (
                  <Icon name={crumb?.icon} size={16} />
                )}
                <span>{crumb?.label}</span>
              </Button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;