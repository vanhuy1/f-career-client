import Tag from './job-tag';

interface JobSkillsProps {
  skills: string[];
}

export default function JobSkills({ skills }: JobSkillsProps) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Required Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Tag key={index} className="bg-indigo-100 text-indigo-600">
            {skill}
          </Tag>
        ))}
      </div>
    </section>
  );
}
