import { useTranslation } from '@/hooks/useTranslation';
import React from 'react';
import styles from './maintenance-components.module.css';

interface SupportButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  ariaLabelKey: string;
  language?: string;
}

const SupportButton: React.FC<SupportButtonProps> = ({ href, icon, label, value, ariaLabelKey, language }) => {
  const { t } = useTranslation(language);
  
  return (
    <a 
      href={href} 
      className={`${styles.supportCard} btn`}
      aria-label={t(ariaLabelKey, { label, value })}
    >
      <span className={styles.supportIcon} aria-hidden="true">
        {icon}
      </span>
      <span>
        <span className={styles.supportLabel}>{label}</span><br />
        <span className={styles.supportValue}>{value}</span>
      </span>
    </a>
  );
};

interface SupportSectionProps {
  phoneNumber?: string;
  email?: string;
  language?: string;
}

export const SupportSection: React.FC<SupportSectionProps> = ({ 
  phoneNumber,
  email,
  language
}) => {
  const { t } = useTranslation(language);

  const PhoneIcon = 
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" className={styles.phoneIcon}>
      <path d="M2.85693 4.94448C2.85693 4.5235 3.02416 4.11977 3.32185 3.82209C3.61952 3.52441 4.02326 3.35718 4.44424 3.35718H7.04741C7.21391 3.3573 7.37616 3.4098 7.51118 3.50722C7.64621 3.60464 7.74717 3.74206 7.79979 3.90003L8.98868 7.46591C9.04891 7.64713 9.04179 7.844 8.96861 8.02039C8.89543 8.19678 8.76111 8.34087 8.59027 8.42623L6.799 9.32305C7.67703 11.2663 9.23349 12.8228 11.1767 13.7008L12.0736 11.9096C12.1589 11.7387 12.303 11.6044 12.4794 11.5312C12.6558 11.458 12.8527 11.4509 13.0339 11.5112L16.5998 12.7C16.7579 12.7527 16.8954 12.8537 16.9928 12.989C17.0903 13.1241 17.1426 13.2866 17.1426 13.4532V16.0556C17.1426 16.4766 16.9754 16.8803 16.6777 17.1779C16.3801 17.4757 15.9764 17.6429 15.5553 17.6429H14.7617C8.1871 17.6429 2.85693 12.3127 2.85693 5.73813V4.94448Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>;

  const EmailIcon = 
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" className={styles.emailIcon}>
      <path d="M2.85693 7.32553L9.11884 10.7064C9.37968 10.8805 9.68622 10.9734 9.99979 10.9734C10.3133 10.9734 10.6199 10.8805 10.8807 10.7064L17.1426 7.32553M4.44424 16.0557H15.5553C15.9764 16.0557 16.3801 15.8884 16.6777 15.5908C16.9754 15.2931 17.1426 14.8894 17.1426 14.4683V6.53188C17.1426 6.1109 16.9754 5.70716 16.6777 5.40948C16.3801 5.11181 15.9764 4.94458 15.5553 4.94458H4.44424C4.02326 4.94458 3.61952 5.11181 3.32185 5.40948C3.02416 5.70716 2.85693 6.1109 2.85693 6.53188V14.4683C2.85693 14.8894 3.02416 15.2931 3.32185 15.5908C3.61952 15.8884 4.02326 16.0557 4.44424 16.0557Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>;

  return (
    <section className={styles.supportSection} aria-labelledby="support-title">
      <h2 id="support-title" className={`${styles.helpTitle} heading2`}>{t('MAINTENANCE.SUPPORT_TITLE')}</h2>
      {phoneNumber && (
        <SupportButton
          href={`tel:${phoneNumber.replace(/\D/g, '')}`}
          icon={PhoneIcon}
          label={t('MAINTENANCE.PHONE_LABEL')}
          value={`${phoneNumber} (Available 24/7)`}
          ariaLabelKey="MAINTENANCE.PHONE_ARIA_LABEL"
          language={language}
        />
      )}

      {email && (
        <SupportButton
          href={`mailto:${email}`}
          icon={EmailIcon}
          label={t('MAINTENANCE.EMAIL_LABEL')}
          value={email}
          ariaLabelKey="MAINTENANCE.EMAIL_ARIA_LABEL"
          language={language}
        />
      )}
    </section>
  );
};
