/**
 * Static credit card offers data for the credit cards page.
 * Sourced from Flutter app (lib/models/card_model.dart); images hosted on S3.
 */

import type { CreditCard } from '@/types/credit-card';


export const CREDIT_CARDS: CreditCard[] = [
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
