import ItemDTO from "../orders/dto/ItemDTO";
import OrderDTO from "../orders/dto/OrderDTO";

export default interface OrderGateway {
  createOrder(orderDTO: OrderDTO): Promise<OrderDTO>;

  getOrdersByStatusAndSortByAscDate(status: string): Promise<OrderDTO[]>;
  getOrder(orderId: string): Promise<OrderDTO | undefined>;
  getOrdersAll(): Promise<OrderDTO[]>;

  updateOrder(orderDTO: OrderDTO): Promise<OrderDTO>;

  addItem(orderDTO: OrderDTO, itemDTO: ItemDTO);
  updateItem(itemId: string, updateItemDTO: ItemDTO);
  deleteItem(orderId: string, itemId: string);
}
