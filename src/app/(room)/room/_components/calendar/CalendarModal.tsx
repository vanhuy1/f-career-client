'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { cn } from '@/lib/utils';
import Modal from '../ui/Modal';
import IconButton from '../ui/IconButton';
import Icon from '../ui/Icon';
import {
  addCalendarEvent,
  updateCalendarEvent,
  removeCalendarEvent,
} from '@/services/state/roomSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format, parse, isBefore, isToday } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Bell,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

// Type definition for event with notification settings
interface EventWithNotification {
  id: string;
  title: string;
  date: string;
  time?: string;
  notes?: string;
  color: string;
  notification: boolean;
  notificationTime: number; // minutes before event
  synced: boolean; // whether synced with Google Calendar
}

export default function CalendarModal() {
  const dispatch = useAppDispatch();
  const calendarEvents = useSelector(
    (state: RootState) => state.room.calendar.events,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithNotification | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (selectedEvent || isAddingEvent) {
  }

  // Form state for new/edited event
  const [eventForm, setEventForm] = useState<EventWithNotification>({
    id: '',
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    notes: '',
    color: '#4ade80', // Green by default
    notification: true,
    notificationTime: 15, // 15 minutes before by default
    synced: false,
  });

  // Get events for the selected date
  const eventsForSelectedDate = calendarEvents
    .filter((event) => event.date === format(currentDate, 'yyyy-MM-dd'))
    .sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (!a.time) return 1;
      if (!b.time) return -1;
      return 0;
    });

  // Handle modal open/close
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    resetForm();
    setSelectedTab('calendar');
  };

  // Reset form state
  const resetForm = () => {
    setEventForm({
      id: '',
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      notes: '',
      color: '#4ade80',
      notification: true,
      notificationTime: 15,
      synced: false,
    });
    setIsAddingEvent(false);
    setIsEditingEvent(false);
    setSelectedEvent(null);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setEventForm((prev) => ({ ...prev, [name]: checked }));
  };

  // Add a new event
  const handleAddEvent = () => {
    if (!eventForm.title) {
      toast.error('Please enter a title for your event');
      return;
    }

    const newEvent = {
      ...eventForm,
      id: uuidv4(),
    };

    dispatch(addCalendarEvent(newEvent));

    // If notification is enabled, schedule it
    if (newEvent.notification) {
      scheduleNotification(newEvent);
    }

    // If Google Calendar sync is enabled and we're connected, sync this event
    if (isGoogleConnected && eventForm.synced) {
      syncEventToGoogle(newEvent);
    }

    toast.success('Event added successfully!');
    resetForm();
    setSelectedTab('calendar');
  };

  // Update an existing event
  const handleUpdateEvent = () => {
    if (!eventForm.title) {
      toast.error('Please enter a title for your event');
      return;
    }

    dispatch(updateCalendarEvent(eventForm));

    // If notification is enabled, schedule it
    if (eventForm.notification) {
      scheduleNotification(eventForm);
    }

    // If Google Calendar sync is enabled and we're connected, sync this event
    if (isGoogleConnected && eventForm.synced) {
      syncEventToGoogle(eventForm);
    }

    toast.success('Event updated successfully!');
    resetForm();
    setSelectedTab('calendar');
  };

  // Delete an event
  const handleDeleteEvent = (id: string) => {
    dispatch(removeCalendarEvent(id));
    toast.success('Event deleted successfully!');
    resetForm();
  };

  // Edit an event
  const handleEditEvent = (event: EventWithNotification) => {
    setEventForm(event);
    setSelectedEvent(event);
    setIsEditingEvent(true);
    setIsAddingEvent(false);
    setSelectedTab('add');
  };

  // Function to schedule browser notification
  const scheduleNotification = (event: EventWithNotification) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      try {
        // Calculate notification time
        const eventDateTime = event.time
          ? parse(`${event.date} ${event.time}`, 'yyyy-MM-dd HH:mm', new Date())
          : parse(`${event.date} 09:00`, 'yyyy-MM-dd HH:mm', new Date());

        const notificationTime = new Date(
          eventDateTime.getTime() - event.notificationTime * 60 * 1000,
        );
        const now = new Date();

        if (notificationTime > now) {
          const timeoutId = setTimeout(() => {
            new Notification('Event Reminder', {
              body: `${event.title} is starting in ${event.notificationTime} minutes`,
              icon: '/notification-icon.png',
            });
          }, notificationTime.getTime() - now.getTime());

          // Store timeout ID in localStorage to persist across page reloads
          const notifications = JSON.parse(
            localStorage.getItem('calendarNotifications') || '{}',
          );
          notifications[event.id] = timeoutId;
          localStorage.setItem(
            'calendarNotifications',
            JSON.stringify(notifications),
          );
        }
      } catch (err) {
        console.error('Error scheduling notification:', err);
      }
    }
  };

  // Function to connect to Google Calendar
  const connectToGoogle = async () => {
    try {
      setIsSyncing(true);

      // Mock function - would actually use OAuth flow in production
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsGoogleConnected(true);
      toast.success('Connected to Google Calendar!');
    } catch (error) {
      toast.error('Failed to connect to Google Calendar');
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Function to sync event to Google Calendar
  const syncEventToGoogle = async (event: EventWithNotification) => {
    try {
      // Mock function - would actually call Google Calendar API in production
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success(`Event "${event.title}" synced with Google Calendar`);
    } catch (error) {
      toast.error('Failed to sync event with Google Calendar');
      console.error(error);
    }
  };

  // Sync all events to Google Calendar
  const syncAllEvents = async () => {
    try {
      setIsSyncing(true);

      // Mock function - would actually batch events to Google Calendar API in production
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('All events synced with Google Calendar');
    } catch (error) {
      toast.error('Failed to sync events with Google Calendar');
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const days = [];

    // Previous month days to fill first week
    const firstDay = startDate.getDay();
    for (let i = firstDay; i > 0; i--) {
      const day = new Date(startDate);
      day.setDate(day.getDate() - i);
      days.push({ date: day, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= endDate.getDate(); i++) {
      const day = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i,
      );
      days.push({ date: day, isCurrentMonth: true });
    }

    // Next month days to fill last week
    const lastDay = endDate.getDay();
    for (let i = 1; i < 7 - lastDay; i++) {
      const day = new Date(endDate);
      day.setDate(day.getDate() + i);
      days.push({ date: day, isCurrentMonth: false });
    }

    return days;
  };

  // Function to change month
  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // Calendar days
  const calendarDays = generateCalendarDays();

  // Check if there are events on a specific date
  const hasEventsOnDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return calendarEvents.some((event) => event.date === dateStr);
  };

  // Get day styling based on whether it's past, today, or future
  const getDayStyle = (date: Date, isCurrentMonth: boolean) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!isCurrentMonth) return 'text-stone-600';
    if (isToday(date)) return 'bg-green-500/20 text-green-400 font-medium';
    if (isBefore(date, today)) return 'text-stone-500'; // Past days are grey
    return 'text-white'; // Future days are white
  };

  // Render tabs
  const renderTabs = () => (
    <div className="mb-4 flex border-b border-stone-700/50">
      <button
        className={cn(
          'px-4 py-2 text-sm font-medium',
          selectedTab === 'calendar'
            ? 'border-b-2 border-green-400 text-green-400'
            : 'text-stone-400 hover:text-white',
        )}
        onClick={() => setSelectedTab('calendar')}
      >
        Calendar
      </button>
      <button
        className={cn(
          'px-4 py-2 text-sm font-medium',
          selectedTab === 'add'
            ? 'border-b-2 border-green-400 text-green-400'
            : 'text-stone-400 hover:text-white',
        )}
        onClick={() => {
          setSelectedTab('add');
          setIsAddingEvent(true);
          setIsEditingEvent(false);
        }}
      >
        {isEditingEvent ? 'Edit Event' : 'Add Event'}
      </button>
      <button
        className={cn(
          'px-4 py-2 text-sm font-medium',
          selectedTab === 'google'
            ? 'border-b-2 border-green-400 text-green-400'
            : 'text-stone-400 hover:text-white',
        )}
        onClick={() => setSelectedTab('google')}
      >
        Google Calendar
      </button>
    </div>
  );

  // Render calendar view
  const renderCalendarView = () => (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => changeMonth(-1)}
          className="rounded p-1 text-stone-400 hover:bg-stone-800"
        >
          <Icon name="Previous" />
        </button>

        <h3 className="font-medium text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h3>

        <button
          onClick={() => changeMonth(1)}
          className="rounded p-1 text-stone-400 hover:bg-stone-800"
        >
          <Icon name="Next" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-medium text-stone-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            className={cn(
              'relative flex h-10 items-center justify-center rounded-md text-sm',
              day.isCurrentMonth ? 'hover:bg-stone-800' : 'text-stone-600',
              getDayStyle(day.date, day.isCurrentMonth),
              format(day.date, 'yyyy-MM-dd') ===
                format(currentDate, 'yyyy-MM-dd') && 'ring-1 ring-green-400',
            )}
            onClick={() => setCurrentDate(day.date)}
          >
            {format(day.date, 'd')}
            {hasEventsOnDate(day.date) && (
              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-green-400"></span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-medium text-white">
            {format(currentDate, 'MMMM d, yyyy')}
          </h4>
          <Button
            size="sm"
            onClick={() => {
              setIsAddingEvent(true);
              setIsEditingEvent(false);
              setEventForm((prev) => ({
                ...prev,
                date: format(currentDate, 'yyyy-MM-dd'),
              }));
              setSelectedTab('add');
            }}
            className="flex items-center gap-1 border border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/30"
          >
            <Plus size={14} />
            <span>Add Event</span>
          </Button>
        </div>

        {eventsForSelectedDate.length > 0 ? (
          <div className="space-y-2">
            {eventsForSelectedDate.map((event) => (
              <div
                key={event.id}
                className="flex items-center rounded-md border border-stone-700/50 bg-stone-800/50 p-3"
              >
                <div
                  className="mr-3 h-12 w-2 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      (event as EventWithNotification).color || '#4ade80',
                  }}
                ></div>
                <div className="flex-1">
                  <div className="font-medium text-white">{event.title}</div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-stone-400">
                    {event.time && (
                      <span className="flex items-center">
                        <CalendarIcon size={12} className="mr-1.5" />
                        <span>{event.time}</span>
                      </span>
                    )}
                    {(event as EventWithNotification).notification && (
                      <span className="flex items-center">
                        <Bell size={12} className="mr-1.5" />
                        <span>
                          {(event as EventWithNotification).notificationTime}{' '}
                          min before
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      handleEditEvent(event as EventWithNotification)
                    }
                    className="rounded-full p-1 text-stone-400 hover:bg-stone-700 hover:text-white"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="rounded-full p-1 text-stone-400 hover:bg-stone-700 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-stone-400">
            No events for this day. Click Add Event to create one.
          </div>
        )}
      </div>
    </div>
  );

  // Render event form
  const renderEventForm = () => (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-stone-300">
            Event Title
          </Label>
          <Input
            id="title"
            name="title"
            value={eventForm.title}
            onChange={handleInputChange}
            placeholder="Enter event title"
            className="mt-1 border-stone-700/50 bg-stone-800 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-stone-300">
              Date
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={eventForm.date}
              onChange={handleInputChange}
              className="mt-1 border-stone-700/50 bg-stone-800 text-white"
            />
          </div>
          <div>
            <Label htmlFor="time" className="text-stone-300">
              Time (optional)
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={eventForm.time}
              onChange={handleInputChange}
              className="mt-1 border-stone-700/50 bg-stone-800 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="text-stone-300">
            Notes (optional)
          </Label>
          <Textarea
            id="notes"
            name="notes"
            value={eventForm.notes || ''}
            onChange={handleInputChange}
            placeholder="Add notes about this event"
            className="mt-1 h-20 border-stone-700/50 bg-stone-800 text-white"
          />
        </div>

        <div>
          <Label htmlFor="color" className="text-stone-300">
            Color
          </Label>
          <div className="mt-1 flex items-center gap-2">
            {['#4ade80', '#60a5fa', '#f97316', '#a855f7', '#f43f5e'].map(
              (color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setEventForm((prev) => ({ ...prev, color }))}
                  className={cn(
                    'h-6 w-6 rounded-full',
                    eventForm.color === color && 'ring-2 ring-white',
                  )}
                  style={{ backgroundColor: color }}
                />
              ),
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="notification"
              checked={eventForm.notification}
              onCheckedChange={(checked) =>
                handleSwitchChange('notification', checked)
              }
            />
            <Label htmlFor="notification" className="text-stone-300">
              Enable Notification
            </Label>
          </div>

          {eventForm.notification && (
            <div className="flex items-center gap-2">
              <Label
                htmlFor="notificationTime"
                className="text-sm text-stone-300"
              >
                Minutes before:
              </Label>
              <select
                id="notificationTime"
                name="notificationTime"
                value={eventForm.notificationTime}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    notificationTime: Number(e.target.value),
                  }))
                }
                className="rounded-md border border-stone-700/50 bg-stone-800 px-2 py-1 text-sm text-white"
              >
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>
          )}
        </div>

        {isGoogleConnected && (
          <div className="flex items-center space-x-2">
            <Switch
              id="synced"
              checked={eventForm.synced}
              onCheckedChange={(checked) =>
                handleSwitchChange('synced', checked)
              }
            />
            <Label htmlFor="synced" className="text-stone-300">
              Sync with Google Calendar
            </Label>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {isEditingEvent && (
            <Button
              variant="destructive"
              onClick={() => handleDeleteEvent(eventForm.id)}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Delete Event
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              resetForm();
              setSelectedTab('calendar');
            }}
            className="border border-stone-700/50"
          >
            Cancel
          </Button>
          <Button
            onClick={isEditingEvent ? handleUpdateEvent : handleAddEvent}
            className="border border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/30"
          >
            {isEditingEvent ? 'Update Event' : 'Add Event'}
          </Button>
        </div>
      </div>
    </div>
  );

  // Render Google Calendar integration
  const renderGoogleCalendarIntegration = () => (
    <div className="p-4">
      <div className="py-6 text-center">
        {isGoogleConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span className="font-medium">Connected to Google Calendar</span>
            </div>

            <p className="text-stone-300">
              Your events will be synced with Google Calendar when you create or
              update them if you enable sync for each event.
            </p>

            <div className="mt-6 flex justify-center gap-4">
              <Button
                onClick={syncAllEvents}
                disabled={isSyncing}
                className="flex items-center gap-2 border border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/30"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Sync All Events</span>
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() =>
                  window.open('https://calendar.google.com', '_blank')
                }
                className="flex items-center gap-2 border border-stone-700/50"
              >
                <ExternalLink size={16} />
                <span>Open Google Calendar</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xl font-medium text-white">
              Connect to Google Calendar
            </div>
            <p className="text-stone-300">
              Connect your Google Calendar to sync study room events and get
              notifications across all your devices.
            </p>

            <Button
              onClick={connectToGoogle}
              disabled={isSyncing}
              className="mt-4 flex items-center gap-2 border border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/30"
            >
              {isSyncing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Icon name="Calendar" />
                  <span>Connect Google Calendar</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Render the appropriate content based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case 'calendar':
        return renderCalendarView();
      case 'add':
        return renderEventForm();
      case 'google':
        return renderGoogleCalendarIntegration();
      default:
        return renderCalendarView();
    }
  };

  return (
    <>
      <IconButton
        icon="Calendar"
        label="Calendar"
        onClick={handleOpen}
        isActive={isOpen}
      />

      <Modal isOpen={isOpen} onClose={handleClose} title="Calendar" size="md">
        <div>
          {renderTabs()}
          {renderContent()}
        </div>
      </Modal>
    </>
  );
}
