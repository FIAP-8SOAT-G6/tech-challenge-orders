import OrderDTO from "../dto/OrderDTO";
import ItemDTO from "../dto/ItemDTO";

export default interface AddItem {
  addItem(orderId: string, ItemDTO: ItemDTO): Promise<OrderDTO>;
}
