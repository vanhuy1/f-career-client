'use client';

import { cn } from '@/lib/utils';
import IconButton from './IconButton';

export default function IconButtonDemo() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Icon Button Variants</h3>
        <div className="flex flex-col gap-6">
          <div>
            <h4 className="text-sm text-stone-400 mb-2">Default (Tooltip)</h4>
            <div className="flex gap-4">
              <IconButton 
                icon="Clock" 
                label="Default Tooltip" 
              />
              <IconButton 
                icon="Calendar" 
                label="Active Tooltip" 
                isActive={true} 
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-stone-400 mb-2">Hover Right</h4>
            <div className="flex gap-4">
              <IconButton 
                icon="Clock" 
                label="Hover Right Label" 
                labelPosition="hover-right" 
              />
              <IconButton 
                icon="Calendar" 
                label="Active Hover Right" 
                labelPosition="hover-right"
                isActive={true} 
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-stone-400 mb-2">Always Right</h4>
            <div className="flex gap-4">
              <IconButton 
                icon="Clock" 
                label="Always Right" 
                labelPosition="right" 
              />
              <IconButton 
                icon="Calendar" 
                label="Active Right" 
                labelPosition="right"
                isActive={true} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 