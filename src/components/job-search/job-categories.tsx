import Tag from './job-tag';

interface JobCategoriesProps {
  categories: string[];
}

export default function JobCategories({ categories }: JobCategoriesProps) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <Tag key={index} className="bg-orange-100 text-orange-600">
            {category}
          </Tag>
        ))}
      </div>
    </section>
  );
}
