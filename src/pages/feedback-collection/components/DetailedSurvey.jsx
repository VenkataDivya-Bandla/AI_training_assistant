import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DetailedSurvey = ({ onSubmit, onBack, onSaveDraft }) => {
  const [responses, setResponses] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  const surveyQuestions = [
    {
      section: 'Onboarding Process',
      icon: 'UserCheck',
      questions: [
        {
          id: 'onboarding-clarity',
          type: 'rating',
          question: 'How clear was the onboarding process?',
          scale: 5
        },
        {
          id: 'onboarding-pace',
          type: 'rating',
          question: 'Was the onboarding pace appropriate?',
          scale: 5
        },
        {
          id: 'onboarding-support',
          type: 'text',
          question: 'What could be improved in the onboarding process?',
          placeholder: 'Share your suggestions...'
        }
      ]
    },
    {
      section: 'Training & Resources',
      icon: 'BookOpen',
      questions: [
        {
          id: 'training-quality',
          type: 'rating',
          question: 'How would you rate the quality of training materials?',
          scale: 5
        },
        {
          id: 'resource-accessibility',
          type: 'rating',
          question: 'How easy was it to find the resources you needed?',
          scale: 5
        },
        {
          id: 'training-feedback',
          type: 'text',
          question: 'Which training resources were most helpful?',
          placeholder: 'Describe the most valuable resources...'
        }
      ]
    },
    {
      section: 'Team & Culture',
      icon: 'Users',
      questions: [
        {
          id: 'team-welcome',
          type: 'rating',
          question: 'How welcomed did you feel by your team?',
          scale: 5
        },
        {
          id: 'culture-fit',
          type: 'rating',
          question: 'How well do you feel you fit with the company culture?',
          scale: 5
        },
        {
          id: 'culture-feedback',
          type: 'text',
          question: 'What aspects of the culture stood out to you?',
          placeholder: 'Share your observations...'
        }
      ]
    }
  ];

  const currentSectionData = surveyQuestions?.[currentSection];
  const totalSections = surveyQuestions?.length;
  const progress = ((currentSection + 1) / totalSections) * 100;

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const feedbackData = {
      type: 'detailed',
      responses,
      completedSections: totalSections,
      timestamp: new Date()?.toISOString(),
      completedAt: new Date()
    };
    onSubmit(feedbackData);
  };

  const handleSaveDraft = () => {
    const draftData = {
      type: 'detailed',
      responses,
      currentSection,
      savedAt: new Date()?.toISOString()
    };
    onSaveDraft(draftData);
  };

  const isLastSection = currentSection === totalSections - 1;
  const sectionResponses = currentSectionData?.questions?.filter(q => responses?.[q?.id]);
  const sectionComplete = sectionResponses?.length === currentSectionData?.questions?.length;

  const RatingInput = ({ question, value, onChange }) => (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
      <div className="flex justify-between">
        {[1, 2, 3, 4, 5]?.map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
              value === rating
                ? 'border-primary bg-primary text-white' :'border-border bg-card hover:border-primary/50'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name={currentSectionData?.icon} size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              {currentSectionData?.section}
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">
            Section {currentSection + 1} of {totalSections}
          </span>
        </div>
        
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Progress: {Math.round(progress)}%</span>
          <span>Est. time: {(totalSections - currentSection) * 2} min</span>
        </div>
      </div>
      {/* Questions */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-8">
        {currentSectionData?.questions?.map((question, index) => (
          <div key={question?.id} className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-medium text-primary">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  {question?.question}
                </h3>
                
                {question?.type === 'rating' ? (
                  <RatingInput
                    question={question}
                    value={responses?.[question?.id]}
                    onChange={(value) => handleResponseChange(question?.id, value)}
                  />
                ) : (
                  <Input
                    type="text"
                    placeholder={question?.placeholder}
                    value={responses?.[question?.id] || ''}
                    onChange={(e) => handleResponseChange(question?.id, e?.target?.value)}
                    className="min-h-[100px]"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Section Progress */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Section Progress: {sectionResponses?.length}/{currentSectionData?.questions?.length} completed
          </span>
          {sectionComplete && (
            <div className="flex items-center space-x-2 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">Section Complete</span>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack}>
            Back to Types
          </Button>
          {currentSection > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous Section
            </Button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="ghost" 
            onClick={handleSaveDraft}
            iconName="Save"
            iconPosition="left"
          >
            Save Draft
          </Button>
          
          {isLastSection ? (
            <Button 
              variant="default" 
              onClick={handleSubmit}
              disabled={!sectionComplete}
              iconName="Send"
              iconPosition="right"
            >
              Submit Survey
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={handleNext}
              disabled={!sectionComplete}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Next Section
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedSurvey;