# Development Guidelines for Notion CMS Project

## 1. Project Overview

**Project Name:** Personal Development Blog using Notion CMS  
**Technology Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, @notionhq/client  
**Core Functionality:** Blog platform that uses Notion as a content management system (CMS)  

**Project Architecture Pattern:** Layered Architecture (Controller → Service → Repository) with DTO pattern

---

## 2. Project Architecture

### 2.1 Directory Structure

```
project-root/
├── app/                          # Next.js App Router pages and layouts
│   ├── layout.tsx                # Root layout (requires Header, Footer components)
│   ├── page.tsx                  # Home page (blog list)
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx          # Blog detail page (dynamic route)
│   ├── category/
│   │   └── [category]/
│   │       └── page.tsx          # Category filtered list
│   └── search/
│       └── page.tsx              # Search results page
├── components/
│   ├── layout/                   # Layout components (Header, Footer, Navigation)
│   ├── blog/                     # Blog-specific components (BlogCard, BlogList, BlogContent)
│   ├── notion/                   # Notion rendering components (NotionRenderer, block renderers)
│   ├── common/                   # Reusable UI components (Badge, etc.)
│   ├── search/                   # Search-related components
│   └── pagination/               # Pagination component
├── lib/
│   ├── notion/
│   │   ├── client.ts             # Notion API client instance (@notionhq/client)
│   │   ├── api.ts                # Notion API functions (fetchPages, fetchPageContent, etc.)
│   │   └── renderer.ts           # Rich Text rendering engine
│   ├── utils/
│   │   ├── format.ts             # Formatting utilities (formatDate, truncateText, generateSlug)
│   │   └── search.ts             # Client-side search logic
│   └── constants.ts              # Configuration constants and environment variables
├── types/
│   ├── notion.ts                 # Notion API base types (Page, RichText, Block, etc.)
│   └── blog.ts                   # Domain types (Post, Category, Tag)
├── public/                       # Static files
├── docs/
│   ├── PRD.md                    # Product Requirements Document
│   └── ROADMAP.md                # Development Roadmap
├── .env.local                    # Environment variables (NEVER commit)
├── CLAUDE.md                     # Global AI development guidelines
└── shrimp-rules.md              # AI agent project-specific rules

```

### 2.2 Module Responsibilities

| Module | Responsibility | Dependencies |
|--------|----------------|--------------|
| `lib/notion/client.ts` | Notion API client initialization | @notionhq/client |
| `lib/notion/api.ts` | All Notion API operations | client.ts, types/notion.ts |
| `lib/notion/renderer.ts` | Converting Notion blocks to React components | types/notion.ts |
| `lib/utils/format.ts` | Date, text, slug formatting | types/blog.ts |
| `lib/utils/search.ts` | Full-text search on client-side | types/blog.ts |
| `components/layout/` | Header, Footer, Navigation | lib/utils/format.ts |
| `components/blog/` | Blog card, list, content display | types/blog.ts, lib/utils/ |
| `components/notion/` | Notion block rendering | lib/notion/renderer.ts |

---

## 3. Code Standards

### 3.1 Language & Naming Conventions

| Element | Language | Example |
|---------|----------|---------|
| **Responses** | Korean | "블로그 글 목록을 가져왔습니다" |
| **Code Comments** | Korean (business logic only) | `// 발행된 글만 필터링` |
| **Variable/Function Names** | English (camelCase) | `const publishedPosts`, `formatDate()` |
| **Type Names** | English (PascalCase) | `interface Post`, `type BlogStatus` |
| **File Names** | English (kebab-case for components) | `blog-card.tsx`, `notion-renderer.ts` |

### 3.2 TypeScript Standards

- **NO `any` type:** All functions and variables must have explicit types
- **Interface Required:** Every exported function must have TypeScript interface for parameters and return type
- **Type Safety:** Use `as const` for literal types, `satisfies` for type checking
- **Error Typing:** Use `Error` class or custom error types, never implicit

```typescript
// ✓ CORRECT
interface FetchPostsParams {
  limit: number;
  offset: number;
  status: 'published' | 'draft';
}

async function fetchPosts(params: FetchPostsParams): Promise<Post[]> {
  // implementation
}

// ✗ WRONG
async function fetchPosts(params: any): any {
  // implementation
}
```

### 3.3 Formatting Standards

- **Indentation:** 2 spaces (NOT tabs)
- **Line Length:** Max 100 characters (for readability)
- **Semicolons:** Required at end of statements
- **Quotes:** Double quotes for strings
- **Spacing:** One space after keywords, before braces

```typescript
// ✓ CORRECT
if (status === "published") {
  const formatted = formatDate(date);
}

// ✗ WRONG
if(status=="published"){const formatted=formatDate(date)}
```

### 3.4 Component Standards

