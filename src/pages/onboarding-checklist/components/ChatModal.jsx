import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { getContextualResponse } from '../../../services/openaiService';

const ChatModal = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && context) {
      // Initialize conversation based on context
      const initialMessage = {
        id: Date.now(),
        type: 'ai',
        content: getContextualGreeting(context),
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      setError(null);
      
      // Focus input after modal opens
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 100);
    }
  }, [isOpen, context]);

  const getContextualGreeting = (context) => {
    if (context?.type === 'task') {
      return `Hi! I'm here to help you with "${context?.title}". What specific questions do you have about this task?`;
    } else if (context?.type === 'phase') {
      return `Hello! I can provide guidance for ${context?.title}. What would you like to know about this onboarding phase?`;
    } else if (context?.type === 'progress') {
      return `Hi there! I can help you understand your onboarding progress and suggest ways to stay on track. What would you like to discuss?`;
    }
    return `Hello! I'm your AI onboarding assistant. How can I help you today?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue?.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue?.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue?.trim();
    setInputValue('');
    setIsTyping(true);
    setError(null);

    try {
      // Get conversation history for context (last 8 messages due to modal size)
      const conversationHistory = messages?.slice(-8)?.map(msg => ({
        type: msg?.type === 'ai' ? 'assistant' : msg?.type,
        content: msg?.content
      }));

      const aiResponse = await getContextualResponse(currentInput, context, conversationHistory);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting contextual AI response:', error);
      setError('Failed to get response. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateFallbackResponse(context),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateFallbackResponse = (context) => {
    if (context?.type === 'task') {
      return `I'm having trouble connecting right now, but for the task "${context?.title}", I recommend starting with the documentation and breaking it into smaller steps. Feel free to ask your mentor or check the employee handbook for guidance.`;
    } else if (context?.type === 'phase') {
      return `I'm currently unable to provide detailed guidance, but for the "${context?.title}" phase, focus on the priority items first and don't hesitate to reach out to HR or your manager for support.`;
    }
    return "I'm having connection issues right now. Please try again, or contact HR or your manager for immediate assistance.";
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = async () => {
    setMessages([]);
    setError(null);
    
    const initialMessage = {
      id: Date.now(),
      type: 'ai',
      content: getContextualGreeting(context),
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevated w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Bot" size={16} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                {context?.title || 'Onboarding Help'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {error && (
              <div className="text-xs text-error bg-error/10 px-2 py-1 rounded">
                Connection Issues
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((message) => (
            <div
              key={message?.id}
              className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message?.type === 'user' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message?.content}</p>
                <p className={`text-xs mt-1 ${
                  message?.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {message?.timestamp?.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground p-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e?.target?.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
            </div>
            <Button
              variant="default"
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue?.trim() || isTyping}
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={14}
                onClick={resetChat}
                className="text-xs"
                disabled={isTyping}
              >
                Reset Chat
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded text-sm text-error">
              {error} - Responses may be limited while connection issues persist.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;