import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FeedbackTypeCard from './components/FeedbackTypeCard';
import PulseFeedback from './components/PulseFeedback';
import DetailedSurvey from './components/DetailedSurvey';
import OpenTextFeedback from './components/OpenTextFeedback';
import FeedbackSuccess from './components/FeedbackSuccess';
import FeedbackHistory from './components/FeedbackHistory';

const FeedbackCollection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState('selection'); // selection, feedback, success
  const [selectedType, setSelectedType] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [drafts, setDrafts] = useState([]);

  // Mock user data
  useEffect(() => {
    const userData = {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'employee',
      department: 'Engineering',
      joinDate: '2025-01-01',
      onboardingProgress: 75
    };
    setUser(userData);

    // Load drafts from localStorage
    const savedDrafts = localStorage.getItem('feedback_drafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setCurrentStep('feedback');
  };

  const handleFeedbackSubmit = (feedbackData) => {
    // Mock submission
    console.log('Feedback submitted:', feedbackData);
    setSubmittedFeedback(feedbackData);
    setCurrentStep('success');
    
    // Remove draft if exists
    const updatedDrafts = drafts?.filter(draft => draft?.type !== feedbackData?.type);
    setDrafts(updatedDrafts);
    localStorage.setItem('feedback_drafts', JSON.stringify(updatedDrafts));
  };

  const handleSaveDraft = (draftData) => {
    const updatedDrafts = drafts?.filter(draft => draft?.type !== draftData?.type);
    updatedDrafts?.push(draftData);
    setDrafts(updatedDrafts);
    localStorage.setItem('feedback_drafts', JSON.stringify(updatedDrafts));
    
    // Show success message
    alert('Draft saved successfully!');
  };

  const handleLoadDraft = (type) => {
    const draft = drafts?.find(d => d?.type === type);
    if (draft) {
      setSelectedType(type);
      setCurrentStep('feedback');
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
    setSelectedType('');
  };

  const handleNewFeedback = () => {
    setCurrentStep('selection');
    setSelectedType('');
    setSubmittedFeedback(null);
  };

  const handleViewDashboard = () => {
    navigate('/employee-dashboard');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/employee-dashboard', icon: 'LayoutDashboard' },
    { label: 'Feedback Collection', path: '/feedback-collection', icon: 'MessageSquare', isLast: true }
  ];

  const feedbackStats = {
    totalSubmitted: 12,
    thisMonth: 3,
    avgResponseTime: '2.5 days',
    implementationRate: '85%'
  };

  if (showHistory) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="pt-16">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <FeedbackHistory onClose={() => setShowHistory(false)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} className="mb-6" />

          {currentStep === 'selection' && (
            <>
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Share Your Feedback
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      Help us improve your onboarding experience by sharing your thoughts and insights.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowHistory(true)}
                    iconName="History"
                    iconPosition="left"
                  >
                    View History
                  </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="MessageSquare" size={20} className="text-primary" />
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {feedbackStats?.totalSubmitted}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Submitted</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="Calendar" size={20} className="text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {feedbackStats?.thisMonth}
                        </div>
                        <div className="text-sm text-muted-foreground">This Month</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="Clock" size={20} className="text-green-600" />
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {feedbackStats?.avgResponseTime}
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Response</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="TrendingUp" size={20} className="text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {feedbackStats?.implementationRate}
                        </div>
                        <div className="text-sm text-muted-foreground">Implemented</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Type Selection */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Choose Your Feedback Type
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeedbackTypeCard
                      type="pulse"
                      isSelected={selectedType === 'pulse'}
                      onSelect={handleTypeSelection}
                    />
                    <FeedbackTypeCard
                      type="detailed"
                      isSelected={selectedType === 'detailed'}
                      onSelect={handleTypeSelection}
                    />
                    <FeedbackTypeCard
                      type="opentext"
                      isSelected={selectedType === 'opentext'}
                      onSelect={handleTypeSelection}
                    />
                  </div>
                </div>

                {/* Saved Drafts */}
                {drafts?.length > 0 && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                      <Icon name="Save" size={20} className="text-primary" />
                      <span>Saved Drafts</span>
                    </h3>
                    <div className="space-y-3">
                      {drafts?.map((draft, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon 
                              name={draft?.type === 'pulse' ? 'Zap' : draft?.type === 'detailed' ? 'FileText' : 'MessageSquare'} 
                              size={20} 
                              className="text-muted-foreground" 
                            />
                            <div>
                              <div className="font-medium text-foreground capitalize">
                                {draft?.type === 'opentext' ? 'Open Text' : draft?.type} Feedback
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Saved {new Date(draft.savedAt)?.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoadDraft(draft?.type)}
                          >
                            Continue
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Chatbot Integration */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Icon name="Bot" size={24} color="white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Try AI-Powered Feedback
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Have a conversation with our AI assistant to share your feedback naturally. 
                        It can help you articulate your thoughts and ensure nothing important is missed.
                      </p>
                      <Button variant="outline" iconName="MessageCircle" iconPosition="left">
                        Start AI Conversation
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Icon name="Lightbulb" size={20} className="text-primary" />
                    <span>Feedback Tips</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Be Specific</h4>
                      <p className="text-sm text-muted-foreground">
                        Provide concrete examples and specific situations to help us understand your experience better.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Stay Constructive</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on how things can be improved rather than just what went wrong.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Include Context</h4>
                      <p className="text-sm text-muted-foreground">
                        Mention when and where something happened to give us better context.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Suggest Solutions</h4>
                      <p className="text-sm text-muted-foreground">
                        If possible, include your ideas for how things could be improved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 'feedback' && (
            <div>
              {selectedType === 'pulse' && (
                <PulseFeedback
                  onSubmit={handleFeedbackSubmit}
                  onBack={handleBackToSelection}
                />
              )}
              {selectedType === 'detailed' && (
                <DetailedSurvey
                  onSubmit={handleFeedbackSubmit}
                  onBack={handleBackToSelection}
                  onSaveDraft={handleSaveDraft}
                />
              )}
              {selectedType === 'opentext' && (
                <OpenTextFeedback
                  onSubmit={handleFeedbackSubmit}
                  onBack={handleBackToSelection}
                  onSaveDraft={handleSaveDraft}
                />
              )}
            </div>
          )}

          {currentStep === 'success' && (
            <FeedbackSuccess
              feedbackData={submittedFeedback}
              onNewFeedback={handleNewFeedback}
              onViewDashboard={handleViewDashboard}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackCollection;