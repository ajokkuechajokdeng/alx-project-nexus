import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

const defaultDescription = 'Discover trending and recommended movies with MovIQ - your personal movie recommendation app.';
const defaultImage = '/images/moviq-social.jpg'; // Default social sharing image
const defaultUrl = 'https://moviq.vercel.app'; // Replace with your actual domain
const siteName = 'MovIQ';

const SEO: React.FC<SEOProps> = ({
  title,
  description = defaultDescription,
  image = defaultImage,
  url = defaultUrl,
  type = 'website',
  twitterCard = 'summary_large_image',
}) => {
  // Ensure title has site name
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  // Ensure image is an absolute URL
  const fullImageUrl = image.startsWith('http') ? image : `${defaultUrl}${image}`;
  
  // Ensure URL is absolute
  const fullUrl = url.startsWith('http') ? url : `${defaultUrl}${url}`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      
      {/* Open Graph Meta Tags for social sharing */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#E50914" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Head>
  );
};

export default SEO;