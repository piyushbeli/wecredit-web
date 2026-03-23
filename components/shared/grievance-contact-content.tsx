import React from 'react';

/**
 * Shared content component for Grievance Redressal and Contact Us pages
 * Contains customer service information and grievance officer details
 */
const GrievanceContactContent = (): React.ReactNode => {
  return (
    <div className="w-full space-y-6">
      {/* Welcome Title */}
      <h1 className="text-zinc-800 text-base font-medium font-['Poppins']">
        Welcome to WeCredit Customer Services
      </h1>

      {/* Introduction Paragraph 1 */}
      <p className="text-zinc-500 text-sm font-normal font-['Poppins'] leading-4">
        We are committed to take all necessary steps to resolve your grievances and complaints (including for digital loans) within a reasonable time frame. You may make use of any of the options listed below to register your grievance or complaint. We would like to reassure you that we will work on resolving the same at the earliest.
      </p>

      {/* Introduction Paragraph 2 */}
      <p className="text-zinc-500 text-sm font-normal font-['Poppins'] leading-4">
        You may connect with us through any of the below channels. We will be glad to assist you:
      </p>

      {/* Grievance Officer Section */}
      <div className="space-y-4">
        <h2 className="text-zinc-800 text-sm font-normal font-['Poppins'] leading-4">
          Grievance Officer
        </h2>

        <div className="space-y-2 text-zinc-500 text-sm font-normal font-['Poppins'] leading-4">
          <p>Name: Abhay Padoor</p>
          <p>Address - 6th floor, Wing A, Let's Work, Corporate Centre, J.B Nagar, Chakala, Andheri East, Mumbai - 400059</p>
          <p>Email: care@wecredit.co.in</p>
          <p>Contact: +91 9240259585</p>
        </div>
      </div>
    </div>
  );
};

export default GrievanceContactContent;
