import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Languages } from 'lucide-react';

interface ContactSectionProps {
  email: string;
  phone: string;
  languages: string[];
}

export function ContactSection({
  email,
  phone,
  languages,
}: ContactSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Additional Details</CardTitle>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="mb-1 text-gray-500">Email</p>
              <p>{email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="mb-1 text-gray-500">Phone</p>
              <p>{phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <p className="mb-1 text-gray-500">Languages</p>
              <p>{languages.join(', ')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
