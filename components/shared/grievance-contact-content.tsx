import React from 'react';

/**
 * Shared content component for Grievance Redressal and Contact Us pages
 * Contains customer service information and grievance officer details
 */
const GrievanceContactContent = (): React.ReactNode => {
  return (
    <div className="wc-static-content w-full space-y-6">
      {/* Section welcome heading — page H1 is rendered by each page's wrapper */}
      <h2 className="text-base font-medium text-zinc-800 sm:text-lg lg:text-xl">
        Welcome to WeCredit Customer Services
      </h2>

      {/* Introduction Paragraph 1 */}
      <p>
        We are committed to take all necessary steps to resolve your grievances and complaints (including for digital loans) within a reasonable time frame. You may make use of any of the options listed below to register your grievance or complaint. We would like to reassure you that we will work on resolving the same at the earliest.
      </p>

      {/* Introduction Paragraph 2 */}
      <p>
        You may connect with us through any of the below channels. We will be glad to assist you:
      </p>

      {/* Grievance Officer Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-800 sm:text-base lg:text-lg">
          Grievance Officer
        </h2>

        <div className="space-y-2">
          <p>Name: Abhay Padoor</p>
          <p>Address - 6th floor, Wing A, Let&apos;s Work, Corporate Centre, J.B Nagar, Chakala, Andheri East, Mumbai - 400059</p>
          <p>
            Email:{' '}
            <a href="mailto:care@wecredit.co.in">
              care@wecredit.co.in
            </a>
          </p>
          <p>
            Contact:{' '}
            <a href="tel:+919240259585">
              +91 9240259585
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrievanceContactContent;
