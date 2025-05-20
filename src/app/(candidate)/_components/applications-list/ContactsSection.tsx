'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Phone, Video, User } from 'lucide-react';
import type { ContactPerson } from '@/types/Application';

interface ContactsSectionProps {
  contacts: ContactPerson[];
}

export default function ContactsSection({ contacts }: ContactsSectionProps) {
  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-purple-500" />;
      case 'in-person':
        return <User className="h-4 w-4 text-orange-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Contacts</h3>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </div>

        <div className="space-y-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{contact.name}</h4>
                  <p className="text-sm text-gray-500">{contact.role}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
              </div>

              {contact.communications && contact.communications.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-2 text-sm font-medium">
                    Communication History
                  </h5>
                  <div className="space-y-2">
                    {contact.communications.map((comm) => (
                      <div
                        key={comm.id}
                        className="flex items-start gap-2 text-sm"
                      >
                        {getCommunicationIcon(comm.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comm.summary}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comm.date).toLocaleDateString()}
                            </span>
                          </div>
                          {comm.content && (
                            <p className="mt-1 text-gray-600">{comm.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No contacts added yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
