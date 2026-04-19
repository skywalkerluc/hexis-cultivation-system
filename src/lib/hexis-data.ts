export type AttributeId =
  | "focus"
  | "discipline"
  | "energy"
  | "organization"
  | "resilience"
  | "memory"
  | "creativity"
  | "leadership"
  | "emotional-control"
  | "physical-endurance";

export type AttributeStatus = "improving" | "stable" | "decaying" | "at-risk";

export type ActionType =
  | "training"
  | "practice"
  | "routine"
  | "achievement"
  | "recovery";

export type Intensity = "light" | "moderate" | "intense";

export interface Attribute {
  id: AttributeId;
  name: string;
  short: string;
  current: number; // 0-20, with one decimal
  base: number;
  potential: number;
  status: AttributeStatus;
  trend7: number; // delta last 7 days
  decayRatePerWeek: number; // points per week without maintenance
  lastMaintained: string; // ISO date
  description: string;
  maintenance: string;
  decayLogic: string;
  growthLogic: string;
  history: { date: string; value: number }[];
  recommendedActions: string[];
}

export interface EvidenceEvent {
  id: string;
  date: string; // ISO
  type: ActionType;
  title: string;
  intensity: Intensity;
  notes?: string;
  effects: { attribute: AttributeId; delta: number; reason: string }[];
}

export interface Recommendation {
  id: string;
  attribute: AttributeId;
  title: string;
  rationale: string;
  estimatedGain: number;
}

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const buildHistory = (start: number, points: number[]): { date: string; value: number }[] => {
  let v = start;
  return points.map((delta, i) => {
    v = Math.max(0, Math.min(20, v + delta));
    return { date: daysAgo(points.length - i - 1), value: Number(v.toFixed(1)) };
  });
};