- **Functional Components:** Use React function components, NOT class components
- **Props Interface:** Define `Props` interface above component
- **Filename:** Match component name, kebab-case (e.g., `BlogCard.tsx`)
- **Client Components:** Use `"use client"` directive only when necessary (state, events)
- **Memoization:** Use `React.memo` only if performance issue proven

```typescript
// ✓ CORRECT
interface BlogCardProps {
  post: Post;
  onClickRead: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onClickRead }) => {
  return (
    <div>
      <h2>{post.title}</h2>
      <button onClick={onClickRead}>Read</button>
    </div>
  );
};

// ✗ WRONG
export default function BlogCard(props: any) {
  return <div>{props.post.title}</div>;
}
```

---

## 4. Functionality Implementation Standards

### 4.1 API Integration with Notion

**Location:** `lib/notion/api.ts` - ALL Notion API calls must be centralized here

#### API Function Pattern

```typescript
interface NotionApiResponse<T> {
  data: T;
  error?: string;
}

async function fetchPages(
  databaseId: string,
  filter?: QueryDatabaseParameters["filter"],
  sort?: QueryDatabaseParameters["sorts"]
): Promise<Post[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter,
      sorts: sort || [{ property: "Published", direction: "descending" }],
      page_size: 100,
    });
    return response.results.map(normalizePost);
  } catch (error) {
    throw handleNotionError(error);
  }
}
```

### 4.2 Error Handling (MANDATORY)

**EVERY API call MUST have error handling**

```typescript
// ✓ CORRECT - Error handling required
async function fetchPages(databaseId: string): Promise<Post[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    return response.results.map(normalizePost);
  } catch (error) {
    if (error instanceof APIResponseError) {
      logger.error("Notion API error:", error.message);
      throw new Error(`Failed to fetch pages: ${error.message}`);
    }
    throw error;
  }
}

// ✗ WRONG - No error handling
async function fetchPages(databaseId: string): Promise<Post[]> {
  const response = await notion.databases.query({ database_id: databaseId });
  return response.results.map(normalizePost);
}
```

### 4.3 Data Validation

All Notion API responses MUST be validated before use:

```typescript
// ✓ CORRECT - Validation included
function normalizePost(page: PageObjectResponse): Post {
  const titleProp = page.properties.Title;
  if (!titleProp || titleProp.type !== "title") {
    throw new Error("Invalid Post: missing Title property");
  }
  
  return {
    id: page.id,
    title: titleProp.title[0]?.plain_text || "Untitled",
    // ... more properties
  };
}
```

### 4.4 ISR (Incremental Static Regeneration) MANDATORY

Never use dynamic page generation without ISR - it causes performance issues.

```typescript
// ✓ CORRECT - SSG with ISR
export const revalidate = 15 * 60; // 15 minutes

export async function generateStaticParams() {
  const posts = await fetchPublishedPosts();
  return posts.map((post) => ({
    slug: generateSlug(post.title),
  }));
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await fetchPostBySlug(params.slug);
  // ...
}

// ✗ WRONG - Dynamic without ISR
export default async function BlogDetailPage({ params }: Props) {
  // No generateStaticParams = dynamic rendering (SLOW)
  const post = await fetchPostBySlug(params.slug);
  // ...
}
```

### 4.5 Retry Logic for API Rate Limiting

When Notion API returns rate limit (429), implement exponential backoff:

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof APIResponseError && error.status === 429) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}
```

---

## 5. Framework & Library Usage Standards

### 5.1 Next.js 15 Specifics

- **App Router:** Use `app/` directory (NOT `pages/` directory)
- **Server Components:** Default to server components, use `"use client"` only when needed
- **Metadata API:** Use Next.js `metadata` export, NOT `<Head>` tags
- **Image Optimization:** Use `next/image` component with sizes, width, height
- **Dynamic Routes:** Use `[slug]` with `generateStaticParams()`

```typescript
// ✓ CORRECT - App Router with metadata
export const metadata: Metadata = {
  title: "Blog Post",
  description: "Post description",
};

