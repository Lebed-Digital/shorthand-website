import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Teacher Resources | ShortHand',
  description:
    'Free printable tools for teachers. Download the Parent Contact Documentation Log and more resources to save time on classroom paperwork.',
  alternates: { canonical: 'https://getshorthandapp.com/resources' },
  openGraph: {
    title: 'Free Teacher Resources | ShortHand',
    description: 'Free printable tools for teachers. No sign-up required.',
    url: 'https://getshorthandapp.com/resources',
    type: 'website',
    images: [
      {
        url: 'https://getshorthandapp.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Teacher Resources from ShortHand',
      },
    ],
  },
};

const resources = [
  {
    title: 'Parent Contact Documentation Log',
    description:
      'Track every call, email, and note home in one place. One page per week. Print it, fill it by hand, and keep it in your binder.',
    file: '/Parent Contact Documentation Log.pdf',
    label: 'Download Free PDF',
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-sm text-teal-600 hover:underline mb-2 block">
            &larr; ShortHand
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Free Teacher Resources</h1>
          <p className="text-gray-500 mt-2">
            Printable tools to save you time. No sign-up, no email required.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="grid gap-6">
          {resources.map((resource) => (
            <div
              key={resource.file}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{resource.title}</h2>
                <p className="text-gray-500 text-sm mt-1">{resource.description}</p>
              </div>
              <a
                href={resource.file}
                download
                className="shrink-0 inline-block bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition text-sm text-center"
              >
                {resource.label}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-teal-50 border border-teal-100 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Want this built into your routine?</h2>
          <p className="text-gray-600 text-sm mb-5 max-w-md mx-auto">
            ShortHand logs every parent contact automatically: timestamped, tied to the student, searchable. No separate binder, no trying to remember what you said in October.
          </p>
          <a
            href="https://app.getshorthandapp.com"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition text-sm"
          >
            Try ShortHand Free
          </a>
          <p className="text-xs text-gray-400 mt-3">No credit card. No setup. Works on your phone.</p>
        </div>
      </div>
    </main>
  );
}
