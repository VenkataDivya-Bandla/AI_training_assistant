import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CredentialsHelper = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const demoCredentials = [
    {
      role: 'Employee',
      email: 'employee@company.com',
      password: 'employee123',
      description: 'New employee onboarding experience'
    },
    {
      role: 'HR Admin',
      email: 'hr@company.com',
      password: 'hr123',
      description: 'HR dashboard and admin features'
    },
    {
      role: 'Manager',
      email: 'manager@company.com',
      password: 'manager123',
      description: 'Team management and oversight'
    }
  ];

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        iconSize={16}
        className="w-full text-muted-foreground hover:text-foreground"
      >
        Demo Credentials
      </Button>
      {isExpanded && (
        <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
          <p className="text-xs text-muted-foreground mb-3">
            Use these credentials to explore different user roles:
          </p>
          <div className="space-y-3">
            {demoCredentials?.map((cred, index) => (
              <div key={index} className="bg-card rounded-md p-3 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {cred?.role}
                  </span>
                  <Icon name="User" size={14} className="text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Email: <span className="font-mono text-foreground">{cred?.email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Password: <span className="font-mono text-foreground">{cred?.password}</span>
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {cred?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;