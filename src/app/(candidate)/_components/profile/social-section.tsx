import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Instagram, Twitter, Globe } from 'lucide-react';

interface SocialSectionProps {
  instagram: string;
  twitter: string;
  website: string;
}

export function SocialSection({
  instagram,
  twitter,
  website,
}: SocialSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Social Links</CardTitle>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <p className="mb-1 text-gray-500">Instagram</p>
              <a
                href={`https://${instagram}`}
                className="text-indigo-600 hover:underline"
              >
                {instagram}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <Twitter className="h-5 w-5" />
            </div>
            <div>
              <p className="mb-1 text-gray-500">Twitter</p>
              <a
                href={`https://${twitter}`}
                className="text-indigo-600 hover:underline"
              >
                {twitter}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="mb-1 text-gray-500">Website</p>
              <a
                href={`https://${website}`}
                className="text-indigo-600 hover:underline"
              >
                {website}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
