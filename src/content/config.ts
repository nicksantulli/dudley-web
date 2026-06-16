import { defineCollection, z } from 'astro:content';

const faqItem = z.object({ q: z.string(), a: z.string() });

const apps = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    appStoreId: z.string().optional().default(''),
    bundleId: z.string().optional(),
    icon: z.string(),
    ogImage: z.string().optional(),
    status: z.enum(['live', 'coming_soon', 'in_development']),
    category: z.string(),
    // Client work: the partner/brand this app was built FOR (e.g. "HomeLight").
    // When set, the app is rendered in the homepage "Client work" section with a
    // "Created for <partner>" label instead of in the studio's own-apps list.
    // Leave unset for Dudley's own apps.
    developedFor: z.string().optional(),
    operatingSystem: z.string().default('iOS 16.0 or later'),
    applicationCategory: z.string().default('EntertainmentApplication'),
    primaryKeyword: z.string(),
    featureList: z.array(z.string()).default([]),
    faq: z.array(faqItem),
    // Per-app SUPPORT FAQ (troubleshooting / how-do-I, distinct from the marketing `faq`).
    // Data-driven: any app with a non-empty `support` array automatically gets a
    // /support/<slug> page and a card on the /support index. Leave it empty for apps
    // that don't have a support page yet (coming-soon stubs); fill it in when they ship.
    support: z.array(faqItem).default([]),
    relatedArchetypes: z.array(z.string()).optional(),
    relatedApps: z.array(z.string()).optional(),
    // Set false for a "Coming soon" stub that has no full landing/privacy page yet.
    // The homepage still shows its card (icon + badge + blurb) but hides the
    // Learn more / Privacy buttons, and no /apps/<slug>/ page is generated.
    // Flip to true (and fill in the body/faq) once the app ships and earns a page.
    landingPage: z.boolean().default(true),
    order: z.number().default(99),
    dateAdded: z.date(),
    lastUpdated: z.date(),
  }),
});

const archetypes = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    emoji: z.string(),
    tagline: z.string(),
    description: z.string(),
    primaryKeyword: z.string(),
    associatedApp: z.string().default('vibe-rater'),
    faq: z.array(faqItem),
    relatedArchetypes: z.array(z.string()).default([]),
    order: z.number().default(99),
    dateAdded: z.date(),
  }),
});

const comparisons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    primaryKeyword: z.string(),
    targetApp: z.string(),
    apps: z.array(
      z.object({
        name: z.string(),
        bestFor: z.string().optional(),
        price: z.string().default('Free'),
        description: z.string(),
        pros: z.array(z.string()),
        verdict: z.string(),
        appStoreUrl: z.string().optional(),
        isDudleyApp: z.boolean().default(false),
      })
    ),
    faq: z.array(faqItem).default([]),
    related: z.array(z.object({ title: z.string(), url: z.string(), description: z.string() })).default([]),
    dateAdded: z.date(),
    lastUpdated: z.date(),
  }),
});

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    primaryKeyword: z.string(),
    targetApp: z.string().default('vibe-rater'),
    faq: z.array(faqItem).default([]),
    dateAdded: z.date(),
  }),
});

// Blog — the Content Writer drops a markdown/MDX file in src/content/blog/ and pushes.
// This schema mirrors the frontmatter they already author in vault/growth/blog/posts/.
// Everything optional has a sensible default so a minimal post (title + description +
// publishDate + category) still builds. Adding a post requires zero layout changes.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.string(),
    // Extra freeform tags beyond the category. Tag pages are built from category + tags.
    tags: z.array(z.string()).default([]),
    primaryKeyword: z.string().optional(),
    relatedApps: z.array(z.string()).default([]),
    relatedArchetypes: z.array(z.string()).default([]),
    faq: z.array(faqItem).default([]),
    author: z.string().default('Dudley Development'),
    // Site-relative or absolute OG image; falls back to the Dudley mark in the layout.
    ogImage: z.string().optional(),
    featured: z.boolean().default(false),
    // Set draft: true to keep a post out of the build (index, routes, RSS, sitemap, llms.txt).
    draft: z.boolean().default(false),
  }),
});

export const collections = { apps, archetypes, comparisons, tools, blog };
