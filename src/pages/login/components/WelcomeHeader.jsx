import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Company Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-soft">
          <Icon name="Bot" size={32} color="white" />
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome to AI Training Assistant
        </h1>
        <p className="text-muted-foreground">
          Sign in to access your personalized onboarding experience
        </p>
      </div>
    </div>
  );
};

export default WelcomeHeader;