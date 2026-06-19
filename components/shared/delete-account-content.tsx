import React from 'react';

const DELETE_ACCOUNT_EMAIL = 'care@wecredit.co.in';

/**
 * Static content for the Delete Account page.
 * Guides users to contact support for account deletion requests.
 */
const DeleteAccountContent = (): React.ReactNode => {
  return (
    <div className="wc-static-content w-full space-y-6">
      <h2 className="text-base font-medium text-zinc-800 sm:text-lg lg:text-xl">
        We&apos;re here to help
      </h2>

      <p>
        We&apos;re sorry to see you go. If you would like to delete your WeCredit
        account, please email us at{' '}
        <a href={`mailto:${DELETE_ACCOUNT_EMAIL}`}>{DELETE_ACCOUNT_EMAIL}</a> from
        the email address linked to your account. Include your registered mobile
        number so we can verify your request quickly.
      </p>

      <p>
        Our support team will review your request and contact you shortly to
        complete the process.
      </p>

      <p>
        Please note that deleting your account is permanent and may affect your
        access to loan offers, credit insights, and other WeCredit services.
      </p>
    </div>
  );
};

export default DeleteAccountContent;
