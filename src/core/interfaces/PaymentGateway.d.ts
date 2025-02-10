import ProductDTO from "../products/dto/ProductDTO";

export default interface PaymentGateway {
  performPayment(orderId: string): Promise<string>;
  getPaymentDetails(paymentId: number): Promise<PaymentDTO>;
}
