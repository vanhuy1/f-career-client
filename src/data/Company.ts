// // src/data/Company.ts
// import { Company } from '@/types/Company';

// // Define companyData as an array
// export const companyData: Company[] = [
//   {
//     companyName: 'Stripe',
//     logo: '/logo-landing/maze.png', // Replace with actual logo path
//     website: 'https://stripe.com',
//     founded: 'July 31, 2011',
//     employees: '4000+',
//     location: '20 countries',
//     industry: 'Payment Gateway',
//     jobCount: 43,
//     primaryColor: '#6772e5',
//     description:
//       "Stripe is a software platform for starting and running internet businesses. Millions of businesses rely on Stripe's software tools to accept payments, expand globally, and manage their businesses online. Stripe has been at the forefront of expanding internet commerce, powering new business models, and supporting the latest platforms, from marketplaces to mobile commerce sites. We believe that growing the GDP of the internet is a problem rooted in code and design, not finance. Stripe is built for developers, makers, and creators. We work on solving the hard technical problems necessary to build global economic infrastructure—from designing highly reliable systems to developing advanced machine learning algorithms to prevent fraud.",
//     techStack: [
//       { companyName: 'HTML 5', logo: '/tech-stack/html5.webp' },
//       { companyName: 'CSS 3', logo: '/tech-stack/css3.png' },
//       { companyName: 'JavaScript', logo: '/tech-stack/javascript.png' },
//       { companyName: 'Ruby', logo: '/tech-stack/rudy.webp' },
//       { companyName: 'Mixpanel', logo: '/tech-stack/mixpannel.webp' },
//       { companyName: 'Framer', logo: '/tech-stack/framer.webp' },
//     ],
//     socialLinks: {
//       twitter: 'twitter.com/stripe',
//       facebook: 'facebook.com/StripeHQ',
//       linkedin: 'linkedin.com/company/stripe',
//     },
//     officeLocations: [
//       { country: 'United States', flag: '🇺🇸' },
//       { country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
//       { country: 'Japan', flag: '🇯🇵' },
//       { country: 'Australia', flag: '🇦🇺' },
//       { country: 'China', flag: '🇨🇳' },
//     ],
//     tags: ['Business', 'Payment gateway'],
//   },
//   {
//     companyName: 'Truebill',
//     logo: '/logo-landing/canva.png', // Replace with actual logo path
//     website: 'https://truebill.com',
//     founded: 'January 15, 2015',
//     employees: '500+',
//     location: '5 countries',
//     industry: 'Finance',
//     jobCount: 7,
//     primaryColor: '#4285f4',
//     description:
//       'Take control of your money. Truebill develops a mobile app that helps consumers take control of their financial lives.',
//     techStack: [],
//     socialLinks: {
//       twitter: '',
//       facebook: '',
//       linkedin: '',
//     },
//     officeLocations: [],
//     tags: ['Business'],
//   },
//   {
//     companyName: 'Square',
//     logo: '/logo-landing/Blinkist.jpg', // Replace with actual logo path
//     website: 'https://squareup.com',
//     founded: 'February 2009',
//     employees: '5000+',
//     location: '8 countries',
//     industry: 'Payment Processing',
//     jobCount: 7,
//     primaryColor: '#000000',
//     description:
//       'Square builds common business tools in unconventional ways so more people can start, run, and grow their businesses.',
//     techStack: [],
//     socialLinks: {
//       twitter: '',
//       facebook: '',
//       linkedin: '',
//     },
//     officeLocations: [],
//     tags: ['Business', 'Blockchain'],
//   },
//   {
//     companyName: 'Coinbase',
//     logo: '/logo-landing/Blinkist.jpg', // Replace with actual logo path
//     website: 'https://coinbase.com',
//     founded: 'June 2012',
//     employees: '3000+',
//     location: '10 countries',
//     industry: 'Cryptocurrency',
//     jobCount: 7,
//     primaryColor: '#0052ff',
//     description:
//       'Coinbase is a digital currency wallet and platform where merchants and consumers can transact with new digital currencies.',
//     techStack: [],
//     socialLinks: {
//       twitter: '',
//       facebook: '',
//       linkedin: '',
//     },
//     officeLocations: [],
//     tags: ['Business', 'Blockchain'],
//   },
//   {
//     companyName: 'Robinhood',
//     logo: '/logo-landing/Blinkist.jpg', // Replace with actual logo path
//     website: 'https://robinhood.com',
//     founded: 'April 2013',
//     employees: '1000+',
//     location: '3 countries',
//     industry: 'Financial Services',
//     jobCount: 7,
//     primaryColor: '#00c805',
//     description:
//       'Robinhood is lowering barriers, removing fees, and providing greater access to financial information.',
//     techStack: [],
//     socialLinks: {
//       twitter: '',
//       facebook: '',
//       linkedin: '',
//     },
//     officeLocations: [],
//     tags: ['Business'],
//   },
//   {
//     companyName: 'Kraken',
//     logo: '/logo-landing/Blinkist.jpg', // Replace with actual logo path
//     website: 'https://kraken.com',
//     founded: 'July 2011',
//     employees: '2000+',
//     location: '6 countries',
//     industry: 'Cryptocurrency Exchange',
//     jobCount: 7,
//     primaryColor: '#5741d9',
//     description:
//       "Based in San Francisco, Kraken is the world's largest global bitcoin exchange in euro volume and liquidity.",
//     techStack: [],
//     socialLinks: {
//       twitter: '',
//       facebook: '',
//       linkedin: '',
//     },
//     officeLocations: [],
//     tags: ['Business', 'Blockchain'],
//   },
//   {
//     companyName: 'Revolut',
//     logo: '/logo-landing/Blinkist.jpg', // Replace with actual logo path
//     website: 'https://revolut.com',
//     founded: 'July 2015',
//     employees: '2500+',
//     location: '30 countries',
//     industry: 'Banking',
//     jobCount: 7,
//     primaryColor: '#191c1f',
//     description:
//       'When Revolut was founded in 2015, we had a vision to build a sustainable, digital alternative to traditional big banks.',
//     techStack: [],
//     socialLinks: {
//       twitter: '',
//       facebook: '',
//       linkedin: '',
//     },
//     officeLocations: [],
//     tags: ['Business'],
//   },
//   {
//     companyName: 'Divvy',
//     logo: '/logo-landing/Blinkist.jpg', // Replace with actual logo path
//     website: 'https://divvy.com',
//     founded: 'March 2016',
//     employees: '800+',
//     location: '2 countries',
//     industry: 'Financial Services',
//     jobCount: 7,
//     primaryColor: '#000000',
//     description:
//       'Divvy is a secure financial platform for businesses to manage payments and subscriptions.',
//     techStack: [],
//     socialLinks: {
//       twitter: '',
//       facebook: '',
//       linkedin: '',
//     },
//     officeLocations: [],
//     tags: ['Business', 'Blockchain'],
//   },
// ];
