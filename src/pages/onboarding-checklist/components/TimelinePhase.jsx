import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import TaskItem from './TaskItem';

const TimelinePhase = ({ 
  phase, 
  isExpanded, 
  onToggle, 
  onTaskComplete, 
  onTaskReorder,
  onOpenChat 
}) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const completedTasks = phase?.tasks?.filter(task => task?.completed)?.length;
  const totalTasks = phase?.tasks?.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleDragStart = (e, taskId) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTaskId) => {
    e?.preventDefault();
    if (draggedTask && draggedTask !== targetTaskId) {
      onTaskReorder(phase?.id, draggedTask, targetTaskId);
    }
    setDraggedTask(null);
  };

  const getPhaseIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle2';
      case 'in-progress':
        return 'Clock';
      case 'upcoming':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  const getPhaseColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-primary';
      case 'upcoming':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="relative">
      {/* Timeline connector line */}
      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border"></div>
      <div className="bg-card border border-border rounded-lg shadow-soft mb-6">
        {/* Phase Header */}
        <div 
          className="p-6 cursor-pointer hover:bg-muted/50 transition-smooth"
          onClick={onToggle}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Timeline dot */}
              <div className={`w-12 h-12 rounded-full border-4 border-background bg-card shadow-soft flex items-center justify-center ${getPhaseColor(phase?.status)}`}>
                <Icon name={getPhaseIcon(phase?.status)} size={20} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground">{phase?.title}</h3>
                <p className="text-sm text-muted-foreground">{phase?.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-muted-foreground">
                    {completedTasks}/{totalTasks} tasks completed
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{phase?.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Progress circle */}
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${progressPercentage * 1.76} 176`}
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-foreground">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              
              <Icon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                className="text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Expandable Tasks Section */}
        {isExpanded && (
          <div className="border-t border-border">
            <div className="p-6">
              <div className="space-y-3">
                {phase?.tasks?.map((task, index) => (
                  <div
                    key={task?.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task?.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, task?.id)}
                    className="cursor-move"
                  >
                    <TaskItem
                      task={task}
                      onComplete={() => onTaskComplete(phase?.id, task?.id)}
                      onOpenChat={() => onOpenChat(task)}
                    />
                  </div>
                ))}
              </div>
              
              {/* Phase Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="MessageSquare"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => onOpenChat({ title: `${phase?.title} Guidance`, type: 'phase' })}
                  >
                    Get AI Help
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Calendar"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => console.log('Schedule phase review')}
                  >
                    Schedule Review
                  </Button>
                </div>
                
                {completedTasks === totalTasks && (
                  <div className="flex items-center space-x-2 text-success">
                    <Icon name="Trophy" size={16} />
                    <span className="text-sm font-medium">Phase Complete!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePhase;