import OrderDTO from "../dto/OrderDTO";

export default interface GetOrder {
  getOrder(orderId: string): Promise<OrderDTO | undefined>;
}
