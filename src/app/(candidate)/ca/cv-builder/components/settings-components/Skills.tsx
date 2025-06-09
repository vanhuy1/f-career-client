// settings-components/Skills.tsx
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Cv } from '@/types/Cv';

interface SkillsProps {
  cv: Cv;
  onUpdateCv: <K extends keyof Cv>(key: K, value: Cv[K]) => void;
  onAddTag: (
    e: React.KeyboardEvent,
    key: 'skills' | 'languages',
    value: string,
  ) => void;
  onRemoveTag: (key: 'skills' | 'languages', value: string) => void;
}

const Skills = ({ cv, onAddTag, onRemoveTag }: SkillsProps) => {
  const [skill, setSkill] = useState('');
  const [language, setLanguage] = useState('');

  const handleKeyDown = (
    e: React.KeyboardEvent,
    key: 'skills' | 'languages',
    value: string,
  ) => {
    if (e.key === 'Enter' && value.trim()) {
      onAddTag(e, key, value.trim());
      if (key === 'skills') setSkill('');
      else setLanguage('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'skills', skill)}
          placeholder="Add a skill and press Enter"
          className="mt-1"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {cv.skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center rounded bg-gray-100 px-2 py-1"
            >
              <span>{skill}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveTag('skills', skill)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="languages">Languages</Label>
        <Input
          id="languages"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'languages', language)}
          placeholder="Add a language and press Enter"
          className="mt-1"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {cv.languages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center rounded bg-gray-100 px-2 py-1"
            >
              <span>{lang}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveTag('languages', lang)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
