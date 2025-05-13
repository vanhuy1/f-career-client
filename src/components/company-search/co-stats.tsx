// import { companyData } from '@/data/Company';
// import { Building, Calendar, MapPin, Users } from 'lucide-react';

// interface CompanyStatsProps {
//   company: (typeof companyData)[number];
// }

// export default function CompanyStats({ company }: CompanyStatsProps) {
//   return (
//     <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
//           <Calendar className="h-5 w-5 text-orange-500" />
//         </div>
//         <div>
//           <p className="text-gray-500">Founded</p>
//           <p className="font-medium">{company.founded}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
//           <Users className="h-5 w-5 text-blue-500" />
//         </div>
//         <div>
//           <p className="text-gray-500">Employees</p>
//           <p className="font-medium">{company.employees}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
//           <MapPin className="h-5 w-5 text-green-500" />
//         </div>
//         <div>
//           <p className="text-gray-500">Location</p>
//           <p className="font-medium">{company.location}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
//           <Building className="h-5 w-5 text-purple-500" />
//         </div>
//         <div>
//           <p className="text-gray-500">Industry</p>
//           <p className="font-medium">{company.industry}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
