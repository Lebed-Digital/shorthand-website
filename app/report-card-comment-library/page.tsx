import type { Metadata } from 'next';
import LibraryClient from './LibraryClient';

export const metadata: Metadata = {
  title: 'Report Card Comment Library (Prototype)',
  robots: { index: false, follow: false },
};

export default function ReportCardCommentLibraryPage() {
  return <LibraryClient />;
}
