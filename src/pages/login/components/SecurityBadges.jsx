import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      text: 'SSL Encrypted',
      description: '256-bit encryption'
    },
    {
      icon: 'Lock',
      text: 'SOC 2 Compliant',
      description: 'Enterprise security'
    },
    {
      icon: 'CheckCircle',
      text: 'GDPR Compliant',
      description: 'Data protection'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <p className="text-xs text-muted-foreground text-center mb-4">
        Enterprise-grade security & compliance
      </p>
      <div className="flex items-center justify-center space-x-6">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-1">
              <Icon 
                name={feature?.icon} 
                size={14} 
                className="text-success" 
              />
              <span className="text-xs font-medium text-foreground">
                {feature?.text}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {feature?.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;