import { DynamicFavicon } from "@/components/common/dynamic-favicon";
import {
  IconHeader,
  MaintenanceContainer,
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

function formatCustomerName(str: string): string {
  if (str.toLowerCase() === 'maverickandwolf') {
    return 'Maverick & Wolf';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function MaintenancePage({ customerConfig, customerName }: MaintenancePageProps) {
  
  useEffect(() => {
    setGlobalAppConfig(customerConfig);

    if (customerConfig) {
      getTheme(customerConfig).catch(error => {
        console.warn('Failed to load theme:', error);
      });
    }

    if (customerConfig?.configs.gtmKey) {
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${customerConfig.configs.gtmKey}');
      `;
      document.head.appendChild(gtmScript);
    }
  }, [customerConfig]);

  const { t } = useTranslation(customerConfig?.configs.language);

  if (!customerConfig) {
    return (
      <>
        <Head>
          <title>{t('errors.customerNotFound')}</title>
          <meta name="description" content={t('errors.customerNotFoundDescription')} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.container}>
          <MaintenanceContainer>
            <h1>{t('errors.customerNotFound')}</h1>
            <p>{t('errors.customerNotFoundMessage', { customerName })}</p>
          </MaintenanceContainer>
        </div>
      </>
    );
  }

  const isSupportAvailable = customerConfig.configs.phoneNumber || customerConfig.configs.email;

  return (
    <>
      <DynamicFavicon faviconUrl={customerConfig?.configs?.faviconUrl} />
      <Head>
        <title>{t('maintenance.pageTitle', { customer: formatCustomerName(customerConfig.customer) })}</title>
        <meta name="description" content={t('maintenance.pageDescription', { customer: customerConfig.customer })} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang = '${customerConfig.configs.language || 'en-GB'}';`,
          }}
        />
        {customerConfig.configs.gtmKey && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${customerConfig.configs.gtmKey}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
      </Head>
      <div className={styles.container}>
        <MaintenanceContainer>
          <IconHeader logoUrl={customerConfig?.configs?.logoUrl} />
          <MaintenanceMessage
            title={t('maintenance.title')}
            subtitle={t('maintenance.subtitle', { customer: customerConfig.customer })}
          />
          <ReturnTime 
            title={t('maintenance.expectedReturnTitle')}
            language={customerConfig?.configs.language} 
          />
          {isSupportAvailable && (
            <SupportSection
              phoneNumber={customerConfig.configs.phoneNumber}
              email={customerConfig.configs.email}
              language={customerConfig?.configs.language}
            />
            )
          }
          <MaintenanceFooter 
            message={t('maintenance.footerMessage')}
          />
        </MaintenanceContainer>
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
