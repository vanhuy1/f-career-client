interface CompanyLogoProps {
  company: string;
  color: string;
}

export function CompanyLogo({ company, color }: CompanyLogoProps) {
  const getLogoColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'black':
        return 'bg-gray-100 text-gray-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getInitial = () => {
    return company.charAt(0);
  };

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-md ${getLogoColor()}`}
    >
      {getInitial()}
    </div>
  );
}
