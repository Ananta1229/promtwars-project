import type { SampleMessage } from '@/lib/types';

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: 'bank-kyc',
    label: 'Fake banking KYC update',
    channel: 'SMS',
    text: 'Dear Customer, your SBI bank account KYC has expired. Your account will be suspended within 24 hours. To avoid deactivation, update your KYC immediately at http://sbi-kycupdate.motiflues.xyz/renew. Failure to comply will lead to permanent closure.',
  },
  {
    id: 'otp-theft',
    label: 'OTP theft attempt',
    channel: 'WhatsApp',
    text: 'Hi, this is Rahul from Flipkart Delivery. We are trying to deliver your parcel but need to verify your address. Please share the OTP you just received on 773642 to confirm delivery. The delivery boy is waiting at your gate.',
  },
  {
    id: 'parcel-fee',
    label: 'Fake parcel delivery payment',
    channel: 'SMS',
    text: 'Your parcel FX-99281 could not be delivered because the address fee of Rs 25 was not paid. Your package is stuck at the regional customs hub. Pay the delivery fee of ₹25 at upi id fastpay@ybl within 12 hours or your shipment will be returned and discarded.',
  },
  {
    id: 'lottery',
    label: 'Lottery / reward scam',
    channel: 'SMS',
    text: 'CONGRATULATIONS! Your mobile number has been selected in the KBC WhatsApp Lucky Draw 2026. You have won a cash prize of Rs 25,00,000 in the monthly lottery jackpot. To claim your prize, send your name, Aadhaar number and a processing fee of Rs 8500 to our agent. Call now: +91 98765 43210.',
  },
  {
    id: 'normal-delivery',
    label: 'Ordinary delivery confirmation',
    channel: 'SMS',
    text: 'Your order OD4471882266 from Amazon.in has been delivered. We hope you enjoy your purchase. To rate the delivery experience, open the Amazon app. Return window closes in 7 days.',
  },
  {
    id: 'income-tax',
    label: 'Fake income-tax refund',
    channel: 'Email',
    text: 'Income Tax Department: You are eligible for a tax refund of Rs 32,540 for the assessment year. Your bank account details are not updated. Verify your PAN card and account number at https://refund-cbdts.incometax-refunds.online/verify before the last warning deadline. Failure to verify will cancel your refund.',
  },
  {
    id: 'job-scam',
    label: 'Part-time job earning scam',
    channel: 'WhatsApp',
    text: 'Work from home part time job! Earn Rs 3000 per day with no investment. Guaranteed daily payout. Join our Telegram channel and register with your name and UPI id. First 100 users get free recharge. Click t.me/earnfast-daily to start earning today.',
  },
];
