import OrderDTO from "../dto/OrderDTO";

export default interface UpdateOrderStatus {
  updateOrderStatus(orderId: string, status: string): Promise<OrderDTO>;
}
