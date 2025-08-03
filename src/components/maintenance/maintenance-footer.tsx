import { useTranslation } from '@/hooks/useTranslation';
import React from 'react';
import styles from './maintenance-components.module.css';

interface MaintenanceFooterProps {
  message?: string;
}

export const MaintenanceFooter: React.FC<MaintenanceFooterProps> = ({ 
  message
}) => {
  const { t } = useTranslation();
  
  return (
    <footer role="contentinfo">
      <p className={`${styles.footer} text-tertiary`}>
        {message || t('maintenance.footerMessage')}
      </p>
    </footer>
  );
};
