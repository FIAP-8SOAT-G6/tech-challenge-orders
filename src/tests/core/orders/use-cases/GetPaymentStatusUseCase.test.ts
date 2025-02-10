import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import CustomerDTO from "../../../../core/customers/dto/CustomerDTO";
import OrderDTO from "../../../../core/orders/dto/OrderDTO";

import { OrderPaymentsStatus } from "../../../../core/orders/entities/OrderPaymentsStatus";

import OrderGateway from "../../../../core/interfaces/OrderGateway";
import FakeCustomerGateway from "../../../../gateways/FakeCustomerGateway";
import FakeOrderGateway from "../../../../gateways/FakeOrderGateway";

import CreateOrderUseCase from "../../../../core/orders/use-cases/CreateOrderUseCase";
import GetPaymentStatusUseCase from "../../../../core/orders/use-cases/GetPaymentStatusUseCase";
import ResourceNotFoundError from "../../../../core/common/exceptions/ResourceNotFoundError";

chai.use(chaiAsPromised);

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com",
});

let customerGateway: FakeCustomerGateway, orderGateway: OrderGateway;

describe("Get Payment Status Use Case", () => {
  beforeEach(() => {
    customerGateway = new FakeCustomerGateway();
    orderGateway = new FakeOrderGateway();
  });

  function setupCreateOrderUseCase() {
    return new CreateOrderUseCase(orderGateway, customerGateway);
  }

  function setupGetPaymentStatusUseCase() {
    return new GetPaymentStatusUseCase(orderGateway);
  }

  async function createCustomer() {
    return customerGateway.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer!.id });
  }

  it('should return "PENDING" while the order awaits payment', async () => {
    const createOrderUseCase = setupCreateOrderUseCase();
    const getPaymentStatus = setupGetPaymentStatusUseCase();

    const orderDTO = await createOrderDTO();
    const order = await createOrderUseCase.createOrder(orderDTO);

    const paymentStatus = await getPaymentStatus.getPaymentStatus(order.id!);
    expect(paymentStatus).to.be.equals(OrderPaymentsStatus.PENDING);
  });

  it("should throw error message when order non-existing", async () => {
    const getPaymentStatus = setupGetPaymentStatusUseCase();
    const nonExistingId = "-1";

    await expect(
      getPaymentStatus.getPaymentStatus(nonExistingId)
    ).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });
});