export default async function Page() {
  // Server component by default
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✗ WRONG - Pages directory, client-only
export default function Page() {
  "use client";
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
}
```

### 5.2 TypeScript Configuration

- **Target:** ES2020 or higher
- **Strict Mode:** `strict: true` in tsconfig.json
- **No Implicit Any:** `noImplicitAny: true`
- **Path Aliases:** Use `@/` prefix for imports

```typescript
// ✓ CORRECT - Use path aliases
import { BlogCard } from "@/components/blog/blog-card";
import { Post } from "@/types/blog";

// ✗ WRONG - Relative paths for distant modules
import { BlogCard } from "../../../components/blog/blog-card";
```

### 5.3 Tailwind CSS & shadcn/ui

- **Tailwind:** Use utility-first approach, avoid inline styles
- **shadcn/ui:** Use pre-built components from shadcn/ui library
- **Dark Mode:** Prepare for dark mode support (use CSS variables)
- **Responsive:** Mobile-first design approach

```typescript
// ✓ CORRECT - Tailwind utilities with responsive
<div className="w-full md:w-1/2 lg:w-1/3 px-4 py-6">
  <h2 className="text-xl md:text-2xl font-bold">Title</h2>
</div>

// ✗ WRONG - Inline styles
<div style={{ width: "50%", padding: "10px" }}>
  <h2 style={{ fontSize: "20px" }}>Title</h2>
</div>
```

### 5.4 @notionhq/client Usage

- **Client Instance:** Must be in `lib/notion/client.ts`, exported as singleton
- **Error Handling:** All API calls wrapped in try-catch with custom error handlers
- **Rate Limiting:** Implement retry logic for 429 responses
- **API Version:** Always specify API version in client config

```typescript
// ✓ CORRECT - lib/notion/client.ts
import { Client } from "@notionhq/client";

const notionApiKey = process.env.NOTION_API_KEY;
if (!notionApiKey) {
  throw new Error("NOTION_API_KEY environment variable not set");
}

export const notion = new Client({
  auth: notionApiKey,
});

// Use in api.ts:
import { notion } from "./client";

async function fetchPages(databaseId: string): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  // ...
}
```

---

## 6. Workflow Standards

### 6.1 Development Phase Workflow

Follow ROADMAP.md phases strictly:

1. **Phase 1:** Environment Setup (folder structure, Notion client)
2. **Phase 2:** Common Modules (types, API functions, components)
3. **Phase 3:** Core Features (home page, detail page)
4. **Phase 4:** Additional Features (categories, search)
5. **Phase 5:** Optimization & Deployment

### 6.2 Notion Database Schema Compliance

Always verify these fields exist in Notion database before development:

| Field | Type | Status |
|-------|------|--------|
| Title | Title | ✓ Required |
| Category | Select | ✓ Required |
| Tags | Multi-select | Optional |
| Published | Date | ✓ Required |
| Status | Select | ✓ Required (values: "발행됨", "초안") |
| Content | Page content | ✓ Required |

**Filter Rule:** Only display posts where `Status = "발행됨"`  
**Sort Rule:** Order by `Published` descending (newest first)

### 6.3 Environment Variables

Create `.env.local` (NEVER commit):

```bash
NOTION_API_KEY=your_notion_api_key_here
NEXT_PUBLIC_NOTION_DATABASE_ID=your_database_id_here
```

Template location: `docs/env.local.example` should exist and be maintained

---

## 7. Key File Interaction Standards

### 7.1 Multi-File Modification Rules

When modifying these files, you MUST check related files simultaneously:

| Primary File | Must Check | Reason |
|--------------|-----------|--------|
| `types/blog.ts` | `lib/notion/api.ts`, `lib/utils/format.ts` | Type consumers |
| `lib/notion/api.ts` | `app/page.tsx`, `app/blog/[slug]/page.tsx` | API function usage |
| `lib/constants.ts` | `.env.local` (template) | Environment variables |
| `components/layout/Header.tsx` | `app/layout.tsx` | Layout integration |
| `lib/notion/renderer.ts` | `components/notion/NotionRenderer.tsx` | Renderer usage |
| `ROADMAP.md` or `PRD.md` | Current phase completion status | Progress tracking |

**CRITICAL:** Do NOT modify one file without reviewing all dependent files

```typescript
// EXAMPLE: Modifying Post type
// ✓ REQUIRED STEPS:
// 1. Edit types/blog.ts - add new field to Post interface
// 2. Check lib/notion/api.ts - update normalizePost() function
// 3. Check lib/utils/format.ts - if formatting is needed
// 4. Check all usages in components/blog/*.tsx files
// 5. Update ROADMAP.md if phase completion changes
```

### 7.2 Import Path Conventions

Use path aliases consistently:

```typescript
// ✓ CORRECT
import { Post } from "@/types/blog";
import { fetchPosts } from "@/lib/notion/api";
import { BlogCard } from "@/components/blog/blog-card";

