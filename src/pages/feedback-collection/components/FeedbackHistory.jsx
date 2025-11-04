import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeedbackHistory = ({ onClose }) => {
  const [filter, setFilter] = useState('all');

  const feedbackHistory = [
    {
      id: 1,
      type: 'pulse',
      title: 'Quick Pulse - Onboarding Experience',
      submittedAt: new Date('2025-01-10T14:30:00'),
      status: 'reviewed',
      sentiment: 'positive',
      response: 'Thank you for your positive feedback! We\'re glad the onboarding process is working well.',
      responseAt: new Date('2025-01-11T09:15:00')
    },
    {
      id: 2,
      type: 'detailed',
      title: 'Detailed Survey - Training Materials',
      submittedAt: new Date('2025-01-08T16:45:00'),
      status: 'in-progress',
      sentiment: 'neutral',
      response: null,
      responseAt: null
    },
    {
      id: 3,
      type: 'opentext',
      title: 'Open Feedback - Team Integration',
      submittedAt: new Date('2025-01-05T11:20:00'),
      status: 'implemented',
      sentiment: 'negative',
      response: 'We\'ve implemented changes to the team integration process based on your suggestions.',
      responseAt: new Date('2025-01-12T13:30:00')
    },
    {
      id: 4,
      type: 'pulse',
      title: 'Quick Pulse - Tools Setup',
      submittedAt: new Date('2025-01-03T09:10:00'),
      status: 'pending',
      sentiment: 'positive',
      response: null,
      responseAt: null
    }
  ];

  const getTypeConfig = (type) => {
    switch (type) {
      case 'pulse':
        return { icon: 'Zap', label: 'Quick Pulse', color: 'text-blue-600' };
      case 'detailed':
        return { icon: 'FileText', label: 'Detailed Survey', color: 'text-green-600' };
      case 'opentext':
        return { icon: 'MessageSquare', label: 'Open Feedback', color: 'text-purple-600' };
      default:
        return { icon: 'MessageCircle', label: 'Feedback', color: 'text-gray-600' };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { icon: 'Clock', label: 'Pending Review', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'in-progress':
        return { icon: 'Eye', label: 'Under Review', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'reviewed':
        return { icon: 'CheckCircle', label: 'Reviewed', color: 'text-green-600', bg: 'bg-green-50' };
      case 'implemented':
        return { icon: 'Check', label: 'Implemented', color: 'text-success', bg: 'bg-success/10' };
      default:
        return { icon: 'Circle', label: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const getSentimentConfig = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return { icon: 'Smile', color: 'text-green-600' };
      case 'negative':
        return { icon: 'Frown', color: 'text-red-600' };
      default:
        return { icon: 'Meh', color: 'text-yellow-600' };
    }
  };

  const filteredHistory = filter === 'all' 
    ? feedbackHistory 
    : feedbackHistory?.filter(item => item?.type === filter);

  const filterOptions = [
    { value: 'all', label: 'All Feedback', count: feedbackHistory?.length },
    { value: 'pulse', label: 'Quick Pulse', count: feedbackHistory?.filter(f => f?.type === 'pulse')?.length },
    { value: 'detailed', label: 'Detailed Survey', count: feedbackHistory?.filter(f => f?.type === 'detailed')?.length },
    { value: 'opentext', label: 'Open Feedback', count: feedbackHistory?.filter(f => f?.type === 'opentext')?.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="History" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Feedback History
          </h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Icon name="X" size={20} />
        </Button>
      </div>
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option?.label}
              <span className="ml-2 text-xs opacity-75">({option?.count})</span>
            </button>
          ))}
        </div>
      </div>
      {/* Feedback List */}
      <div className="space-y-4">
        {filteredHistory?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No feedback found
            </h3>
            <p className="text-muted-foreground">
              {filter === 'all' ?'You haven\'t submitted any feedback yet.'
                : `No ${filterOptions?.find(f => f?.value === filter)?.label?.toLowerCase()} found.`
              }
            </p>
          </div>
        ) : (
          filteredHistory?.map((feedback) => {
            const typeConfig = getTypeConfig(feedback?.type);
            const statusConfig = getStatusConfig(feedback?.status);
            const sentimentConfig = getSentimentConfig(feedback?.sentiment);

            return (
              <div key={feedback?.id} className="bg-card border border-border rounded-lg p-6">
                {/* Feedback Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-lg bg-white border-2 border-current flex items-center justify-center ${typeConfig?.color}`}>
                      <Icon name={typeConfig?.icon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {feedback?.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Submitted {feedback?.submittedAt?.toLocaleDateString()}</span>
                        <div className="flex items-center space-x-1">
                          <Icon name={sentimentConfig?.icon} size={14} className={sentimentConfig?.color} />
                          <span className="capitalize">{feedback?.sentiment}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full flex items-center space-x-2 ${statusConfig?.bg}`}>
                    <Icon name={statusConfig?.icon} size={14} className={statusConfig?.color} />
                    <span className={`text-sm font-medium ${statusConfig?.color}`}>
                      {statusConfig?.label}
                    </span>
                  </div>
                </div>
                {/* Response */}
                {feedback?.response && (
                  <div className="bg-muted rounded-lg p-4 mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="MessageCircle" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">HR Response</span>
                      <span className="text-xs text-muted-foreground">
                        {feedback?.responseAt?.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feedback?.response}
                    </p>
                  </div>
                )}
                {/* Actions */}
                <div className="flex justify-end mt-4 pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                    {feedback?.status === 'reviewed' && (
                      <Button variant="ghost" size="sm">
                        Follow Up
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Summary Stats */}
      {filteredHistory?.length > 0 && (
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {feedbackHistory?.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {feedbackHistory?.filter(f => f?.status === 'implemented')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Implemented</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {feedbackHistory?.filter(f => f?.status === 'reviewed')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {feedbackHistory?.filter(f => f?.status === 'pending')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackHistory;