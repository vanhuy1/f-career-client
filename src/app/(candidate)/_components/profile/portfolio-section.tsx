import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Portfolio } from '@/types/UserProfile';

interface PortfolioSectionProps {
  portfolios: Portfolio[];
}

export function PortfolioSection({ portfolios }: PortfolioSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Portfolios</CardTitle>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="space-y-2">
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image
                  src={portfolio.image || '/placeholder.svg'}
                  alt={portfolio.title}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm">{portfolio.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