export const attributes: Attribute[] = [
  {
    id: "focus",
    name: "Focus",
    short: "FOC",
    current: 14.2,
    base: 12.5,
    potential: 17.0,
    status: "improving",
    trend7: 0.6,
    decayRatePerWeek: 0.4,
    lastMaintained: daysAgo(1),
    description:
      "Sustained, voluntary attention on a single chosen object. Cultivated through deep work, single-tasking and the deliberate refusal of low-grade stimulus.",
    maintenance:
      "Two to four deep work sessions per week, each 60–90 minutes, with phone removed from the room.",
    decayLogic:
      "Erodes gradually with frequent context switching, fragmented mornings or extended periods of passive media.",
    growthLogic:
      "Grows fastest from sessions held above 45 minutes without interruption. Diminishing returns past two hours.",
    history: buildHistory(13.6, [0, 0.1, -0.05, 0.15, 0.1, 0.0, 0.2, 0.1, -0.05, 0.1, 0.05, 0.15, 0.1, 0.05]),
    recommendedActions: [
      "90-minute deep work block on a single problem",
      "Reading session without secondary devices",
      "One full day with notifications disabled",
    ],
  },
  {
    id: "discipline",
    name: "Discipline",
    short: "DIS",
    current: 12.8,
    base: 11.0,
    potential: 16.5,
    status: "stable",
    trend7: 0.1,
    decayRatePerWeek: 0.3,
    lastMaintained: daysAgo(2),
    description:
      "The capacity to act in accordance with stated intent regardless of immediate mood. Built through small, repeated, kept commitments.",
    maintenance:
      "Hold three pre-committed daily actions. Honor them on low-energy days especially.",
    decayLogic: "Weakens when repeated exceptions are made for convenience.",
    growthLogic:
      "Strengthens when commitments are kept under friction. Larger gains on inconvenient days.",
    history: buildHistory(12.5, [0.05, 0, 0.1, -0.05, 0.05, 0, 0.05, 0.1, 0, 0.05, 0, 0.05, 0, 0.05]),
    recommendedActions: [
      "Complete morning routine before any screen contact",
      "Hold one previously-deferred commitment today",
    ],
  },
  {
    id: "energy",
    name: "Energy",
    short: "ENR",
    current: 9.6,
    base: 11.5,
    potential: 16.0,
    status: "decaying",
    trend7: -0.9,
    decayRatePerWeek: 1.1,
    lastMaintained: daysAgo(5),
    description:
      "The available capacity to engage with effortful work. Determined more by recovery quality than by intensity.",
    maintenance:
      "Consistent sleep window, sunlight in the first hour, two recovery actions per week.",
    decayLogic:
      "Drops quickly after consecutive nights below seven hours or after sustained caffeine compensation.",
    growthLogic:
      "Restored primarily through sleep regularity and aerobic baseline, not motivational effort.",
    history: buildHistory(11.2, [-0.1, -0.05, 0, -0.1, -0.15, -0.1, -0.05, -0.2, -0.1, -0.15, -0.05, -0.1, -0.15, -0.1]),
    recommendedActions: [
      "Two consecutive nights at full sleep window",
      "30-minute outdoor walk before noon",
      "Skip evening caffeine for three days",
    ],
  },
  {
    id: "organization",
    name: "Organization",
    short: "ORG",
    current: 13.4,
    base: 12.0,
    potential: 17.5,
    status: "stable",
    trend7: 0.2,
    decayRatePerWeek: 0.5,
    lastMaintained: daysAgo(1),
    description:
      "The shaping of one's environment, time and attention so that intended action becomes the path of least resistance.",
    maintenance: "Weekly review. Inbox to zero twice weekly. Calendar reflects actual priorities.",
    decayLogic: "Degrades quickly when reviews are skipped for more than ten days.",
    growthLogic: "Improves through structural changes, not single tidy-up sessions.",
    history: buildHistory(13.1, [0.05, 0, 0.05, 0.1, 0, -0.05, 0.1, 0.05, 0, 0.05, 0.1, 0, 0.05, 0]),
    recommendedActions: [
      "Weekly review with calendar audit",
      "Reduce open browser tabs to a single working set",
    ],
  },
  {
    id: "resilience",
    name: "Resilience",
    short: "RES",
    current: 11.2,
    base: 10.5,
    potential: 16.0,
    status: "improving",
    trend7: 0.4,
    decayRatePerWeek: 0.2,
    lastMaintained: daysAgo(3),
    description:
      "The capacity to remain functional and reflective when conditions are adverse. A structural attribute, slow to build, slow to lose.",
    maintenance: "Deliberate exposure to controlled difficulty. Reflective journaling after setbacks.",
    decayLogic: "Decays slowly. Most often eroded by avoidance patterns rather than single events.",
    growthLogic:
      "Built by completing what was committed to during periods of low motivation or after a setback.",
    history: buildHistory(10.8, [0, 0.05, 0.1, 0, 0.05, 0.1, 0, 0.05, 0, 0.1, 0.05, 0, 0.05, 0.05]),
    recommendedActions: [
      "Reflective journal entry after today's most difficult moment",
      "Cold exposure or controlled discomfort routine",
    ],
  },
  {
    id: "memory",
    name: "Memory",
    short: "MEM",
    current: 10.4,
    base: 10.0,
    potential: 15.5,
    status: "stable",
    trend7: 0.0,
    decayRatePerWeek: 0.4,
    lastMaintained: daysAgo(4),
    description:
      "The encoding, retention and retrieval of meaningful information. Trained through structured recall, not passive review.",
    maintenance: "Spaced retrieval sessions three times per week.",
    decayLogic: "Material left unreviewed for more than a week begins to fade measurably.",
    growthLogic: "Active recall and interleaving outperform re-reading by a wide margin.",
    history: buildHistory(10.4, [0, 0.05, 0, -0.05, 0, 0.05, 0, 0, 0.05, -0.05, 0, 0.05, 0, 0]),
    recommendedActions: ["20-minute spaced repetition session", "Teach today's key idea aloud"],
  },
  {
    id: "creativity",
    name: "Creativity",
    short: "CRE",
    current: 12.0,
    base: 11.0,
    potential: 17.0,
    status: "improving",
    trend7: 0.5,
    decayRatePerWeek: 0.3,
    lastMaintained: daysAgo(2),
    description:
      "The generation and combination of distinct ideas in service of a chosen problem. Requires inputs, time and unstructured interval.",
    maintenance: "One generative session per week. Daily input from outside your domain.",
    decayLogic: "Suffers when input becomes monotonic or schedule has no slack.",
    growthLogic: "Improves with constraint-based exercises and cross-domain reading.",
    history: buildHistory(11.5, [0.05, 0, 0.1, 0, 0.05, 0.1, 0, 0.05, 0.05, 0.05, 0, 0.1, 0.05, 0.05]),
    recommendedActions: ["Constraint-based generative session", "Read outside primary discipline"],
  },
  {
    id: "leadership",
    name: "Leadership",
    short: "LEA",
    current: 9.8,
    base: 9.5,
    potential: 16.0,
    status: "stable",
    trend7: 0.1,
    decayRatePerWeek: 0.2,
    lastMaintained: daysAgo(6),
    description:
      "The capacity to articulate direction and coordinate the action of others toward it without coercion.",
    maintenance: "One clarifying conversation per week. Written communication that reduces ambiguity.",
    decayLogic: "Atrophies in extended solo work without people-coordination practice.",
    growthLogic: "Strengthens through difficult, candid, well-prepared conversations.",
    history: buildHistory(9.6, [0, 0.05, 0, 0.05, 0, 0, 0.05, 0, 0.05, 0, 0, 0.05, 0, 0]),
    recommendedActions: ["Hold one direct, prepared conversation deferred this week"],
  },
  {
    id: "emotional-control",
    name: "Emotional Control",
    short: "EMO",
    current: 11.6,
    base: 10.8,
    potential: 16.5,
    status: "stable",
    trend7: 0.2,
    decayRatePerWeek: 0.3,
    lastMaintained: daysAgo(2),
    description:
      "The capacity to feel without being moved into reactive action. Built through naming, slowing and choosing.",
    maintenance: "Brief daily reflection. Pause-before-reply discipline in difficult exchanges.",
    decayLogic: "Decays under sustained sleep debt and unresolved interpersonal load.",
    growthLogic: "Grows through repeated composed responses in genuinely activating situations.",
    history: buildHistory(11.2, [0.05, 0, 0.05, 0, 0.05, 0, 0.05, 0.05, 0, 0.05, 0, 0.05, 0, 0.05]),
    recommendedActions: ["Five-minute reflective pause before evening communication"],
  },
  {
    id: "physical-endurance",
    name: "Physical Endurance",
    short: "PHY",
    current: 10.9,
    base: 10.5,
    potential: 17.5,
    status: "at-risk",
    trend7: -0.3,
    decayRatePerWeek: 0.7,
    lastMaintained: daysAgo(8),
    description:
      "The body's capacity to sustain effort over time. Underwrites every other attribute when developed; constrains them when neglected.",
    maintenance: "Three aerobic sessions per week at conversational pace. One longer session weekly.",
    decayLogic: "Loses ground noticeably after seven days without aerobic work.",
    growthLogic: "Built primarily by volume at low intensity, not by occasional hard sessions.",
    history: buildHistory(11.2, [0, -0.05, 0, -0.05, 0, -0.05, 0, -0.05, 0, -0.05, 0, -0.05, 0, -0.05]),
    recommendedActions: ["45-minute aerobic session at conversational pace", "Two short walks today"],
  },
];

