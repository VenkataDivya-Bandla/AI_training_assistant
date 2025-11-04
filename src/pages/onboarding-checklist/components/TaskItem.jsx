import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaskItem = ({ task, onComplete, onOpenChat }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (task?.completed) return;
    
    setIsCompleting(true);
    // Simulate API call delay
    setTimeout(() => {
      onComplete();
      setIsCompleting(false);
    }, 500);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'document':
        return 'FileText';
      case 'meeting':
        return 'Calendar';
      case 'training':
        return 'BookOpen';
      case 'system':
        return 'Settings';
      case 'verification':
        return 'Shield';
      default:
        return 'CheckSquare';
    }
  };

  return (
    <div className={`p-4 border rounded-lg transition-all duration-300 ${
      task?.completed 
        ? 'bg-success/5 border-success/20' :'bg-card border-border hover:border-primary/30'
    } ${isCompleting ? 'scale-105 shadow-elevated' : 'shadow-soft'}`}>
      <div className="flex items-start space-x-4">
        {/* Completion Checkbox */}
        <div className="mt-1">
          <Checkbox
            checked={task?.completed}
            onChange={handleComplete}
            disabled={isCompleting}
            className={isCompleting ? 'animate-pulse' : ''}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Icon 
                  name={getTaskIcon(task?.type)} 
                  size={16} 
                  className="text-muted-foreground"
                />
                <h4 className={`font-medium ${
                  task?.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}>
                  {task?.title}
                </h4>
                
                {/* Priority Badge */}
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task?.priority)}`}>
                  {task?.priority}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {task?.description}
              </p>
              
              {/* Task Metadata */}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{task?.estimatedTime}</span>
                </div>
                
                {task?.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>Due {task?.dueDate}</span>
                  </div>
                )}
                
                {task?.assignedTo && (
                  <div className="flex items-center space-x-1">
                    <Icon name="User" size={12} />
                    <span>{task?.assignedTo}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Task Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {task?.hasResources && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ExternalLink"
                  iconSize={14}
                  onClick={() => console.log('Open resources for', task?.id)}
                  className="text-xs"
                >
                  Resources
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                iconName="MessageSquare"
                iconSize={14}
                onClick={() => onOpenChat(task)}
                className="text-xs"
              >
                Ask AI
              </Button>
              
              {task?.requiresUpload && !task?.completed && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Upload"
                  iconSize={14}
                  onClick={() => console.log('Upload document for', task?.id)}
                  className="text-xs"
                >
                  Upload
                </Button>
              )}
            </div>
          </div>
          
          {/* Subtasks */}
          {task?.subtasks && task?.subtasks?.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-muted">
              {task?.subtasks?.map((subtask) => (
                <div key={subtask?.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={subtask?.completed}
                    onChange={() => console.log('Toggle subtask', subtask?.id)}
                    size="sm"
                  />
                  <span className={`text-sm ${
                    subtask?.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}>
                    {subtask?.title}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Completion Animation */}
          {isCompleting && (
            <div className="absolute inset-0 flex items-center justify-center bg-success/10 rounded-lg">
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle2" size={24} className="animate-bounce" />
                <span className="font-medium">Task Completed!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;