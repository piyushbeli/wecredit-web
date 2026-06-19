'use client';

import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import DeleteAccountContent from './delete-account-content';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

const DeleteAccountWrapper = (): ReactNode => {
  return (
    <FooterLinkPageWrapper
      banner={{
        title: 'Delete Account',
        iconImage: IMAGES.ICONS.CONTACT_US,
        iconAlt: 'Delete Account',
      }}
      contentClassName="px-4"
    >
      <h1 className="sr-only">Delete Your WeCredit Account</h1>
      <DeleteAccountContent />
    </FooterLinkPageWrapper>
  );
};

export default DeleteAccountWrapper;
