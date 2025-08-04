import { getMaintenanceDateEnd, useAppConfig } from '@/utils/appConfig';
import { useEffect, useState } from 'react';
import styles from './maintenance-components.module.css';

interface ReturnTimeProps {
  title: string;
  language?: string;
}

export const ReturnTime: React.FC<ReturnTimeProps> = ({ title, language }) => {
  const appConfig = useAppConfig();
  const returnDateString = getMaintenanceDateEnd();
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

      const locale = language || appConfig?.config.language || 'en-GB';
      const formatted = date.toLocaleDateString(locale, options);
      setFormattedDate(formatted);
      
    } catch (error) {
      console.error('Error formatting date:', error);
      setFormattedDate(returnDateString);
    }
  }, [returnDateString, language, appConfig]);
  
  return (
    <div className={styles.returnBox} role="region" aria-label={title}>
      <div className={`${styles.returnTitle} heading3`}>{title}</div>
      <div className={`${styles.returnDate} text-muted`}>{formattedDate}</div>
    </div>
  );
};
