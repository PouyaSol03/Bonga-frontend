import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

function getDefaultCanonicalUrl() {
  if (typeof window === 'undefined') return undefined;

  const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, '');
  const pathname = window.location.pathname || '/';

  if (configuredSiteUrl) {
    return `${configuredSiteUrl}${pathname === '/' ? '' : pathname}`;
  }

  return `${window.location.origin}${pathname}`;
}

function toAbsoluteUrl(url: string | undefined, baseUrl: string | undefined) {
  if (!url) return undefined;

  try {
    return new URL(url, baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : undefined)).toString();
  } catch {
    return url;
  }
}

export function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary',
  noIndex = false,
  structuredData,
}: SEOProps) {
  const resolvedCanonicalUrl = canonicalUrl || getDefaultCanonicalUrl();
  const resolvedDescription = ogDescription || description;
  const resolvedOgImage = toAbsoluteUrl(ogImage, resolvedCanonicalUrl);

  return (
    <Helmet>
      <html lang="fa" dir="rtl" />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={
          noIndex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="بنگاه" />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:title" content={ogTitle || title} />
      {resolvedDescription && <meta property="og:description" content={resolvedDescription} />}
      {resolvedOgImage && <meta property="og:image" content={resolvedOgImage} />}
      {resolvedCanonicalUrl && <meta property="og:url" content={resolvedCanonicalUrl} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || title} />
      {resolvedDescription && <meta name="twitter:description" content={resolvedDescription} />}
      {resolvedOgImage && <meta name="twitter:image" content={resolvedOgImage} />}

      {resolvedCanonicalUrl && <link rel="canonical" href={resolvedCanonicalUrl} />}

      {structuredData ? (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      ) : null}
    </Helmet>
  );
}
