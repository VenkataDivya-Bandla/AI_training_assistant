import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AvailabilityManager = ({ 
  availability = [], 
  onUpdateAvailability,
  isLoading = false 
}) => {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [editMode, setEditMode] = useState(false);
  const [tempAvailability, setTempAvailability] = useState(availability);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const formatTime = (time) => {
    const [hour, minute] = time?.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getDayAvailability = (day) => {
    return tempAvailability?.find(avail => avail?.day === day) || {
      day,
      enabled: false,
      startTime: '09:00',
      endTime: '17:00',
      breaks: []
    };
  };

  const updateDayAvailability = (day, updates) => {
    setTempAvailability(prev => {
      const existing = prev?.find(avail => avail?.day === day);
      if (existing) {
        return prev?.map(avail => 
          avail?.day === day ? { ...avail, ...updates } : avail
        );
      } else {
        return [...prev, { day, enabled: false, startTime: '09:00', endTime: '17:00', breaks: [], ...updates }];
      }
    });
  };

  const toggleDayEnabled = (day) => {
    const dayAvail = getDayAvailability(day);
    updateDayAvailability(day, { enabled: !dayAvail?.enabled });
  };

  const updateTimeRange = (day, field, value) => {
    updateDayAvailability(day, { [field]: value });
  };

  const addBreak = (day) => {
    const dayAvail = getDayAvailability(day);
    const newBreak = {
      id: Date.now(),
      startTime: '12:00',
      endTime: '13:00',
      label: 'Lunch Break'
    };
    updateDayAvailability(day, {
      breaks: [...dayAvail?.breaks, newBreak]
    });
  };

  const updateBreak = (day, breakId, updates) => {
    const dayAvail = getDayAvailability(day);
    updateDayAvailability(day, {
      breaks: dayAvail?.breaks?.map(br => 
        br?.id === breakId ? { ...br, ...updates } : br
      )
    });
  };

  const removeBreak = (day, breakId) => {
    const dayAvail = getDayAvailability(day);
    updateDayAvailability(day, {
      breaks: dayAvail?.breaks?.filter(br => br?.id !== breakId)
    });
  };

  const handleSave = () => {
    onUpdateAvailability(tempAvailability);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempAvailability(availability);
    setEditMode(false);
  };

  const copyToAllDays = (sourceDay) => {
    const sourceAvail = getDayAvailability(sourceDay);
    const updatedAvailability = daysOfWeek?.map(day => ({
      ...sourceAvail,
      day: day?.key
    }));
    setTempAvailability(updatedAvailability);
  };

  const setBusinessHours = () => {
    const businessHours = daysOfWeek?.map(day => ({
      day: day?.key,
      enabled: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']?.includes(day?.key),
      startTime: '09:00',
      endTime: '17:00',
      breaks: [{
        id: Date.now() + Math.random(),
        startTime: '12:00',
        endTime: '13:00',
        label: 'Lunch Break'
      }]
    }));
    setTempAvailability(businessHours);
  };

  const selectedDayAvail = getDayAvailability(selectedDay);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Availability Settings</h3>
        <div className="flex items-center space-x-2">
          {!editMode ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(true)}
              iconName="Edit"
              iconPosition="left"
              iconSize={14}
            >
              Edit Availability
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
                iconSize={14}
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
      {editMode && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Quick Setup</h4>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={setBusinessHours}
              iconName="Briefcase"
              iconPosition="left"
              iconSize={14}
            >
              Business Hours (9-5, Mon-Fri)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToAllDays(selectedDay)}
              iconName="Copy"
              iconPosition="left"
              iconSize={14}
            >
              Copy {daysOfWeek?.find(d => d?.key === selectedDay)?.label} to All Days
            </Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day Selection */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground mb-3">Days of Week</h4>
          {daysOfWeek?.map(day => {
            const dayAvail = getDayAvailability(day?.key);
            return (
              <div
                key={day?.key}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-smooth ${
                  selectedDay === day?.key 
                    ? 'border-primary bg-primary/10' :'border-border hover:bg-muted/50'
                }`}
                onClick={() => setSelectedDay(day?.key)}
              >
                <div className="flex items-center space-x-3">
                  {editMode && (
                    <input
                      type="checkbox"
                      checked={dayAvail?.enabled}
                      onChange={() => toggleDayEnabled(day?.key)}
                      onClick={(e) => e?.stopPropagation()}
                      className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
                    />
                  )}
                  <div>
                    <div className="font-medium text-foreground">{day?.label}</div>
                    {dayAvail?.enabled ? (
                      <div className="text-xs text-muted-foreground">
                        {formatTime(dayAvail?.startTime)} - {formatTime(dayAvail?.endTime)}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">Unavailable</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    dayAvail?.enabled ? 'bg-success' : 'bg-muted-foreground'
                  }`} />
                  {selectedDay === day?.key && (
                    <Icon name="ChevronRight" size={16} className="text-primary" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Day Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">
              {daysOfWeek?.find(d => d?.key === selectedDay)?.label} Settings
            </h4>
            {editMode && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedDayAvail?.enabled}
                  onChange={() => toggleDayEnabled(selectedDay)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
                />
                <label className="text-sm font-medium text-foreground">Available</label>
              </div>
            )}
          </div>

          {selectedDayAvail?.enabled ? (
            <div className="space-y-6">
              {/* Working Hours */}
              <div className="space-y-4">
                <h5 className="font-medium text-foreground">Working Hours</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
                    {editMode ? (
                      <select
                        value={selectedDayAvail?.startTime}
                        onChange={(e) => updateTimeRange(selectedDay, 'startTime', e?.target?.value)}
                        className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {timeSlots?.map(time => (
                          <option key={time} value={time}>{formatTime(time)}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-3 py-2 text-sm bg-muted border border-border rounded-md">
                        {formatTime(selectedDayAvail?.startTime)}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
                    {editMode ? (
                      <select
                        value={selectedDayAvail?.endTime}
                        onChange={(e) => updateTimeRange(selectedDay, 'endTime', e?.target?.value)}
                        className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {timeSlots?.map(time => (
                          <option key={time} value={time}>{formatTime(time)}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-3 py-2 text-sm bg-muted border border-border rounded-md">
                        {formatTime(selectedDayAvail?.endTime)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Breaks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-foreground">Breaks</h5>
                  {editMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBreak(selectedDay)}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Add Break
                    </Button>
                  )}
                </div>

                {selectedDayAvail?.breaks?.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Icon name="Coffee" size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No breaks scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayAvail?.breaks?.map(breakItem => (
                      <div key={breakItem?.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                        <Icon name="Coffee" size={16} className="text-muted-foreground" />
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          {editMode ? (
                            <>
                              <Input
                                type="text"
                                placeholder="Break name"
                                value={breakItem?.label}
                                onChange={(e) => updateBreak(selectedDay, breakItem?.id, { label: e?.target?.value })}
                              />
                              <select
                                value={breakItem?.startTime}
                                onChange={(e) => updateBreak(selectedDay, breakItem?.id, { startTime: e?.target?.value })}
                                className="px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                {timeSlots?.map(time => (
                                  <option key={time} value={time}>{formatTime(time)}</option>
                                ))}
                              </select>
                              <select
                                value={breakItem?.endTime}
                                onChange={(e) => updateBreak(selectedDay, breakItem?.id, { endTime: e?.target?.value })}
                                className="px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                {timeSlots?.map(time => (
                                  <option key={time} value={time}>{formatTime(time)}</option>
                                ))}
                              </select>
                            </>
                          ) : (
                            <>
                              <div className="font-medium text-foreground">{breakItem?.label}</div>
                              <div className="text-sm text-muted-foreground">{formatTime(breakItem?.startTime)}</div>
                              <div className="text-sm text-muted-foreground">{formatTime(breakItem?.endTime)}</div>
                            </>
                          )}
                        </div>
                        {editMode && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBreak(selectedDay, breakItem?.id)}
                            className="text-error hover:text-error"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium mb-2">Day Not Available</h4>
              <p>You're not available on {daysOfWeek?.find(d => d?.key === selectedDay)?.label}s</p>
              {editMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleDayEnabled(selectedDay)}
                  className="mt-4"
                >
                  Make Available
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;