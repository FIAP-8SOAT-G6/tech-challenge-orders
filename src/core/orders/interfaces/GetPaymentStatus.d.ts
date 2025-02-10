export default interface GetPaymentStatus {
  getPaymentStatus(orderId: string): Promise<string>;
}
