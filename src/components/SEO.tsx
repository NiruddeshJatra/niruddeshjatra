import { Helmet } from 'react-helmet-async';
import { toISOWithTimezone } from '../lib/structuredData';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  lang?: 'en' | 'bn';
  alternateLangPath?: string;
  ogType?: 'website' | 'article';
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
  structuredData?: object;
}

const SITE_URL = 'https://niruddeshjatra.space';
const SITE_NAME = 'niruddeshjatra';
const SITE_AUTHOR = 'Nasiful Alam';
const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  lang = 'en',
  alternateLangPath,
  ogType = 'website',
  articleMeta,
  structuredData,
}) => {
  const fullUrl = `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;

  return (
    <Helmet>
      <html lang={lang} />

      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {alternateLangPath && (
        <>
          <link rel="alternate" hreflang={lang === 'en' ? 'bn' : 'en'} href={`${SITE_URL}${alternateLangPath}`} />
          <link rel="alternate" hreflang={lang} href={fullUrl} />
          <link rel="alternate" hreflang="x-default" href={fullUrl} />
        </>
      )}

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE_URL} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === 'bn' ? 'bn_BD' : 'en_US'} />

      {ogType === 'article' && articleMeta && (
        <>
          {articleMeta.publishedTime && <meta property="article:published_time" content={toISOWithTimezone(articleMeta.publishedTime)} />}
          {articleMeta.modifiedTime && <meta property="article:modified_time" content={toISOWithTimezone(articleMeta.modifiedTime)} />}
          <meta property="article:author" content={articleMeta.author || SITE_AUTHOR} />
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE_URL} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
