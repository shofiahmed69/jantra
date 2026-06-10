import { MetadataRoute } from 'next';
import api from '@/lib/api';
import { getAllPosts } from '@/data/blogPosts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jantrasoft.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static Routes
  const staticRoutes = [
    '',
    '/services',
    '/work',
    '/blog',
    '/contact',
    '/pricing',
    '/careers',
    '/about',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Service Routes
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
    priority: 0.8,
  }));

  // Location Service Routes
  const locations = ["new-york", "san-francisco", "london", "austin", "toronto", "berlin"];
  const locationRoutes = serviceSlugs.flatMap((slug) => 
    locations.map((location) => ({
      url: `${siteUrl}/services/${slug}/${location}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  // Blog Routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    // Attempt to fetch from API
    const response = await api.get("/blog");
    let data = response.data?.posts || response.data?.data || response.data || [];
    
    if (!Array.isArray(data) || data.length === 0) {
      // Fallback to local posts
      data = getAllPosts();
    }
    
    blogRoutes = data.map((post: any) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    // Fallback to local posts
    const localPosts = getAllPosts();
    blogRoutes = localPosts.map((post: any) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  }

  return [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...blogRoutes];
}
