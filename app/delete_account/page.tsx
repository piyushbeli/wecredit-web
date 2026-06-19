import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import DeleteAccountWrapper from '@/components/shared/delete-account-wrapper';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

export const metadata: Metadata = buildPageMetadata('/delete_account/');

/**
 * Delete Account page — explains how users can request account deletion.
 */
const DeleteAccountPage = (): React.ReactNode => {
  return (
    <div className="max-w-7xl mx-auto">
      <DeleteAccountWrapper />
    </div>
  );
};

export default DeleteAccountPage;
