import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { getTrainingAssistantResponse, getQuickActionResponse, checkApiStatus } from '../../../services/openaiService';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Welcome to AI Training Assistant! 🎉\n\nI'm here to help you with your onboarding journey. You can ask me about:\n• Company policies and procedures\n• IT setup and tools\n• Training resources and schedules\n• Meeting arrangements\n• Any questions about your role\n\nHow can I assist you today?`,timestamp: new Date(Date.now() - 300000),avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=40&h=40&fit=crop&crop=face'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [apiStatus, setApiStatus] = useState({ status: 'checking', message: 'Checking connection...' });
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const quickActions = [
    { id: 1, label: 'Company Policies', icon: 'FileText', category: 'policies' },
    { id: 2, label: 'IT Setup Guide', icon: 'Monitor', category: 'it' },
    { id: 3, label: 'Schedule Meeting', icon: 'Calendar', category: 'meeting' },
    { id: 4, label: 'Training Resources', icon: 'BookOpen', category: 'training' },
    { id: 5, label: 'Team Directory', icon: 'Users', category: 'team' },
    { id: 6, label: 'FAQ', icon: 'HelpCircle', category: 'faq' }
  ];

  const emojis = ['👍', '👎', '😊', '😢', '🎉', '🤔', '💡', '✅', '❌', '🔥'];

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check API status on component mount and periodically
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkApiStatus();
        setApiStatus(status);
        setRetryCount(0); // Reset retry count on successful check
      } catch (error) {
        setApiStatus({
          status: 'offline',
          message: 'Unable to connect to AI services'
        });
      }
    };

    checkStatus();
    
    // Check status every 2 minutes if offline
    const statusInterval = setInterval(() => {
      if (apiStatus?.status === 'offline' || apiStatus?.status === 'quota_exceeded') {
        checkStatus();
      }
    }, 120000);

    return () => clearInterval(statusInterval);
  }, [apiStatus?.status]);

  const handleRetry = async () => {
    setApiStatus({ status: 'checking', message: 'Reconnecting...' });
    try {
      const status = await checkApiStatus();
      setApiStatus(status);
      setRetryCount(0);
    } catch (error) {
      setRetryCount(prev => prev + 1);
      setApiStatus({
        status: 'offline',
        message: `Connection failed (attempt ${retryCount + 1})`
      });
    }
  };

  const getConnectionStatusInfo = () => {
    switch (apiStatus?.status) {
      case 'online':
        return {
          color: 'bg-success',
          text: 'Online',
          showRetry: false
        };
      case 'quota_exceeded':
        return {
          color: 'bg-warning',
          text: 'Limited Mode',
          showRetry: true,
          description: 'Using offline responses due to high demand'
        };
      case 'offline': case'auth_error':
        return {
          color: 'bg-error',
          text: 'Offline Mode',
          showRetry: true,
          description: 'Using cached responses'
        };
      case 'checking':
        return {
          color: 'bg-muted',
          text: 'Connecting...',
          showRetry: false
        };
      default:
        return {
          color: 'bg-muted',
          text: 'Unknown',
          showRetry: true
        };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage?.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get conversation history for context (last 10 messages)
      const conversationHistory = messages?.slice(-10)?.map(msg => ({
        type: msg?.type === 'bot' ? 'assistant' : msg?.type,
        content: msg?.content
      }));

      const aiResponse = await getTrainingAssistantResponse(currentInput, conversationHistory);

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=40&h=40&fit=crop&crop=face',
        isOfflineResponse: apiStatus?.status !== 'online'
      };

      setMessages(prev => [...prev, botResponse]);
      
      // Update API status based on successful response
      if (apiStatus?.status !== 'online' && !aiResponse?.includes('experiencing connectivity issues')) {
        setApiStatus({ status: 'online', message: 'Connection restored' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // The service will handle the error and return a fallback response
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm experiencing technical difficulties. Please try again in a moment, or contact HR for immediate assistance.",
        timestamp: new Date(),
        avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=40&h=40&fit=crop&crop=face',
        isOfflineResponse: true
      };

      setMessages(prev => [...prev, errorResponse]);
      setApiStatus({ status: 'offline', message: 'Connection issues detected' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action) => {
    const quickMessage = {
      id: Date.now(),
      type: 'user',
      content: `Tell me about ${action?.label?.toLowerCase()}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, quickMessage]);
    setIsTyping(true);

    try {
      const aiResponse = await getQuickActionResponse(action?.category);

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=40&h=40&fit=crop&crop=face',
        isOfflineResponse: apiStatus?.status !== 'online'
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting quick action response:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: `I'm having trouble getting information about ${action?.label?.toLowerCase()} right now. Please check the Employee Handbook or contact HR for immediate assistance.`,
        timestamp: new Date(),
        avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=40&h=40&fit=crop&crop=face',
        isOfflineResponse: true
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const fileMessage = {
        id: Date.now(),
        type: 'user',
        content: `📎 Uploaded file: ${file?.name}`,
        timestamp: new Date(),
        attachment: {
          name: file?.name,
          size: file?.size,
          type: file?.type
        }
      };
      setMessages(prev => [...prev, fileMessage]);
      
      // Add AI response about file upload
      setTimeout(() => {
        const fileResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: `I've received your file "${file?.name}". While I can't process files directly yet, I can help you with questions about the content or guide you on where to submit documents for review. What would you like to know about this file?`,
          timestamp: new Date(),
          avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=40&h=40&fit=crop&crop=face'
        };
        setMessages(prev => [...prev, fileResponse]);
      }, 1000);
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
    setTimeout(() => {
      setIsRecording(false);
      setInputMessage("How do I access the employee handbook?");
    }, 3000);
  };

  const addEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })?.format(timestamp);
  };

  const connectionInfo = getConnectionStatusInfo();

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Bot" size={20} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Training Assistant</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${connectionInfo?.color} rounded-full ${apiStatus?.status === 'checking' ? 'animate-pulse' : ''}`}></div>
                <span className="text-sm text-muted-foreground">
                  {connectionInfo?.text}
                </span>
                {connectionInfo?.showRetry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetry}
                    className="h-6 px-2 text-xs"
                  >
                    <Icon name="RefreshCw" size={12} />
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Icon name="Search" size={18} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="MoreVertical" size={18} />
            </Button>
          </div>
        </div>
        
        {/* Connection Status Info */}
        {(apiStatus?.status === 'quota_exceeded' || apiStatus?.status === 'offline' || apiStatus?.status === 'auth_error') && (
          <div className={`mt-2 p-3 rounded-lg border ${
            apiStatus?.status === 'quota_exceeded' ?'bg-warning/10 border-warning/20 text-warning-foreground' :'bg-info/10 border-info/20 text-info-foreground'
          }`}>
            <div className="flex items-start space-x-2">
              <Icon 
                name={apiStatus?.status === 'quota_exceeded' ? 'AlertTriangle' : 'Info'} 
                size={16} 
                className="mt-0.5 flex-shrink-0" 
              />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {apiStatus?.status === 'quota_exceeded' ?'High Demand Detected' :'Offline Mode Active'}
                </p>
                <p className="text-xs mt-1 opacity-90">
                  {connectionInfo?.description || apiStatus?.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {quickActions?.map((action) => (
            <Button
              key={action?.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action)}
              iconName={action?.icon}
              iconPosition="left"
              iconSize={14}
              className="justify-start text-xs"
              disabled={isTyping}
            >
              {action?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message?.id}
            className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-[80%] ${message?.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {message?.type === 'bot' && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={message?.avatar}
                    alt="AI Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className={`rounded-lg px-4 py-3 ${
                message?.type === 'user' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
              }`}>
                <div className="whitespace-pre-wrap text-sm">
                  {message?.content}
                </div>
                {message?.attachment && (
                  <div className="mt-2 p-2 bg-background/10 rounded border">
                    <div className="flex items-center space-x-2">
                      <Icon name="Paperclip" size={14} />
                      <span className="text-xs">{message?.attachment?.name}</span>
                    </div>
                  </div>
                )}
                <div className={`flex items-center justify-between mt-2 text-xs opacity-70`}>
                  <span className={message?.type === 'user' ? 'ml-auto' : ''}>
                    {formatTime(message?.timestamp)}
                  </span>
                  {message?.isOfflineResponse && (
                    <div className="flex items-center space-x-1 text-xs opacity-60">
                      <Icon name="Wifi" size={10} className="opacity-50" />
                      <span>Offline</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=40&h=40&fit=crop&crop=face"
                  alt="AI Assistant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        {showEmojiPicker && (
          <div className="mb-3 p-2 bg-muted rounded-lg">
            <div className="flex flex-wrap gap-2">
              {emojis?.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => addEmoji(emoji)}
                  className="text-lg hover:bg-background rounded p-1 transition-smooth"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef?.current?.click()}
              className="h-10 w-10"
              disabled={isTyping}
            >
              <Icon name="Paperclip" size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="h-10 w-10"
              disabled={isTyping}
            >
              <Icon name="Smile" size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceRecord}
              className={`h-10 w-10 ${isRecording ? 'bg-error text-error-foreground' : ''}`}
              disabled={isTyping}
            >
              <Icon name={isRecording ? "MicOff" : "Mic"} size={18} />
            </Button>
          </div>

          <div className="flex-1">
            <Input
              type="text"
              placeholder={
                apiStatus?.status === 'offline' || apiStatus?.status === 'quota_exceeded'
                  ? "Ask me anything (offline responses available)..."
                  : "Type your message..."
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && !isTyping && handleSendMessage()}
              className="resize-none"
              disabled={isTyping}
            />
          </div>

          <Button
            variant="default"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputMessage?.trim() || isTyping}
            className="h-10 w-10"
          >
            <Icon name="Send" size={18} />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        />
      </div>
    </div>
  );
};

export default ChatInterface;