export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  static async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || 'Trinity Express <bookings@trinityexpress.rw>';

    if (apiKey && apiKey.startsWith('re_')) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from,
            to: [payload.to],
            subject: payload.subject,
            html: payload.html,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error('Resend API error:', errData);
          return { success: false, error: errData.message || 'Failed to send email via Resend' };
        }

        const data = await res.json();
        return { success: true, messageId: data.id };
      } catch (err: unknown) {
        console.error('Email sending exception:', err);
        return { success: false, error: (err as Error).message };
      }
    }

    // Mock Email mode for development / testing
    console.log('\n======================================================');
    console.log('📨 [DEV MOCK EMAIL SERVICE] Transactional Email Generated');
    console.log(`To: ${payload.to}`);
    console.log(`From: ${from}`);
    console.log(`Subject: ${payload.subject}`);
    console.log('======================================================\n');

    return {
      success: true,
      messageId: `mock_email_${Date.now()}`,
    };
  }

  static generateBookingConfirmationHtml(data: {
    bookingRef: string;
    passengerName: string;
    origin: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    seatNumbers: string;
    totalAmount: string;
    ticketUrl: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: #0B172C; color: #ffffff; padding: 30px 24px; text-align: center; border-bottom: 4px solid #10B981; }
    .header h1 { margin: 0 0 6px; font-size: 24px; letter-spacing: 1px; }
    .header p { margin: 0; color: #94a3b8; font-size: 14px; }
    .content { padding: 24px; }
    .badge { display: inline-block; background: #ECFDF5; color: #065F46; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; margin-bottom: 20px; }
    .route-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .route-header { font-size: 18px; font-weight: bold; color: #0B172C; margin-bottom: 8px; }
    .details-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .details-table td { padding: 8px 0; font-size: 14px; border-bottom: 1px dashed #e2e8f0; }
    .details-table td.label { color: #64748b; width: 40%; }
    .details-table td.val { font-weight: 600; color: #0f172a; text-align: right; }
    .btn { display: block; text-align: center; background: #059669; color: #ffffff !important; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 24px 0 10px; }
    .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>TRINITY EXPRESS</h1>
      <p>Bus Tickets Across East Africa</p>
    </div>
    <div class="content">
      <div class="badge">✓ Booking Confirmed & Paid</div>
      <p>Dear <strong>${data.passengerName}</strong>,</p>
      <p>Thank you for choosing Trinity Express. Your digital bus ticket is confirmed and ready for your cross-border journey.</p>
      
      <div class="route-box">
        <div class="route-header">${data.origin} ➔ ${data.destination}</div>
        <table class="details-table">
          <tr><td class="label">Booking Reference</td><td class="val">${data.bookingRef}</td></tr>
          <tr><td class="label">Travel Date</td><td class="val">${data.departureDate}</td></tr>
          <tr><td class="label">Departure Time</td><td class="val">${data.departureTime}</td></tr>
          <tr><td class="label">Seat Number(s)</td><td class="val">${data.seatNumbers}</td></tr>
          <tr><td class="label">Total Paid</td><td class="val">${data.totalAmount}</td></tr>
        </table>
      </div>

      <a href="${data.ticketUrl}" class="btn">View & Download Digital Ticket</a>
      <p style="font-size: 13px; color: #64748b; text-align: center;">Please arrive at the terminal at least 45 minutes before departure with your original Passport/Travel ID.</p>
    </div>
    <div class="footer">
      Trinity Express Rwanda • Kigali Nyabugogo Bus Terminal • +250 788 123 456
    </div>
  </div>
</body>
</html>
    `;
  }
}
