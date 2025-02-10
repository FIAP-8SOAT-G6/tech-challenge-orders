import ItemDTO from "../../core/orders/dto/ItemDTO";
import OrderDTO from "../../core/orders/dto/OrderDTO";

export default interface OrderRepository {
  create(orderDTO: OrderDTO): Promise<OrderDTO>;
  findById(id: string): Promise<OrderDTO | undefined>;
  findAll(): Promise<OrderDTO[]>;
  createItem(order: OrderDTO, itemDTO: ItemDTO): Promise;
  removeItem(orderId: string, itemId: string): Promise;
  updateItem(itemId: string, itemDTO: ItemDTO): Promise;
  updateOrder(orderDTO: OrderDTO): Promise<OrderDTO | undefined>;
  findOrdersByStatusAndSortByAscDate(orderStatus: string): Promise<OrderDTO[]>;
}
