import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CalendarView from './components/CalendarView';
import MeetingForm from './components/MeetingForm';
import MeetingList from './components/MeetingList';
import AvailabilityManager from './components/AvailabilityManager';

const MeetingScheduler = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [activeTab, setActiveTab] = useState('schedule');
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Welcome & Onboarding Overview",
      type: "hr",
      date: "2025-01-15",
      time: "10:00",
      duration: "60",
      location: "video-call",
      attendees: ["Sarah Johnson (HR)", "Michael Chen (Manager)"],
      agenda: `• Welcome and introductions\n• Review onboarding progress\n• Address any questions or concerns\n• Discuss company policies and benefits\n• Next steps and follow-up`,
      notes: "First day orientation meeting",
      recurring: false,
      status: "scheduled"
    },
    {
      id: 2,
      title: "Technical Setup & Tools Training",
      type: "training",
      date: "2025-01-16",
      time: "14:00",
      duration: "90",
      location: "office",
      attendees: ["David Rodriguez (IT)", "Lisa Wang (Trainer)"],
      agenda: `• Review training materials\n• Hands-on practice session\n• Q&A and clarifications\n• Assessment and feedback\n• Additional resources and next steps`,
      notes: "Bring laptop for setup",
      recurring: false,
      status: "scheduled"
    },
    {
      id: 3,
      title: "Weekly Check-in",
      type: "manager",
      date: "2025-01-17",
      time: "11:00",
      duration: "30",
      location: "video-call",
      attendees: ["Michael Chen (Manager)"],
      agenda: `• Check-in on current projects\n• Discuss goals and expectations\n• Review performance and feedback\n• Address any challenges\n• Plan upcoming work and priorities`,
      notes: "",
      recurring: true,
      recurringType: "weekly",
      recurringEnd: "2025-04-17",
      status: "scheduled"
    },
    {
      id: 4,
      title: "Mentorship Session",
      type: "mentor",
      date: "2025-01-18",
      time: "15:30",
      duration: "45",
      location: "video-call",
      attendees: ["Jennifer Adams (Senior Developer)"],
      agenda: `• Review learning objectives\n• Discuss current challenges\n• Share industry insights and best practices\n• Set development goals\n• Plan next mentoring session`,
      notes: "Focus on React best practices",
      recurring: false,
      status: "scheduled"
    },
    {
      id: 5,
      title: "Team Introduction Meeting",
      type: "team",
      date: "2025-01-20",
      time: "09:30",
      duration: "60",
      location: "hybrid",
      attendees: ["Development Team", "Product Team"],
      agenda: `• Team updates and announcements\n• Project status reviews\n• Collaboration opportunities\n• Process improvements\n• Action items and follow-up`,
      notes: "Meet the entire development team",
      recurring: false,
      status: "scheduled"
    }
  ]);

  const [availableSlots, setAvailableSlots] = useState([
    { date: "2025-01-15", time: "09:00" },
    { date: "2025-01-15", time: "09:30" },
    { date: "2025-01-15", time: "11:00" },
    { date: "2025-01-15", time: "11:30" },
    { date: "2025-01-15", time: "13:00" },
    { date: "2025-01-15", time: "13:30" },
    { date: "2025-01-15", time: "15:00" },
    { date: "2025-01-15", time: "15:30" },
    { date: "2025-01-16", time: "09:00" },
    { date: "2025-01-16", time: "09:30" },
    { date: "2025-01-16", time: "10:00" },
    { date: "2025-01-16", time: "10:30" },
    { date: "2025-01-16", time: "11:00" },
    { date: "2025-01-16", time: "11:30" },
    { date: "2025-01-16", time: "16:00" },
    { date: "2025-01-16", time: "16:30" },
    { date: "2025-01-17", time: "09:00" },
    { date: "2025-01-17", time: "09:30" },
    { date: "2025-01-17", time: "10:00" },
    { date: "2025-01-17", time: "10:30" },
    { date: "2025-01-17", time: "13:00" },
    { date: "2025-01-17", time: "13:30" },
    { date: "2025-01-17", time: "14:00" },
    { date: "2025-01-17", time: "14:30" }
  ]);

  const [availableAttendees] = useState([
    { value: "sarah.johnson", label: "Sarah Johnson", description: "HR Manager" },
    { value: "michael.chen", label: "Michael Chen", description: "Engineering Manager" },
    { value: "david.rodriguez", label: "David Rodriguez", description: "IT Support" },
    { value: "lisa.wang", label: "Lisa Wang", description: "Training Coordinator" },
    { value: "jennifer.adams", label: "Jennifer Adams", description: "Senior Developer" },
    { value: "robert.kim", label: "Robert Kim", description: "Product Manager" },
    { value: "emily.davis", label: "Emily Davis", description: "UX Designer" },
    { value: "alex.thompson", label: "Alex Thompson", description: "DevOps Engineer" }
  ]);

  const [availability, setAvailability] = useState([
    {
      day: 'monday',
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      breaks: [
        { id: 1, startTime: '12:00', endTime: '13:00', label: 'Lunch Break' }
      ]
    },
    {
      day: 'tuesday',
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      breaks: [
        { id: 2, startTime: '12:00', endTime: '13:00', label: 'Lunch Break' }
      ]
    },
    {
      day: 'wednesday',
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      breaks: [
        { id: 3, startTime: '12:00', endTime: '13:00', label: 'Lunch Break' }
      ]
    },
    {
      day: 'thursday',
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      breaks: [
        { id: 4, startTime: '12:00', endTime: '13:00', label: 'Lunch Break' }
      ]
    },
    {
      day: 'friday',
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      breaks: [
        { id: 5, startTime: '12:00', endTime: '13:00', label: 'Lunch Break' }
      ]
    },
    {
      day: 'saturday',
      enabled: false,
      startTime: '09:00',
      endTime: '17:00',
      breaks: []
    },
    {
      day: 'sunday',
      enabled: false,
      startTime: '09:00',
      endTime: '17:00',
      breaks: []
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleScheduleMeeting = async (meetingData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingMeeting) {
        // Update existing meeting
        setMeetings(prev => prev?.map(meeting => 
          meeting?.id === editingMeeting?.id 
            ? { ...meeting, ...meetingData, id: editingMeeting?.id }
            : meeting
        ));
      } else {
        // Create new meeting
        const newMeeting = {
          ...meetingData,
          id: Date.now(),
          status: 'scheduled'
        };
        setMeetings(prev => [...prev, newMeeting]);
      }
      
      setShowMeetingForm(false);
      setEditingMeeting(null);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting);
    setShowMeetingForm(true);
  };

  const handleCancelMeeting = async (meeting) => {
    if (window.confirm('Are you sure you want to cancel this meeting?')) {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setMeetings(prev => prev?.filter(m => m?.id !== meeting?.id));
      } catch (error) {
        console.error('Error canceling meeting:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleJoinMeeting = (meeting) => {
    // Simulate joining a video call
    window.open('https://teams.microsoft.com/meeting-join', '_blank');
  };

  const handleUpdateAvailability = async (newAvailability) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAvailability(newAvailability);
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { key: 'schedule', label: 'Schedule Meeting', icon: 'Calendar' },
    { key: 'meetings', label: 'My Meetings', icon: 'Clock' },
    { key: 'availability', label: 'Availability', icon: 'Settings' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6" />

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Meeting Scheduler</h1>
              <p className="text-muted-foreground mt-2">
                Schedule meetings with HR, managers, and mentors to support your onboarding journey
              </p>
            </div>
            
            {activeTab === 'schedule' && !showMeetingForm && (
              <Button
                onClick={() => setShowMeetingForm(true)}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Schedule Meeting
              </Button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted rounded-lg p-1 mb-8">
            {tabs?.map(tab => (
              <Button
                key={tab?.key}
                variant={activeTab === tab?.key ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActiveTab(tab?.key);
                  setShowMeetingForm(false);
                  setEditingMeeting(null);
                }}
                iconName={tab?.icon}
                iconPosition="left"
                iconSize={16}
                className="flex-1"
              >
                {tab?.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calendar View */}
              <div className="space-y-6">
                <CalendarView
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  meetings={meetings}
                  availableSlots={availableSlots}
                />
              </div>

              {/* Meeting Form */}
              <div className="space-y-6">
                {showMeetingForm ? (
                  <MeetingForm
                    selectedDate={selectedDate}
                    onScheduleMeeting={handleScheduleMeeting}
                    onCancel={() => {
                      setShowMeetingForm(false);
                      setEditingMeeting(null);
                    }}
                    editingMeeting={editingMeeting}
                    availableAttendees={availableAttendees}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="bg-card rounded-lg border border-border p-8 text-center">
                    <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Select a Date to Schedule
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Choose a date from the calendar to schedule a new meeting
                    </p>
                    <Button
                      onClick={() => setShowMeetingForm(true)}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Schedule Meeting
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="max-w-4xl">
              <MeetingList
                meetings={meetings}
                onEditMeeting={handleEditMeeting}
                onCancelMeeting={handleCancelMeeting}
                onJoinMeeting={handleJoinMeeting}
                currentUser={user}
              />
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="max-w-6xl">
              <AvailabilityManager
                availability={availability}
                onUpdateAvailability={handleUpdateAvailability}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MeetingScheduler;