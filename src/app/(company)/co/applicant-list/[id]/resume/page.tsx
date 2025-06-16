import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-16 items-center justify-center rounded bg-red-100">
          <span className="text-xs font-semibold text-red-600">PDF</span>
        </div>
        <h4 className="mb-2 font-medium text-gray-900">
          Jerome_Bell_Resume.pdf
        </h4>
        <p className="mb-4 text-sm text-gray-600">
          2.4 MB • Uploaded 2 days ago
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Eye className="mr-2 h-4 w-4" />
          View Resume
        </Button>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Resume Summary</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Total Experience</label>
            <p className="mt-1 text-sm font-medium text-gray-900">4 Years</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Education</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              Bachelors in Engineering
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Previous Companies</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              Twitter, Meta, Google
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Key Skills</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              UI/UX Design, Product Strategy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
