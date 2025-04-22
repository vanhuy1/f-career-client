import { CheckCircle2 } from 'lucide-react';

interface CheckListItemProps {
  children: React.ReactNode;
}

export default function CheckListItem({ children }: CheckListItemProps) {
  return (
    <li className="flex items-start">
      <CheckCircle2 className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
      <span className="text-gray-600">{children}</span>
    </li>
  );
}
