export const COURSES = [
  {
    id: 'fullstack-mern',
    title: 'Full-Stack Web Development with MERN',
    category: 'Development', level: 'Beginner to Advanced', rating: 4.8, reviews: 2314,
    students: 18420, price: 4999, mrp: 12999, free: false,
    tag: 'Bestseller', color: 'linear-gradient(135deg,#3E4D08,#10130A)',
    thumb: 'MERN', instructor: 'Aarav Sharma', duration: '42h 30m', lessons: 128,
    desc: 'Master MongoDB, Express, React and Node by building 8 production-grade projects with authentication, payments, R2 uploads and Supabase.',
    outcomes: ['Build and deploy 8 MERN projects', 'JWT auth + role isolation (student/admin)', 'Supabase Postgres + RLS from scratch', 'Video uploads to Cloudflare R2'],
    curriculum: [
      { title: 'Foundations & Setup', items: ['Course orientation & roadmap', 'JS/ES6 refresher for React', 'Git, VS Code & project structure'] },
      { title: 'React Frontend Mastery', items: ['Components, hooks & router', 'State with context + query', 'Pixel-perfect UI from Figma'] },
      { title: 'Node API + Supabase', items: ['REST APIs with Express', 'Postgres schema design', 'Row Level Security & policies'] },
      { title: 'Videos with Cloudflare R2', items: ['Buckets, CORS & signed URLs', 'HLS streaming in React player', 'Progress tracking & resumes'] },
      { title: 'Payments & Launch', items: ['Razorpay/Stripe checkout', 'Enrollments & certificates', 'Deploy on Vercel + VPS'] },
    ],
  },
  {
    id: 'react-pro',
    title: 'React 18 Professional: From Hooks to Performance',
    category: 'Frontend', level: 'Intermediate', rating: 4.9, reviews: 1870,
    students: 12300, price: 0, mrp: 0, free: true,
    tag: 'Free', color: 'linear-gradient(135deg,#75900F,#2A3407)',
    thumb: 'REACT', instructor: 'Sneha Iyer', duration: '18h 10m', lessons: 64,
    desc: 'Free flagship React course. Hooks, router, data fetching, memoization and testing with real LMS screens.',
    outcomes: ['Advanced hooks patterns', 'Router guards & lazy loading', 'Performance profiling', 'Unit testing with Vitest'],
    curriculum: [
      { title: 'Core Hooks Deep Dive', items: ['useState/useEffect mental model', 'Custom hooks library', 'Forms & validation'] },
      { title: 'Routing & Data', items: ['Nested routes & guards', 'Loaders, caching & errors', 'Auth flows'] },
      { title: 'Ship Faster', items: ['Memo, virtual lists', 'Testing & CI', 'Build & deploy'] },
    ],
  },
  {
    id: 'supabase-postgres',
    title: 'Supabase & PostgreSQL: Auth, RLS and Realtime',
    category: 'Backend', level: 'Intermediate', rating: 4.7, reviews: 940,
    students: 8210, price: 2999, mrp: 7999, free: false,
    tag: 'New', color: 'linear-gradient(135deg,#1F2A08,#5C6E0B)',
    thumb: 'SQL', instructor: 'Rohan Verma', duration: '22h 00m', lessons: 78,
    desc: 'Design secure multi-tenant schemas, write RLS policies for student/admin isolation, and ship realtime dashboards.',
    outcomes: ['Schema design for LMS', 'RLS policies that isolate tenants', 'Storage + signed URLs', 'Realtime subscriptions'],
    curriculum: [
      { title: 'Postgres Modelling', items: ['Tables, relations & indexes', 'Seed data & migrations'] },
      { title: 'Auth & RLS', items: ['Supabase Auth + roles', 'Policies for courses/orders/notes'] },
      { title: 'Realtime & Storage', items: ['Live enrolment feeds', 'File policies for notes'] },
    ],
  },
  {
    id: 'dsa-bootcamp',
    title: 'DSA Bootcamp in JavaScript: 150 Problems',
    category: 'CS Fundamentals', level: 'All levels', rating: 4.8, reviews: 3120,
    students: 24100, price: 1999, mrp: 5999, free: false,
    tag: 'Popular', color: 'linear-gradient(135deg,#8FAE1A,#141A06)',
    thumb: 'DSA', instructor: 'Kunal Mehta', duration: '36h 45m', lessons: 150,
    desc: 'Arrays to graphs with interview patterns, contests and lifetime mock-test access.',
    outcomes: ['150 curated problems', 'Patterns for interviews', 'Time/space analysis', 'Contest strategy'],
    curriculum: [
      { title: 'Foundations', items: ['Complexity analysis', 'Arrays & strings (30 Qs)'] },
      { title: 'Core Structures', items: ['Linked lists, stacks, trees', 'Graphs & DP'] },
    ],
  },
  {
    id: 'ui-design-system',
    title: 'Design Systems: Pixel-Perfect UI with Figma',
    category: 'Design', level: 'Beginner', rating: 4.6, reviews: 620,
    students: 5340, price: 0, mrp: 0, free: true,
    tag: 'Free', color: 'linear-gradient(135deg,#B9D92E,#3E4D08)',
    thumb: 'UI/UX', instructor: 'Jane Rayne', duration: '9h 20m', lessons: 38,
    desc: 'Free design course matching this platform aesthetic: type, spacing, olive/paper tokens and dark sections.',
    outcomes: ['Figma auto-layout mastery', 'Token-driven theming', 'Landing page teardown', 'Handoff to React'],
    curriculum: [
      { title: 'Visual Foundations', items: ['Type scale & spacing', 'Color tokens'] },
      { title: 'Build the LMS Landing', items: ['Hero recreation', 'Dark band & footer'] },
    ],
  },
  {
    id: 'devops-deploy',
    title: 'Deploy Like a Pro: CI/CD, VPS & R2 CDN',
    category: 'DevOps', level: 'Advanced', rating: 4.7, reviews: 410,
    students: 3120, price: 3499, mrp: 8999, free: false,
    tag: 'Pro', color: 'linear-gradient(135deg,#0E1206,#75900F)',
    thumb: 'OPS', instructor: 'Aditya Rao', duration: '16h 40m', lessons: 52,
    desc: 'Ship the LMS with GitHub Actions, Nginx, SSL, and R2 caching for video delivery.',
    outcomes: ['VPS hardening', 'CI/CD pipelines', 'R2 + CDN caching', 'Monitoring & backups'],
    curriculum: [
      { title: 'Server Setup', items: ['Nginx + SSL', 'PM2 & logs'] },
      { title: 'Pipelines', items: ['Preview deploys', 'R2 cache invalidation'] },
    ],
  },
];

