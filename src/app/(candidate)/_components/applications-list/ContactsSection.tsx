'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import type { ContactPerson } from '@/types/Application';

interface ContactsSectionProps {
  contacts: ContactPerson[];
}

export default function ContactsSection({ contacts }: ContactsSectionProps) {
  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Contacts</h3>
        </div>

        <div className="space-y-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{contact.name}</h4>
                  <p className="text-sm text-gray-500">{contact.role}</p>
                </div>
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