// ✗ WRONG
import { Post } from "../../types/blog";
import { fetchPosts } from "../../../lib/notion/api";
import { BlogCard } from "../../../../components/blog/blog-card";
```

---

## 8. AI Decision-Making Standards

### 8.1 When to Create New Files vs. Modifying Existing

| Situation | Decision | Reason |
|-----------|----------|--------|
| Adding new API function | Add to `lib/notion/api.ts` | Centralize Notion operations |
| Adding new utility function | Add to `lib/utils/*.ts` | Reusable across project |
| New component type | Create new file in `components/*/` | Organized structure |
| New type definition | Add to existing `types/blog.ts` or `types/notion.ts` | Logical grouping |
| Configuration value | Add to `lib/constants.ts` | Single source of truth |

### 8.2 When to Use Server vs. Client Components

| Feature | Component Type | Reason |
|---------|----------------|--------|
| Fetch data from Notion API | Server component | Security, no API key exposure |
| Display static content | Server component | Better performance |
| Handle user input (form, button) | Client component | Requires interactivity |
| State management | Client component | Requires useState, useReducer |
| Real-time updates | Client component | useEffect needed |

**Default:** Server component UNLESS you need interactivity

### 8.3 Performance Decision Tree

```
Does page need dynamic data?
├─ NO → Use static generation (SSG) in public/
├─ YES → Does it change often (< 1 hour)?
│  ├─ NO → Use ISR with revalidate: 3600
│  └─ YES → Use ISR with revalidate: 60
│
Does data size matter?
├─ YES → Implement pagination (10 items/page)
├─ NO → No pagination needed
```

### 8.4 Error Handling Decision Tree

```
Is this an API call?
├─ YES → MUST have try-catch + handleNotionError()
├─ NO → Consider if it can fail
│  ├─ CAN FAIL → Add try-catch with user-friendly message
│  └─ CANNOT FAIL → No error handling needed
```

---

## 9. Prohibited Actions

### 9.1 ABSOLUTELY PROHIBITED ❌

| Action | Reason | Alternative |
|--------|--------|-------------|
| Use `any` type | Breaks type safety | Use `unknown` with type guard or proper type |
| Hardcode API keys | Security risk | Use `.env.local` |
| Dynamic routes without ISR | Performance issue | Use `generateStaticParams()` + ISR |
| Skip error handling on API calls | Unhandled errors crash app | Use try-catch + handleNotionError() |
| Korean variable names | Breaks code readability | Use English camelCase |
| Modify Notion data | Only Notion.com should modify | Fetch and display only |
| Over-abstract code | Premature optimization | Keep it simple, refactor only when needed |

### 9.2 NOT ALLOWED during Implementation

| Prohibited | When it's OK | Reason |
|-----------|-------------|--------|
| Add features beyond current phase | After current phase complete | Follow ROADMAP phases strictly |
| Refactor unrelated code | In same PR as feature | Separate refactor PRs |
| Complex algorithms without tests | With comprehensive tests | Complexity requires verification |
| Dependency upgrades | Only for bug/security fixes | Minimize dependency changes |
| Comments explaining WHAT code does | Complex WHY logic only | Code should be self-explanatory |

### 9.3 Code Patterns to Avoid

```typescript
// ✗ WRONG: Using any
function processPost(post: any) {
  return post.title.toUpperCase();
}

// ✓ CORRECT: Use proper type
function processPost(post: Post): string {
  return post.title.toUpperCase();
}

// ✗ WRONG: Hardcoded API key
const notion = new Client({ auth: "notion_abc123xyz" });

// ✓ CORRECT: Use environment variable
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ✗ WRONG: No error handling
const post = await notion.pages.retrieve({ page_id: pageId });

// ✓ CORRECT: With error handling
try {
  const post = await notion.pages.retrieve({ page_id: pageId });
} catch (error) {
  throw handleNotionError(error);
}

// ✗ WRONG: Unnecessary abstraction
const usePostHook = (setPost: SetStateAction<Post | null>) => {
  return useCallback(() => fetchPost(), []);
};

// ✓ CORRECT: Direct implementation
async function fetchPost(): Promise<Post> {
  return (await notion.pages.retrieve(/* ... */)) as Post;
}
```

---

## 10. Testing Standards

- **Unit Tests:** Required for utility functions in `lib/utils/`
- **Integration Tests:** Required for Notion API functions
- **Component Tests:** Required for reusable components
- **E2E Tests:** Optional for critical user flows

Test command: `npm run test`

---

## 11. Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| FCP (First Contentful Paint) | < 1.8 seconds | Lighthouse |
| LCP (Largest Contentful Paint) | < 2.5 seconds | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| Lighthouse Performance | > 90 | Lighthouse |
| Lighthouse SEO | > 90 | Lighthouse |
| Build Time | < 60 seconds | next build |

---

## 12. Summary Checklist for AI Agents

Before implementing ANY feature:

- [ ] Read ROADMAP.md to confirm current phase
- [ ] Check CLAUDE.md for global rules
- [ ] Verify directory structure matches section 2.1
- [ ] Plan file modifications (section 7.1)
- [ ] Define TypeScript interfaces for all inputs/outputs
- [ ] Prepare error handling strategy
- [ ] Confirm ISR strategy if page is dynamic
- [ ] Check for prohibited actions (section 9)
- [ ] After implementation: run type check and lint
- [ ] After implementation: verify multi-file consistency

---

**Last Updated:** 2026-08-08  
**For Questions:** Refer to PRD.md, ROADMAP.md, or CLAUDE.md