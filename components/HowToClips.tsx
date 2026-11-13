interface Clip {
  // Base name of the .mp4 and its .jpg poster in public/videos/how-to/
  file: string;
  title: string;
  description: string;
}

const SITE = 'https://getshorthandapp.com';

// Square, silent how-to clips (recreated app screens, fictional students). Self-hosted rather than YouTube:
// a Short embed always draws YouTube's Shorts overlay over the top of the clip, where the step captions are.
export default function HowToClips({ heading, clips }: { heading: string; clips: Clip[] }) {
  const schema = clips.map((c) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": c.title,
    "description": c.description,
    "thumbnailUrl": `${SITE}/videos/how-to/${c.file}.jpg`,
    "contentUrl": `${SITE}/videos/how-to/${c.file}.mp4`,
    "uploadDate": "2026-11-12T00:00:00+00:00"
  }));

  return (
    <section className="howto-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h2 className="howto-heading">{heading}</h2>
      <div className="howto-grid">
        {clips.map((c) => (
          <div className="howto-item" key={c.file}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <video
              src={`/videos/how-to/${c.file}.mp4`}
              poster={`/videos/how-to/${c.file}.jpg`}
              aria-label={c.title}
              controls
              muted
              playsInline
              preload="none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
