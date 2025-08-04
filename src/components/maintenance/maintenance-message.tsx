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
  
  return (
    <section className={styles.messageSection}>
      <h1 className={styles.messageTitle} id="main-title">
        {title}
      </h1>
      <p className={`${styles.subtitle} subtitle`}>
        {subtitle}
      </p>
    </section>
  );
};
