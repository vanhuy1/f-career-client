import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import ROUTES from '@/constants/navigation';

interface ContactSectionProps {
  email: string;
  phone: string;
  languages: string[];
  readOnly?: boolean;
}

export function ContactSection({
  email,
  phone,
  readOnly = false,
}: ContactSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Additional Details</CardTitle>
        {!readOnly && (
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Link href={ROUTES.CA.HOME.SETTINGS.path}>
              <Edit2 className="h-4 w-4" />
            </Link>
          </Button>
        )}
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
        </div>
      </CardContent>
    </Card>
  );
}
