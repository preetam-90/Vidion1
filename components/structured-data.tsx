import { FC } from 'react';

interface VideoStructuredDataProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string; // Format: "PT1H30M" for 1 hour 30 minutes
}

export const VideoStructuredData: FC<VideoStructuredDataProps> = ({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
    ...(duration && { duration }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

interface WebsiteStructuredDataProps {
  name: string;
  url: string;
  description: string;
  searchAction?: string;
}

export const WebsiteStructuredData: FC<WebsiteStructuredDataProps> = ({
  name,
  url,
  description,
  searchAction,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    ...(searchAction && {
      potentialAction: {
        '@type': 'SearchAction',
        target: `${searchAction}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

interface MovieStructuredDataProps {
  name: string;
  description: string;
  image: string;
  datePublished: string;
  director?: string;
  duration?: string;
  contentRating?: string;
}

export const MovieStructuredData: FC<MovieStructuredDataProps> = ({
  name,
  description,
  image,
  datePublished,
  director,
  duration,
  contentRating,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name,
    description,
    image,
    datePublished,
    ...(director && { director: { '@type': 'Person', name: director } }),
    ...(duration && { duration }),
    ...(contentRating && { contentRating }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export const OrganizationStructuredData: FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vidiony',
    url: 'https://vidion.vercel.app',
    logo: 'https://vidion.vercel.app/logo.png',
    sameAs: [
      // Add your social media profiles here if you have them
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}; 