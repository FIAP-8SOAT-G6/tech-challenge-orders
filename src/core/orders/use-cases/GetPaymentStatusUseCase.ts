import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import GetPaymentStatus from "../interfaces/GetPaymentStatus";
import OrderMapper from "../mappers/OrderMappers";

export default class GetPaymentStatusUseCase implements GetPaymentStatus {
  constructor(private orderGateway: OrderGateway) {}

  async getPaymentStatus(orderId: string): Promise<string> {
    const repositoryOrderDTO = await this.orderGateway.getOrder(orderId);
    this.#validateOrderExists(repositoryOrderDTO?.id!, orderId);

    const order = OrderMapper.toOrderEntity(repositoryOrderDTO!);
    return order.getPaymentStatus();
  }

  #validateOrderExists(orderIdFound: string, orderIdReceived: string) {
    if (!orderIdFound) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Order, "id", orderIdReceived);
  }
}
