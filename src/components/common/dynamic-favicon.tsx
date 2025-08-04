import Head from 'next/head';

interface DynamicFaviconProps {
  faviconUrl?: string;
}

export const DynamicFavicon: React.FC<DynamicFaviconProps> = ({ faviconUrl = "/favicon.ico" }) => {
  return (
    <Head>
      <link rel="icon" href={faviconUrl} />
      <link rel="shortcut icon" href={faviconUrl} />
      <link rel="apple-touch-icon" href={faviconUrl} />
    </Head>
  );
};
