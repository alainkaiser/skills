export interface PaymentGateway {
  charge(amountInCents: number): Promise<string>;
}

export class PaymentClient implements PaymentGateway {
  async charge(amountInCents: number): Promise<string> {
    const response = await fetch('/payments', {
      method: 'POST',
      body: JSON.stringify({ amountInCents }),
    });

    if (!response.ok) {
      throw new Error('Payment failed');
    }

    return response.text();
  }
}
