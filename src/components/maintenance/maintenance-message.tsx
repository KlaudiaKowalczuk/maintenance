import { useTranslation } from '@/hooks/useTranslation';
import React from 'react';
import styles from './maintenance-components.module.css';

interface MaintenanceMessageProps {
  title?: string;
  subtitle?: string;
}

export const MaintenanceMessage: React.FC<MaintenanceMessageProps> = ({ 
  title,
  subtitle
}) => {
  const { t } = useTranslation();
  return (
    <section className={styles.messageSection}>
      <h1 className={styles.messageTitle} id="main-title">
        {title || t('maintenance.title')}
      </h1>
      <p className={`${styles.subtitle} subtitle`}>
        {subtitle || t('maintenance.subtitle')}
      </p>
    </section>
  );
};
