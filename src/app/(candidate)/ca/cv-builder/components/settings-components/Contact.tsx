// settings-components/Contact.tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { Cv } from '@/types/Cv';

interface ContactProps {
  cv: Cv;
  onUpdateCv: <K extends keyof Cv>(key: K, value: Cv[K]) => void;
}

const Contact = ({ cv, onUpdateCv }: ContactProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="displayMail">Display Email</Label>
          <Switch
            id="displayMail"
            checked={cv.displayMail}
            onCheckedChange={(checked) => onUpdateCv('displayMail', checked)}
          />
        </div>
        {cv.displayMail && (
          <Input
            id="email"
            value={cv.email}
            onChange={(e) => onUpdateCv('email', e.target.value)}
            placeholder="your.email@example.com"
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="displayLinkedIn">Display LinkedIn</Label>
          <Switch
            id="displayLinkedIn"
            checked={cv.displayLinkedIn}
            onCheckedChange={(checked) =>
              onUpdateCv('displayLinkedIn', checked)
            }
          />
        </div>
        {cv.displayLinkedIn && (
          <Input
            id="linkedin"
            value={cv.linkedin}
            onChange={(e) => onUpdateCv('linkedin', e.target.value)}
            placeholder="linkedin.com/in/username"
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="displayGithub">Display GitHub</Label>
          <Switch
            id="displayGithub"
            checked={cv.displayGithub}
            onCheckedChange={(checked) => onUpdateCv('displayGithub', checked)}
          />
        </div>
        {cv.displayGithub && (
          <Input
            id="github"
            value={cv.github}
            onChange={(e) => onUpdateCv('github', e.target.value)}
            placeholder="github.com/username"
          />
        )}
      </div>
    </div>
  );
};

export default Contact;
