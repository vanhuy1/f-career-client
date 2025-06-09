'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { Cv } from '@/types/Cv';

interface AboutProps {
  cv: Cv;
  onUpdateCv: <K extends keyof Cv>(key: K, value: Cv[K]) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const About = ({ cv, onUpdateCv, onUploadImage }: AboutProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="displayImage">Display Profile Picture</Label>
        <Switch
          id="displayImage"
          checked={cv.displayImage}
          onCheckedChange={(checked) => onUpdateCv('displayImage', checked)}
        />
      </div>
      {cv.displayImage && (
        <div>
          <Label htmlFor="image">Profile Picture</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={onUploadImage}
            className="mt-1"
          />
        </div>
      )}
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={cv.name}
          onChange={(e) => onUpdateCv('name', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={cv.title}
          onChange={(e) => onUpdateCv('title', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={cv.summary}
          onChange={(e) => onUpdateCv('summary', e.target.value)}
          className="mt-1 h-32"
        />
      </div>
    </div>
  );
};

export default About;
