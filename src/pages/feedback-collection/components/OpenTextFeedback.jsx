import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OpenTextFeedback = ({ onSubmit, onBack, onSaveDraft }) => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    feedback: '',
    priority: 'medium',
    anonymous: false
  });
  const [charCount, setCharCount] = useState(0);
  const [sentiment, setSentiment] = useState('neutral');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categoryOptions = [
    { value: 'onboarding', label: 'Onboarding Process' },
    { value: 'training', label: 'Training Materials' },
    { value: 'tools', label: 'Tools & Technology' },
    { value: 'team', label: 'Team Integration' },
    { value: 'culture', label: 'Company Culture' },
    { value: 'communication', label: 'Communication' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const minChars = 50;
  const maxChars = 1000;

  // Mock sentiment analysis
  const analyzeSentiment = (text) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'helpful', 'love', 'perfect', 'wonderful'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'disappointing', 'frustrating'];
      
      const words = text?.toLowerCase()?.split(' ');
      const positiveCount = words?.filter(word => positiveWords?.some(pos => word?.includes(pos)))?.length;
      const negativeCount = words?.filter(word => negativeWords?.some(neg => word?.includes(neg)))?.length;
      
      if (positiveCount > negativeCount) {
        setSentiment('positive');
      } else if (negativeCount > positiveCount) {
        setSentiment('negative');
      } else {
        setSentiment('neutral');
      }
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'feedback') {
      setCharCount(value?.length);
      if (value?.length > 20) {
        analyzeSentiment(value);
      }
    }
  };

  const handleSubmit = () => {
    const feedbackData = {
      type: 'opentext',
      ...formData,
      sentiment,
      charCount,
      timestamp: new Date()?.toISOString(),
      completedAt: new Date()
    };
    onSubmit(feedbackData);
  };

  const handleSaveDraft = () => {
    const draftData = {
      type: 'opentext',
      ...formData,
      savedAt: new Date()?.toISOString()
    };
    onSaveDraft(draftData);
  };

  const isValid = formData?.category && formData?.subject && formData?.feedback?.length >= minChars;
  const progress = Math.min((charCount / minChars) * 100, 100);

  const getSentimentConfig = () => {
    switch (sentiment) {
      case 'positive':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: 'Smile', label: 'Positive' };
      case 'negative':
        return { color: 'text-red-600', bg: 'bg-red-50', icon: 'Frown', label: 'Negative' };
      default:
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'Meh', label: 'Neutral' };
    }
  };

  const sentimentConfig = getSentimentConfig();

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="MessageSquare" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Share Your Detailed Feedback
          </h2>
        </div>
        <p className="text-muted-foreground">
          Help us improve by sharing your thoughts, suggestions, and experiences in detail.
        </p>
      </div>
      {/* Form Fields */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        {/* Category and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Category"
            placeholder="Select feedback category"
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            required
          />
          
          <Select
            label="Priority Level"
            placeholder="Select priority"
            options={priorityOptions}
            value={formData?.priority}
            onChange={(value) => handleInputChange('priority', value)}
          />
        </div>

        {/* Subject */}
        <Input
          label="Subject"
          type="text"
          placeholder="Brief summary of your feedback"
          value={formData?.subject}
          onChange={(e) => handleInputChange('subject', e?.target?.value)}
          required
        />

        {/* Feedback Text */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Detailed Feedback *
          </label>
          <textarea
            className="w-full min-h-[200px] p-4 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
            placeholder="Share your detailed thoughts, experiences, and suggestions..."
            value={formData?.feedback}
            onChange={(e) => handleInputChange('feedback', e?.target?.value)}
            maxLength={maxChars}
          />
          
          {/* Character Counter and Progress */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${
                charCount >= minChars ? 'text-success' : 'text-muted-foreground'
              }`}>
                {charCount}/{maxChars} characters
              </span>
              {charCount < minChars && (
                <span className="text-sm text-muted-foreground">
                  ({minChars - charCount} more needed)
                </span>
              )}
            </div>
            
            {/* Sentiment Analysis */}
            {charCount > 20 && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${sentimentConfig?.bg}`}>
                {isAnalyzing ? (
                  <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
                ) : (
                  <Icon name={sentimentConfig?.icon} size={16} className={sentimentConfig?.color} />
                )}
                <span className={`text-sm font-medium ${sentimentConfig?.color}`}>
                  {isAnalyzing ? 'Analyzing...' : sentimentConfig?.label}
                </span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {charCount > 0 && (
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress >= 100 ? 'bg-success' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData?.anonymous}
            onChange={(e) => handleInputChange('anonymous', e?.target?.checked)}
            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
          />
          <label htmlFor="anonymous" className="flex items-center space-x-2 text-sm text-foreground cursor-pointer">
            <Icon name="EyeOff" size={16} className="text-muted-foreground" />
            <span>Submit anonymously (your identity will not be shared)</span>
          </label>
        </div>
      </div>
      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Tips for effective feedback:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about what worked well or needs improvement</li>
              <li>• Include examples when possible</li>
              <li>• Suggest actionable solutions</li>
              <li>• Focus on the experience rather than individuals</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back to Types
        </Button>
        
        <div className="flex space-x-3">
          <Button 
            variant="ghost" 
            onClick={handleSaveDraft}
            iconName="Save"
            iconPosition="left"
            disabled={!formData?.feedback}
          >
            Save Draft
          </Button>
          
          <Button 
            variant="default" 
            onClick={handleSubmit}
            disabled={!isValid}
            iconName="Send"
            iconPosition="right"
          >
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpenTextFeedback;