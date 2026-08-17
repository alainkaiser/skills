type Customer = { tier: 'standard' | 'premium'; active: boolean };
type Line = { quantity: number; unitPrice: number };

export function calculateTotal(customer: Customer, lines: Line[]): number {
  return customer.active
    ? lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0) *
        (customer.tier === 'premium' ? 0.9 : lines.length > 10 ? 0.95 : 1)
    : 0;
}
