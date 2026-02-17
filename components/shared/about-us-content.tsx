import React from 'react';
import { BackToHomeButton } from './back-to-home-button';

interface InfoCardProps {
  image: string;
  alt: string;
  title: string;
  description: string;
  mb?: string;
}

const InfoCard = ({
  image,
  alt,
  title,
  description,
  mb = 'mb-4',
}: InfoCardProps) => (
  <div
    className={`w-full bg-white rounded-lg shadow-[1px_1px_4px_0px_#6666661A,-1px_-1px_4px_0px_#6666661A] overflow-hidden ${mb}`}
  >
    <div className="w-full aspect-[361/261]">
      <img src={image} alt={alt} className="w-full h-full object-cover" />
    </div>

    <div className="p-3 text-center">
      <h3 className="font-['Poppins'] font-medium text-base leading-[1] tracking-normal text-zinc-800">
        {title}
      </h3>

      <div className="h-2" />

      <p className="font-['Poppins'] font-normal text-sm leading-[1.2] tracking-normal text-zinc-500">
        {description}
      </p>
    </div>
  </div>
);

const AboutUsContent = (): React.ReactNode => {
  const teamMembers = [
    {
      image:
        'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/person_placeholder.png',
      title: 'Mukul Devpura',
      description:
        'Chief Executive Officer (CEO) and Chief Financial Officer (CFO)',
    },
    {
      image:
        'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/person_placeholder.png',
      title: 'Brijesh Chokhra',
      description: 'Chief Operating Officer (COO)',
    },
    {
      image:
        'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/person_placeholder.png',
      title: 'Laksh Dua',
      description: 'Chief Risk Officer (CRO)',
    },
    {
      image:
        'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/person_placeholder.png',
      title: 'Sumit Chokhra',
      description: 'Chief Business Officer (CBO)',
    },
  ];

  const achievements = [
    {
      title: 'ONDC Partnership',
      description:
        'We started working with ONDC partners in 2024, expanding our reach and collaboration in the digital commerce ecosystem.',
    },
    {
      title: 'Jobs Created',
      description:
        'WeCredit has provided over 400 jobs, contributing to employment and growth in the financial sector.',
    },
    {
      title: 'Strong Lending Network',
      description:
        'We work with 25–30 lenders, NBFCs, fintechs, and banks, ensuring a wide range of credit options for our customers.',
    },
  ];

  return (
    <div className="w-full">

      {/* Gradient Intro */}
      {/* Back to Home Button */}
    
      <div className="bg-[linear-gradient(96.83deg,_#CCDFFC_35.72%,_#FAFCFF_100%)] px-4 py-6 mb-4">
        <div className="">
        <BackToHomeButton />
      </div>
        <h2 className="font-['Poppins'] font-medium text-2xl leading-[1] tracking-normal text-zinc-800">
          About WeCredit
        </h2>

        <div className="h-4" />

        <p className="font-['Poppins'] font-normal text-sm leading-[1.2] tracking-normal text-zinc-600">
          At WeCredit, we believe that managing credit should be easy and transparent without confusion or hidden details.
        </p>
      </div>

      <div className="px-4">

        {/* Laptop Image */}
        <div className="w-full overflow-hidden mb-8">
          <img
            src="https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/laptop.png"
            alt="About WeCredit"
            className="w-full h-auto object-cover"
          />
        </div>
        <OurPartnersSection />


        <h3 className="font-['Poppins'] font-medium text-base leading-[1] tracking-normal text-zinc-800 mb-4">
          We make personal finance simple and transparent.
        </h3>

        <p className="font-['Poppins'] font-normal text-sm leading-[1.2] tracking-normal text-[#7F7F7F] mb-8">
          With the help of data and technology, WeCredit lets you view and compare multiple loan and card offers in one place. We share clear and unbiased information to help you make better decisions and support you throughout your credit journey.
        </p>

        {/* Team */}
        <h3 className="font-['Poppins'] font-medium text-base leading-[1] tracking-normal text-zinc-800 mb-4">
          Meet the Team Behind WeCredit
        </h3>

        <p className="font-['Poppins'] font-normal text-sm leading-[1.2] tracking-normal text-[#7F7F7F] mb-10">
          Our leadership team brings experience from key areas of the business, including finance, operations, risk, and growth.
        </p>

        {teamMembers.map((member, index) => (
          <InfoCard
            key={index}
            image={member.image}
            alt={member.title}
            title={member.title}
            description={member.description}
            mb={index === teamMembers.length - 1 ? 'mb-6' : 'mb-4'}
          />
        ))}

        {/* Timeline */}
        <div className="mb-6 mt-8">
          <h2 className="font-['Poppins'] font-medium text-base leading-[1] tracking-normal text-black">
            Our Journey
          </h2>
        </div>

        <div className="relative w-full">
          <div className="absolute left-[42px] top-0 bottom-0 w-[2px] bg-[#D9D9D9]" />

          <div className="space-y-10">
            {[
              {
                year: '2022',
                title: 'The Beginning',
                desc:
                  'WeCredit started under the name Spiraea Digital Private Limited...',
                dot: '#045BCF',
              },
              {
                year: '2025',
                title: 'Growth & Rebranding',
                desc:
                  'The company became QuantumX Global Private Limited...',
                dot: '#00F076',
              },
            ].map((item, index) => (
              <div key={index} className="relative flex">
                <div
                  className="w-6 h-6 rounded-full shrink-0"
                  style={{ backgroundColor: item.dot }}
                />

                <div className="ml-8 flex-1">
                  <div className="font-['Poppins'] font-medium text-sm leading-[1.2] text-[#045BCF]">
                    {item.year}
                  </div>

                  <div className="mt-1 font-['Poppins'] font-medium text-base leading-[1.2] text-[#045BCF]">
                    {item.title}
                  </div>

                  <p className="mt-2 font-['Poppins'] font-normal text-sm leading-[1.2] text-zinc-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* 2026 */}
            <div className="relative flex">
              <div className="w-6 h-6 rounded-full bg-[#D9D9D9] shrink-0" />

              <div className="ml-8 flex-1">
                <div className="font-['Poppins'] font-medium text-sm leading-[1.2] text-[#045BCF]">
                  2026
                </div>

                <div className="mt-3 p-4 rounded-lg border border-dashed border-[#045BCF] bg-[linear-gradient(96.83deg,_#CCDFFC_35.72%,_#FAFCFF_100%)]">
                  <p className="font-['Poppins'] font-normal text-sm leading-[1.2] text-[#045BCF]">
                    Since then, WeCredit has been helping people get credit easily and quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6 mt-8">
          <h2 className="font-['Poppins'] font-medium text-base leading-[1] tracking-normal text-black">
            Our Achievements & Partnerships
          </h2>
        </div>

        {achievements.map((item, index) => (
          <InfoCard
            key={index}
            image="https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/achievements.png"
            alt={item.title}
            title={item.title}
            description={item.description}
          />
        ))}

      </div>
    </div>
  );
};

export default AboutUsContent;

const OurPartnersSection = (): React.ReactNode => {
  const partners = [
    
    {
      name: 'FataFatLoans.com',
      url: 'https://fatafatloans.com',
      logo: 'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/Screenshot+2025-12-27+at+11.33.19%E2%80%AFAM.png',
      logoHeight: 'h-7',
    },
    {
      name: 'LoansBazaar.co',
      url: 'https://loansbazaar.co',
      logo: 'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/2+23.png',
      logoWidth: 'w-10',
      logoHeight: 'h-7',
    },
    
    {
      name: 'Godrej Finance',
      url: 'https://godrejfinance.com/',
      logo: 'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/godrej.jpeg',
      logoHeight: 'h-6',
    },
  ];

 return (
  <div className="mb-8">
    <h2 className="font-['Poppins'] font-medium text-base leading-[1] tracking-normal text-zinc-800 mb-4">
      Our Partners
    </h2>

    {/* Wrapper with vertical line */}
    <div className="flex">
      
      {/* Vertical Grey Line */}
      <div className="w-[4px] bg-gray-300 rounded-sm mr-4" />

      {/* Partner List */}
      <div className="flex-1 space-y-2">
        {partners.map((partner, index) => (
          <a
            key={index}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between"
          >
            {/* Left section */}
            <div className="flex items-center flex-1">

              {/* Fixed logo width */}
              <div className="w-16 flex items-center justify-start">
                <div className="border border-gray-300 rounded p-1">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className={`${partner.logoHeight} object-contain`}
                  />
                </div>
              </div>

              {/* Brand name */}
              <div className="flex-1 pl-3">
                <span className="font-['Poppins'] font-medium text-sm leading-none text-zinc-800">
                  {partner.name}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <span className="text-black text-base leading-none">
              →
            </span>
          </a>
        ))}
      </div>
    </div>
  </div>
);




};
