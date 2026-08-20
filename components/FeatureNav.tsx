import Link from 'next/link';

const features = [
  { slug: 'quick-note',        label: 'Quick Note' },
  { slug: 'ai-reports',             label: 'Write Reports' },
  { slug: 'parent-emails',          label: 'Parent Communication' },
  { slug: 'parent-communication-log', label: 'Parent Communication Log' },
  { slug: 'behavior-tracking', label: 'Never Miss a Student' },
  { slug: 'accommodations',    label: 'Accommodations at a Glance' },
  { slug: 'ask-shorthand',     label: 'Ask ShortHand' },
  { slug: 'student-documentation-report', label: 'Student Documentation Report' },
  { slug: 'meeting-prep-report', label: 'Meeting Prep Report' },
  // class-insights (Progress & Insights) intentionally omitted 2026-08-05: see app/features/class-insights/page.tsx
];

export default function FeatureNav({ current }: { current: string }) {
  const idx = features.findIndex(f => f.slug === current);
  const next = features[(idx + 1) % features.length];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px 0' }}>
      <Link href={`/features/${next.slug}`} className="feature-nav-btn">
        Next: {next.label} →
      </Link>
    </div>
  );
}
