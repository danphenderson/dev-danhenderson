import type { BlogPost } from '../types/blog';

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-a-design-system-that-scales',
    title: 'Building a Design System That Scales',
    subtitle: 'Lessons from maintaining a living component library across a growing product.',
    excerpt:
      'Design systems promise consistency and velocity, but the real challenge is building one that survives contact with a product team. Here is what I learned shipping a component library that actually scales.',
    author: 'Daniel Henderson',
    publishedAt: '2026-03-10',
    readingTimeMinutes: 12,
    tags: ['design-systems', 'react', 'architecture', 'frontend'],
    featured: true,
    heroImage: '/assets/blog/design-system-hero.jpg',
    heroImageAlt:
      'Abstract layered geometric shapes representing design tokens and component composition.',
    content: [
      {
        type: 'paragraph',
        text: 'Every frontend codebase eventually reaches a point where ad-hoc component creation becomes unsustainable. Shared buttons diverge, spacing becomes inconsistent, and teams lose hours debating styling conventions in pull requests. A design system aims to solve this — but building one that survives real product pressure is a fundamentally different challenge from building a component library.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Start with tokens, not components',
        id: 'start-with-tokens',
      },
      {
        type: 'paragraph',
        text: 'The instinct is to start with a button or a card. Resist it. The foundation of a scalable design system is its token layer — the shared vocabulary for color, spacing, typography, elevation, and motion. Tokens are the API contract between design intent and engineering implementation.',
      },
      {
        type: 'code',
        language: 'typescript',
        filename: 'tokens.ts',
        code: `export const duration = {
  instant: 0.12,
  quick: 0.18,
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  dramatic: 0.7,
} as const;

export const easing = {
  smooth: [0.25, 0.1, 0.25, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
  decel: [0, 0, 0.2, 1],
} as const;`,
        caption:
          'A motion token layer makes animation decisions explicit and shared across the system.',
      },
      {
        type: 'paragraph',
        text: 'When your tokens are well-defined, component authoring becomes a composition exercise rather than a design exercise. The component author is not choosing spacing values — they are selecting from a constrained set of intentional options.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The composition problem',
        id: 'composition-problem',
      },
      {
        type: 'paragraph',
        text: 'Most design system failures are not about missing components. They are about rigid components that cannot compose with the contexts where they need to be used. A card component that only works in a grid layout is not a shared primitive — it is a feature component wearing a library badge.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Design for the caller',
        text: 'A good shared component accepts style overrides via sx or className, exposes meaningful semantic props, and makes zero assumptions about its parent layout context.',
      },
      {
        type: 'paragraph',
        text: 'The test I use: can a consumer use this component in a context I have not anticipated without forking it? If the answer is no, the abstraction boundary is wrong.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Motion as a system concern',
        id: 'motion-as-system',
      },
      {
        type: 'paragraph',
        text: 'Animation is often treated as decoration — sprinkled in at the end by whoever is polishing the feature. This leads to inconsistent timing, competing easings, and motion that feels noisy rather than intentional.',
      },
      {
        type: 'paragraph',
        text: 'A design system should own motion. Shared duration tokens, easing curves, stagger timings, and transition presets ensure that every animated surface in the product speaks the same visual language.',
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'MotionSection.tsx',
        code: `export function MotionSection({ children, variants = fadeInUp }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: asMargin('0px 0px -12% 0px') });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}`,
        caption:
          'Scroll-triggered reveals become a reusable primitive, not a per-component concern.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Reduced motion is not optional',
        id: 'reduced-motion',
      },
      {
        type: 'paragraph',
        text: 'Every motion primitive in the system should degrade gracefully when the user prefers reduced motion. This is not an accessibility checkbox — it is a design constraint that forces you to ensure content is valuable without animation.',
      },
      {
        type: 'blockquote',
        text: 'If removing all animation from your UI makes it feel broken, the animation is doing structural work that should live in layout.',
        attribution: 'A useful design system heuristic',
      },
      {
        type: 'heading',
        level: 2,
        text: 'What I would do differently',
        id: 'what-i-would-do-differently',
      },
      {
        type: 'paragraph',
        text: 'If I were starting over, I would invest more in the token layer before writing a single component. I would also build a visual regression testing pipeline from day one — the cost of undetected visual drift compounds faster than you expect.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Define tokens first, components second.',
          'Build composition tests, not just isolation tests.',
          'Treat motion as a first-class system concern.',
          'Ship a reduced-motion audit with every release.',
          'Document the why, not just the what.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Building a design system that scales is fundamentally an architecture problem. The visual output matters, but the structural decisions — token granularity, composition boundaries, motion ownership, and accessibility contracts — are what determine whether the system survives contact with a growing team.',
      },
    ],
  },
  {
    slug: 'react-performance-patterns-beyond-memo',
    title: 'React Performance Patterns Beyond React.memo',
    excerpt:
      'Memoization is the first tool most developers reach for when a React app gets slow. But the highest-leverage performance patterns operate at a different level entirely.',
    author: 'Daniel Henderson',
    publishedAt: '2026-02-24',
    readingTimeMinutes: 9,
    tags: ['react', 'performance', 'frontend', 'architecture'],
    content: [
      {
        type: 'paragraph',
        text: 'React.memo is not a performance strategy. It is a caching primitive. The distinction matters because memoization addresses symptom — unnecessary re-renders — while the highest-leverage performance patterns address cause: component architecture that creates render pressure in the first place.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'State colocation',
        id: 'state-colocation',
      },
      {
        type: 'paragraph',
        text: 'The single most impactful performance pattern in React is placing state as close as possible to the UI that depends on it. When a piece of state lives in a top-level provider and only one leaf component reads it, every component between provider and consumer re-renders for free.',
      },
      {
        type: 'code',
        language: 'tsx',
        code: `// Before: state at the top, pain at the bottom
function App() {
  const [query, setQuery] = useState('');
  return (
    <Layout>
      <Sidebar />
      <Content>
        <SearchBar query={query} onChange={setQuery} />
        <ResultList query={query} />
      </Content>
    </Layout>
  );
}

// After: state colocated with its consumers
function SearchSection() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBar query={query} onChange={setQuery} />
      <ResultList query={query} />
    </>
  );
}`,
        caption: 'Moving state down eliminates re-renders in Layout, Sidebar, and Content.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Composition over props drilling',
        id: 'composition-over-drilling',
      },
      {
        type: 'paragraph',
        text: 'React components re-render when their parent re-renders, unless they are memoized or receive stable references. But children passed as props — through the children prop or render slots — are already stable references because they were created in the parent scope.',
      },
      {
        type: 'callout',
        variant: 'note',
        text: 'Components passed as children are created in the parent render scope, which means they do not re-create when the receiving component re-renders. This is free memoization through composition.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Derived state with useMemo',
        id: 'derived-state',
      },
      {
        type: 'paragraph',
        text: 'Expensive computations — sorting, filtering, aggregating — should be memoized at the data layer, not the component layer. useMemo on a derived computation is cheaper and more targeted than React.memo on an entire subtree.',
      },
      {
        type: 'code',
        language: 'typescript',
        code: `// Derive expensive data once, not on every render
const sortedPosts = useMemo(
  () => [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  [posts]
);

const tagIndex = useMemo(() => {
  const index = new Map<string, BlogPost[]>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const existing = index.get(tag) ?? [];
      existing.push(post);
      index.set(tag, existing);
    }
  }
  return index;
}, [posts]);`,
      },
      {
        type: 'heading',
        level: 2,
        text: 'The render boundary pattern',
        id: 'render-boundary',
      },
      {
        type: 'paragraph',
        text: 'When you need context-driven updates that should not propagate beyond a boundary, extract the consuming component into its own tree. This creates a natural re-render boundary without memoization.',
      },
      {
        type: 'paragraph',
        text: 'These patterns all share a common principle: the best optimization is the render that never needs to happen. Architecture your component tree so that state changes affect the smallest possible subtree, and you will rarely need React.memo at all.',
      },
    ],
  },
  {
    slug: 'typescript-discriminated-unions-for-ui-state',
    title: 'TypeScript Discriminated Unions for UI State Machines',
    subtitle: 'Replace boolean soup with type-safe state transitions.',
    excerpt:
      'If your component has isLoading, isError, and isSuccess as separate booleans, you have an implicit state machine with impossible states that TypeScript cannot protect you from. Discriminated unions fix this.',
    author: 'Daniel Henderson',
    publishedAt: '2026-01-15',
    readingTimeMinutes: 7,
    tags: ['typescript', 'patterns', 'frontend', 'architecture'],
    content: [
      {
        type: 'paragraph',
        text: 'Every experienced React developer has seen this pattern: a component with isLoading, isError, hasData, and isRetrying as independent boolean flags. The combination space is 2⁴ = 16 states, most of which are impossible — loading and error at the same time, data without loading having completed. But nothing in the type system prevents these impossible states from occurring.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The boolean soup problem',
        id: 'boolean-soup',
      },
      {
        type: 'code',
        language: 'typescript',
        code: `// Boolean soup: 16 possible states, ~4 are valid
type AsyncState = {
  isLoading: boolean;
  isError: boolean;
  hasData: boolean;
  error: Error | null;
  data: User[] | null;
};`,
        caption: 'Independent booleans create a combinatorial explosion of unreachable states.',
      },
      {
        type: 'paragraph',
        text: 'The problem is not just theoretical. Boolean soup leads to defensive rendering: checking isLoading && !isError && !hasData before showing a spinner, then adding another guard when a new flag is introduced. Every flag doubles the conditional surface area.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Discriminated unions as state machines',
        id: 'discriminated-unions',
      },
      {
        type: 'paragraph',
        text: 'A discriminated union models only the valid states. Each variant of the union carries exactly the data that exists in that state — no null checks required, no impossible combinations possible.',
      },
      {
        type: 'code',
        language: 'typescript',
        code: `type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

function renderUsers(state: AsyncState<User[]>) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <Spinner />;
    case 'error':
      return <ErrorBanner error={state.error} />;
    case 'success':
      return <UserList users={state.data} />;
  }
}`,
        caption:
          'Each branch has exactly the data it needs — no null guards, no impossible states.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Exhaustive switch',
        text: 'TypeScript narrows the union in each case branch. If you add a new status variant, the compiler will flag every switch that does not handle it — free migration safety.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Applying this to component props',
        id: 'component-props',
      },
      {
        type: 'paragraph',
        text: 'Discriminated unions are equally powerful for component APIs. Instead of a component with mode, showHeader, and collapsible as independent props, model the valid configurations explicitly.',
      },
      {
        type: 'code',
        language: 'typescript',
        code: `type CardProps =
  | { variant: 'compact'; title: string }
  | { variant: 'expanded'; title: string; subtitle: string; actions: ReactNode }
  | { variant: 'hero'; title: string; heroImage: string; overlay?: ReactNode };`,
        caption: 'Each variant carries exactly the props that make sense for that mode.',
      },
      {
        type: 'paragraph',
        text: 'This pattern scales beautifully for complex UI components where different modes require fundamentally different data. The type system documents the valid configurations and prevents callers from providing incoherent prop combinations.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'When not to use discriminated unions',
        id: 'when-not-to-use',
      },
      {
        type: 'paragraph',
        text: 'Not every boolean should be promoted to a union. If two flags are genuinely independent — a dialog can be both open and loading, for example — then separate booleans are the correct model. The union pattern is for flags that represent mutually exclusive states of a single concern.',
      },
      {
        type: 'blockquote',
        text: 'Model your types after the domain, not the UI framework. If the domain has four states, your type should have four variants — no more, no fewer.',
      },
    ],
  },
];
