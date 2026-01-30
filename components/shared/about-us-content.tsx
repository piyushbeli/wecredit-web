import React from 'react';
import Link from 'next/link';

/**
 * About Us content component
 * Displays WeCredit's mission, brands, and value propositions
 * Structured with clear sections for readability and SEO
 */
const AboutUsContent = (): React.ReactNode => {
  return (
    <div className="w-full space-y-8 text-zinc-700">
      {/* Mission Statement */}
      <section>
        <p className="text-base leading-relaxed">
          At WeCredit, our mission is to make personal finance easy, convenient, and transparent for everyone. 
          Leveraging the latest data and technology innovations, we help you choose the best offers across 
          personal loans and business loans. Our sophisticated algorithm-based technology platform provides 
          you with access to multiple personal loan offers, simplifies the comparison of various options, 
          and offers unbiased advice.
        </p>
      </section>

      {/* Horizontal Divider */}
      <hr className="border-zinc-300" />

      {/* Our Brands Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-900">Our Brands</h2>
        <p className="text-base text-zinc-600">Sub-products of WeCredit:</p>
        
        {/* Brand links - rendered as a clean list */}
        <ul className="space-y-3 ml-4">
          <li>
            <Link 
              href="https://www.snapit.photo/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <strong>Snapit</strong>
            </Link>
            {' '}- Snapit
          </li>
          <li>
            <Link 
              href="https://fatafatloans.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <strong>FataFatLoans.com</strong>
            </Link>
            {' '}- Quick and hassle-free financing
          </li>
          <li>
            <Link 
              href="https://loansbazaar.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <strong>LoansBazaar.co</strong>
            </Link>
            {' '}- Loan options from Rs 10,000 to Rs 5 lakh
          </li>
        </ul>
      </section>

      {/* Horizontal Divider */}
      <hr className="border-zinc-300" />

      {/* Why Choose WeCredit Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900">Why Choose WeCredit?</h2>
        
        {/* Feature Grid - using a structured layout for clarity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Approvals */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-zinc-900">Quick Approvals</h3>
            <p className="text-base leading-relaxed">
              Experience fast loan approvals and quick disbursals directly into your bank account.
            </p>
          </div>

          {/* Financial Education */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-zinc-900">Financial Education</h3>
            <p className="text-base leading-relaxed">
              We provide resources and advice to help you make informed financial decisions.
            </p>
          </div>

          {/* Convenient Access */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-zinc-900">Convenient Access</h3>
            <p className="text-base leading-relaxed">
              Apply for loans online from the comfort of your home.
            </p>
          </div>

          {/* Flexible Repayment */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-zinc-900">Flexible Repayment Options</h3>
            <p className="text-base leading-relaxed">
              Enjoy manageable EMIs that fit your budget.
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Divider */}
      <hr className="border-zinc-300" />

      {/* How We Help Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-900">How We Help People Across India?</h2>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-zinc-900">Seamless Loan Experience</h3>
          <p className="text-base leading-relaxed">
            From the moment you apply to the moment your loan is disbursed, WeCredit is with you every 
            step of the way. Our user-friendly platform ensures a hassle-free experience, guiding you 
            through the entire loan process with clarity and ease.
          </p>
        </div>
      </section>

      {/* Horizontal Divider */}
      <hr className="border-zinc-300" />

      {/* Commitment to Transparency Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900">Our Commitment To Transparency</h2>
        
        {/* Transparency Features */}
        <div className="space-y-5">
          {/* Clear Communication */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-zinc-900">Clear Communication</h3>
            <p className="text-base leading-relaxed">
              We believe in clear and honest communication. All terms and conditions of the loan offers 
              are presented transparently, ensuring there are no surprises down the line.
            </p>
          </div>

          {/* Security */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-zinc-900">Secure and Confidential</h3>
            <p className="text-base leading-relaxed">
              Your security is our priority. We employ the highest standards of data protection to ensure 
              your personal and financial information is safe and confidential.
            </p>
          </div>

          {/* Customer Support */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-zinc-900">Customer Support</h3>
            <p className="text-base leading-relaxed">
              Our dedicated customer support team is always ready to assist you. If you have questions 
              about the loan process or need help with your application, we&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Divider */}
      <hr className="border-zinc-300" />

      {/* Call to Action Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-900">Join the WeCredit Community</h2>
        <p className="text-base leading-relaxed">
          WeCredit is not just a financial platform; it&apos;s a community committed to financial empowerment. 
          Join us and take the first step towards achieving your financial goals. Download the WeCredit 
          app today and unlock a world of financial opportunities tailored just for you.
        </p>
      </section>
    </div>
  );
};

export default AboutUsContent;
