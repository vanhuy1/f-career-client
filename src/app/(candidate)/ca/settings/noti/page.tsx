'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    applications: true,
    jobs: false,
    recommendations: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save these preferences to a database
    console.log('Notification preferences saved:', notifications);
    alert('Notification preferences updated successfully');
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="py-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Basic Information
        </h2>
        <p className="mt-1 text-gray-600">
          This is notifications preferences that you can update anytime.
        </p>
        <div className="mt-4 border-t border-gray-200"></div>
      </section>

      <section className="py-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <p className="mt-1 text-gray-600">
              Customize your preferred
              <br />
              notification settings
            </p>
          </div>
          <div className="flex-1">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="applications"
                  checked={notifications.applications}
                  onCheckedChange={() =>
                    handleNotificationChange('applications')
                  }
                  className="mt-1"
                />
                <div>
                  <Label
                    htmlFor="applications"
                    className="text-base font-medium text-gray-900"
                  >
                    Applications
                  </Label>
                  <p className="text-sm text-gray-500">
                    These are notifications for jobs that you have applied to
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="jobs"
                  checked={notifications.jobs}
                  onCheckedChange={() => handleNotificationChange('jobs')}
                  className="mt-1"
                />
                <div>
                  <Label
                    htmlFor="jobs"
                    className="text-base font-medium text-gray-900"
                  >
                    Jobs
                  </Label>
                  <p className="text-sm text-gray-500">
                    These are notifications for job openings that suit your
                    profile
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="recommendations"
                  checked={notifications.recommendations}
                  onCheckedChange={() =>
                    handleNotificationChange('recommendations')
                  }
                  className="mt-1"
                />
                <div>
                  <Label
                    htmlFor="recommendations"
                    className="text-base font-medium text-gray-900"
                  >
                    Recommendations
                  </Label>
                  <p className="text-sm text-gray-500">
                    These are notifications for personalized recommendations
                    from our recruiters
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}
