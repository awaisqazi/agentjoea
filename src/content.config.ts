import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const properties = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/properties' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      tag: z.enum(['Rental', 'AirBnb', 'Flipped']),
      beds: z.number(),
      baths: z.number(),
      propertyType: z.string(),
      buyPrice: z.number(),
      soldPrice: z.number(),
      order: z.number(),
      card: image(),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      excerpt: z.string(),
      cover: image(),
    }),
});

export const collections = { properties, blog };
