'use client';

import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import GrievanceContactContent from './grievance-contact-content';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

const ContactUsWrapper = (): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'CONTACT US',
        iconImage: IMAGES.ICONS.CONTACT_US,
        iconAlt: 'Contact Us Icon',
      }}
      contentClassName="mx-4 px-4"
    >
      <h1 className="sr-only">Contact WeCredit Support</h1>
      <GrievanceContactContent />
    </FooterLinkPageWrapper>
  );
};

export default ContactUsWrapper;
