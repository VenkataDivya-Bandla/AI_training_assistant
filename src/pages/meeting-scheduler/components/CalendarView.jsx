import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const CalendarView = ({ 
  currentDate, 
  onDateChange, 
  viewMode, 
  onViewModeChange, 
  selectedDate, 
  onDateSelect,
  meetings,
  availableSlots 
}) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    let day = startOfWeek?.getDay();
    const diff = startOfWeek?.getDate() - day;
    startOfWeek?.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      let day = new Date(startOfWeek);
      day?.setDate(startOfWeek?.getDate() + i);
      weekDays?.push(day);
    }
    return weekDays;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      slots?.push(`${hour}:00`);
      slots?.push(`${hour}:30`);
    }
    return slots;
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    const [hour, minute] = time?.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const isSameDay = (date1, date2) => {
    return date1?.toDateString() === date2?.toDateString();
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const isSelected = (date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  const hasMeeting = (date, time) => {
    return meetings?.some(meeting => 
      isSameDay(new Date(meeting.date), date) && meeting?.time === time
    );
  };

  const isAvailable = (date, time) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return availableSlots?.some(slot => 
      slot?.date === dateStr && slot?.time === time
    );
  };

  const getMeetingType = (date, time) => {
    const meeting = meetings?.find(meeting => 
      isSameDay(new Date(meeting.date), date) && meeting?.time === time
    );
    return meeting?.type || '';
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setMonth(currentDate?.getMonth() + direction);
    onDateChange(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setDate(currentDate?.getDate() + (direction * 7));
    onDateChange(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate?.setDate(currentDate?.getDate() + direction);
    onDateChange(newDate);
  };

  const handleNavigation = (direction) => {
    switch (viewMode) {
      case 'month':
        navigateMonth(direction);
        break;
      case 'week':
        navigateWeek(direction);
        break;
      case 'day':
        navigateDay(direction);
        break;
      default:
        break;
    }
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="grid grid-cols-7 gap-0 border-b border-border">
          {weekDays?.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0">
          {days?.map((day, index) => (
            <div
              key={index}
              className={`min-h-24 p-2 border-r border-b border-border last:border-r-0 cursor-pointer transition-smooth ${
                !day ? 'bg-muted/30' : isToday(day) ?'bg-primary/10': isSelected(day) ?'bg-primary/20' : 'hover:bg-muted/50'
              }`}
              onClick={() => day && onDateSelect(day)}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(day) ? 'text-primary' : isSelected(day) ?'text-primary' : 'text-foreground'
                  }`}>
                    {day?.getDate()}
                  </div>
                  <div className="space-y-1">
                    {meetings?.filter(meeting => isSameDay(new Date(meeting.date), day))?.slice(0, 2)?.map((meeting, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                            meeting?.type === 'hr' ? 'bg-primary' :
                            meeting?.type === 'manager' ? 'bg-accent' :
                            meeting?.type === 'mentor' ? 'bg-warning' : 'bg-secondary'
                          }`}
                        >
                          {formatTime(meeting?.time)}
                        </div>
                      ))}
                    {meetings?.filter(meeting => isSameDay(new Date(meeting.date), day))?.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{meetings?.filter(meeting => isSameDay(new Date(meeting.date), day))?.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const timeSlots = getTimeSlots();

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-8 gap-0 border-b border-border">
          <div className="p-3 bg-muted"></div>
          {weekDays?.map(day => (
            <div
              key={day?.toISOString()}
              className={`p-3 text-center text-sm font-medium cursor-pointer transition-smooth ${
                isToday(day) ? 'bg-primary text-primary-foreground' :
                isSelected(day) ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              onClick={() => onDateSelect(day)}
            >
              <div>{formatDate(day)}</div>
            </div>
          ))}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {timeSlots?.map(time => (
            <div key={time} className="grid grid-cols-8 gap-0 border-b border-border last:border-b-0">
              <div className="p-2 text-xs text-muted-foreground bg-muted/50 border-r border-border">
                {formatTime(time)}
              </div>
              {weekDays?.map(day => (
                <div
                  key={`${day?.toISOString()}-${time}`}
                  className={`p-2 min-h-12 border-r border-border last:border-r-0 cursor-pointer transition-smooth ${
                    hasMeeting(day, time) ? 
                      getMeetingType(day, time) === 'hr' ? 'bg-primary text-primary-foreground' :
                      getMeetingType(day, time) === 'manager' ? 'bg-accent text-accent-foreground' :
                      getMeetingType(day, time) === 'mentor' ? 'bg-warning text-warning-foreground' : 'bg-secondary text-secondary-foreground'
                    : isAvailable(day, time) ? 'bg-success/10 hover:bg-success/20' : 'hover:bg-muted/50'
                  }`}
                  onMouseEnter={() => setHoveredSlot(`${day?.toISOString()}-${time}`)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  onClick={() => {
                    onDateSelect(day);
                    // Trigger time selection callback if needed
                  }}
                >
                  {hasMeeting(day, time) && (
                    <div className="text-xs font-medium">
                      {meetings?.find(meeting => 
                        isSameDay(new Date(meeting.date), day) && meeting?.time === time
                      )?.title}
                    </div>
                  )}
                  {!hasMeeting(day, time) && isAvailable(day, time) && hoveredSlot === `${day?.toISOString()}-${time}` && (
                    <div className="text-xs text-success font-medium">Available</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = getTimeSlots();

    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border bg-muted">
          <h3 className="font-medium text-foreground">
            {currentDate?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {timeSlots?.map(time => (
            <div
              key={time}
              className={`flex items-center p-3 border-b border-border last:border-b-0 cursor-pointer transition-smooth ${
                hasMeeting(currentDate, time) ? 
                  getMeetingType(currentDate, time) === 'hr' ? 'bg-primary text-primary-foreground' :
                  getMeetingType(currentDate, time) === 'manager' ? 'bg-accent text-accent-foreground' :
                  getMeetingType(currentDate, time) === 'mentor' ? 'bg-warning text-warning-foreground' : 'bg-secondary text-secondary-foreground'
                : isAvailable(currentDate, time) ? 'bg-success/10 hover:bg-success/20' : 'hover:bg-muted/50'
              }`}
              onClick={() => {
                // Trigger time selection callback if needed
              }}
            >
              <div className="w-20 text-sm font-medium">
                {formatTime(time)}
              </div>
              <div className="flex-1">
                {hasMeeting(currentDate, time) ? (
                  <div>
                    <div className="font-medium">
                      {meetings?.find(meeting => 
                        isSameDay(new Date(meeting.date), currentDate) && meeting?.time === time
                      )?.title}
                    </div>
                    <div className="text-sm opacity-80">
                      {meetings?.find(meeting => 
                        isSameDay(new Date(meeting.date), currentDate) && meeting?.time === time
                      )?.attendees?.join(', ')}
                    </div>
                  </div>
                ) : isAvailable(currentDate, time) ? (
                  <div className="text-success font-medium">Available</div>
                ) : (
                  <div className="text-muted-foreground">Unavailable</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">
            {viewMode === 'month' && currentDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {viewMode === 'week' && `Week of ${getWeekDays(currentDate)?.[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            {viewMode === 'day' && currentDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigation(-1)}
              iconName="ChevronLeft"
              iconSize={16}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigation(1)}
              iconName="ChevronRight"
              iconSize={16}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            {['month', 'week', 'day']?.map(mode => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Calendar Content */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-muted-foreground">HR Check-in</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded"></div>
          <span className="text-muted-foreground">Manager 1:1</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning rounded"></div>
          <span className="text-muted-foreground">Mentor Session</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success/20 border border-success rounded"></div>
          <span className="text-muted-foreground">Available</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;