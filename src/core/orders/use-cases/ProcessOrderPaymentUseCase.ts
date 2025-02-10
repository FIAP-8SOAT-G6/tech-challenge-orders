import ResourceNotFoundError from "../../common/exceptions/ResourceNotFoundError";
import OrderGateway from "../../interfaces/OrderGateway";
import PaymentGateway from "../../interfaces/PaymentGateway";
import OrderDTO from "../dto/OrderDTO";
import PaymentDTO from "../dto/PaymentDTO";
import { OrderPaymentsStatus } from "../entities/OrderPaymentsStatus";
import { OrderStatus } from "../entities/OrderStatus";
import OrderMapper from "../mappers/OrderMappers";
import ProcessOrderPayment from "../interfaces/UpdateOrderPaymentStatus";

export default class ProcessOrderPaymentUseCase implements ProcessOrderPayment {
  constructor(
    private readonly orderGateway: OrderGateway,
    private readonly paymentGateway: PaymentGateway
  ) {}

  async updateOrderPaymentStatus(paymentDTO: PaymentDTO): Promise<OrderDTO> {
    const { paymentId } = paymentDTO;
    const detailedPaymentDTO = await this.paymentGateway.getPaymentDetails(paymentId!);

    this.#validateEntityIDExists<number>(detailedPaymentDTO?.paymentId, ResourceNotFoundError.Resources.Payment, paymentId!);

    const { orderId, paymentStatus } = detailedPaymentDTO;
    const orderDTO = await this.orderGateway.getOrder(orderId);

    this.#validateEntityIDExists<string>(orderDTO?.id!, ResourceNotFoundError.Resources.Order, orderId);

    const order = OrderMapper.toOrderEntity(orderDTO!);
    order.setPaymentStatus(paymentStatus);

    if (order.getPaymentStatus() === OrderPaymentsStatus.APPROVED) {
      order.setStatus(OrderStatus.PAYED);
    }

    return await this.orderGateway.updateOrder(OrderMapper.toOrderDTO(order));
  }

  #validateEntityIDExists<T>(idFound: T, type: string, idReceived: T) {
    if (!idFound) {
      throw new ResourceNotFoundError(type, "id", idReceived);
    }
  }
}
