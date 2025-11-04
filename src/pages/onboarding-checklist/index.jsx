import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TimelinePhase from './components/TimelinePhase';
import ProgressSidebar from './components/ProgressSidebar';
import BulkActions from './components/BulkActions';
import ChatModal from './components/ChatModal';

const OnboardingChecklist = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState(['week1']);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [phases, setPhases] = useState([]);
  const [overallProgress, setOverallProgress] = useState({});
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
      return;
    }

    initializeData();
  }, [navigate]);

  const initializeData = () => {
    // Mock onboarding phases data
    const mockPhases = [
      {
        id: 'week1',
        title: 'Week 1: Getting Started',
        description: 'Essential setup and orientation tasks',
        duration: '5 days',
        status: 'in-progress',
        tasks: [
          {
            id: 'task1',
            title: 'Complete IT Setup',
            description: 'Set up your laptop, accounts, and development environment',
            type: 'system',
            priority: 'high',
            estimatedTime: '2 hours',
            dueDate: 'Aug 15, 2025',
            assignedTo: 'IT Support',
            completed: true,
            hasResources: true,
            requiresUpload: false,
            subtasks: [
              { id: 'sub1', title: 'Install required software', completed: true },
              { id: 'sub2', title: 'Configure VPN access', completed: true },
              { id: 'sub3', title: 'Set up email client', completed: false }
            ]
          },
          {
            id: 'task2',
            title: 'Security Training',
            description: 'Complete mandatory security awareness training and certification',
            type: 'training',
            priority: 'high',
            estimatedTime: '1 hour',
            dueDate: 'Aug 16, 2025',
            assignedTo: 'Security Team',
            completed: false,
            hasResources: true,
            requiresUpload: false
          },
          {
            id: 'task3',
            title: 'Submit Emergency Contact Information',
            description: 'Provide emergency contact details and medical information',
            type: 'document',
            priority: 'medium',
            estimatedTime: '15 minutes',
            dueDate: 'Aug 17, 2025',
            assignedTo: 'HR Team',
            completed: false,
            hasResources: false,
            requiresUpload: true
          }
        ]
      },
      {
        id: 'week2',
        title: 'Week 2: Team Integration',
        description: 'Meet your team and understand your role',
        duration: '5 days',
        status: 'upcoming',
        tasks: [
          {
            id: 'task4',
            title: 'One-on-One with Manager',
            description: 'Initial meeting to discuss expectations and goals',
            type: 'meeting',
            priority: 'high',
            estimatedTime: '1 hour',
            dueDate: 'Aug 20, 2025',
            assignedTo: 'Direct Manager',
            completed: false,
            hasResources: true,
            requiresUpload: false
          },
          {
            id: 'task5',
            title: 'Team Introduction Sessions',
            description: 'Meet with each team member and understand their roles',
            type: 'meeting',
            priority: 'medium',
            estimatedTime: '3 hours',
            dueDate: 'Aug 22, 2025',
            assignedTo: 'Team Members',
            completed: false,
            hasResources: false,
            requiresUpload: false
          },
          {
            id: 'task6',
            title: 'Project Overview Training',
            description: 'Learn about current projects and your upcoming assignments',
            type: 'training',
            priority: 'medium',
            estimatedTime: '2 hours',
            dueDate: 'Aug 23, 2025',
            assignedTo: 'Project Lead',
            completed: false,
            hasResources: true,
            requiresUpload: false
          }
        ]
      },
      {
        id: 'month1',
        title: 'Month 1: Skill Development',
        description: 'Technical training and skill building',
        duration: '4 weeks',
        status: 'upcoming',
        tasks: [
          {
            id: 'task7',
            title: 'Git & Version Control Training',
            description: 'Master Git workflows and collaboration practices',
            type: 'training',
            priority: 'high',
            estimatedTime: '4 hours',
            dueDate: 'Sep 1, 2025',
            assignedTo: 'Tech Lead',
            completed: false,
            hasResources: true,
            requiresUpload: false
          },
          {
            id: 'task8',
            title: 'Jira & Project Management',
            description: 'Learn to use Jira for task tracking and project management',
            type: 'training',
            priority: 'medium',
            estimatedTime: '2 hours',
            dueDate: 'Sep 5, 2025',
            assignedTo: 'Project Manager',
            completed: false,
            hasResources: true,
            requiresUpload: false
          },
          {
            id: 'task9',
            title: 'First Code Review',
            description: 'Submit your first code for review and feedback',
            type: 'verification',
            priority: 'high',
            estimatedTime: '1 hour',
            dueDate: 'Sep 10, 2025',
            assignedTo: 'Senior Developer',
            completed: false,
            hasResources: false,
            requiresUpload: true
          }
        ]
      }
    ];

    setPhases(mockPhases);

    // Calculate overall progress
    const allTasks = mockPhases?.flatMap(phase => phase?.tasks);
    const completedTasks = allTasks?.filter(task => task?.completed);
    const progressPercentage = Math.round((completedTasks?.length / allTasks?.length) * 100);

    setOverallProgress({
      percentage: progressPercentage,
      completedTasks: completedTasks?.length,
      totalTasks: allTasks?.length,
      daysRemaining: 75,
      currentPhase: 'Week 1: Getting Started'
    });

    // Mock upcoming deadlines
    setUpcomingDeadlines([
      {
        id: 'deadline1',
        task: 'Security Training',
        phase: 'Week 1',
        timeLeft: '2 days',
        urgency: 'high'
      },
      {
        id: 'deadline2',
        task: 'Emergency Contact Info',
        phase: 'Week 1',
        timeLeft: '4 days',
        urgency: 'medium'
      },
      {
        id: 'deadline3',
        task: 'Manager One-on-One',
        phase: 'Week 2',
        timeLeft: '1 week',
        urgency: 'medium'
      }
    ]);

    // Mock quick actions
    setQuickActions([
      {
        id: 'action1',
        label: 'Schedule IT Setup',
        icon: 'Calendar',
        type: 'schedule'
      },
      {
        id: 'action2',
        label: 'Download Handbook',
        icon: 'Download',
        type: 'download'
      },
      {
        id: 'action3',
        label: 'Contact HR Support',
        icon: 'MessageSquare',
        type: 'chat',
        title: 'HR Support',
        chatType: 'hr'
      },
      {
        id: 'action4',
        label: 'View Training Videos',
        icon: 'Play',
        type: 'training'
      }
    ]);
  };

  const handlePhaseToggle = (phaseId) => {
    setExpandedPhases(prev => 
      prev?.includes(phaseId) 
        ? prev?.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const handleTaskComplete = (phaseId, taskId) => {
    setPhases(prev => prev?.map(phase => {
      if (phase?.id === phaseId) {
        return {
          ...phase,
          tasks: phase?.tasks?.map(task => 
            task?.id === taskId ? { ...task, completed: !task?.completed } : task
          )
        };
      }
      return phase;
    }));

    // Update overall progress
    setTimeout(() => {
      const allTasks = phases?.flatMap(phase => phase?.tasks);
      const completedTasks = allTasks?.filter(task => task?.completed);
      const progressPercentage = Math.round((completedTasks?.length / allTasks?.length) * 100);

      setOverallProgress(prev => ({
        ...prev,
        percentage: progressPercentage,
        completedTasks: completedTasks?.length
      }));
    }, 100);
  };

  const handleTaskReorder = (phaseId, draggedTaskId, targetTaskId) => {
    setPhases(prev => prev?.map(phase => {
      if (phase?.id === phaseId) {
        const tasks = [...phase?.tasks];
        const draggedIndex = tasks?.findIndex(task => task?.id === draggedTaskId);
        const targetIndex = tasks?.findIndex(task => task?.id === targetTaskId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedTask] = tasks?.splice(draggedIndex, 1);
          tasks?.splice(targetIndex, 0, draggedTask);
        }
        
        return { ...phase, tasks };
      }
      return phase;
    }));
  };

  const handleOpenChat = (context) => {
    setChatContext(context);
    setIsChatOpen(true);
  };

  const handleOpenTraining = (resource) => {
    console.log('Opening training resource:', resource);
    // In a real app, this would navigate to training materials
  };

  const handleBulkComplete = () => {
    selectedTasks?.forEach(taskId => {
      const phase = phases?.find(p => p?.tasks?.some(t => t?.id === taskId));
      if (phase) {
        handleTaskComplete(phase?.id, taskId);
      }
    });
    setSelectedTasks([]);
  };

  const handleSelectAll = () => {
    const allTaskIds = phases?.flatMap(phase => phase?.tasks?.map(task => task?.id));
    setSelectedTasks(allTaskIds);
  };

  const handleDeselectAll = () => {
    setSelectedTasks([]);
  };

  const handleBulkSchedule = (taskIds) => {
    console.log('Scheduling tasks:', taskIds);
    navigate('/meeting-scheduler');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/employee-dashboard', icon: 'LayoutDashboard' },
    { label: 'My Progress', path: '/onboarding-checklist', icon: 'CheckSquare', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} className="mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  My Onboarding Progress
                </h1>
                <p className="text-muted-foreground">
                  Track your progress through the first 90 days at our company
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => console.log('Export progress report')}
                >
                  Export Report
                </Button>
                <Button
                  variant="default"
                  iconName="MessageSquare"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => handleOpenChat({ title: 'General Help', type: 'general' })}
                >
                  Get AI Help
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Timeline Content */}
            <div className="lg:col-span-8">
              <div className="space-y-6">
                {phases?.map((phase) => (
                  <TimelinePhase
                    key={phase?.id}
                    phase={phase}
                    isExpanded={expandedPhases?.includes(phase?.id)}
                    onToggle={() => handlePhaseToggle(phase?.id)}
                    onTaskComplete={handleTaskComplete}
                    onTaskReorder={handleTaskReorder}
                    onOpenChat={handleOpenChat}
                  />
                ))}
              </div>
              
              {/* Timeline End Marker */}
              <div className="relative mt-8">
                <div className="absolute left-6 top-0 w-0.5 h-8 bg-border"></div>
                <div className="flex items-center space-x-4 ml-12">
                  <div className="w-12 h-12 rounded-full bg-success text-success-foreground flex items-center justify-center shadow-soft">
                    <Icon name="Trophy" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Onboarding Complete!</h3>
                    <p className="text-sm text-muted-foreground">
                      You'll reach this milestone after completing all phases
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <ProgressSidebar
                  overallProgress={overallProgress}
                  upcomingDeadlines={upcomingDeadlines}
                  quickActions={quickActions}
                  onOpenChat={handleOpenChat}
                  onOpenTraining={handleOpenTraining}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Bulk Actions */}
      <BulkActions
        selectedTasks={selectedTasks}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkComplete={handleBulkComplete}
        onBulkSchedule={handleBulkSchedule}
        totalTasks={phases?.flatMap(phase => phase?.tasks)?.length}
        isVisible={selectedTasks?.length > 0}
      />
      {/* AI Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={chatContext}
      />
    </div>
  );
};

export default OnboardingChecklist;