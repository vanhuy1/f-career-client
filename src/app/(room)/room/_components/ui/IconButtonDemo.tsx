'use client';

import IconButton from './IconButton';

export default function IconButtonDemo() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="mb-4 text-lg font-medium text-white">
          Icon Button Variants
        </h3>
        <div className="flex flex-col gap-6">
          <div>
            <h4 className="mb-2 text-sm text-stone-400">Default (Tooltip)</h4>
            <div className="flex gap-4">
              <IconButton icon="Clock" label="Default Tooltip" />
              <IconButton
                icon="Calendar"
                label="Active Tooltip"
                isActive={true}
              />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm text-stone-400">Hover Right</h4>
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
            <h4 className="mb-2 text-sm text-stone-400">Always Right</h4>
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
