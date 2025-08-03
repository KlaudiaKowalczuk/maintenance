import { useTranslation } from '@/hooks/useTranslation';
import { useAppConfig, useMaintenanceDateEnd } from '@/utils/appConfig';
import { useEffect, useState } from 'react';
import styles from './maintenance-components.module.css';

export const ReturnTime: React.FC = () => {
  const { t } = useTranslation();
  const appConfig = useAppConfig();
  const returnDateString = useMaintenanceDateEnd();
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    if (!returnDateString) {
      setFormattedDate('');
      return;
    }

    try {
      const date = new Date(returnDateString);
      
      if (isNaN(date.getTime())) {
        setFormattedDate(returnDateString);
        return;
      }

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      };

      const locale = appConfig?.configs.language || 'en-GB';
      const formatted = date.toLocaleDateString(locale, options);
      setFormattedDate(formatted);
      
    } catch (error) {
      console.error('Error formatting date:', error);
      setFormattedDate(returnDateString);
    }
  }, [returnDateString, appConfig]);
  
  return (
    <div className={styles.returnBox} role="region" aria-label={t('maintenance.expectedReturnTitle')}>
      <div className={`${styles.returnTitle} heading3`}>{t('maintenance.expectedReturnTitle')}</div>
      <div className={`${styles.returnDate} text-muted`}>{formattedDate}</div>
    </div>
  );
};
