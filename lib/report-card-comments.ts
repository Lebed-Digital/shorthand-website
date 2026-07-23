// The one authoritative list. Every category lives here, nested under its section.
// Adding a category means adding it here, nowhere else, so there is exactly one
// source of truth and every comment's `category` is checked against it at compile time.
export const CATEGORIES_BY_SECTION = {
  behavior: [
    'self-control',
    'peer-relationships',
    'focus-and-attention',
    'participation',
    'leadership',
    'independence',
    'following-directions',
    'effort-and-motivation',
  ],
  adhd: [
    'attention-and-focus',
    'impulse-control',
    'organization',
    'task-completion',
    'self-regulation-strategies',
  ],
  preschool: [
    'social-emotional-development',
    'self-help-skills',
    'play-and-cooperation',
    'early-literacy',
    'early-math',
    'gross-and-fine-motor',
  ],
  academics: [
    'reading',
    'writing',
    'math',
    'general-work-habits',
  ],
  'social-emotional': [
    'emotional-regulation',
    'empathy-and-relationships',
    'self-awareness',
    'resilience-and-growth-mindset',
  ],
} as const;

export type Section = keyof typeof CATEGORIES_BY_SECTION;
export type CategoryFor<S extends Section> = (typeof CATEGORIES_BY_SECTION)[S][number];

export const SECTION_LABELS: Record<Section, string> = {
  behavior: 'Behavior',
  adhd: 'ADHD / Attention',
  preschool: 'Preschool',
  academics: 'Academics',
  'social-emotional': 'Social-Emotional',
};

export const CATEGORY_LABELS: Record<string, string> = {
  'self-control': 'Self-control',
  'peer-relationships': 'Peer relationships',
  'focus-and-attention': 'Focus and attention',
  participation: 'Participation',
  leadership: 'Leadership',
  independence: 'Independence',
  'following-directions': 'Following directions',
  'effort-and-motivation': 'Effort and motivation',
  'attention-and-focus': 'Attention and focus',
  'impulse-control': 'Impulse control',
  organization: 'Organization',
  'task-completion': 'Task completion',
  'self-regulation-strategies': 'Self-regulation strategies',
  'social-emotional-development': 'Social-emotional development',
  'self-help-skills': 'Self-help skills',
  'play-and-cooperation': 'Play and cooperation',
  'early-literacy': 'Early literacy',
  'early-math': 'Early math',
  'gross-and-fine-motor': 'Gross and fine motor',
  reading: 'Reading',
  writing: 'Writing',
  math: 'Math',
  'general-work-habits': 'General work habits',
  'emotional-regulation': 'Emotional regulation',
  'empathy-and-relationships': 'Empathy and relationships',
  'self-awareness': 'Self-awareness',
  'resilience-and-growth-mindset': 'Resilience and growth mindset',
};

export const TONES = ['positive', 'growth'] as const;
export type Tone = (typeof TONES)[number];

export const GRADE_BANDS = ['preschool', 'k-2', '3-5', 'middle-upper'] as const;
export type GradeBand = (typeof GRADE_BANDS)[number];

export const GRADE_BAND_LABELS: Record<GradeBand, string> = {
  preschool: 'Preschool',
  'k-2': 'K-2',
  '3-5': '3-5',
  'middle-upper': 'Middle/Upper',
};

export interface Comment<S extends Section = Section> {
  id: string;
  section: S;
  category: CategoryFor<S>;
  tone: Tone;
  gradeBands: GradeBand[];
  text: string; // uses [Student] as the literal placeholder token for personalization
}

