// /home/ubuntu/dropshipping_site_china_brasil/src/app/api/pagseguro/notify/route.ts
// Placeholder for PagSeguro transaction notification webhook

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: Implement logic to handle PagSeguro notifications
  // 1. Receive notification data (usually XML or form-urlencoded)
  // 2. Verify the notification's authenticity (using PagSeguro's notification check API)
  // 3. Parse the notification data to get transaction status, code, reference, etc.
  // 4. Update the order status in your database based on the notification
  //    - e.g., if payment approved, mark order as paid and trigger fulfillment process
  //    - if payment cancelled, mark order as cancelled
  // 5. Respond to PagSeguro with a 200 OK to acknowledge receipt.

  try {
    const notificationData = await request.text(); // PagSeguro often sends XML or form data
    console.log("PagSeguro notification received:", notificationData);

    // --- Example: Extracting notificationCode if sent as form data ---
    // const formData = new URLSearchParams(notificationData);
    // const notificationCode = formData.get('notificationCode');
    // const notificationType = formData.get('notificationType');

    // if (notificationType === 'transaction' && notificationCode) {
    //   console.log(`Processing PagSeguro notification code: ${notificationCode}`);
    //   // Here you would call PagSeguro's API to get transaction details using this notificationCode
    //   // const transactionDetails = await fetchPagSeguroTransaction(notificationCode);
    //   // await processTransactionUpdate(transactionDetails);
    // } else {
    //   console.warn('Received PagSeguro notification without a valid code or type.');
    // }
    // --- End Example ---

    // IMPORTANT: Always respond with 200 OK to PagSeguro quickly, 
    // otherwise they will keep retrying the notification.
    // Actual processing should be done asynchronously if it's time-consuming.
    return NextResponse.json({ message: "Notification received successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error processing PagSeguro notification:", error);
    // Even in case of error, PagSeguro might expect a 200 OK, or it will retry.
    // Check PagSeguro documentation for best practices on error handling for notifications.
    // For now, returning 500 for internal errors during processing, but this might need adjustment.
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 });
  }
}

/*
async function fetchPagSeguroTransaction(notificationCode: string) {
  // const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL;
  // const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN_SANDBOX; // or PAGSEGURO_TOKEN_PRODUCTION
  // const pagSeguroApiUrl = process.env.PAGSEGURO_API_URL_SANDBOX; // or PAGSEGURO_API_URL_PRODUCTION

  // const response = await fetch(`${pagSeguroApiUrl}/v3/transactions/notifications/${notificationCode}?email=${PAGSEGURO_EMAIL}&token=${PAGSEGURO_TOKEN}`, {
  //   method: 'GET',
  //   headers: {
  //     'Accept': 'application/xml;charset=ISO-8859-1'
  //   }
  // });
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch PagSeguro transaction details for notification ${notificationCode}`);
  // }
  // const xmlData = await response.text();
  // // Parse XML to get transaction status, reference, etc.
  // return parseTransactionDetailsFromXML(xmlData);
  return { status: '3', reference: 'order_123' }; // Mock data
}

async function processTransactionUpdate(transactionDetails: any) {
  // console.log('Updating order based on transaction:', transactionDetails);
  // // Update your database here
}

function parseTransactionDetailsFromXML(xmlString: string): any {
  // ... logic to parse transaction details from PagSeguro XML response ...
  return {};
}
*/

