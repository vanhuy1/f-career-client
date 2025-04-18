import { ChevronDown, Grid, List } from 'lucide-react';
import CompanyCard from '@/components/company-search/company-card';
import Pagination from '@/components/company-search/pagination';
import FilterSidebar from './filter-sidebar';

export default function CompanySearchPage() {
  const companyData = [
    {
      logo: '/logo-landing/udacity.png',
      name: 'Stripe',
      description:
        "Stripe is a software platform for starting and running internet businesses. Millions of businesses rely on Stripe's software tools...",
      jobCount: 7,
      tags: ['Business', 'Payment gateway'],
      primaryColor: '#6772e5',
    },
    {
      logo: '/logo-landing/udacity.png',
      name: 'Truebill',
      description:
        'Take control of your money. Truebill develops a mobile app that helps consumers take control of their financial...',
      jobCount: 7,
      tags: ['Business'],
      primaryColor: '#4285f4',
    },
    {
      logo: '/logo-landing/udacity.png',
      name: 'Square',
      description:
        'Square builds common business tools in unconventional ways so more people can start, run, and grow their businesses.',
      jobCount: 7,
      tags: ['Business', 'Blockchain'],
      primaryColor: '#000000',
    },
    {
      logo: '/logo-landing/udacity.png',
      name: 'Coinbase',
      description:
        'Coinbase is a digital currency wallet and platform where merchants and consumers can transact with new digital currencies.',
      jobCount: 7,
      tags: ['Business', 'Blockchain'],
      primaryColor: '#0052ff',
    },
    {
      logo: '/logo-landing/udacity.png',
      name: 'Robinhood',
      description:
        'Robinhood is lowering barriers, removing fees, and providing greater access to financial information.',
      jobCount: 7,
      tags: ['Business'],
      primaryColor: '#00c805',
    },
    {
      logo: '/logo-landing/udacity.png',
      name: 'Kraken',
      description:
        "Based in San Francisco, Kraken is the world's largest global bitcoin exchange in euro volume and liquidity.",
      jobCount: 7,
      tags: ['Business', 'Blockchain'],
      primaryColor: '#5741d9',
    },
    {
      logo: '/logo-landing/udacity.png',
      name: 'Revolut',
      description:
        'When Revolut was founded in 2015, we had a vision to build a sustainable, digital alternative to traditional big banks.',
      jobCount: 7,
      tags: ['Business'],
      primaryColor: '#191c1f',
    },
    {
      logo: '/logo-landing/udacity.png',
      name: 'Divvy',
      description:
        'Divvy is a secure financial platform for businesses to manage payments and subscriptions.',
      jobCount: 7,
      tags: ['Business', 'Blockchain'],
      primaryColor: '#000000',
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full shrink-0 md:w-64">
          <FilterSidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">All Companies</h1>
              <p className="text-muted-foreground text-sm">
                Showing 73 results
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  Most relevant
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              <div className="flex rounded border">
                <button className="border-r p-2">
                  <Grid className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-2">
                  <List className="h-4 w-4 text-indigo-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {companyData.map((co, index) => (
              <CompanyCard
                key={index}
                logo={co.logo}
                name={co.name}
                description={co.description}
                companyJobCount={co.jobCount}
                tags={co.tags}
                primaryColor={co.primaryColor}
              />
            ))}
          </div>
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination currentPage={2} totalPages={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
