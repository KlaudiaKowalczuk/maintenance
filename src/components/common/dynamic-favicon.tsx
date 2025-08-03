import { useAppConfig } from '@/utils/appConfig';
import Head from 'next/head';

interface DynamicFaviconProps {
  defaultFavicon?: string;
}

export const DynamicFavicon: React.FC<DynamicFaviconProps> = ({ 
  defaultFavicon = "/favicon.ico" 
}) => {
  const customerConfig = useAppConfig();
  const faviconUrl = customerConfig?.configs.faviconUrl || defaultFavicon;

  return (
    <Head>
      <link rel="icon" href={faviconUrl} />
      <link rel="shortcut icon" href={faviconUrl} />
      <link rel="apple-touch-icon" href={faviconUrl} />
    </Head>
  );
};
