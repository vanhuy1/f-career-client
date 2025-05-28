'use server';

import { Skill } from '@/components/skill-input-form';

export async function searchSkills(query: string) {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.apilayer.com/skills?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          apikey: process.env.SKILLS_API_KEY!,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }

    const data = await response.json();

    const skills = Array.isArray(data) ? data : data.skills || [];

    return skills.slice(0, 4).map((skill: Skill) => ({
      id: skill.id || skill.name || skill,
      name: skill.name || skill.title || skill,
    }));
  } catch (error) {
    console.error('Error searching skills:', error);
    return [];
  }
}
