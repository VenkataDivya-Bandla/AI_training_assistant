import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PulseFeedback = ({ onSubmit, onBack }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedAspects, setSelectedAspects] = useState([]);

  const moodOptions = [
    { value: 'very-happy', emoji: '😄', label: 'Excellent', color: 'text-green-600' },
    { value: 'happy', emoji: '😊', label: 'Good', color: 'text-green-500' },
    { value: 'neutral', emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
    { value: 'sad', emoji: '😔', label: 'Poor', color: 'text-orange-500' },
    { value: 'very-sad', emoji: '😞', label: 'Terrible', color: 'text-red-500' }
  ];

  const aspectOptions = [
    { id: 'onboarding-process', label: 'Onboarding Process', icon: 'UserCheck' },
    { id: 'training-materials', label: 'Training Materials', icon: 'BookOpen' },
    { id: 'mentor-support', label: 'Mentor Support', icon: 'Users' },
    { id: 'tools-setup', label: 'Tools & Setup', icon: 'Settings' },
    { id: 'team-integration', label: 'Team Integration', icon: 'Heart' },
    { id: 'communication', label: 'Communication', icon: 'MessageCircle' }
  ];

  const handleAspectToggle = (aspectId) => {
    setSelectedAspects(prev => 
      prev?.includes(aspectId) 
        ? prev?.filter(id => id !== aspectId)
        : [...prev, aspectId]
    );
  };

  const handleSubmit = () => {
    const feedbackData = {
      type: 'pulse',
      mood: selectedMood,
      aspects: selectedAspects,
      timestamp: new Date()?.toISOString(),
      completedAt: new Date()
    };
    onSubmit(feedbackData);
  };

  const isValid = selectedMood && selectedAspects?.length > 0;

  return (
    <div className="space-y-8">
      {/* Mood Selection */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          How are you feeling about your onboarding experience?
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {moodOptions?.map((mood) => (
            <button
              key={mood?.value}
              onClick={() => setSelectedMood(mood?.value)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedMood === mood?.value
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <div className="text-4xl mb-2">{mood?.emoji}</div>
              <div className={`text-sm font-medium ${
                selectedMood === mood?.value ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {mood?.label}
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Aspect Selection */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Which aspects would you like to comment on? (Select all that apply)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aspectOptions?.map((aspect) => (
            <button
              key={aspect?.id}
              onClick={() => handleAspectToggle(aspect?.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                selectedAspects?.includes(aspect?.id)
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <Icon 
                name={aspect?.icon} 
                size={20} 
                className={selectedAspects?.includes(aspect?.id) ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className={`font-medium ${
                selectedAspects?.includes(aspect?.id) ? 'text-primary' : 'text-foreground'
              }`}>
                {aspect?.label}
              </span>
              {selectedAspects?.includes(aspect?.id) && (
                <Icon name="Check" size={16} className="text-primary ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Progress Indicator */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">
            {isValid ? '100%' : `${Math.round(((selectedMood ? 1 : 0) + (selectedAspects?.length > 0 ? 1 : 0)) / 2 * 100)}%`}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${isValid ? 100 : Math.round(((selectedMood ? 1 : 0) + (selectedAspects?.length > 0 ? 1 : 0)) / 2 * 100)}%` 
            }}
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
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
  );
};

export default PulseFeedback;