export const events: EvidenceEvent[] = [
  {
    id: "e1",
    date: daysAgo(0),
    type: "training",
    title: "Deep work · system architecture review",
    intensity: "intense",
    notes: "Two uninterrupted blocks. Phone in another room.",
    effects: [
      { attribute: "focus", delta: 0.3, reason: "Two 90-minute blocks above the deep-work threshold." },
      { attribute: "discipline", delta: 0.05, reason: "Held to pre-committed start time." },
    ],
  },
  {
    id: "e2",
    date: daysAgo(0),
    type: "recovery",
    title: "Outdoor walk · 35 minutes",
    intensity: "light",
    effects: [
      { attribute: "energy", delta: 0.15, reason: "Daylight exposure within first hours of waking." },
    ],
  },
  {
    id: "e3",
    date: daysAgo(1),
    type: "practice",
    title: "Spaced repetition · domain vocabulary",
    intensity: "moderate",
    effects: [
      { attribute: "memory", delta: 0.1, reason: "Active recall session, 22 minutes." },
    ],
  },
  {
    id: "e4",
    date: daysAgo(2),
    type: "routine",
    title: "Weekly review",
    intensity: "moderate",
    effects: [
      { attribute: "organization", delta: 0.2, reason: "Calendar audited and inbox cleared." },
      { attribute: "discipline", delta: 0.05, reason: "Routine held without omission." },
    ],
  },
  {
    id: "e5",
    date: daysAgo(3),
    type: "achievement",
    title: "Held difficult conversation with team lead",
    intensity: "intense",
    notes: "Prepared in writing beforehand. Stayed in the room.",
    effects: [
      { attribute: "leadership", delta: 0.25, reason: "Clarifying conversation under conditions of friction." },
      { attribute: "emotional-control", delta: 0.15, reason: "Composed response during activating exchange." },
    ],
  },
  {
    id: "e6",
    date: daysAgo(4),
    type: "training",
    title: "Aerobic session · 30 minutes (skipped 45-minute target)",
    intensity: "light",
    effects: [
      { attribute: "physical-endurance", delta: -0.05, reason: "Below maintenance volume for the week." },
    ],
  },
  {
    id: "e7",
    date: daysAgo(5),
    type: "recovery",
    title: "Late screen exposure, 11:40pm",
    intensity: "light",
    notes: "Logged for transparency.",
    effects: [
      { attribute: "energy", delta: -0.2, reason: "Sleep onset delayed past intended window." },
    ],
  },
  {
    id: "e8",
    date: daysAgo(6),
    type: "practice",
    title: "Generative session · constraint exercise",
    intensity: "moderate",
    effects: [
      { attribute: "creativity", delta: 0.2, reason: "Constraint-based output, twelve usable variations." },
    ],
  },
  {
    id: "e9",
    date: daysAgo(7),
    type: "routine",
    title: "Reflective journal · 10 minutes",
    intensity: "light",
    effects: [
      { attribute: "resilience", delta: 0.1, reason: "Reflection completed after a difficult day." },
      { attribute: "emotional-control", delta: 0.05, reason: "Naming the activation rather than acting on it." },
    ],
  },
  {
    id: "e10",
    date: daysAgo(9),
    type: "training",
    title: "Long aerobic session · 65 minutes",
    intensity: "intense",
    effects: [
      { attribute: "physical-endurance", delta: 0.3, reason: "Volume above weekly baseline." },
      { attribute: "energy", delta: -0.05, reason: "Acute fatigue cost; net positive over the week." },
    ],
  },
];

