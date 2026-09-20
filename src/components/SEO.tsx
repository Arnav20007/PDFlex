import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
}

export const SEO = ({ title, description, canonicalPath }: SEOProps) => {
  useEffect(() => {
    // 1. Update title
    document.title = title.includes("PDFlex") ? title : `${title} — PDFlex`;

    // 2. Update description meta tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // 4. Update canonical URL if provided
    if (canonicalPath) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', `${window.location.origin}${canonicalPath}`);
    }
  }, [title, description, canonicalPath]);

  return null;
};

export default SEO;
