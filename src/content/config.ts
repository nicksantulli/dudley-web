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
    status: z.enum(['live', 'coming_soon', 'in_development']),
    category: z.string(),
    operatingSystem: z.string().default('iOS 16.0 or later'),
    applicationCategory: z.string().default('EntertainmentApplication'),
    primaryKeyword: z.string(),
    featureList: z.array(z.string()).default([]),
    faq: z.array(faqItem),
    relatedArchetypes: z.array(z.string()).optional(),
    relatedApps: z.array(z.string()).optional(),
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

export const collections = { apps, archetypes, comparisons, tools };
