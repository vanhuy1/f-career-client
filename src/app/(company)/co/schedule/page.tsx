'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Search,
  Plus,
} from 'lucide-react';

// Extended mock data for schedule
const scheduleEvents = [
  {
    id: 1,
    title: 'Interview with Sarah Johnson',
    type: 'interview',
    time: '09:00 AM',
    duration: '1 hour',
    date: 'Today',
    fullDate: '2024-01-15',
    location: 'Conference Room A',
    candidate: 'Sarah Johnson',
    position: 'Frontend Developer',
    status: 'confirmed',
    interviewer: 'John Smith',
    notes: 'Technical round - React and TypeScript focus',
  },
  {
    id: 2,
    title: 'Team Meeting',
    type: 'meeting',
    time: '02:00 PM',
    duration: '30 mins',
    date: 'Today',
    fullDate: '2024-01-15',
    location: 'Virtual Meeting',
    status: 'confirmed',
    attendees: ['HR Team', 'Engineering Team'],
    notes: 'Weekly sync on hiring progress',
  },
  {
    id: 3,
    title: 'Interview with Michael Chen',
    type: 'interview',
    time: '10:30 AM',
    duration: '1 hour',
    date: 'Tomorrow',
    fullDate: '2024-01-16',
    location: 'Conference Room B',
    candidate: 'Michael Chen',
    position: 'Backend Developer',
    status: 'pending',
    interviewer: 'Emily Davis',
    notes: 'System design and API development',
  },
  {
    id: 4,
    title: 'Quarterly Review',
    type: 'meeting',
    time: '03:00 PM',
    duration: '2 hours',
    date: 'Tomorrow',
    fullDate: '2024-01-16',
    location: 'Main Conference Room',
    status: 'confirmed',
    attendees: ['Management Team', 'Department Heads'],
    notes: 'Q1 performance and hiring metrics review',
  },
  {
    id: 5,
    title: 'Interview with Alex Rodriguez',
    type: 'interview',
    time: '11:00 AM',
    duration: '1 hour',
    date: 'Jan 17',
    fullDate: '2024-01-17',
    location: 'Conference Room A',
    candidate: 'Alex Rodriguez',
    position: 'UX Designer',
    status: 'confirmed',
    interviewer: 'Sarah Wilson',
    notes: 'Portfolio review and design challenge',
  },
  {
    id: 6,
    title: 'HR Strategy Meeting',
    type: 'meeting',
    time: '02:30 PM',
    duration: '1.5 hours',
    date: 'Jan 17',
    fullDate: '2024-01-17',
    location: 'HR Office',
    status: 'confirmed',
    attendees: ['HR Team', 'CEO'],
    notes: 'Discuss new hiring strategies for Q2',
  },
  {
    id: 7,
    title: 'Interview with Lisa Park',
    type: 'interview',
    time: '09:30 AM',
    duration: '1 hour',
    date: 'Jan 18',
    fullDate: '2024-01-18',
    location: 'Virtual Meeting',
    candidate: 'Lisa Park',
    position: 'Product Manager',
    status: 'pending',
    interviewer: 'Mark Thompson',
    notes: 'Product strategy and roadmap discussion',
  },
];

const HRSchedule = () => {
  const [selectedDate, setSelectedDate] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <User className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredEvents = scheduleEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.candidate &&
        event.candidate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.position &&
        event.position.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesDate =
      selectedDate === 'all' || event.fullDate === selectedDate;

    return matchesSearch && matchesType && matchesDate;
  });

  const uniqueDates = [
    ...new Set(scheduleEvents.map((event) => event.fullDate)),
  ].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Schedule</h1>
          <p className="mt-1 text-gray-600">
            Manage your interviews and meetings
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events, candidates, positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="interview">Interviews</option>
                <option value="meeting">Meetings</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Dates</option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {scheduleEvents.filter((e) => e.date === 'Today').length}
            </div>
            <p className="text-sm text-gray-600">
              {
                scheduleEvents.filter(
                  (e) => e.date === 'Today' && e.type === 'interview',
                ).length
              }{' '}
              interviews,
              {
                scheduleEvents.filter(
                  (e) => e.date === 'Today' && e.type === 'meeting',
                ).length
              }{' '}
              meetings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {scheduleEvents.length}
            </div>
            <p className="text-sm text-gray-600">
              {scheduleEvents.filter((e) => e.type === 'interview').length}{' '}
              interviews,
              {scheduleEvents.filter((e) => e.type === 'meeting').length}{' '}
              meetings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {scheduleEvents.filter((e) => e.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">Require confirmation</p>
          </CardContent>
        </Card>
      </div>

      {/* Event List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Schedule Events
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredEvents.length} events)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        <Badge
                          className={`text-xs ${getTypeColor(event.type)}`}
                        >
                          {event.type}
                        </Badge>
                        <Badge
                          className={`text-xs ${getStatusColor(event.status)}`}
                        >
                          {event.status}
                        </Badge>
                      </div>

                      <div className="mb-2 grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time} ({event.duration})
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>

                      {event.candidate && (
                        <div className="mb-1 text-sm text-gray-700">
                          <strong>Candidate:</strong> {event.candidate} •{' '}
                          <strong>Position:</strong> {event.position}
                        </div>
                      )}

                      {event.interviewer && (
                        <div className="mb-1 text-sm text-gray-700">
                          <strong>Interviewer:</strong> {event.interviewer}
                        </div>
                      )}

                      {event.attendees && (
                        <div className="mb-1 text-sm text-gray-700">
                          <strong>Attendees:</strong>{' '}
                          {event.attendees.join(', ')}
                        </div>
                      )}

                      {event.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Notes:</strong> {event.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {event.date}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      {event.status === 'pending' && (
                        <Button variant="default" size="sm">
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p>No events found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HRSchedule;
