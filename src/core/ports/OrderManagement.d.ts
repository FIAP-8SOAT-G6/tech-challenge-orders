import OrderDTO from "../dto/OrderDTO";
import ItemDTO from "../dto/ItemDTO";

export default interface OrderManagement {
  create(orderDTO: OrderDTO): Promise<OrderDTO>;

  getOrders(): Promise<OrderDTO[]>;

  getOrdersAll(): Promise<OrderDTO[]>;

  getOrder(orderId: string): Promise<OrderDTO | undefined>;

  addItem(orderId: string, itemDTO: ItemDTO): Promise<OrderDTO>;

  removeItem(orderId: string, itemId: string): Promise<undefined>;

  updateItem(orderId: string, itemId: string, itemDTO: ItemDTO): Promise<OrderDTO>;

  checkout(orderId: string): Promise<OrderDTO>;
}
