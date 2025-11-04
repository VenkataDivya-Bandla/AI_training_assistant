import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MeetingList = ({ 
  meetings = [], 
  onEditMeeting, 
  onCancelMeeting, 
  onJoinMeeting,
  currentUser 
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filterOptions = [
    { value: 'all', label: 'All Meetings', icon: 'Calendar' },
    { value: 'upcoming', label: 'Upcoming', icon: 'Clock' },
    { value: 'today', label: 'Today', icon: 'CalendarDays' },
    { value: 'past', label: 'Past', icon: 'History' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'type', label: 'Type' },
    { value: 'title', label: 'Title' }
  ];

  const getMeetingTypeColor = (type) => {
    switch (type) {
      case 'hr':
        return 'bg-primary text-primary-foreground';
      case 'manager':
        return 'bg-accent text-accent-foreground';
      case 'mentor':
        return 'bg-warning text-warning-foreground';
      case 'training':
        return 'bg-success text-success-foreground';
      case 'team':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getMeetingTypeLabel = (type) => {
    const types = {
      hr: 'HR Check-in',
      manager: 'Manager 1:1',
      mentor: 'Mentor Session',
      training: 'Training Session',
      team: 'Team Meeting'
    };
    return types?.[type] || type;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    const [hour, minute] = time?.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const isToday = (dateString) => {
    const today = new Date();
    const meetingDate = new Date(dateString);
    return today?.toDateString() === meetingDate?.toDateString();
  };

  const isPast = (dateString, time) => {
    const now = new Date();
    const meetingDateTime = new Date(`${dateString}T${time}`);
    return meetingDateTime < now;
  };

  const isUpcoming = (dateString, time) => {
    const now = new Date();
    const meetingDateTime = new Date(`${dateString}T${time}`);
    return meetingDateTime > now;
  };

  const canJoin = (dateString, time) => {
    const now = new Date();
    const meetingDateTime = new Date(`${dateString}T${time}`);
    const timeDiff = meetingDateTime?.getTime() - now?.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Can join 15 minutes before to 30 minutes after
    return minutesDiff >= -30 && minutesDiff <= 15;
  };

  const filterMeetings = (meetings) => {
    return meetings?.filter(meeting => {
      switch (filter) {
        case 'upcoming':
          return isUpcoming(meeting?.date, meeting?.time);
        case 'today':
          return isToday(meeting?.date);
        case 'past':
          return isPast(meeting?.date, meeting?.time);
        default:
          return true;
      }
    });
  };

  const sortMeetings = (meetings) => {
    return [...meetings]?.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
        case 'type':
          return a?.type?.localeCompare(b?.type);
        case 'title':
          return a?.title?.localeCompare(b?.title);
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedMeetings = sortMeetings(filterMeetings(meetings));

  const getStatusBadge = (meeting) => {
    if (isPast(meeting?.date, meeting?.time)) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          <Icon name="Check" size={12} className="mr-1" />
          Completed
        </span>
      );
    }
    
    if (isToday(meeting?.date)) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning">
          <Icon name="Clock" size={12} className="mr-1" />
          Today
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
        <Icon name="Calendar" size={12} className="mr-1" />
        Upcoming
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">My Meetings</h3>
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="text-sm bg-input border border-border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                Sort by {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        {filterOptions?.map(option => (
          <Button
            key={option?.value}
            variant={filter === option?.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(option?.value)}
            iconName={option?.icon}
            iconPosition="left"
            iconSize={14}
            className="flex-1"
          >
            {option?.label}
          </Button>
        ))}
      </div>
      {/* Meetings List */}
      <div className="space-y-3">
        {filteredAndSortedMeetings?.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No meetings found</h4>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? "You don't have any meetings scheduled yet."
                : `No ${filter} meetings found.`
              }
            </p>
          </div>
        ) : (
          filteredAndSortedMeetings?.map((meeting) => (
            <div
              key={meeting?.id}
              className="bg-card rounded-lg border border-border p-4 hover:shadow-soft transition-smooth"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(meeting?.type)}`}>
                      {getMeetingTypeLabel(meeting?.type)}
                    </span>
                    {getStatusBadge(meeting)}
                  </div>
                  
                  <h4 className="text-lg font-medium text-foreground mb-1">
                    {meeting?.title}
                  </h4>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{formatDate(meeting?.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{formatTime(meeting?.time)} ({meeting?.duration} min)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name={meeting?.location === 'video-call' ? 'Video' : meeting?.location === 'office' ? 'Building' : 'Phone'} size={14} />
                      <span className="capitalize">{meeting?.location?.replace('-', ' ')}</span>
                    </div>
                  </div>
                  
                  {meeting?.attendees && meeting?.attendees?.length > 0 && (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-3">
                      <Icon name="Users" size={14} />
                      <span>With: {meeting?.attendees?.join(', ')}</span>
                    </div>
                  )}
                  
                  {meeting?.agenda && (
                    <div className="text-sm text-muted-foreground">
                      <p className="line-clamp-2">{meeting?.agenda?.split('\n')?.[0]}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {canJoin(meeting?.date, meeting?.time) && meeting?.location === 'video-call' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onJoinMeeting(meeting)}
                      iconName="Video"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Join
                    </Button>
                  )}
                  
                  {!isPast(meeting?.date, meeting?.time) && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditMeeting(meeting)}
                        iconName="Edit"
                        iconSize={14}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCancelMeeting(meeting)}
                        iconName="Trash2"
                        iconSize={14}
                        className="text-error hover:text-error"
                      />
                    </>
                  )}
                </div>
              </div>
              
              {meeting?.recurring && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Icon name="Repeat" size={12} />
                    <span>Recurring {meeting?.recurringType} until {formatDate(meeting?.recurringEnd)}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingList;