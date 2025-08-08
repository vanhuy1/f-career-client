// components/editor/sections/Skills.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import type { Cv } from '@/types/Cv';
import { toast } from 'react-toastify';

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

// Type definitions
interface StackOverflowTag {
  name: string;
  count: number;
  is_moderator_only: boolean;
  is_required: boolean;
  has_synonyms: boolean;
}

interface StackOverflowResponse {
  items: StackOverflowTag[];
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
}

interface CountryLanguageResponse {
  languages?: Record<string, string>;
}

// API service for skills suggestions - using multiple sources
const fetchSkillsSuggestions = async (query: string): Promise<string[]> => {
  try {
    // Using Stack Overflow API for technical skills
    const response = await fetch(
      `https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&inname=${encodeURIComponent(query)}&site=stackoverflow&pagesize=20`,
    );
    const data: StackOverflowResponse = await response.json();

    // Format tags to proper case
    const skills =
      data.items?.map((item) => {
        // Convert snake_case or kebab-case to proper names
        return item.name
          .split(/[-_]/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }) || [];

    return skills;
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};

// API service for language suggestions - simplified without proficiency levels
const fetchLanguageSuggestions = async (query: string): Promise<string[]> => {
  try {
    // Using REST Countries API for language data
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=languages',
    );
    const countries: CountryLanguageResponse[] = await response.json();

    // Extract unique languages
    const languagesSet = new Set<string>();
    countries.forEach((country) => {
      if (country.languages) {
        Object.values(country.languages).forEach((lang) => {
          languagesSet.add(lang);
        });
      }
    });

    // Convert to array and filter by query
    const languages = Array.from(languagesSet)
      .filter((lang) => lang.toLowerCase().includes(query.toLowerCase()))
      .sort()
      .slice(0, 15);

    return languages;
  } catch (error) {
    console.error('Error fetching languages:', error);
    // Fallback to common languages if API fails
    return getCommonLanguages()
      .filter((lang) => lang.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 15);
  }
};

// Fallback common languages - just language names without proficiency
const getCommonLanguages = () => [
  'English',
  'Spanish',
  'Chinese',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Bengali',
  'Russian',
  'Japanese',
  'Punjabi',
  'German',
  'Javanese',
  'Wu Chinese',
  'Malay',
  'Telugu',
  'Vietnamese',
  'Korean',
  'French',
  'Marathi',
  'Tamil',
  'Urdu',
  'Turkish',
  'Italian',
  'Thai',
  'Gujarati',
  'Jin Chinese',
  'Min Nan Chinese',
  'Persian',
  'Polish',
  'Pashto',
  'Kannada',
  'Xiang Chinese',
  'Malayalam',
  'Sundanese',
  'Hausa',
  'Odia',
  'Burmese',
  'Hakka Chinese',
  'Ukrainian',
  'Bhojpuri',
  'Tagalog',
  'Yoruba',
  'Maithili',
  'Uzbek',
  'Sindhi',
  'Amharic',
  'Fula',
  'Romanian',
  'Oromo',
  'Igbo',
  'Azerbaijani',
  'Awadhi',
  'Gan Chinese',
  'Cebuano',
  'Dutch',
  'Kurdish',
  'Serbo-Croatian',
  'Malagasy',
  'Saraiki',
  'Nepali',
  'Sinhala',
  'Chittagonian',
  'Zhuang',
  'Khmer',
  'Turkmen',
  'Assamese',
  'Madurese',
  'Somali',
  'Marwari',
  'Magahi',
  'Haryanvi',
  'Hungarian',
  'Chhattisgarhi',
  'Greek',
  'Chewa',
  'Deccan',
  'Akan',
  'Kazakh',
  'Min Bei Chinese',
  'Sylheti',
  'Zulu',
  'Czech',
  'Kinyarwanda',
  'Dhundhari',
  'Haitian Creole',
  'Min Dong Chinese',
  'Ilokano',
  'Quechua',
  'Kirundi',
  'Swedish',
  'Hmong',
  'Shona',
  'Uyghur',
  'Hiligaynon',
  'Mossi',
  'Xhosa',
];

const Skills = ({ cv, onAddTag, onRemoveTag }: SkillsProps) => {
  const [skill, setSkill] = useState('');
  const [language, setLanguage] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [languageSuggestions, setLanguageSuggestions] = useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const skillInputRef = useRef<HTMLInputElement>(null);
  const languageInputRef = useRef<HTMLInputElement>(null);
  const skillDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Store timeout refs for debouncing
  const skillTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const languageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch skill suggestions with debounce - fixed with inline function
  const fetchSkillsDebounced = useCallback(
    (query: string) => {
      // Clear previous timeout
      if (skillTimeoutRef.current) {
        clearTimeout(skillTimeoutRef.current);
      }

      // Set new timeout
      skillTimeoutRef.current = setTimeout(async () => {
        if (query.length < 2) {
          setSkillSuggestions([]);
          return;
        }

        setIsLoadingSkills(true);
        try {
          const suggestions = await fetchSkillsSuggestions(query);
          // Filter out skills that are already added
          const filteredSuggestions = suggestions.filter(
            (s) =>
              !cv.skills.some(
                (skill) => skill.toLowerCase() === s.toLowerCase(),
              ),
          );
          setSkillSuggestions(filteredSuggestions);
        } catch (error) {
          console.error('Error fetching skills:', error);
          setSkillSuggestions([]);
        } finally {
          setIsLoadingSkills(false);
        }
      }, 300);
    },
    [cv.skills],
  );

  // Fetch language suggestions with debounce - fixed with inline function
  const fetchLanguagesDebounced = useCallback(
    (query: string) => {
      // Clear previous timeout
      if (languageTimeoutRef.current) {
        clearTimeout(languageTimeoutRef.current);
      }

      // Set new timeout
      languageTimeoutRef.current = setTimeout(async () => {
        if (query.length < 1) {
          setLanguageSuggestions([]);
          return;
        }

        setIsLoadingLanguages(true);
        try {
          const suggestions = await fetchLanguageSuggestions(query);
          // Filter out languages that are already added
          const filteredSuggestions = suggestions.filter(
            (l) =>
              !(cv.languages || []).some(
                (lang) => lang.toLowerCase() === l.toLowerCase(),
              ),
          );
          setLanguageSuggestions(filteredSuggestions);
        } catch (error) {
          console.error('Error fetching languages:', error);
          setLanguageSuggestions([]);
        } finally {
          setIsLoadingLanguages(false);
        }
      }, 300);
    },
    [cv.languages],
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (skillTimeoutRef.current) {
        clearTimeout(skillTimeoutRef.current);
      }
      if (languageTimeoutRef.current) {
        clearTimeout(languageTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (skill) {
      fetchSkillsDebounced(skill);
      setShowSkillSuggestions(true);
    } else {
      setSkillSuggestions([]);
      setShowSkillSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);
  }, [skill, fetchSkillsDebounced]);

  useEffect(() => {
    if (language) {
      fetchLanguagesDebounced(language);
      setShowLanguageSuggestions(true);
    } else {
      setLanguageSuggestions([]);
      setShowLanguageSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);
  }, [language, fetchLanguagesDebounced]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        skillDropdownRef.current &&
        !skillDropdownRef.current.contains(event.target as Node) &&
        !skillInputRef.current?.contains(event.target as Node)
      ) {
        setShowSkillSuggestions(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node) &&
        !languageInputRef.current?.contains(event.target as Node)
      ) {
        setShowLanguageSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSkillSelect = (selectedSkill: string) => {
    // Check if skill already exists (case insensitive)
    if (
      cv.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())
    ) {
      toast.warning('This skill already exists');
      return;
    }

    // Create a proper event with target
    const fakeEvent = {
      key: 'Enter',
      preventDefault: () => {},
      target: { value: '' },
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    onAddTag(fakeEvent, 'skills', selectedSkill);
    setSkill('');
    setShowSkillSuggestions(false);
    setSelectedSuggestionIndex(-1);
    skillInputRef.current?.focus();
  };

  const handleLanguageSelect = (selectedLanguage: string) => {
    // Check if language already exists (case insensitive)
    if (
      (cv.languages || []).some(
        (l) => l.toLowerCase() === selectedLanguage.toLowerCase(),
      )
    ) {
      toast.warning('This language already exists');
      return;
    }

    // Create a proper event with target
    const fakeEvent = {
      key: 'Enter',
      preventDefault: () => {},
      target: { value: '' },
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    onAddTag(fakeEvent, 'languages', selectedLanguage);
    setLanguage('');
    setShowLanguageSuggestions(false);
    setSelectedSuggestionIndex(-1);
    languageInputRef.current?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    key: 'skills' | 'languages',
    value: string,
    suggestions: string[],
  ) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (
        selectedSuggestionIndex >= 0 &&
        suggestions[selectedSuggestionIndex]
      ) {
        if (key === 'skills') {
          handleSkillSelect(suggestions[selectedSuggestionIndex]);
        } else {
          handleLanguageSelect(suggestions[selectedSuggestionIndex]);
        }
      } else if (value.trim()) {
        onAddTag(e, key, value.trim());
        if (key === 'skills') {
          setSkill('');
          setShowSkillSuggestions(false);
        } else {
          setLanguage('');
          setShowLanguageSuggestions(false);
        }
        setSelectedSuggestionIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowSkillSuggestions(false);
      setShowLanguageSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="skills">Skills</Label>
        <div className="relative">
          <Input
            ref={skillInputRef}
            id="skills"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) =>
              handleKeyDown(e, 'skills', skill, skillSuggestions)
            }
            onFocus={() => skill && setShowSkillSuggestions(true)}
            placeholder="Add a skill and press Enter (e.g., React, Node.js)"
            className="mt-1"
            autoComplete="off"
          />
          {isLoadingSkills && (
            <Loader2 className="absolute top-3 right-3 h-4 w-4 animate-spin text-gray-400" />
          )}

          {/* Skills suggestions dropdown */}
          {showSkillSuggestions && skillSuggestions.length > 0 && (
            <div
              ref={skillDropdownRef}
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg"
            >
              {skillSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    index === selectedSuggestionIndex
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-100'
                  }`}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  onClick={() => handleSkillSelect(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {cv.skills.map((skillItem, index) => (
            <div
              key={index}
              className="group flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1.5 text-sm transition-colors hover:bg-blue-200"
            >
              <span className="text-blue-800">{skillItem}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 opacity-60 transition-opacity hover:bg-transparent hover:opacity-100"
                onClick={() => onRemoveTag('skills', skillItem)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="languages">Languages</Label>
        <div className="relative">
          <Input
            ref={languageInputRef}
            id="languages"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            onKeyDown={(e) =>
              handleKeyDown(e, 'languages', language, languageSuggestions)
            }
            onFocus={() => language && setShowLanguageSuggestions(true)}
            placeholder="Add a language and press Enter"
            className="mt-1"
            autoComplete="off"
          />
          {isLoadingLanguages && (
            <Loader2 className="absolute top-3 right-3 h-4 w-4 animate-spin text-gray-400" />
          )}

          {/* Language suggestions dropdown */}
          {showLanguageSuggestions && languageSuggestions.length > 0 && (
            <div
              ref={languageDropdownRef}
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg"
            >
              {languageSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    index === selectedSuggestionIndex
                      ? 'bg-green-100 text-green-900'
                      : 'hover:bg-gray-100'
                  }`}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  onClick={() => handleLanguageSelect(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(cv.languages || []).map((lang, index) => (
            <div
              key={index}
              className="group flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-sm transition-colors hover:bg-green-200"
            >
              <span className="text-green-800">{lang}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 opacity-60 transition-opacity hover:bg-transparent hover:opacity-100"
                onClick={() => onRemoveTag('languages', lang)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
