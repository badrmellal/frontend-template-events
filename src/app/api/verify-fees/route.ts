import { NextRequest, NextResponse } from 'next/server';
import { africanCountries } from '../currency/route';

export async function POST(request: NextRequest) {
  const { price, quantity, isOrganization, currencyCode, storedTotal } = await request.json();

  try {
    const result = calculateFeesAndCommission(price, quantity, isOrganization, currencyCode);
    
    // We verify the total price
    const isValid = Math.abs(result.totalToCharge - storedTotal) < 0.01; 

    return NextResponse.json({ ...result, isValid });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

function calculateFeesAndCommission(price: number, quantity: number, isOrganization: boolean, currencyCode: string) {
  // Find the country data for the given currency code
  const country = africanCountries.find(c => c.currency.code === currencyCode);
  if (!country) {
    throw new Error(`Invalid currency code: ${currencyCode}`);
  }

  // Payment fees per transaction
  const stripeFeePercentage = 0.029; // 2.9%
  let stripeFixedFee: number;

  // Stripe fixed fee based on currency
  switch (country.currency.code) {
    case 'EGP': stripeFixedFee = 3.00; break;
    case 'KES': stripeFixedFee = 30.00; break;
    case 'ZAR': stripeFixedFee = 1.50; break;
    case 'GHS': stripeFixedFee = 0.30; break;
    case 'TZS': stripeFixedFee = 700.00; break;
    case 'MAD': stripeFixedFee = 3.00; break;
    case 'XOF': stripeFixedFee = 100.00; break;
    case 'UGX': stripeFixedFee = 1000.00; break;
    case 'ZMW': stripeFixedFee = 3.00; break;
    default: stripeFixedFee = 0.30; // default to $0.3
  }

  // Our commission rates
  const singlePublisherCommissionPercentage = 0.05; // 5% for single publishers
  const organizationCommissionPercentage = 0.04; // 4% for organizations

  const subtotal = price * quantity;

  // Stripe fees for the total ticket price
  const stripeFee = (subtotal * stripeFeePercentage) + (stripeFixedFee * quantity);

  // Commission for the total ticket sales
  const commission = subtotal * (isOrganization ? organizationCommissionPercentage : singlePublisherCommissionPercentage);

  // Total amount to charge the customer (subtotal + stripe fee + commission)
  const totalToCharge = subtotal + stripeFee + commission;

  // Amount that would be sent to the publisher before Wise fee
  const publisherAmount = subtotal - commission;

  // Wise fee (applied to the amount sent to the publisher)
  const wiseFeePercentage = 0.015; // 1.5%
  const wiseFee = publisherAmount * wiseFeePercentage;

  // Final amount to be sent to the publisher
  const finalPublisherAmount = publisherAmount - wiseFee;

  return {
    subtotal,
    stripeFee,
    commission,
    totalToCharge,
    publisherAmount,
    wiseFee,
    finalPublisherAmount
  };
}