import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActions = ({ 
  selectedTasks, 
  onSelectAll, 
  onDeselectAll, 
  onBulkComplete, 
  onBulkSchedule,
  totalTasks,
  isVisible 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkComplete = async () => {
    if (selectedTasks?.length === 0) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      onBulkComplete();
      setIsProcessing(false);
    }, 1000);
  };

  if (!isVisible || selectedTasks?.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card border border-border rounded-lg shadow-elevated p-4 min-w-96">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedTasks?.length === totalTasks}
                indeterminate={selectedTasks?.length > 0 && selectedTasks?.length < totalTasks}
                onChange={(e) => {
                  if (e?.target?.checked) {
                    onSelectAll();
                  } else {
                    onDeselectAll();
                  }
                }}
              />
              <span className="text-sm font-medium text-foreground">
                {selectedTasks?.length} task{selectedTasks?.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Calendar"
              iconPosition="left"
              iconSize={16}
              onClick={() => onBulkSchedule(selectedTasks)}
              disabled={isProcessing}
            >
              Schedule
            </Button>
            
            <Button
              variant="default"
              size="sm"
              iconName="CheckSquare"
              iconPosition="left"
              iconSize={16}
              onClick={handleBulkComplete}
              disabled={isProcessing}
              loading={isProcessing}
            >
              {isProcessing ? 'Completing...' : 'Mark Complete'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={16}
              onClick={onDeselectAll}
              disabled={isProcessing}
            />
          </div>
        </div>
        
        {isProcessing && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Processing {selectedTasks?.length} tasks...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;