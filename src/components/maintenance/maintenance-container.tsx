import React from 'react';
import styles from './maintenance-components.module.css';

interface MaintenanceContainerProps {
  children: React.ReactNode;
}

export const MaintenanceContainer: React.FC<MaintenanceContainerProps> = ({ children }) => {
  return (
    <section className={styles.maintenanceCard} role="main" aria-labelledby="main-title">
      {children}
    </section>
  );
};
