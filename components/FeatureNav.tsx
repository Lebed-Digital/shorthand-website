import Link from 'next/link';

const features = [
  { slug: 'quick-note',        label: 'Quick Note' },
  { slug: 'ai-reports',             label: 'Write Reports' },
  { slug: 'parent-emails',          label: 'Parent Communication' },
  { slug: 'parent-communication-log', label: 'Parent Communication Log' },
  { slug: 'behavior-tracking', label: 'Never Miss a Student' },
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
