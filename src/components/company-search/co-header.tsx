// import { companyData } from '@/data/Company';
// import Link from 'next/link';

// interface CompanyHeaderProps {
//   company: (typeof companyData)[number];
// }

// export default function CompanyHeader({ company }: CompanyHeaderProps) {
//   return (
//     <div>
//       <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
//         <h1 className="text-5xl font-bold text-gray-800">{company.name}</h1>
//         <div
//           className="rounded-md border px-4 py-1"
//           style={{
//             borderColor: company.primaryColor,
//             color: company.primaryColor,
//           }}
//         >
//           {company.jobCount} Jobs
//         </div>
//       </div>
//       <Link
//         href={company.website}
//         className="mb-8 inline-block hover:underline"
//         style={{ color: company.primaryColor }}
//       >
//         {company.website}
//       </Link>
//     </div>
//   );
// }
