import { MetadataRoute } from 'next';
import { ICONS } from '@/data/icons';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://orbit-icons.vercel.app';

  const icons = ICONS.map((icon) => ({
    url: `${baseUrl}/icons/${icon.name}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...icons,
  ];
}
