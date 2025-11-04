import React from 'react';
import Icon from '../../../components/AppIcon';


const FeedbackTypeCard = ({ type, isSelected, onSelect, disabled = false }) => {
  const typeConfig = {
    pulse: {
      icon: 'Zap',
      title: 'Quick Pulse',
      description: 'Share your instant thoughts with emoji reactions',
      color: 'bg-blue-50 border-blue-200',
      selectedColor: 'bg-blue-100 border-blue-400',
      iconColor: 'text-blue-600'
    },
    detailed: {
      icon: 'FileText',
      title: 'Detailed Survey',
      description: 'Complete comprehensive questionnaire with ratings',
      color: 'bg-green-50 border-green-200',
      selectedColor: 'bg-green-100 border-green-400',
      iconColor: 'text-green-600'
    },
    opentext: {
      icon: 'MessageSquare',
      title: 'Open Feedback',
      description: 'Write detailed thoughts and suggestions',
      color: 'bg-purple-50 border-purple-200',
      selectedColor: 'bg-purple-100 border-purple-400',
      iconColor: 'text-purple-600'
    }
  };

  const config = typeConfig?.[type];

  return (
    <div
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected ? config?.selectedColor : config?.color
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
      onClick={() => !disabled && onSelect(type)}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center ${config?.iconColor}`}>
          <Icon name={config?.icon} size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {config?.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {config?.description}
          </p>
        </div>
        {isSelected && (
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackTypeCard;