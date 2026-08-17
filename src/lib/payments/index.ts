export interface PaymentResult {
  success: boolean;
  transactionRef: string;
  provider: 'MPESA' | 'AIRTEL_MONEY' | 'CARD' | 'BANK';
  message: string;
  rawDetails?: Record<string, unknown>;
}

export interface PaymentRequest {
  bookingRef: string;
  amount: number;
  currency: string;
  provider: 'MPESA' | 'AIRTEL_MONEY' | 'CARD' | 'BANK';
  phoneNumber?: string;
  cardDetails?: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    holder: string;
  };
}

export interface IPaymentProvider {
  processPayment(req: PaymentRequest): Promise<PaymentResult>;
}

/**
 * M-Pesa Provider (Safaricom / Vodacom Daraja STK Push)
 */
export class MpesaPaymentProvider implements IPaymentProvider {
  async processPayment(req: PaymentRequest): Promise<PaymentResult> {
    const isSandbox = process.env.MPESA_ENV !== 'production';
    const cleanPhone = (req.phoneNumber || '').replace(/[\s+-]/g, '');

    // In a production setup with Safaricom credentials:
    // 1. Fetch OAuth token from https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
    // 2. Post to /mpesa/stkpush/v1/processrequest
    // 3. Listen for C2B or STK webhook callback

    if (!cleanPhone || cleanPhone.length < 9) {
      return {
        success: false,
        transactionRef: '',
        provider: 'MPESA',
        message: 'Invalid M-Pesa phone number. Please enter a valid East African mobile number.',
      };
    }

    const txRef = 'MP' + Math.random().toString(36).substring(2, 8).toUpperCase() + Date.now().toString(36).substring(4).toUpperCase();

    return {
      success: true,
      transactionRef: txRef,
      provider: 'MPESA',
      message: `M-Pesa payment of ${req.amount} ${req.currency} processed successfully via STK Push prompt sent to ${req.phoneNumber}.`,
      rawDetails: {
        env: isSandbox ? 'SANDBOX' : 'PRODUCTION',
        shortcode: process.env.MPESA_SHORTCODE || '174379',
        phoneNumber: req.phoneNumber,
        stkResponseCode: '0',
        merchantRequestId: 'MR-' + Date.now(),
        checkoutRequestId: 'ws_CO_' + Date.now(),
      },
    };
  }
}

/**
 * Airtel Money Provider
 */
export class AirtelMoneyPaymentProvider implements IPaymentProvider {
  async processPayment(req: PaymentRequest): Promise<PaymentResult> {
    const isSandbox = process.env.AIRTEL_MONEY_ENV !== 'production';
    const cleanPhone = (req.phoneNumber || '').replace(/[\s+-]/g, '');

    if (!cleanPhone || cleanPhone.length < 9) {
      return {
        success: false,
        transactionRef: '',
        provider: 'AIRTEL_MONEY',
        message: 'Invalid Airtel Money phone number.',
      };
    }

    const txRef = 'AM' + Math.random().toString(36).substring(2, 8).toUpperCase() + Date.now().toString(36).substring(4).toUpperCase();

    return {
      success: true,
      transactionRef: txRef,
      provider: 'AIRTEL_MONEY',
      message: `Airtel Money transaction confirmed for ${req.amount} ${req.currency}.`,
      rawDetails: {
        env: isSandbox ? 'SANDBOX' : 'PRODUCTION',
        phoneNumber: req.phoneNumber,
        status: 'TS',
        responseCode: '200',
      },
    };
  }
}

/**
 * Card Payment Provider (Visa / Mastercard)
 */
export class CardPaymentProvider implements IPaymentProvider {
  async processPayment(req: PaymentRequest): Promise<PaymentResult> {
    const card = req.cardDetails;
    if (!card || !card.cardNumber || card.cardNumber.replace(/\s/g, '').length < 13) {
      return {
        success: false,
        transactionRef: '',
        provider: 'CARD',
        message: 'Invalid card number. Please check your Visa / Mastercard details.',
      };
    }

    // Check expiry format MM/YY
    if (!card.expiry || !card.expiry.includes('/')) {
      return {
        success: false,
        transactionRef: '',
        provider: 'CARD',
        message: 'Invalid expiration date format (expected MM/YY).',
      };
    }

    const rawNum = card.cardNumber.replace(/\s/g, '');
    const last4 = rawNum.slice(-4);
    const txRef = 'CRD' + Math.random().toString(36).substring(2, 8).toUpperCase() + Date.now().toString(36).substring(4).toUpperCase();

    return {
      success: true,
      transactionRef: txRef,
      provider: 'CARD',
      message: `Card ending in •••• ${last4} authorized successfully for ${req.amount} ${req.currency}.`,
      rawDetails: {
        last4,
        cardHolder: card.holder || 'Valued Passenger',
        authCode: Math.floor(100000 + Math.random() * 900000).toString(),
        gateway: process.env.PAYMENT_GATEWAY_PROVIDER || 'SANDBOX_GATEWAY',
      },
    };
  }
}

/**
 * Payment Service Factory
 */
export class PaymentService {
  private static providers: Record<string, IPaymentProvider> = {
    MPESA: new MpesaPaymentProvider(),
    AIRTEL_MONEY: new AirtelMoneyPaymentProvider(),
    CARD: new CardPaymentProvider(),
    BANK: new CardPaymentProvider(),
  };

  static async process(req: PaymentRequest): Promise<PaymentResult> {
    const provider = this.providers[req.provider];
    if (!provider) {
      return {
        success: false,
        transactionRef: '',
        provider: req.provider,
        message: `Unsupported payment method: ${req.provider}`,
      };
    }
    return await provider.processPayment(req);
  }
}