export const recommendations: Recommendation[] = [
  {
    id: "r1",
    attribute: "energy",
    title: "Two recovery nights",
    rationale: "Energy has dropped 0.9 over the past week. Two consecutive nights at your sleep window will restore most of it.",
    estimatedGain: 0.6,
  },
  {
    id: "r2",
    attribute: "physical-endurance",
    title: "45-minute aerobic session",
    rationale: "Physical Endurance is at risk after eight days without a maintenance session.",
    estimatedGain: 0.4,
  },
  {
    id: "r3",
    attribute: "focus",
    title: "Two more deep work blocks this week",
    rationale: "Focus is improving. Two more 90-minute blocks would consolidate the gain into your base.",
    estimatedGain: 0.3,
  },
  {
    id: "r4",
    attribute: "leadership",
    title: "One deferred conversation",
    rationale: "A leadership conversation has been on your queue for six days. Holding it would convert intent into evidence.",
    estimatedGain: 0.25,
  },
];

export const profile = {
  displayName: "Adrien Marchand",
  email: "adrien@hexis.app",
  joined: "2024-09-12",
  avatarSeed: "obsidian-3",
  weeklyPractice: 6.5,
  longestStreak: 41,
  currentStreak: 12,
};

export const getAttribute = (id: string) => attributes.find((a) => a.id === id);

export const eventsByAttribute = (id: AttributeId) =>
  events.filter((e) => e.effects.some((f) => f.attribute === id));

export const formatDelta = (n: number) =>
  `${n > 0 ? "+" : ""}${n.toFixed(2).replace(/\.?0+$/, "")}`;
