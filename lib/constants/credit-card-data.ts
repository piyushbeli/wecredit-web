/**
 * Static credit card offers data for the credit cards page.
 * Sourced from Flutter app (lib/models/card_model.dart); images hosted on S3.
 */

import type { CreditCard } from '@/types/credit-card';


export const CREDIT_CARDS: CreditCard[] = [
  {
    title: 'SBI SimplyCLICK',
    imageAsset: `https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/sbi_s_click.jpg`,
    link: 'https://www.sbicard.com/sprint/c/simplyClick?ch=dis&GEMID1=dis_smart_SimplyClick_conversion_July25_eapply_Banner_static&GEMID2=WeCredit',
    intro:
      'SBI presents, SimplyClick! Best for online shopping and e-commerce rewards.',
    benefits: [
      '10× reward points on partner online brands like Amazon, Myntra, BookMyShow',
      '₹500 Amazon voucher on joining',
      '1% fuel surcharge waiver (₹500–3,000 spends)',
    ],
    feeDetails: 'joining & annual fee (waived on ₹1L spend/year)',
    gradientColors: ['#002b0b', '#005b2f'],
    clip: true,
    amount: '₹499',
  },
  {
    title: 'SBI SimplySAVE',
    imageAsset: `https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/Simply_Save.jpg`,
    link: 'https://www.sbicard.com/sprint/c/simplySave?ch=dis&GEMID1=dis_smart_SimplySave_conversion_July25_eapply_Banner_static&GEMID2=WeCredit',
    intro:
      'SBI SimplySAVE credit card. Best suited for your daily spends like groceries dining and online purchases.',
    benefits: [
      '10× reward points on groceries, movies, dining, and departmental stores',
      '₹2,000 bonus points on ₹2,000 spend within 60 days',
      '1% fuel surcharge waiver (max ₹100/month)',
    ],
    feeDetails: 'joining & annual fee (waived on ₹1L spend/year)',
    gradientColors: ['#022761', '#00144d'],
    clip: true,
    amount: '₹499',
  },
  {
    title: 'SBI PRIME',
    imageAsset: `https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/Prime_card.jpg`,
    link: 'https://www.sbicard.com/sprint/c/prime?ch=dis&GEMID1=dis_smart_Prime_conversion_July25_eapply_banner_static&GEMID2=WeCredit',
    intro:
      'SBI presents PRIME. Premium lifestyle credit card with high-value travel and milestone benefits.',
    benefits: [
      'Welcome e-Gift Voucher worth ₹3,000 from Yatra, Bata, Hush Puppies, etc.',
      'Lounge access: 4 International (via Priority Pass) + 8 Domestic per year',
      'Milestone benefits worth up to ₹12,000/year',
    ],
    feeDetails: 'joining & renewal fee (waived on ₹3L annual spend)',
    gradientColors: ['#0F0E13', '#0F0E13', '#0F0E13', '#024F39'],
    clip: true,
    amount: '₹2,999',
  },
  {
    title: 'SBI ELITE',
    imageAsset: `https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/Elite_card.jpg`,
    link: 'https://www.sbicard.com/sprint/c/elite?ch=dis&GEMID1=dis_smart_Elite_conversion_July25_eapply_banner_static&GEMID2=WeCredit',
    intro:
      'SBI ELITE credit card. Luxury credit card with travel, lifestyle & premium brand privileges.',
    benefits: [
      'Welcome e-Gift Voucher worth ₹5,000 (from brands like Hush Puppies, Yatra)',
      'Complimentary Club Vistara & Trident Privilege membership',
      'Lounge Access: 6 international + 8 domestic visits annually',
    ],
    feeDetails: '₹joining & renewal fee (waived on ₹10L spend)',
    gradientColors: ['#d3bab1', '#130f0c', '#130f0c', '#130f0c', '#130f0c', '#d3bab1'],
    clip: false,
    amount: '₹4,999',
  },
  {
    title: 'SBI MILES',
    imageAsset: `https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/Miles-SBI-Card-Base.jpg`,
    link: 'https://www.sbicard.com/sprint/c/miles?ch=dis&GEMID1=dis_smart_miles_conversion_July25_eapply_banner_static&GEMID2=WeCredit',
    intro:
      'Get exclusive benefits on your SBI Card MILES.Ideal for frequent flyers who want to earn AirMiles.',
    benefits: [
      'Earn AirMiles on every spend (convert to airline/hotel points)',
      'Complimentary domestic & international airport lounge access',
      'Travel concierge and emergency card services',
    ],
    feeDetails: '₹joining & renewal fee',
    gradientColors: ['#a88c98', '#c1c1c1'],
    clip: true,
    amount: '₹1,499',
  },
  {
    title: 'SBI PULSE',
    imageAsset: `https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/Prime_card.jpg`,
    link: 'https://www.sbicard.com/sprint/c/Pulse?ch=dis&GEMID1=dis_smart_miles_conversion_July25_eapply_banner_static&GEMID2=WeCredit',
    intro:
      'SBI presents PULSE. Fitness-focused card with smart health rewards and subscriptions.',
    benefits: [
      'Noise ColorFit Pulse Smartwatch as joining gift',
      'Complimentary FitPass Pro & Netmeds subscriptions',
      'Lounge access + 1% fuel surcharge waiver',
    ],
    feeDetails: '₹joining & annual fee (waived on ₹2L spend)',
    gradientColors: ['#cb517e', '#8CA6DB'],
    clip: false,
    amount: '₹1,499',
  },
  {
    title: 'AnqX',
    imageAsset: `https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/Fw_+CampaignProcess/xcard.png`,
    link: 'https://anqcc.anq.finance/?referral_code=WECREDIT',
    intro:
      'Load your card with rupees using UPI at zero charge Travel Smarter with RuPay-On-the-Go across Metro, Buses & Parking, and skip the Ticket Queue.',
    benefits: [
      '1% Bounties on every spend',
      'Upto 16% on Shopping brands',
      'Encash Rewards to Bank A/C',
    ],
    feeDetails: 'One-time Fee: Rs. 333     Discount Code: WE333',
    gradientColors: ['#66130e', '#9d1819'],
    clip: false,
    amount: '₹333',
  },
];
