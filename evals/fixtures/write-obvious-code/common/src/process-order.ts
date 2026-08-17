export async function processOrder(orderId: string): Promise<void> {
  await reserveInventory(orderId);
  await chargePayment(orderId);
  await sendConfirmation(orderId);
}

declare function reserveInventory(orderId: string): Promise<void>;
declare function chargePayment(orderId: string): Promise<void>;
declare function sendConfirmation(orderId: string): Promise<void>;