// 20 representative sample comments approved 2026-07-22 for the Step 4 prototype.
// See "Report Card Comment Library - V1 Schema.md" section 10 for the revision
// history behind this exact wording. Not the full 350-450 library.
export const REPORT_CARD_COMMENTS: Comment[] = [
  {
    id: 'behavior-positive-self-control-01',
    section: 'behavior',
    category: 'self-control',
    tone: 'positive',
    gradeBands: ['k-2', '3-5'],
    text: '[Student] consistently pauses to think before reacting, even in moments of frustration.',
  },
  {
    id: 'behavior-growth-focus-and-attention-01',
    section: 'behavior',
    category: 'focus-and-attention',
    tone: 'growth',
    gradeBands: ['3-5', 'middle-upper'],
    text: 'Staying focused during longer independent tasks is still developing; [Student] does best with a clear stopping point in sight.',
  },
  {
    id: 'behavior-positive-peer-relationships-01',
    section: 'behavior',
    category: 'peer-relationships',
    tone: 'positive',
    gradeBands: ['k-2', '3-5', 'middle-upper'],
    text: "Classmates often turn to [Student] first when they need a partner, a sign of how much they trust [Student]'s patience and fairness.",
  },
  {
    id: 'behavior-growth-following-directions-01',
    section: 'behavior',
    category: 'following-directions',
    tone: 'growth',
    gradeBands: ['k-2'],
    text: 'Multi-step directions can be challenging for [Student]; giving one instruction at a time seems to be helping them stay focused and complete each step.',
  },
  {
    id: 'behavior-positive-leadership-01',
    section: 'behavior',
    category: 'leadership',
    tone: 'positive',
    gradeBands: ['middle-upper'],
    text: 'When group work stalls, [Student] is usually the one who steps in, assigns next steps, and gets everyone moving again.',
  },
  {
    id: 'adhd-growth-attention-and-focus-01',
    section: 'adhd',
    category: 'attention-and-focus',
    tone: 'growth',
    gradeBands: ['3-5'],
    text: '[Student] is continuing to build stamina for maintaining attention during longer lessons and benefits from brief opportunities to reset and refocus.',
  },
  {
    id: 'adhd-positive-self-regulation-strategies-01',
    section: 'adhd',
    category: 'self-regulation-strategies',
    tone: 'positive',
    gradeBands: ['k-2', '3-5'],
    text: '[Student] has learned to ask for a movement break before frustration builds, demonstrating growing self-awareness and self-advocacy.',
  },
  {
    id: 'adhd-growth-impulse-control-01',
    section: 'adhd',
    category: 'impulse-control',
    tone: 'growth',
    gradeBands: ['k-2', '3-5'],
    text: 'Waiting for a turn to speak is an ongoing goal; [Student] is working on raising a hand instead of calling out an answer.',
  },
  {
    id: 'adhd-positive-organization-01',
    section: 'adhd',
    category: 'organization',
    tone: 'positive',
    gradeBands: ['3-5', 'middle-upper'],
    text: "[Student]'s organizational habits, like keeping materials sorted and ready, are a real strength this year.",
  },
  {
    id: 'preschool-positive-self-help-skills-01',
    section: 'preschool',
    category: 'self-help-skills',
    tone: 'positive',
    gradeBands: ['preschool'],
    text: '[Student] puts on their own coat and shoes at pickup time without being reminded.',
  },
  {
    id: 'preschool-growth-play-and-cooperation-01',
    section: 'preschool',
    category: 'play-and-cooperation',
    tone: 'growth',
    gradeBands: ['preschool'],
    text: 'Sharing toys during center time is still a work in progress; [Student] benefits from gentle reminders and support taking turns.',
  },
  {
    id: 'preschool-positive-early-literacy-01',
    section: 'preschool',
    category: 'early-literacy',
    tone: 'positive',
    gradeBands: ['preschool'],
    text: 'During story time, [Student] points out letters from their own name on the page and gets excited every time.',
  },
  {
    id: 'preschool-growth-gross-and-fine-motor-01',
    section: 'preschool',
    category: 'gross-and-fine-motor',
    tone: 'growth',
    gradeBands: ['preschool'],
    text: 'Holding scissors and cutting along a line is still tricky for [Student]; more practice with playdough and tongs would help build hand strength.',
  },
  {
    id: 'academics-positive-reading-01',
    section: 'academics',
    category: 'reading',
    tone: 'positive',
    gradeBands: ['k-2', '3-5'],
    text: '[Student] reads with real expression now, changing their voice for different characters without being asked.',
  },
  {
    id: 'academics-growth-writing-01',
    section: 'academics',
    category: 'writing',
    tone: 'growth',
    gradeBands: ['3-5', 'middle-upper'],
    text: 'Getting ideas onto the page is harder than talking through them out loud; [Student] benefits from saying a sentence aloud before writing it down.',
  },
  {
    id: 'academics-positive-math-01',
    section: 'academics',
    category: 'math',
    tone: 'positive',
    gradeBands: ['3-5'],
    text: 'Multi-step word problems are an area where [Student] tends to shine, working through each step methodically.',
  },
  {
    id: 'academics-growth-general-work-habits-01',
    section: 'academics',
    category: 'general-work-habits',
    tone: 'growth',
    gradeBands: ['middle-upper'],
    text: "The quality of [Student]'s completed work is consistently strong; building a more consistent habit of submitting homework is the next goal.",
  },
  {
    id: 'social-emotional-positive-empathy-and-relationships-01',
    section: 'social-emotional',
    category: 'empathy-and-relationships',
    tone: 'positive',
    gradeBands: ['k-2', '3-5'],
    text: 'When a classmate is upset, [Student] is quick to notice and check in, showing real care for others.',
  },
  {
    id: 'social-emotional-growth-emotional-regulation-01',
    section: 'social-emotional',
    category: 'emotional-regulation',
    tone: 'growth',
    gradeBands: ['k-2'],
    text: 'Big feelings can be overwhelming for [Student] in the moment; continuing to practice naming emotions can support stronger emotional regulation.',
  },
  {
    id: 'social-emotional-positive-resilience-and-growth-mindset-01',
    section: 'social-emotional',
    category: 'resilience-and-growth-mindset',
    tone: 'positive',
    gradeBands: ['3-5', 'middle-upper'],
    text: "After a wrong answer, [Student]'s instinct is to try again rather than give up, which has become one of their real strengths this year.",
  },
];
