import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import DeleteItem from "../interfaces/DeleteItem";
import OrderMapper from "../mappers/OrderMappers";

export default class DeleteItemUseCase implements DeleteItem {
  constructor(private orderGateway: OrderGateway) {}

  async deleteItem(orderId: string, itemId: string): Promise<undefined> {
    const orderDTO = await this.orderGateway.getOrder(orderId);
    this.#validateOrderExists(orderDTO?.id!, orderId);

    console.log(orderDTO);
    const order = OrderMapper.toOrderEntity(orderDTO!);
    order.removeItem(itemId);
    await this.orderGateway.deleteItem(orderId, itemId);
  }

  #validateOrderExists(orderIdFound: string, orderIdReceived: string) {
    if (!orderIdFound)
      throw new ResourceNotFoundError(
        ResourceNotFoundError.Resources.Order,
        "id",
        orderIdReceived
      );
  }
}
