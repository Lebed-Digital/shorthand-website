import FeatureVideo from './FeatureVideo';

interface Clip {
  videoId: string;
  title: string;
  description: string;
}

// Silent how-to clips (recreated app screens, fictional students). Each square clip was uploaded centered in a
// 16:9 frame on purpose: YouTube treats square/vertical uploads as Shorts, and a Short embed draws its overlay
// (logo, channel, title, like/share) over the clip's step captions. A 16:9 upload is a regular video.
export default function HowToClips({ heading, clips }: { heading: string; clips: Clip[] }) {
  const schema = clips.map((c) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": c.title,
    "description": c.description,
    "thumbnailUrl": `https://i.ytimg.com/vi/${c.videoId}/hqdefault.jpg`,
    "uploadDate": "2026-11-12T00:00:00+00:00",
    "embedUrl": `https://www.youtube-nocookie.com/embed/${c.videoId}`
  }));

  return (
    <section className="howto-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h2 className="howto-heading">{heading}</h2>
      <div className="howto-grid">
        {clips.map((c) => (
          <div className="howto-item" key={c.videoId}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <FeatureVideo videoId={c.videoId} title={c.title} wide hideControls />
          </div>
        ))}
      </div>
    </section>
  );
}
