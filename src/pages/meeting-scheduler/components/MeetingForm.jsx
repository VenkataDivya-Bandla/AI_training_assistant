import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MeetingForm = ({ 
  selectedDate, 
  onScheduleMeeting, 
  onCancel,
  editingMeeting = null,
  availableAttendees = [],
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    attendees: [],
    date: '',
    time: '',
    duration: '30',
    location: 'video-call',
    agenda: '',
    recurring: false,
    recurringType: 'weekly',
    recurringEnd: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const meetingTypes = [
    { value: 'hr', label: 'HR Check-in', description: 'General HR discussion and support' },
    { value: 'manager', label: 'Manager 1:1', description: 'One-on-one with direct manager' },
    { value: 'mentor', label: 'Mentor Session', description: 'Mentorship and guidance session' },
    { value: 'training', label: 'Training Session', description: 'Skills and knowledge training' },
    { value: 'team', label: 'Team Meeting', description: 'Team collaboration and updates' }
  ];

  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' }
  ];

  const locationOptions = [
    { value: 'video-call', label: 'Video Call', description: 'Microsoft Teams/Zoom meeting' },
    { value: 'office', label: 'Office Meeting Room', description: 'In-person meeting' },
    { value: 'phone', label: 'Phone Call', description: 'Audio call only' },
    { value: 'hybrid', label: 'Hybrid', description: 'Both in-person and remote attendees' }
  ];

  const recurringOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const agendaTemplates = {
    hr: `• Welcome and introductions\n• Review onboarding progress\n• Address any questions or concerns\n• Discuss company policies and benefits\n• Next steps and follow-up`,
    manager: `• Check-in on current projects\n• Discuss goals and expectations\n• Review performance and feedback\n• Address any challenges\n• Plan upcoming work and priorities`,
    mentor: `• Review learning objectives\n• Discuss current challenges\n• Share industry insights and best practices\n• Set development goals\n• Plan next mentoring session`,
    training: `• Review training materials\n• Hands-on practice session\n• Q&A and clarifications\n• Assessment and feedback\n• Additional resources and next steps`,
    team: `• Team updates and announcements\n• Project status reviews\n• Collaboration opportunities\n• Process improvements\n• Action items and follow-up`
  };

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate?.toISOString()?.split('T')?.[0]
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (editingMeeting) {
      setFormData({
        title: editingMeeting?.title || '',
        type: editingMeeting?.type || '',
        attendees: editingMeeting?.attendees || [],
        date: editingMeeting?.date || '',
        time: editingMeeting?.time || '',
        duration: editingMeeting?.duration || '30',
        location: editingMeeting?.location || 'video-call',
        agenda: editingMeeting?.agenda || '',
        recurring: editingMeeting?.recurring || false,
        recurringType: editingMeeting?.recurringType || 'weekly',
        recurringEnd: editingMeeting?.recurringEnd || '',
        notes: editingMeeting?.notes || ''
      });
    }
  }, [editingMeeting]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Auto-populate agenda template when meeting type changes
    if (field === 'type' && agendaTemplates?.[value] && !formData?.agenda) {
      setFormData(prev => ({
        ...prev,
        agenda: agendaTemplates?.[value]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Meeting title is required';
    }

    if (!formData?.type) {
      newErrors.type = 'Meeting type is required';
    }

    if (formData?.attendees?.length === 0) {
      newErrors.attendees = 'At least one attendee is required';
    }

    if (!formData?.date) {
      newErrors.date = 'Meeting date is required';
    }

    if (!formData?.time) {
      newErrors.time = 'Meeting time is required';
    }

    if (formData?.recurring && !formData?.recurringEnd) {
      newErrors.recurringEnd = 'End date is required for recurring meetings';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onScheduleMeeting(formData);
  };

  const handleUseTemplate = (type) => {
    if (agendaTemplates?.[type]) {
      setFormData(prev => ({
        ...prev,
        agenda: agendaTemplates?.[type]
      }));
    }
  };

  const formatTimeSlot = (time) => {
    const [hour, minute] = time?.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}
        </h3>
        {onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
          >
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meeting Title */}
        <Input
          label="Meeting Title"
          type="text"
          placeholder="Enter meeting title"
          value={formData?.title}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          error={errors?.title}
          required
        />

        {/* Meeting Type */}
        <Select
          label="Meeting Type"
          placeholder="Select meeting type"
          options={meetingTypes}
          value={formData?.type}
          onChange={(value) => handleInputChange('type', value)}
          error={errors?.type}
          required
        />

        {/* Attendees */}
        <Select
          label="Attendees"
          placeholder="Select attendees"
          options={availableAttendees}
          value={formData?.attendees}
          onChange={(value) => handleInputChange('attendees', value)}
          error={errors?.attendees}
          multiple
          searchable
          required
        />

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData?.date}
            onChange={(e) => handleInputChange('date', e?.target?.value)}
            error={errors?.date}
            required
          />
          
          <Select
            label="Time"
            placeholder="Select time"
            options={timeSlots?.map(time => ({
              value: time,
              label: formatTimeSlot(time)
            }))}
            value={formData?.time}
            onChange={(value) => handleInputChange('time', value)}
            error={errors?.time}
            required
          />
        </div>

        {/* Duration and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Duration"
            options={durationOptions}
            value={formData?.duration}
            onChange={(value) => handleInputChange('duration', value)}
          />
          
          <Select
            label="Location"
            options={locationOptions}
            value={formData?.location}
            onChange={(value) => handleInputChange('location', value)}
          />
        </div>

        {/* Recurring Meeting */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData?.recurring}
              onChange={(e) => handleInputChange('recurring', e?.target?.checked)}
              className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
            />
            <label htmlFor="recurring" className="text-sm font-medium text-foreground">
              Recurring Meeting
            </label>
          </div>

          {formData?.recurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <Select
                label="Repeat"
                options={recurringOptions}
                value={formData?.recurringType}
                onChange={(value) => handleInputChange('recurringType', value)}
              />
              
              <Input
                label="End Date"
                type="date"
                value={formData?.recurringEnd}
                onChange={(e) => handleInputChange('recurringEnd', e?.target?.value)}
                error={errors?.recurringEnd}
              />
            </div>
          )}
        </div>

        {/* Agenda */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Agenda
            </label>
            {formData?.type && agendaTemplates?.[formData?.type] && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleUseTemplate(formData?.type)}
                iconName="FileText"
                iconPosition="left"
                iconSize={14}
              >
                Use Template
              </Button>
            )}
          </div>
          <textarea
            placeholder="Enter meeting agenda..."
            value={formData?.agenda}
            onChange={(e) => handleInputChange('agenda', e?.target?.value)}
            rows={6}
            className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Additional Notes
          </label>
          <textarea
            placeholder="Any additional notes or special requirements..."
            value={formData?.notes}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={isLoading}
            iconName="Calendar"
            iconPosition="left"
            iconSize={16}
          >
            {editingMeeting ? 'Update Meeting' : 'Schedule Meeting'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MeetingForm;