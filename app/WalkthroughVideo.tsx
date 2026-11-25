'use client';
import FeatureVideo from '../components/FeatureVideo';
import { fireVideoPlay } from '../lib/gtag';

// The homepage walkthrough, with the same GA4 video_play the previous
// homepage sent. A client component because the page passes no functions.
export default function WalkthroughVideo() {
  return <FeatureVideo videoId="FGeXjIG_c8c" title="ShortHand full walkthrough" wide onPlay={() => fireVideoPlay('FGeXjIG_c8c', 'homepage_walkthrough')} />;
}