export const NOTES_SEED = [
  { id: 'n1', courseId: 'fullstack-mern', title: 'MERN Roadmap PDF', type: 'PDF', size: '2.4 MB', updated: 'Oct 2026' },
  { id: 'n2', courseId: 'fullstack-mern', title: 'Supabase RLS Cheatsheet', type: 'PDF', size: '1.1 MB', updated: 'Oct 2026' },
  { id: 'n3', courseId: 'react-pro', title: 'Hooks Quick Reference', type: 'DOC', size: '860 KB', updated: 'Sep 2026' },
  { id: 'n4', courseId: 'supabase-postgres', title: 'RLS Policies Handbook', type: 'PDF', size: '3.2 MB', updated: 'Oct 2026' },
];

export const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const TESTS = [
  {
    id: 't-mern-1', courseId: 'fullstack-mern', title: 'MERN Fundamentals Check', duration: '15 min', total: 5,
    questions: [
      { q: 'Which hook runs side-effects after render in React?', opts: ['useState', 'useEffect', 'useMemo', 'useRef'], ans: 1 },
      { q: 'In Express, what does `app.use(express.json())` do?', opts: ['Serves static files', 'Parses JSON request bodies', 'Connects MongoDB', 'Enables CORS'], ans: 1 },
      { q: 'Which Supabase feature isolates student vs admin rows?', opts: ['Realtime', 'Row Level Security', 'Edge Functions', 'Buckets'], ans: 1 },
      { q: 'Best place to store a video for streaming via CDN?', opts: ['Postgres bytea', 'Cloudflare R2 bucket', 'LocalStorage', 'JWT claim'], ans: 1 },
      { q: 'JWT should be verified…', opts: ['Only on the client', 'On every protected API request', 'Once per year', 'Never'], ans: 1 },
    ],
  },
  {
    id: 't-react-1', courseId: 'react-pro', title: 'React Hooks Mastery Quiz', duration: '10 min', total: 5,
    questions: [
      { q: 'Rules of Hooks require hooks to be called…', opts: ['Inside loops', 'At the top level', 'Inside conditions only', 'In event handlers directly'], ans: 1 },
      { q: 'useMemo is used to…', opts: ['Fetch data', 'Memoize expensive values', 'Replace useState', 'Style components'], ans: 1 },
      { q: 'React Router `<Navigate>` is used for…', opts: ['Styling', 'Redirects / guards', 'Animations', 'Forms'], ans: 1 },
      { q: 'Code-splitting a route uses…', opts: ['React.lazy + Suspense', 'useEffect', 'Context', 'Refs'], ans: 0 },
      { q: 'Keys in lists help React…', opts: ['Fetch faster', 'Identify changed items', 'Style rows', 'Paginate'], ans: 1 },
    ],
  },
  {
    id: 't-sql-1', courseId: 'supabase-postgres', title: 'RLS Policy Drill', duration: '10 min', total: 4,
    questions: [
      { q: 'RLS must first be…', opts: ['Dropped', 'Enabled on the table', 'Disabled', 'Indexed'], ans: 1 },
      { q: 'auth.uid() returns…', opts: ['A random number', 'The current user id', 'The table name', 'A bucket id'], ans: 1 },
      { q: 'A policy FOR SELECT controls…', opts: ['Who can read rows', 'Column types', 'Index size', 'Backup time'], ans: 0 },
      { q: 'Service-role key should live…', opts: ['In frontend JS', 'Server-side only', 'In CSS', 'In the URL'], ans: 1 },
    ],
  },
  {
    id: 't-dsa-1', courseId: 'dsa-bootcamp', title: 'Complexity Warm-up', duration: '10 min', total: 4,
    questions: [
      { q: 'Binary search complexity?', opts: ['O(n)', 'O(log n)', 'O(n²)', 'O(1) amortized'], ans: 1 },
      { q: 'HashMap average lookup?', opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], ans: 2 },
      { q: 'Merge sort worst case?', opts: ['O(n log n)', 'O(n²)', 'O(n)', 'O(2ⁿ)'], ans: 0 },
      { q: 'BFS uses…', opts: ['Stack', 'Queue', 'Heap', 'Trie'], ans: 1 },
    ],
  },
];
