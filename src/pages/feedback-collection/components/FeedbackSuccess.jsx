import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeedbackSuccess = ({ feedbackData, onNewFeedback, onViewDashboard }) => {
  const getTypeConfig = () => {
    switch (feedbackData?.type) {
      case 'pulse':
        return {
          icon: 'Zap',
          title: 'Quick Pulse Submitted',
          description: 'Your instant feedback has been recorded',
          color: 'text-blue-600'
        };
      case 'detailed':
        return {
          icon: 'FileText',
          title: 'Detailed Survey Completed',
          description: 'Thank you for completing the comprehensive survey',
          color: 'text-green-600'
        };
      case 'opentext':
        return {
          icon: 'MessageSquare',
          title: 'Feedback Submitted',
          description: 'Your detailed thoughts have been shared with the team',
          color: 'text-purple-600'
        };
      default:
        return {
          icon: 'Check',
          title: 'Feedback Submitted',
          description: 'Thank you for your feedback',
          color: 'text-primary'
        };
    }
  };

  const config = getTypeConfig();

  const achievements = [
    {
      id: 'feedback-contributor',
      title: 'Feedback Contributor',
      description: 'Shared valuable insights',
      icon: 'Award',
      earned: true
    },
    {
      id: 'engagement-champion',
      title: 'Engagement Champion',
      description: 'Complete 5 feedback sessions',
      icon: 'Trophy',
      earned: false,
      progress: '3/5'
    },
    {
      id: 'improvement-advocate',
      title: 'Improvement Advocate',
      description: 'Provide detailed suggestions',
      icon: 'Star',
      earned: feedbackData?.type === 'opentext'
    }
  ];

  const nextSteps = [
    {
      title: 'Review Response',
      description: 'HR team will review your feedback within 2-3 business days',
      icon: 'Eye',
      timeline: '2-3 days'
    },
    {
      title: 'Follow-up',
      description: 'You may receive follow-up questions for clarification',
      icon: 'MessageCircle',
      timeline: '1 week'
    },
    {
      title: 'Implementation',
      description: 'Actionable feedback will be incorporated into improvements',
      icon: 'Settings',
      timeline: '2-4 weeks'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle" size={40} className="text-success" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Thank You!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your feedback is invaluable in helping us create a better onboarding experience for everyone.
        </p>
      </div>
      {/* Feedback Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-lg bg-white border-2 border-current flex items-center justify-center ${config?.color}`}>
            <Icon name={config?.icon} size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {config?.title}
            </h3>
            <p className="text-muted-foreground">
              {config?.description}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {new Date(feedbackData.timestamp)?.toLocaleDateString()}
            </div>
            <div className="text-sm text-muted-foreground">Submitted Date</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              #{Math.floor(Math.random() * 10000)?.toString()?.padStart(4, '0')}
            </div>
            <div className="text-sm text-muted-foreground">Reference ID</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {feedbackData?.type === 'pulse' ? '2 min' : 
               feedbackData?.type === 'detailed' ? '8 min' : '5 min'}
            </div>
            <div className="text-sm text-muted-foreground">Time Invested</div>
          </div>
        </div>
      </div>
      {/* Achievements */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Award" size={20} className="text-primary" />
          <span>Achievements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements?.map((achievement) => (
            <div
              key={achievement?.id}
              className={`p-4 rounded-lg border-2 ${
                achievement?.earned
                  ? 'border-success bg-success/5' :'border-border bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon 
                  name={achievement?.icon} 
                  size={20} 
                  className={achievement?.earned ? 'text-success' : 'text-muted-foreground'}
                />
                <span className={`font-medium ${
                  achievement?.earned ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {achievement?.title}
                </span>
                {achievement?.earned && (
                  <Icon name="Check" size={16} className="text-success" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {achievement?.description}
              </p>
              {achievement?.progress && (
                <p className="text-xs text-muted-foreground mt-1">
                  Progress: {achievement?.progress}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Next Steps */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Clock" size={20} className="text-primary" />
          <span>What Happens Next?</span>
        </h3>
        <div className="space-y-4">
          {nextSteps?.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name={step?.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">{step?.title}</h4>
                  <span className="text-sm text-muted-foreground">{step?.timeline}</span>
                </div>
                <p className="text-sm text-muted-foreground">{step?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button 
          variant="outline" 
          onClick={onNewFeedback}
          iconName="Plus"
          iconPosition="left"
          className="sm:w-auto"
        >
          Submit More Feedback
        </Button>
        <Button 
          variant="default" 
          onClick={onViewDashboard}
          iconName="LayoutDashboard"
          iconPosition="left"
          className="sm:w-auto"
        >
          Back to Dashboard
        </Button>
      </div>
      {/* Contact Support */}
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground mb-2">
          Have questions about your feedback or need immediate assistance?
        </p>
        <Button 
          variant="ghost" 
          size="sm"
          iconName="HelpCircle"
          iconPosition="left"
        >
          Contact HR Support
        </Button>
      </div>
    </div>
  );
};

export default FeedbackSuccess;