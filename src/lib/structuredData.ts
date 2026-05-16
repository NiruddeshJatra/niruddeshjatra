const SITE_URL = 'https://niruddeshjatra.space';

export const personSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nasiful Alam',
  alternateName: ['nj', 'niruddeshjatra'],
  url: SITE_URL,
  jobTitle: 'Tutor, Runner, Maker',
  worksFor: {
    '@type': 'Organization',
    name: 'Independent',
  },
  sameAs: [
    'https://github.com/niruddeshjatra',
    'https://www.strava.com/athletes/102295099',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chittagong',
    addressCountry: 'BD',
  },
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'niruddeshjatra',
  alternateName: 'nj.space',
  url: SITE_URL,
  description: 'a quiet corner of the internet. essays, games, and field notes by nj.',
  author: personSchema(),
  inLanguage: ['en', 'bn'],
});

const toISOWithTimezone = (date: string): string => {
  if (date.includes('T')) return date;
  return `${date}T00:00:00+06:00`;
};

export { toISOWithTimezone };

export const articleSchema = (params: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  lang: 'en' | 'bn';
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: params.title,
  description: params.description,
  url: `${SITE_URL}${params.path}`,
  datePublished: toISOWithTimezone(params.datePublished),
  dateModified: toISOWithTimezone(params.dateModified || params.datePublished),
  inLanguage: params.lang === 'bn' ? 'bn-BD' : 'en-US',
  author: {
    '@type': 'Person',
    name: 'Nasiful Alam',
    alternateName: 'nj',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Person',
    name: 'Nasiful Alam',
    alternateName: 'nj',
  },
  image: `${SITE_URL}/og-image.png`,
});
