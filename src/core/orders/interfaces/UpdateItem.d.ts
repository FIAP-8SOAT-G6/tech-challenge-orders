import OrderDTO from "../dto/OrderDTO";
import ItemDTO from "../dto/ItemDTO";

export default interface UpdateItem {
  updateItem(orderId: string, itemId: string, updateItemDTO: ItemDTO): Promise<OrderDTO>;
}
