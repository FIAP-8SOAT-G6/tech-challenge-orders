import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import PaymentGateway from "../../interfaces/PaymentGateway";
import { OrderStatus } from "../entities/OrderStatus";
import CheckoutOrder from "../interfaces/CheckoutOrder";
import OrderMapper from "../mappers/OrderMappers";

export default class CheckoutOrderUseCase implements CheckoutOrder {
  constructor(
    private orderGateway: OrderGateway,
    private paymentGateway: PaymentGateway
  ) {}

  async checkout(orderId: string): Promise<string> {
    const orderDTO = await this.orderGateway.getOrder(orderId);
    this.#validateOrderExists(orderDTO?.id!, orderId);
    const order = OrderMapper.toOrderEntity(orderDTO!);

    order.setStatus(OrderStatus.PENDING_PAYMENT);

    const qrCode = await this.paymentGateway.performPayment(order.getId()!);
    await this.orderGateway.updateOrder(OrderMapper.toOrderDTO(order));

    return qrCode;
  }

  #validateOrderExists(orderIdFound: string, orderIdReceived: string) {
    if (!orderIdFound) throw new ResourceNotFoundError(ResourceNotFoundError.Resources.Order, "id", orderIdReceived);
  }
}
