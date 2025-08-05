import { DynamicFavicon } from "@/components/common/dynamic-favicon";
import {
  IconHeader,
  MaintenanceFooter,
  MaintenanceMessage,
  ReturnTime,
  SupportSection,
} from "@/components/maintenance";
import styles from "@/components/maintenance/maintenance-components.module.css";
import { useTranslation } from "@/hooks/useTranslation";
import { AppConfig, getCustomerConfig, getCustomerConfigs, setGlobalAppConfig } from "@/utils/appConfig";
import { getTheme } from "@/utils/builderTheme";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useEffect } from "react";

interface MaintenancePageProps {
  customerConfig: AppConfig | null;
  customerName: string;
}

export default function MaintenancePage({ customerConfig, customerName }: MaintenancePageProps) {
  
  const formatCustomerName = (str: string): string => {
    if (str.toLowerCase() === 'maverickandwolf') {
      return 'Maverick & Wolf';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    setGlobalAppConfig(customerConfig);

    if (customerConfig) {
      getTheme(customerConfig).catch(error => {
        console.warn('Failed to load theme:', error);
      });
    }
  }, [customerConfig]);

  const { t } = useTranslation(customerConfig?.config?.language);

  if (!customerConfig) {
    return (
      <>
        <Head>
          <title>{t('ERRORS.CUSTOMER_NOT_FOUND')}</title>
          <meta name="description" content={t('ERRORS.CUSTOMER_NOT_FOUND_DESCRIPTION')} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.container}>
          <section className={styles.maintenanceCard} role="main" aria-labelledby="main-title">
            <h1>{t('ERRORS.CUSTOMER_NOT_FOUND')}</h1>
            <p>{t('ERRORS.CUSTOMER_NOT_FOUND_MESSAGE', { customerName })}</p>
          </section>
        </div>
      </>
    );
  }

  const isSupportAvailable = !!(customerConfig?.config?.phoneNumber || customerConfig?.config?.email);

  return (
    <>
      <DynamicFavicon faviconUrl={customerConfig?.config?.faviconUrl} />
      <Head>
        <title>{t('MAINTENANCE.PAGE_TITLE', { customer: formatCustomerName(customerConfig.customer) })}</title>
        <meta name="description" content={t('MAINTENANCE.PAGE_DESCRIPTION', { customer: formatCustomerName(customerConfig.customer) })} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {customerConfig.config.gtmKey && (
          <>
            {/* eslint-disable-next-line @next/next/next-script-for-ga */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${customerConfig.config.gtmKey}');
                `,
              }}
            />
          </>
        )}
      </Head>
      {customerConfig.config.gtmKey && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${customerConfig.config.gtmKey}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
      <div className={styles.container}>
        <section className={styles.maintenanceCard} role="main" aria-labelledby="main-title">
          <IconHeader logoUrl={customerConfig?.config?.logoUrl} />
          <MaintenanceMessage
            title={t('MAINTENANCE.TITLE')}
            subtitle={t('MAINTENANCE.MESSAGE')}
          />
          <ReturnTime
            title={t('MAINTENANCE.RETURN_TIME')}
            language={customerConfig?.config.language}
          />
          {isSupportAvailable && (
            <SupportSection
              phoneNumber={customerConfig?.config?.phoneNumber}
              email={customerConfig?.config?.email}
              language={customerConfig?.config?.language}
            />
          )}
          <MaintenanceFooter 
            message={t('MAINTENANCE.FOOTER_MESSAGE')}
          />
          </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const configs = getCustomerConfigs();
  const paths = configs.map((config) => ({
    params: { customer: config.customer },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const customerName = context.params?.customer as string;
  const customerConfig = getCustomerConfig(customerName);

  return {
    props: {
      customerConfig,
      customerName,
    },
  };
};
