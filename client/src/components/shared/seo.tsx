
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  ogImage = '/images/barter-logo.png',
  ogUrl 
}) => {
  const { t } = useTranslation();
  
  const defaultTitle = t('seo.defaultTitle', 'BarterTap - Modern Barter Platform');
  const defaultDescription = t(
    'seo.defaultDescription', 
    'BarterTap is a modern platform for bartering goods and services. Trade what you have for what you need.'
  );
  const defaultKeywords = t(
    'seo.defaultKeywords', 
    'barter, trade, exchange, goods, services, second hand, marketplace'
  );
  
  const siteUrl = process.env.NODE_ENV === 'production' 
    ? 'https://bartertap.az' 
    : 'http://localhost:5000';
  
  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl || siteUrl} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl || siteUrl} />
      <meta property="twitter:title" content={title || defaultTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
