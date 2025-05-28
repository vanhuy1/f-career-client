'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { searchSkills } from '@/services/api/skills/search-skills';

export interface Skill {
  id: string;
  name: string;
  title: string;
}

interface SkillSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SkillSearchInput({
  value,
  onChange,
  placeholder,
}: SkillSearchInputProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const debouncedSearch = async (query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const results = await searchSkills(query);
          setSkills(results);
        } catch (error) {
          console.error('Error searching skills:', error);
          setSkills([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSkills([]);
      }
    }, 300);
  };

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleSelect = (skillName: string) => {
    onChange(skillName);
    setSearchQuery(skillName);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    if (!open) setOpen(true);
  };

  const handleSelectCurrentInput = () => {
    if (searchQuery.trim()) {
      handleSelect(searchQuery.trim());
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between p-0"
            onClick={() => setOpen(!open)}
          >
            <Input
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="h-full w-full border-0 p-2 focus:border-none focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          {isLoading ? (
            <div className="text-muted-foreground p-2 text-sm">
              Searching...
            </div>
          ) : (
            <>
              {skills.length > 0 ? (
                <CommandList>
                  <CommandGroup>
                    {skills.map((skill) => (
                      <CommandItem
                        key={skill.id}
                        value={skill.name}
                        onSelect={() => handleSelect(skill.name)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${value === skill.name ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {skill.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              ) : searchQuery.trim() ? (
                <CommandList>
                  <CommandEmpty>
                    <div className="p-2">
                      <p className="text-muted-foreground mb-2 text-sm">
                        No skills found for &quot;{searchQuery}&quot;
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectCurrentInput}
                        className="w-full"
                      >
                        Add &quot;{searchQuery}&quot; as custom skill
                      </Button>
                    </div>
                  </CommandEmpty>
                </CommandList>
              ) : (
                <CommandList>
                  <CommandEmpty>
                    <p className="text-muted-foreground p-2 text-sm">
                      Start typing to search for skills...
                    </p>
                  </CommandEmpty>
                </CommandList>
              )}
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
