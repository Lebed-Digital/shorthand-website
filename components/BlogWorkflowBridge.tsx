import TrackedLink from './TrackedLink';

interface BlogWorkflowBridgeProps {
  title: string;
  description: string;
  steps: [string, string, string];
  ctaCopy: string;
  sourceSlug: string;
  trackingLabel: string;
}

export default function BlogWorkflowBridge({
  title,
  description,
  steps,
  ctaCopy,
  sourceSlug,
  trackingLabel,
}: BlogWorkflowBridgeProps) {
  return (
    <aside className="blog-workflow-bridge" aria-label="A ShortHand workflow">
      <p className="blog-workflow-bridge__eyebrow">A practical ShortHand workflow</p>
      <p className="blog-workflow-bridge__title">{title}</p>
      <p className="blog-workflow-bridge__description">{description}</p>
      <ol className="blog-workflow-bridge__steps">
        {steps.map((step, index) => (
          <li key={step}>
            <span aria-hidden>{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <TrackedLink
        href="https://app.getshorthandapp.com?demo=true"
        label={trackingLabel}
        ctaSource={sourceSlug}
        className="btn-primary blog-workflow-bridge__cta"
      >
        {ctaCopy}
      </TrackedLink>
    </aside>
  );
}
