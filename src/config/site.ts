export const siteConfig = {
  name: "Stone Commerce",
  description:
    "A premium multi-tenant stone e-commerce platform for natural stone, marble, travertine, and architectural materials.",
  url: "https://example.com",
  ogImage: "https://example.com/og.png",
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example",
  },
} as const;

export type SiteConfig = typeof siteConfig;