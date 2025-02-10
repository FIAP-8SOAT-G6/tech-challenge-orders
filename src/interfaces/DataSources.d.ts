import CustomerDTO from "../../core/customers/dto/CustomerDTO";
import ProductDTO from "../core/products/dto/ProductDTO";

type IndexedObject = { [key: string]: any };

export interface OrderDataSource {
  create(orderDTO: OrderDTO): Promise<OrderDTO>;

  findById(id: string): Promise<OrderDTO | undefined>;
  findAll(): Promise<OrderDTO[]>;
  findOrdersByStatusAndSortByAscDate(status: string): Promise<OrderDTO[]>;

  updateOrder(orderDTO: OrderDTO): Promise<OrderDTO>;

  createItem(orderDTO: OrderDTO, itemDTO: ItemDTO);
  updateItem(itemId: string, itemDTO: ItemDTO);
  removeItem(orderId: string, itemId: string);
}