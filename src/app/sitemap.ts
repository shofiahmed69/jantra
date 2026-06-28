import { MetadataRoute } from 'next';
import api from '@/lib/api';
import { getAllPosts } from '@/data/blogPosts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jantrasoft.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Core Static Routes — highest priority
  const staticRoutes = [
    { url: siteUrl, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${siteUrl}/services`, priority: 0.95, changeFrequency: 'weekly' as const },
    { url: `${siteUrl}/pricing`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${siteUrl}/contact`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/about`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${siteUrl}/work`, priority: 0.85, changeFrequency: 'weekly' as const },
    { url: `${siteUrl}/blog`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${siteUrl}/careers`, priority: 0.7, changeFrequency: 'weekly' as const },
  ].map(route => ({
    ...route,
    lastModified: new Date(),
  }));

  // Service Detail Routes — very high priority for product SEO
  const serviceSlugs = [
    "custom-software-development",
    "mobile-app-development",
    "ai-agent-development",
    "workflow-automation",
    "saas-product-development",
    "cloud-api-systems",
    "ui-ux-design"
  ];

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Location + Service Routes — for local SEO targeting global markets
  const locations = [
    "dhaka",
    "bangladesh",
    "new-york",
    "san-francisco",
    "london",
    "austin",
    "toronto",
    "berlin",
    "dubai",
    "singapore",
  ];
  
  const locationRoutes = serviceSlugs.flatMap((slug) =>
    locations.map((location) => ({
      url: `${siteUrl}/services/${slug}/${location}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  // Blog Routes — dynamic with high freshness priority
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const response = await api.get("/blog");
    let data = response.data?.posts || response.data?.data || response.data || [];

    if (!Array.isArray(data) || data.length === 0) {
      data = getAllPosts();
    }

    blogRoutes = data.map((post: any) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }));
  } catch (error) {
    const localPosts = getAllPosts();
    blogRoutes = localPosts.map((post: any) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }));
  }

  return [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...blogRoutes];
}
